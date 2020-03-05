import bcrypt from "bcryptjs";
import { NextFunction, Request, RequestHandler, Response } from "express";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import { ENCRYPTION_KEY } from "../../config";
import Employee from "../database/entities/employee.entity";
import IDataService from "../interfaces/data.service.interface";
import Validator from '../utils/validator';

class AuthController {
    constructor(
        private employeeService: IDataService<Employee>,
        private validate: Validator) {}

    public loginEmployee: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.body.email || !req.body.password) {
            return next(createError(400, "Incomplete request"));
        }

        try {
            this.validate.isEmail(req.body.email);
            const employee =  await this.employeeService.getByFields(
                { email: req.body.email },
                { hiddenFieldsToShow: ["password"] }
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

            res.send({ auth: true, token });
        } catch (error) {
            return next(createError(500, error));
        }
    }

    public registerEmployee: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.body.email ||
            !req.body.password ||
            !req.body.firstName ||
            !req.body.lastName ||
            !req.body.jobTitle ||
            !req.body.customerId ||
            !req.body.employeeRate ||
            !req.body.customerRate
        ) {
            return next(createError(400, "Incomplete request"));
        }
        
        const employeeToRegister = req.body;
        
        try {
            this.validate.employeeJobTitle(req.body.jobTitle);
            this.validate.isEmail(employeeToRegister.email);
            await this.validate.employeeExists(employeeToRegister.email);
        } catch (error) {
            return next(createError(400, error));
        }
        
        const hashedPassword = bcrypt.hashSync(employeeToRegister.password);
        
        try {
            employeeToRegister.password = hashedPassword;

            const createdEmployee = await this.employeeService.create(employeeToRegister);
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
}

export default AuthController;
