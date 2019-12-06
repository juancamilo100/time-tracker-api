import {
    NextFunction,
    Request,
    RequestHandler,
    Response } from "express";
import createError from "http-errors";
import { ObjectLiteral } from "../../types/generics";
import { toCamelCaseAllPropsKeys, toSnakeCaseAllPropsKeys } from "../utils/formatter";
import IDataService from "../interfaces/dataService.interface";
import Task from '../database/entities/task.entity';
import { Validator } from '../utils/validator';
import Report from '../database/entities/report.entity';

class TasksController {
    constructor(
        private reportService: IDataService<Report>,
        private taskService: IDataService<Task>,
        private validate: Validator) {}

    public createTask: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        let task = toSnakeCaseAllPropsKeys(req.body) as Task;

        try {
            this.validate.taskFields(task);
            await this.validate.reportId(req.params.reportId!);
        } catch (error) {
            return next(createError(404, error));
        }

        task.report_id = Number.parseInt(req.params.reportId!);
        const createdTask: Task = await this.taskService.create(task);

        res.send(this.formatPropsKeys(createdTask));
    }

    public updateTaskById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        let task = toSnakeCaseAllPropsKeys(req.body) as Task;
        let { taskId, reportId } = req.params;

        if(task.report_id && task.report_id !== Number.parseInt(reportId)) {
            return next(createError(400, "Cannot update report number"));
        }
        
        try {
            if(task.date_performed) {
                this.validate.taskDateFormat(task.date_performed);
            }
            await this.validate.reportId(reportId);
            await this.validate.taskId(taskId);
        } catch (error) {
            return next(createError(500, error));
        }
        
        try {
            await this.taskService.update(taskId, task);
            res.send(200);
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }
    }

    public deleteTaskById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.validate.taskId(req.params.taskId);
        } catch (error) {
            return next(createError(404, error));
        }
        
        try {
            await this.taskService.delete(req.params.taskId);
            res.send(200);
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }
    }

    private formatPropsKeys(object: object) {
        const formattedObject = toCamelCaseAllPropsKeys(object as ObjectLiteral);

        delete formattedObject.createdAt;
        delete formattedObject.updatedAt;

        return formattedObject;
    }
}

export default TasksController;
