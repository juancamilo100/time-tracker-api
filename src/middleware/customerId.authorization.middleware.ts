import { NextFunction, Request, RequestHandler, Response } from "express";
import createError from "http-errors";
import { EmployeeRole } from "../database/entities/employee.entity";
import employeeService from "../services/employee.service";

const authorizeEmployeeByCustomerId: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const employee = await employeeService.get(req.employeeId!.toString());

    if (employee.customerId! !== Number.parseInt(req.params.id, 10) &&
        req.role !== EmployeeRole.ADMIN) { return next(createError(401, "Unauthorized")); }

    next();
};

export { authorizeEmployeeByCustomerId };
