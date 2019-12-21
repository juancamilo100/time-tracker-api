import { NextFunction, Request, RequestHandler, Response } from "express";
import createError from "http-errors";
import { EmployeeRoles } from "../database/entities/employee.entity";

const authorizeEmployeeById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    if (req.employeeId! !== Number.parseInt(req.params.employeeId, 10) &&
        req.role !== EmployeeRoles.ADMIN) { return next(createError(401, "Unauthorized")); }

    next();
};

export { authorizeEmployeeById };
