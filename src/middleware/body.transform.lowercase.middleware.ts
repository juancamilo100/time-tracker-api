import { NextFunction, Request, RequestHandler, Response } from "express";
import { ObjectLiteral } from '../../types/generics';
import { toLowerCaseAllPropsValues } from '../utils/formatter';

const transformBodyPropsValuesToLowerCase: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    req.body = toLowerCaseAllPropsValues(req.body as ObjectLiteral, ['password']);
    next();
};

export { transformBodyPropsValuesToLowerCase };
