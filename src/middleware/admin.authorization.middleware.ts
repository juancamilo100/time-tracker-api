import { NextFunction, Request, RequestHandler, Response } from "express";
import createError from "http-errors";
import { EmployeeRoles } from "../database/entities/employee.entity";

const authorizeAdminEmployee: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	if (req.role !== EmployeeRoles.ADMIN) {
        console.log("authorizeAdminEmployee");
		return next(createError(401, "Unauthorized"));
    }
    next();
};

export { authorizeAdminEmployee };
