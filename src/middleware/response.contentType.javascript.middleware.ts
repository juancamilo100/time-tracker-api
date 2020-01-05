import { Request, Response, NextFunction } from 'express';

export const setJavascriptContentType = (req: Request, res: Response, next: NextFunction ) => {
    res.setHeader("Content-Type", "text/javascript");
    next();
}