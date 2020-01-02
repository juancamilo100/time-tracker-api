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
            let report = await this.validate.reportId(req.params.reportId);
            let tasks = await this.getTasksByReportId(report.id);

            report = {
                ...report,
                tasks 
            } as ReportWithTasks;

            res.send(this.formatPropsKeys(report));
        } catch (error) {
            return next(createError(500, error));
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
            return next(createError(404, error));
        }

        try {
            await this.reportService.delete(req.params.reportId);
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
            !req.body.startDate || 
            !req.body.endDate || 
            !req.body.employeeId) {
            return next(createError(400, "Incomplete request"));
        }
        
        let {tasks, ...report} = req.body;
        tasks = tasks.map((task: Task) => {
            return toSnakeCaseAllPropsKeys(task);
        }) as Task[];

        const reportToCreate: Report = toSnakeCaseAllPropsKeys(report) as Report;

        try {
            await this.validateReport(req, reportToCreate);
            await this.validateTasks(tasks, reportToCreate);

        } catch (error) {
            return next(createError(500, error));
        }
        
        try {
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

    public updateReportById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.params.reportId ||
            !req.body.tasks ||
            !req.body.startDate ||
            !req.body.endDate ||
            !req.body.customerId || 
            !req.body.employeeId) {
            return next(createError(400, "Incomplete request"));
        }

        if(req.body.id) {
            throw new Error("Cannot update report ID");
        }
            
        let {tasks, ...report} = req.body;
        tasks = tasks.map((task: Task) => {
            return toSnakeCaseAllPropsKeys(task);
        }) as Task[];

        const reportToUpdate: Report = toSnakeCaseAllPropsKeys(report) as Report;
            
        try {
            await this.validateReport(req, reportToUpdate);
            await this.validateTasks(tasks, reportToUpdate);
        } catch (error) {
            return next(createError(500, error));
        }
        
        try {
            for (let task of tasks) {
                if(task.id) {
                    await this.taskService.update(task.id, task);
                }
                else {
                    await this.createTask(task, reportToUpdate.id);
                }
            }
            
            await this.reportService.update(req.params.reportId, reportToUpdate);
            res.send(200);
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }
    }

    private async validateReport(req: Request, report: Report) {
        if(req.params.reportId) {
            await this.validate.reportId(req.params.reportId);
        }
        this.validate.reportPeriodDates({
            start: report.start_date,
            end: report.end_date
        });
        await this.validate.employeeCustomerRelation(report.customer_id, report.employee_id);
    }

    private validateTaskDates(task: Task, report: Report) {
        const reportStartDate = report.start_date;
        const reportEndDate = report.end_date;

        this.validate.dateFormat(task.date_performed);
        this.validate.taskDateAgainstReportPeriod(
            { start: reportStartDate, end: reportEndDate }, 
            task
        );
    }

    private async validateTasks(tasks: Task[], report: Report) {
        for (const task of tasks) {
            this.validate.taskFields(task);
            this.validateTaskDates(task, report);

            if(task.id) {
                await this.validate.taskAndReportIdRelation(task.id, report.id);
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

    private async createReportTasks(tasks: Task[], reportId: number) {
        const createdTasks: Task[] = [];

        for (let task of tasks) {
            const createdTask: Task = await this.createTask(task, reportId);
            createdTasks.push(this.formatPropsKeys(createdTask) as Task);
        }

        return this.formatObjectsInArrayPropsKeys(createdTasks) as Task[];
    }

    private async createTask(task: Task, reportId: number) {
        task.report_id = reportId;
        const createdTask: Task = await this.taskService.create(task);
        return createdTask;
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
