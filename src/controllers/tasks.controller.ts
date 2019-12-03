import {
    NextFunction,
    Request,
    RequestHandler,
    Response } from "express";
import createError from "http-errors";
import { ObjectLiteral } from "../../types/generics";
import Report from "../database/entities/task.entity";
import { toCamelCaseAllPropsKeys, toSnakeCaseAllPropsKeys } from "../utils/formatter";
import IDataService from "../interfaces/dataService.interface";
import Task from '../database/entities/task.entity';
import Employee from "../database/entities/employee.entity";
import moment from 'moment';

class TasksController {
    constructor(
        // private reportService: IDataService<Report>,
        private taskService: IDataService<Task>) {}

    public createTask: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        // let reports = await this.reportService.getAll();

        await this.addTasksToTasks(reports);

        res.send(reports.map((task) => {
            return this.formatPropsKeys(task);
        }));
    }

    public getReportById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.params.reportId) {
            return next(createError(400, "Incomplete request"));
        }

        try {
            let task =  await this.reportService.getByFields(
                { id: req.params.reportId }
            );
            
            if (!task) {
                return next(createError(404, "Report not found"));
            }

            let tasks = await this.getTasksByReportId(task.id);

            task = {
                ...task,
                tasks 
            } as ReportWithTasks;

            res.send(this.formatPropsKeys(task));
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }
    }

    public getTasksByEmployeeId: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.params.employeeId) {
            return next(createError(400, "Incomplete request"));
        }

        try {
            let reports =  await this.reportService.getAllByFields(
                { employee_id: req.params.employeeId }
            );

            await this.addTasksToTasks(reports);

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

        let {tasks, ...task} = req.body;

        try {
            await this.validateEmployeeCustomerRelation(
                task.customerId, 
                task.employeeId
            );
            await this.validateTasksIdsAndDates(tasks, Number.parseInt(req.params.reportId));
        } catch (error) {
            return next(createError(500, error));
        }
        
        try {
            for (let task of tasks) {
                task = toSnakeCaseAllPropsKeys(task);
                await this.taskService.update(task.id, task);
            }

            const updatedReportTasks = await this.taskService.getAllByFields(
                { report_id: req.params.reportId }
            );

            const reportToUpdate: Report = {
                ...task,
                totalHours: this.calculateTotalHours(updatedReportTasks) 
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
        let {tasks, ...task} = req.body;

        try {
            await this.validateEmployeeCustomerRelation(
                task.customerId, 
                task.employeeId
            );
            this.validateTasksFields(tasks);
        } catch (error) {
            return next(createError(500, error));
        }

        try {
            let reportToCreate: Report = {
                ...task,
                totalHours: this.calculateTotalHours(tasks)
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

    private async validateTasksIdsAndDates(tasks: any, reportId: number) {
        for (const task of tasks) {
            const foundTask = await this.taskService.getByFields(
                { 
                    id: task.id,
                    report_id: reportId
                }
            );
            if (!foundTask) {
                throw new Error(`Task with ID: ${task.id} not found or doesn't belong to task with ID: ${reportId}`);
            }
            this.validateTaskDateFormat(task.datePerformed);
        }
    }

    private validateTasksFields(tasks: any) {
        for (const task of tasks) {
            if (!task.hours ||
                !task.datePerformed) {
                throw new Error("Fields missing from task or field value invalid");
            }
            this.validateTaskDateFormat(task.datePerformed);
        }
    }
    
    private validateTaskDateFormat(date: string) {
        if(!moment(date).isValid()) {
            throw new Error("Task performed date is invalid");
        }
    }

    private async addTasksToTasks(reports: Report[]) {
        for (const [index, task] of reports.entries()) {
            const tasks = await this.getTasksByReportId(task.id);

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

        for (let task of tasks) {
            task = toSnakeCaseAllPropsKeys(task) as Task;
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

export default TasksController;
