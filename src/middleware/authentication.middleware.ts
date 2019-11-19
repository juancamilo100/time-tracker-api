import { NextFunction, Request, RequestHandler, Response } from "express";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import { ENCRYPTION_KEY } from "../../config";

interface IDecodedToken {
    employeeId: number;
    role: string;
}

const authenticateEmployee: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.header("authorization");
	if (!token) {
		return next(createError(401, "Unauthorized"));
	}

	try {
		const decodedToken = jwt.verify(token, ENCRYPTION_KEY!) as IDecodedToken;
        req.employeeId = decodedToken.employeeId;
        req.role = decodedToken.role;
		next();
	} catch (error) {
		return next(createError(401, "Unauthorized"));
	}
};

export { authenticateEmployee };
