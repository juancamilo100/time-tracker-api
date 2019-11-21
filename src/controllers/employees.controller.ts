import bcrypt from "bcryptjs";
import {
    NextFunction,
    Request,
    RequestHandler,
    Response } from "express";
import createError from "http-errors";
import { ObjectLiteral } from "../../types/generics";
import Employee from "../database/entities/employee.entity";
import IDataService from "../interfaces/dataService.interface";
import { toCamelCaseAllProps } from "../utils/formatter";

class EmployeesController {
    constructor(private employeeService: IDataService<Employee>) {}

    public getEmployees: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const employees = await this.employeeService.getAll();

        res.send(employees.map((employee) => {
            return this.formatEmployeeProps(employee);
        }));
    }

    public getEmployeeById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.params.id) {
            return next(createError(400, "Incomplete request"));
        }

        try {
            const employee = await this.employeeService.get(req.params.id);

            if (!employee) {
                return next(createError(404, "Employee not found"));
            }

            res.send(this.formatEmployeeProps(employee));
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }
    }

    public deleteEmployeeById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.params.id) {
            return next(createError(400, "Incomplete request"));
        }

        try {
            await this.employeeService.delete(req.params.id);
            res.send(200);
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }
    }

    public updateEmployeeById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.params.id) {
            return next(createError(400, "Incomplete request"));
        }

        if (Object.keys(req.body).includes("password")) {
            return next(createError(400, "Cannot change password"));
        }

        try {
            const employee = await this.employeeService.get(req.params.id);

            if (!employee) {
                return next(createError(404, "Employee not found"));
            }

            await this.employeeService.update(req.params.id, req.body);
            res.send(200);
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }
    }

    public updateEmployeePasswordById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.params.id ||
            !req.body.oldPassword ||
            !req.body.newPassword) {
            return next(createError(400, "Must provide old and new password"));
        }

        const employee = await this.employeeService.get(
            req.params.id,
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

            await this.employeeService.update(req.params.id, fieldsToUpdate as any);
            res.send(200);
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }
    }

    private formatEmployeeProps(employee: Employee) {
        const formattedEmployee = toCamelCaseAllProps(employee as ObjectLiteral);

        delete formattedEmployee.createdAt;
        delete formattedEmployee.updatedAt;

        return formattedEmployee;
    }
}

export default EmployeesController;
