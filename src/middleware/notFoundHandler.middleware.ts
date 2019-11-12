import { NextFunction, Request, RequestHandler, Response } from "express";
import createError from "http-errors";

const notFoundHandler: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
	next(createError(404));
};

export default notFoundHandler;
