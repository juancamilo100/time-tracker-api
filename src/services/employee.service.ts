import { EntitySchema } from "typeorm";
import Employee from "../database/entities/employee.entity";
import BaseDataService from "./base.service";

export class EmployeeService extends BaseDataService<Employee> {
    constructor() {
        super({
            schema: Employee as unknown as EntitySchema<Employee>,
            alias: "employee"
        });
    }
}

export default new EmployeeService();
