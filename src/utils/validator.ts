import { Request } from "express";
import moment from 'moment';
import Task from '../database/entities/task.entity';
import IDataService from '../interfaces/dataService.interface';
import Report from '../database/entities/report.entity';
import Employee from '../database/entities/employee.entity';
import { ObjectLiteral } from '../../types/generics';

export class Validator {
    constructor(
        private employeeService: IDataService<Employee>,
        private taskService: IDataService<Task>,
        private reportService: IDataService<Report>) {}

    public async reportId(reportId: string) {
        const reportFound =  await this.reportService.get(reportId);
            
        if (!reportFound) {
            throw new Error(`Report with ID: ${reportId} was not found`);
        }

        return reportFound;
    } 

    public async taskId(taskId: string) {
        const taskFound =  await this.taskService.get(taskId);
            
        if (!taskFound) {
            throw new Error(`Task with ID: ${taskId} was not found`);
        }

        return taskFound;
    } 

    public async taskIdAndDate(task: Task, reportId: number) {
            const foundTask = await this.taskService.getByFields(
                { 
                    id: task.id,
                    report_id: reportId
                }
            );
            if (!foundTask) {
                throw new Error(`Task with ID: ${task.id} was not found or doesn't belong to report with ID: ${reportId}`);
            }
            this.taskDateFormat(task.date_performed);
            return foundTask;
    }

    public async tasksIdsAndDates(tasks: Task[], reportId: number) {
        for (const task of tasks) {
            await this.taskIdAndDate(task, reportId);
        }
    }

    public taskFields(task: Task) {
        if (!task.hours ||
            !task.date_performed) {
            throw new Error("Fields missing from task or field value invalid");
        }
        this.taskDateFormat(task.date_performed);
    }
    
    public tasksFields(tasks: Task[]) {
        for (const task of tasks) {
            this.taskFields(task);
        }
    }

    public async employeeCustomerRelation(customerId: number, employeeId: number) {
        const employee = await this.employeeService.getByFields({
            customer_id: customerId,
            id: employeeId
        });
        if (!employee) {
            throw new Error(`Employee with ID: ${employeeId} does not work for customer with ID: ${customerId}`);
        }
    }
    
    public taskDateFormat(date: Date) {
        if(!moment(date).isValid()) {
            throw new Error("Task performed date is invalid");
        }
    }

}