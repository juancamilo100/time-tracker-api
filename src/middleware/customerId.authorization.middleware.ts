import { NextFunction, Request, RequestHandler, Response } from "express";
import createError from "http-errors";
import { EmployeeRole } from "../database/entities/employee.entity";
import employeeService from "../services/employee.service";

const authorizeEmployeeByCustomerId: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employee = await employeeService.get(req.employeeId!.toString());
        if (employee.customerId! !== Number.parseInt(req.params.customerId, 10) &&
            req.role !== EmployeeRole.ADMIN) { return next(createError(401, "Unauthorized")); }
        next();
    } catch (error) {
        return next(createError(500, error));
    }
};

export { authorizeEmployeeByCustomerId };
