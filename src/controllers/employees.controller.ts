import bcrypt from "bcryptjs";
import {
    NextFunction,
    Request,
    RequestHandler,
    Response } from "express";
import createError from "http-errors";
import { ObjectLiteral } from "../../types/generics";
import Employee, { EmployeeRoles } from "../database/entities/employee.entity";
import IDataService from "../interfaces/dataService.interface";
import { toCamelCaseAllPropsKeys, toSnakeCaseAllPropsKeys } from "../utils/formatter";
import { Validator } from '../utils/validator';

class EmployeesController {
    constructor(
        private employeeService: IDataService<Employee>,
        private validate: Validator) {}

    public getEmployees: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const employees = await this.employeeService.getAll();

        res.send(employees.map((employee) => {
            return this.formatEmployeeProps(employee, req.role === EmployeeRoles.ADMIN);
        }));
    }

    public getEmployeeById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const employee = await this.validate.employeeId(req.params.employeeId);
            res.send(this.formatEmployeeProps(employee, req.role === EmployeeRoles.ADMIN));
        } catch (error) {
            return next(createError(500, error));
        }
    }

    public deleteEmployeeById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.validate.employeeId(req.params.employeeId);
            await this.employeeService.delete(req.params.employeeId);
            res.send(200);
        } catch (error) {
            return next(createError(500, error));
        }
    }

    public updateEmployeeById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (Object.keys(req.body).includes("password")) {
            return next(createError(400, "Cannot change password"));
        }

        const employeeToUpdate = req.body;
        
        try {
            await this.validate.employeeId(req.params.employeeId);
            await this.employeeService.update(req.params.employeeId, employeeToUpdate);
            res.send(200);
        } catch (error) {
            return next(createError(500, error));
        }
    }

    public updateEmployeePasswordById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.params.employeeId ||
            !req.body.oldPassword ||
            !req.body.newPassword) {
            return next(createError(400, "Must provide old and new password"));
        }

        const employee = await this.employeeService.get(
            req.params.employeeId,
            { hiddenFieldsToShow: ["password"] }
        );

        if (!employee) {
            return next(createError(404, "Employee not found"));
        }

        const oldPasswordIsValid = bcrypt.compareSync(req.body.oldPassword, employee.password);
        if (!oldPasswordIsValid) { return next(createError(401, "Unauthorized")); }

        try {
            const fieldsToUpdate = {
                password: bcrypt.hashSync(req.body.newPassword)
            };

            await this.employeeService.update(req.params.employeeId, fieldsToUpdate as any);
            res.send(200);
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }
    }

    private formatEmployeeProps(employee: Employee, isAdmin: boolean) {
        const formattedEmployee = toCamelCaseAllPropsKeys(employee as ObjectLiteral);

        delete formattedEmployee.createdAt;
        delete formattedEmployee.updatedAt;

        if(!isAdmin) {
            delete formattedEmployee.customerRate;
        }

        return formattedEmployee;
    }
}

export default EmployeesController;
