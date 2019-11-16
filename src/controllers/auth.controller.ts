import bcrypt from "bcryptjs";
import { NextFunction, Request, RequestHandler, Response } from "express";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import { ENCRYPTION_KEY } from "../../config";
import Employee from "../database/entities/employee.entity";
import IDataService from "../interfaces/dataService.interface";

class AuthController {
    constructor(private employeeService: IDataService<Employee>) {}

    public loginEmployee: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.body.email || !req.body.password) {
            return next(createError(400, "Incomplete request"));
        }

        try {
            const employee =  await this.employeeService.getByFields(
                { email: req.body.email },
                { showPassword: true }
            );

            if (!employee) { return next(createError(404, "Employee not found")); }

            const passwordIsValid = bcrypt.compareSync(req.body.password, employee.password);
            if (!passwordIsValid) { return next(createError(401, "Unauthorized")); }

            const token = jwt.sign(
                { 
                    employeeId: employee.id,
                    role: employee.role
                },
                ENCRYPTION_KEY!,
                { expiresIn: 3600 }
            );

            res.send({ auth: true, token});
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }
    }

    public registerEmployee: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.body.email ||
            !req.body.password ||
            !req.body.firstName ||
            !req.body.lastName ||
            !req.body.customerId ||
            !req.body.hourlyRate
        ) {
            return next(createError(400, "Incomplete request"));
        }

        try {
            if (await this.employeeExists(req.body.email)) {
                return next(createError(409, "Employee already exists"));
            }
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }

        const hashedPassword = bcrypt.hashSync(req.body.password);

        try {
            const newEmployee = {
                password: hashedPassword,
                email: req.body.email,
                first_name: req.body.firstName,
                last_name: req.body.lastName,
                customer_id: req.body.customerId,
                hourly_rate: req.body.hourlyRate,
                role: req.body.role
            } as Employee;

            const createdEmployee = await this.employeeService.create(newEmployee);
            const token = jwt.sign(
                { 
                    employeeId: createdEmployee.id,
                    role: req.body.role
                },
                ENCRYPTION_KEY!,
                { expiresIn: 3600 }
            );
            res.send({ auth: true, token });
        } catch (error) {
            return next(createError(500, error));
        }
    }

    private employeeExists = (email: string) => {
        return this.employeeService.getByFields({ email });
    }
}

export default AuthController;
