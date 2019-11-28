import {
    NextFunction,
    Request,
    RequestHandler,
    Response } from "express";
import createError from "http-errors";
import { ObjectLiteral } from "../../types/generics";
import Report from "../database/entities/report.entity";
import { toCamelCaseAllPropsKeys, toSnakeCaseAllPropsKeys } from "../utils/formatter";
import IDataService from "../interfaces/dataService.interface";
import Task from '../database/entities/task.entity';
import Employee from "../database/entities/employee.entity";

interface ReportWithTasks extends Report {
    tasks: Task[]
}

class ReportsController {
    constructor(
        private reportService: IDataService<Report>,
        private taskService: IDataService<Task>,
        private employeeService: IDataService<Employee>) {}

    public getReports: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        let reports = await this.reportService.getAll();

        await this.addTasksToReports(reports);

        res.send(reports.map((report) => {
            return this.formatPropsKeys(report);
        }));
    }

    public getReportById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.params.reportId) {
            return next(createError(400, "Incomplete request"));
        }

        try {
            let report =  await this.reportService.getByFields(
                { id: req.params.reportId }
            );
            
            if (!report) {
                return next(createError(404, "Report not found"));
            }

            let tasks = await this.getTasksByReportId(report.id);

            report = {
                ...report,
                tasks 
            } as ReportWithTasks;

            res.send(this.formatPropsKeys(report));
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }
    }

    public getReportsByEmployeeId: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.params.employeeId) {
            return next(createError(400, "Incomplete request"));
        }

        try {
            let reports =  await this.reportService.getAllByFields(
                { employee_id: req.params.employeeId }
            );

            await this.addTasksToReports(reports);

            res.send(this.formatObjectsInArrayPropsKeys(reports));
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }
    }

    public deleteReportById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.params.reportId) {
            return next(createError(400, "Incomplete request"));
        }

        const reportFound = await this.reportService.get(req.params.reportId);

        if (!reportFound) {
            return next(createError(404, "Report not found"));
        }

        try {
            await this.reportService.delete(req.params.reportId);
            res.send(200);
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }
    }

    public updateReportById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.params.reportId ||
            !req.body.tasks ||
            !req.body.customerId || 
            !req.body.employeeId) {
            return next(createError(400, "Incomplete request"));
        }

        const reportFound = await this.reportService.get(req.params.reportId);

        if (!reportFound) {
            return next(createError(404, "Report not found"));
        }

        let {tasks, ...report} = req.body;
        tasks = tasks.map((task: Task) => {
            return toSnakeCaseAllPropsKeys(task);
        });

        try {
            await this.validateEmployeeCustomerRelation(
                req.body.customerId, 
                req.body.employeeId
            );
            await this.validateTasksIds(tasks, Number.parseInt(req.params.reportId));
        } catch (error) {
            return next(createError(500, error));
        }
        
        try {
            for (const task of tasks) {
                await this.taskService.update(task.id, task);
            }

            const updatedReportTasks = await this.taskService.getAllByFields(
                { report_id: req.params.reportId }
            );

            let totalHours: number = this.calculateTotalHours(updatedReportTasks);

            const reportToUpdate: Report = {
                ...report,
                totalHours 
            };

            await this.reportService.update(req.params.reportId, reportToUpdate);
            res.send(200);
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }
    }

    public createReport: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.body.tasks ||
            !req.body.customerId || 
            !req.body.employeeId) {
            return next(createError(400, "Incomplete request"));
        }

        try {
            await this.validateEmployeeCustomerRelation(
                req.body.customerId, 
                req.body.employeeId
            );
        } catch (error) {
            return next(createError(500, error));
        }

        try {
            let {tasks, ...report} = req.body;
            tasks = tasks.map((task: Task) => {
                return toSnakeCaseAllPropsKeys(task);
            });

            const totalHours = this.calculateTotalHours(tasks);

            let reportToCreate: Report = {
                ...report,
                totalHours 
            };

            reportToCreate = toSnakeCaseAllPropsKeys(reportToCreate) as Report;

            let createdReport = await this.reportService.create(reportToCreate);
            const createdTasks: Task[] = await this.createReportTasks(tasks, createdReport.id);

            createdReport = {
                ...createdReport,
                tasks: createdTasks
            } as ReportWithTasks;

            res.send(this.formatPropsKeys(createdReport));
        } catch (error) {
            return next(createError(500, error));
        }
    }

    private async validateEmployeeCustomerRelation(customerId: number, employeeId: number) {
        const employee = await this.employeeService.getByFields({
            customer_id: customerId,
            id: employeeId
        });
        if (!employee) {
            throw new Error(`Employee with ID: ${employeeId} does not work for customer with ID: ${customerId}`);
        }
    }

    private async validateTasksIds(tasks: any, reportId: number) {
        for (const task of tasks) {
            const foundTask = await this.taskService.getByFields(
                { 
                    id: task.id,
                    report_id: reportId
                }
            );
            if (!foundTask) {
                throw new Error(`Task with ID: ${task.id} not found or doesn't belong to report with ID: ${reportId}`);
            }
        }
    }

    private async addTasksToReports(reports: Report[]) {
        for (const [index, report] of reports.entries()) {
            const tasks = await this.getTasksByReportId(report.id);

            reports[index] = {
                ...reports[index],
                tasks
            } as ReportWithTasks
        }
    }

    private async getTasksByReportId(reportId: number) {
        let tasks = await this.taskService.getAllByFields({report_id: reportId});
        return this.formatObjectsInArrayPropsKeys(tasks);
    }

    private calculateTotalHours(tasks: any) {
        let totalHours: number = 0;

        tasks.forEach((task: Task) => {
            totalHours += Number.parseInt(task.hours);
        });

        return totalHours;
    }

    private async createReportTasks(tasks: Task[], reportId: number) {
        const createdTasks: Task[] = [];

        for (const task of tasks) {
            task.report_id = reportId;
            const createdTask: Task = await this.taskService.create(task);
            createdTasks.push(this.formatPropsKeys(createdTask) as Task);
        }

        return this.formatObjectsInArrayPropsKeys(createdTasks) as Task[];
    }

    private formatPropsKeys(object: object) {
        const formattedObject = toCamelCaseAllPropsKeys(object as ObjectLiteral);

        delete formattedObject.createdAt;
        delete formattedObject.updatedAt;

        return formattedObject;
    }

    private formatObjectsInArrayPropsKeys(arrayOfObjects: object[]) {
        const formatedArrayOfObjects = arrayOfObjects.map((task: ObjectLiteral) => {
            return this.formatPropsKeys(task);
        });

        return formatedArrayOfObjects;
    }
}

export default ReportsController;
