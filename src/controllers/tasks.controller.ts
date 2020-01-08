import {
    NextFunction,
    Request,
    RequestHandler,
    Response } from "express";
import createError from "http-errors";
import { ObjectLiteral } from "../../types/generics";
import { toCamelCaseAllPropsKeys, toSnakeCaseAllPropsKeys } from "../utils/formatter";
import IDataService from "../interfaces/data.service.interface";
import Task from '../database/entities/task.entity';
import Validator from '../utils/validator';

class TasksController {
    constructor(
        private taskService: IDataService<Task>,
        private validate: Validator) {}

    public createTask: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        let task = toSnakeCaseAllPropsKeys(req.body) as Task;

        try {
            this.validate.taskFields(task);
            const report = await this.validate.reportId(req.params.reportId!);
            this.validate.dateFormat(task.date_performed);
            this.validate.taskDateAgainstReportPeriod(
                { 
                    start: report.start_date, 
                    end: report.end_date 
                }, 
                task
            );

        } catch (error) {
            return next(createError(500, error));
        }

        task.report_id = Number.parseInt(req.params.reportId!);
        const createdTask: Task = await this.taskService.create(task);

        res.send(this.formatPropsKeys(createdTask));
    }

    public updateTaskById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        let task = toSnakeCaseAllPropsKeys(req.body) as Task;
        let { taskId, reportId } = req.params;

        if(!taskId || !reportId) {
            return next(createError(400, "Incomplete request"));
        }

        if(task.report_id && task.report_id !== Number.parseInt(reportId)) {
            return next(createError(400, "Cannot update report ID"));
        }
        
        try {
            const report = await this.validate.reportId(reportId);
            if(task.date_performed) {
                this.validate.dateFormat(task.date_performed);
                this.validate.taskDateAgainstReportPeriod(
                    { 
                        start: report.start_date, 
                        end: report.end_date 
                    }, 
                    task
                );
            }
            await this.validate.taskAndReportIdRelation(task.id, Number.parseInt(reportId));
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
        let { taskId, reportId } = req.params;
        try {
            await this.validate.taskAndReportIdRelation(Number.parseInt(taskId), Number.parseInt(reportId));
        } catch (error) {
            return next(createError(404, error));
        }
        
        try {
            await this.taskService.delete(taskId);
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
