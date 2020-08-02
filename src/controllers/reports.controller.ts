import {
    NextFunction,
    Request,
    RequestHandler,
    Response } from "express";
import createError from "http-errors";
import { ObjectLiteral } from "../../types/generics";
import Report from "../database/entities/report.entity";
import { toSnakeCaseAllPropsKeys, formatReturnDataPropsKeys } from "../utils/formatter";
import IDataService from "../interfaces/data.service.interface";
import Task from '../database/entities/task.entity';
import Validator from '../utils/validator';
import { TaskService } from '../services/task.service';

interface ReportWithTasks extends Report {
    tasks: Task[]
}

class ReportsController {
    constructor(
        private reportService: IDataService<Report>,
        private taskService: IDataService<Task>,
        private validate: Validator) {}

    public getReports: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {

        const reports = req.query.invoiceable ? 
            await this.reportService.getAllByFields({
                submitted: true,
                invoice_id: null
            }) :
            await this.reportService.getAll();

        await this.addTasksToReports(reports);
        
        res.send(reports.map((report) => {
            return formatReturnDataPropsKeys(report);
        }));
    }

    public getReportById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.params.reportId) {
            return next(createError(400, "Incomplete request"));
        }

        try {
            let report = await this.validate.reportId(req.params.reportId);
            let tasks = await (this.taskService as TaskService).getTasksByReportId(report.id);

            report = {
                ...report,
                tasks 
            } as ReportWithTasks;

            res.send(formatReturnDataPropsKeys(report));
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
            res.sendStatus(200);
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }
    }

    public submitReport: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const report = await this.validate.reportId(req.params.reportId);
            this.validate.reportSubmission(report);
        } catch (error) {
            return next(createError(500, error));
        }

        try {
            await this.reportService.update(req.params.reportId, {
                submitted: true
            } as any);
            res.send({reportId: req.params.reportId});
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

            res.send(formatReturnDataPropsKeys(createdReport));
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
            res.sendStatus(200);
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }
    }

    private async validateReport(req: Request, report: Report) {
        if(req.params.reportId) {
            const report = await this.validate.reportId(req.params.reportId);
            this.validate.reportSubmission(report);
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

        this.validate.dateFormat(task.date_performed, "L");
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
            const tasks = await (this.taskService as TaskService).getTasksByReportId(report.id);

            reports[index] = {
                ...reports[index],
                tasks: this.formatObjectsInArrayPropsKeys(tasks)
            } as ReportWithTasks
        }
    }



    private async createReportTasks(tasks: Task[], reportId: number) {
        const createdTasks: Task[] = [];

        for (let task of tasks) {
            const createdTask: Task = await this.createTask(task, reportId);
            createdTasks.push(formatReturnDataPropsKeys(createdTask) as Task);
        }

        return this.formatObjectsInArrayPropsKeys(createdTasks) as Task[];
    }

    private async createTask(task: Task, reportId: number) {
        task.report_id = reportId;
        const createdTask: Task = await this.taskService.create(task);
        return createdTask;
    }

    private formatObjectsInArrayPropsKeys(arrayOfObjects: object[]) {
        const formatedArrayOfObjects = arrayOfObjects.map((task: ObjectLiteral) => {
            return formatReturnDataPropsKeys(task);
        });

        return formatedArrayOfObjects;
    }
}

export default ReportsController;
