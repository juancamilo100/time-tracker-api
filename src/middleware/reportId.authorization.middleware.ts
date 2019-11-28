import { NextFunction, Request, RequestHandler, Response } from "express";
import createError from "http-errors";
import { EmployeeRole } from "../database/entities/employee.entity";
import reportService from "../services/report.service";

const authorizeEmployeeByReportId: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const report = await reportService.getByFields(
        {
            employee_id: req.employeeId,
            id: req.params.id
        });

    if (!report && req.role !== EmployeeRole.ADMIN) { 
        return next(createError(401, "Unauthorized")); 
    }

    next();
};

export { authorizeEmployeeByReportId };
