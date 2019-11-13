import bcrypt from "bcryptjs";
import { NextFunction, Request, RequestHandler, Response } from "express";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import { ENCRYPTION_KEY } from "../../config";
import User from "../database/entities/user.entity";
import IDataService from "../interfaces/dataService.interface";

class AuthController {
    constructor(private userService: IDataService<User>) {}

    public loginUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.body.email || !req.body.password) {
            return next(createError(400, "Incomplete request"));
        }

        try {
            const user =  await this.userService.getByFields(
                { email: req.body.email },
                { showPassword: true }
            );

            if (!user) { return next(createError(404, "User not found")); }

            const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordIsValid) { return next(createError(401, "Unauthorized")); }

            const token = jwt.sign(
                { userId: user.id },
                ENCRYPTION_KEY!,
                { expiresIn: 3600 }
            );

            res.send({ auth: true, token});
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }
    }

    public registerUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.body.email ||
            !req.body.password ||
            !req.body.firstName ||
            !req.body.lastName ||
            !req.body.companyId
        ) {
            return next(createError(400, "Incomplete request"));
        }

        try {
            if (await this.userExists(req.body.email)) {
                return next(createError(409, "User already exists"));
            }
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }

        const hashedPassword = bcrypt.hashSync(req.body.password);

        try {
            const newUser = {
                password: hashedPassword,
                email: req.body.email,
                first_name: req.body.firstName,
                last_name: req.body.firstName,
                company_id: req.body.companyId
            } as User;

            const createdUser = await this.userService.create(newUser);
            const token = jwt.sign(
                {id: createdUser.id},
                ENCRYPTION_KEY!,
                { expiresIn: 3600 }
            );
            res.send({ auth: true, token });
        } catch (error) {
            return next(createError(500, error));
        }
    }

    private userExists = (email: string) => {
        return this.userService.getByFields({ email });
    }
}

export default AuthController;
