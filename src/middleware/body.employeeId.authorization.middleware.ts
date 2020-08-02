import { NextFunction, Request, RequestHandler, Response } from "express";
import createError from "http-errors";
import { EmployeeRoles } from "../database/entities/employee.entity";

const authorizeBodyEmployeeById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    if (req.employeeId! !== req.body.employeeId &&
        req.role !== EmployeeRoles.ADMIN) { return next(createError(401, "Unauthorized")); }

    next();
};

export { authorizeBodyEmployeeById };
