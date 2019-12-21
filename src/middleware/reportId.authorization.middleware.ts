import { NextFunction, Request, RequestHandler, Response } from "express";
import createError from "http-errors";
import { EmployeeRoles } from "../database/entities/employee.entity";
import reportService from "../services/report.service";

const authorizeEmployeeByReportId: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const report = await reportService.getByFields(
        {
            employee_id: req.employeeId,
            id: req.params.reportId
        });

    if (!report && req.role !== EmployeeRoles.ADMIN) { 
        return next(createError(401, "Unauthorized")); 
    }

    next();
};

export { authorizeEmployeeByReportId };
