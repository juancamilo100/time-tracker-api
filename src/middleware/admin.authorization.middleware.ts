import { NextFunction, Request, RequestHandler, Response } from "express";
import createError from "http-errors";
import { EmployeeRoles } from "../database/entities/employee.entity";

const authorizeAdminEmployee: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	if (req.role !== EmployeeRoles.ADMIN) {
		return next(createError(401, "Unauthorized"));
    }
    next();
};

export { authorizeAdminEmployee };
