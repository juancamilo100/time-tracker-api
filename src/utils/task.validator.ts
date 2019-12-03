import moment from 'moment';
import Task from '../database/entities/task.entity';
import IDataService from '../interfaces/dataService.interface';

export class TaskValidator {
    constructor(private taskService: IDataService<Task>) {}

    public async validateTasksIdsAndDates(tasks: Task[], reportId: number) {
        for (const task of tasks) {
            const foundTask = await this.taskService.getByFields(
                { 
                    id: task.id,
                    report_id: reportId
                }
            );
            if (!foundTask) {
                throw new Error(`Task with ID: ${task.id} was not found or doesn't belong to report with ID: ${reportId}`);
            }
            this.validateTaskDateFormat(task.date_performed);
        }
    }

    public validateTasksFields(tasks: Task[]) {
        for (const task of tasks) {
            if (!task.hours ||
                !task.date_performed) {
                throw new Error("Fields missing from task or field value invalid");
            }
            this.validateTaskDateFormat(task.date_performed);
        }
    }
    
    private validateTaskDateFormat(date: Date) {
        if(!moment(date).isValid()) {
            throw new Error("Task performed date is invalid");
        }
    }

}