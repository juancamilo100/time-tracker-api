import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

const globalErrorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
	res.status(err.status || 500).send({
		message: err.message
	});
};

export default globalErrorHandler;
