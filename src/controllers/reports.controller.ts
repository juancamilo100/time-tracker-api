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
import { Validator } from '../utils/validator';

interface ReportWithTasks extends Report {
    tasks: Task[]
}

class ReportsController {
    constructor(
        private reportService: IDataService<Report>,
        private taskService: IDataService<Task>,
        private validate: Validator) {}

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
            let report =  await this.reportService.get(req.params.reportId);
            
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

        try {
            await this.validate.reportId(req.params.reportId);
        } catch (error) {
            return next(createError(500, error));
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
            
        let {tasks, ...report} = req.body;
        tasks = tasks.map((task: Task) => {
            return toSnakeCaseAllPropsKeys(task);
        }) as Task[];
            
        try {
            await this.validate.reportId(req.params.reportId);
            await this.validate.employeeCustomerRelation(
                report.customerId, 
                report.employeeId
            );
            await this.validate.tasksIdsAndDates(tasks, Number.parseInt(req.params.reportId));
        } catch (error) {
            return next(createError(500, error));
        }
        
        try {
            for (let task of tasks) {
                await this.taskService.update(task.id, task);
            }

            await this.reportService.update(req.params.reportId, report);
            res.send(200);
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }
    }

    public submitReport: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.validate.reportId(req.params.reportId);
        } catch (error) {
            return next(createError(500, error));
        }

        try {
            await this.reportService.update(req.params.reportId, {
                submitted: true
            } as any);
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
        
        let {tasks, ...report} = req.body;
        tasks = tasks.map((task: Task) => {
            return toSnakeCaseAllPropsKeys(task);
        }) as Task[];

        try {
            await this.validate.employeeCustomerRelation(
                report.customerId, 
                report.employeeId
            );
            this.validate.tasksFields(tasks);
        } catch (error) {
            return next(createError(500, error));
        }

        try {
            let reportToCreate: Report = toSnakeCaseAllPropsKeys(report) as Report;

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

    private async createReportTasks(tasks: Task[], reportId: number) {
        const createdTasks: Task[] = [];

        for (let task of tasks) {
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
