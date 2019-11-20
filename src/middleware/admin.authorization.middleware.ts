import { NextFunction, Request, RequestHandler, Response } from "express";
import createError from "http-errors";
import { EmployeeRole } from "../database/entities/employee.entity";

const authorizeAdminEmployee: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	if (req.role !== EmployeeRole.ADMIN) {
		return next(createError(401, "Unauthorized"));
    }
    next();
};

export { authorizeAdminEmployee };