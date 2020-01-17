import { EntitySchema, getRepository, FindConditions } from "typeorm";
import BaseDataService from "./base.data.service";
import Task from '../database/entities/task.entity';

export class TaskService extends BaseDataService<Task> {
    constructor() {
        super({
            schema: Task as unknown as EntitySchema<Task>,
            alias: "task"
        });
    }

    public async getAllTasksForGroupOfReports(reportIds: number[]) {
        try {
            const tasks = await getRepository(this.entity.schema)
                .find({
                    where: this.getTasksForReportsQuery(reportIds)
                });
    
            return tasks
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong while getting tasks for reports");
        }
    }
    
    public async getTasksByReportId(reportId: number) {
        try {
            const tasks = await this.getAllByFields({report_id: reportId});
            return tasks;
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong while getting tasks for report");
        }
    }

    private getTasksForReportsQuery(reportIds: number[]) {
        let query: FindConditions<object>[] = [];
        reportIds.forEach((id) => {
            query.push({
                report_id: id
            });
        });
        return query;
    }
}

export default new TaskService();
