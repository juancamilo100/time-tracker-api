import { NextFunction, Request, RequestHandler, Response } from "express";

const decodeBase64BodyFields: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const fieldsToDecode = [
        'password',
        'oldPassword',
        'newPassword'
    ]

    fieldsToDecode.forEach((field) => {
        if(req.body[field]) {
            req.body[field] = Buffer.from(req.body[field], 'base64').toString('utf-8');  
        }
    })

    next();
};

export { decodeBase64BodyFields };
