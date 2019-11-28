import { EntitySchema } from "typeorm";
import BaseDataService from "./base.service";
import Task from '../database/entities/task.entity';

class TaskService extends BaseDataService<Task> {
    constructor() {
        super({
            schema: Task as unknown as EntitySchema<Task>,
            alias: "task"
        });
    }
}

export default new TaskService();
