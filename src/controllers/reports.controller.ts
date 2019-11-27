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
            return this.formatProps(report);
        }));
    }

    public getReportById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.params.id) {
            return next(createError(400, "Incomplete request"));
        }

        try {
            let report =  await this.reportService.getByFields(
                { id: req.params.id }
            );
            
            if (!report) {
                return next(createError(404, "Report not found"));
            }

            let tasks = await this.getTasksByReportId(report.id);

            report = {
                ...report,
                tasks 
            } as ReportWithTasks;

            res.send(this.formatProps(report));
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

            res.send(this.formatProps(reports));
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }
    }

    public deleteReportById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.params.id) {
            return next(createError(400, "Incomplete request"));
        }

        const reportFound = await this.reportService.get(req.params.id);

        if (!reportFound) {
            return next(createError(404, "Report not found"));
        }

        try {
            await this.reportService.delete(req.params.id);
            res.send(200);
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }
    }

    public updateReportById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.params.id ||
            !req.body.tasks ||
            !req.body.customerId || 
            !req.body.employeeId) {
            return next(createError(400, "Incomplete request"));
        }

        const reportFound = await this.reportService.get(req.params.id);

        if (!reportFound) {
            return next(createError(404, "Report not found"));
        }

        let {tasks, ...report} = req.body;

        try {
            await this.validateEmployeeCustomerRelation(
                req.body.customerId, 
                req.body.employeeId
            );
            await this.validateTasksIds(tasks);
        } catch (error) {
            return next(createError(500, error));
        }
        
        try {
            tasks = tasks.map((task: Task) => {
                return toSnakeCaseAllPropsKeys(task);
            });
            
            for (const task of tasks) {
                await this.taskService.update(task.id, task);
            }

            const updatedReportTasks = await this.taskService.getByFields(
                {report_id: req.params.id}
            );

            let totalHours: number = this.calculateTotalHours(updatedReportTasks);

            const reportToUpdate: Report = {
                ...report,
                totalHours 
            };

            await this.reportService.update(req.params.id, reportToUpdate);
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

            let totalHours: number = this.calculateTotalHours(tasks);

            let reportToCreate: Report = {
                ...report,
                totalHours 
            };

            reportToCreate = toSnakeCaseAllPropsKeys(reportToCreate) as Report;

            let createdReport = await this.reportService.create(reportToCreate);
            const createdTasks: Task[] = await this.createReportTasks(tasks, createdReport);

            createdReport = {
                ...createdReport,
                tasks: createdTasks
            } as ReportWithTasks;

            res.send(this.formatProps(createdReport));
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
            throw new Error(`Employee with id: ${employeeId} does not work for customer with id: ${customerId}`);
        }
    }

    private async validateTasksIds(tasks: any) {
        for (const task of tasks) {
            const foundTask = await this.taskService.getByFields({ id: task.id });
            if (!foundTask) {
                throw new Error(`Task with ID: ${task.id} not found`);
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
        return this.formatObjectsArrayProps(tasks);
    }

    private calculateTotalHours(tasks: any) {
        let totalHours: number = 0;

        tasks.forEach((task: Task) => {
            totalHours += Number.parseInt(task.hours);
        });

        return totalHours;
    }

    private async createReportTasks(tasks: Task[], updateReport: Report) {
        const createdTasks: Task[] = [];

        for (const task of tasks) {
            task.report_id = updateReport.id;
            const createdTask: Task = await this.taskService.create(task);
            createdTasks.push(this.formatProps(createdTask) as Task);
        }

        return this.formatObjectsArrayProps(createdTasks) as Task[];
    }

    private formatProps(object: object) {
        const formattedObject = toCamelCaseAllPropsKeys(object as ObjectLiteral);

        delete formattedObject.createdAt;
        delete formattedObject.updatedAt;

        return formattedObject;
    }

    private formatObjectsArrayProps(arrayOfObjects: object[]) {
        const formatedArrayOfObjects = arrayOfObjects.map((task: ObjectLiteral) => {
            return this.formatProps(task);
        });

        return formatedArrayOfObjects;
    }
}

export default ReportsController;
