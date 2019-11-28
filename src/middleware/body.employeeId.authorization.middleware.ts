import { NextFunction, Request, RequestHandler, Response } from "express";
import createError from "http-errors";
import { EmployeeRole } from "../database/entities/employee.entity";

const authorizeBodyEmployeeById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    if (req.employeeId! !== req.body.employeeId &&
        req.role !== EmployeeRole.ADMIN) { return next(createError(401, "Unauthorized")); }

    next();
};

export { authorizeBodyEmployeeById };
