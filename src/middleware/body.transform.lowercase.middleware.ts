import { NextFunction, Request, RequestHandler, Response } from "express";
import { ObjectLiteral } from "../../types/generics";
import { toLowerCaseAllPropsValues } from "../utils/formatter";

const transformBodyPropsValuesToLowerCase: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const fieldsToExclude = [
        "password",
        "oldPassword",
        "newPassword"
    ];

    req.body = toLowerCaseAllPropsValues(req.body as ObjectLiteral, fieldsToExclude);
    next();
};

export { transformBodyPropsValuesToLowerCase };
