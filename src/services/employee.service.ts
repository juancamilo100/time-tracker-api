import { getRepository } from "typeorm";
import Employee from "../database/entities/employee.entity";
import IDataService, { QueryOptions } from "../interfaces/dataService.interface";
import { camelToSnake } from "../utils/formatter";

class EmployeeService implements IDataService<Employee> {
    private employee = new Employee();

    public get(id: string) {
        return Promise.resolve(this.employee);
    }

    public getByFields(fields: object, options: QueryOptions = {}) {
        const clause = this.buildWhereClauseFromFields(fields, "AND");
        let query = getRepository(Employee)
            .createQueryBuilder("employees")
            .where(clause, fields);

        if (options.showPassword) {
            query = query.addSelect("employees.password");
        }

        return query.getOne();
    }

    public getByEitherFields(fields: object[]) {
        return Promise.resolve(this.employee);
    }

    public getAll() {
        return getRepository(Employee).find();
    }

    public getAllByFields(fields: object) {
        return Promise.resolve([this.employee]);
    }

    public create(entity: Employee) {
        const employeeRepo = getRepository(Employee);
        const newEmployee = employeeRepo.create(entity);
        return employeeRepo.save(newEmployee);
    }

    public update(entity: Employee) {
        return Promise.resolve(this.employee);
    }

    public delete(id: string) {
        return Promise.resolve(this.employee);
    }

    private buildWhereClauseFromFields(fields: object, operator: string) {
        let clause = "";
        Object.keys(fields).forEach((field, index) => {
            clause += `employees.${camelToSnake(field)} = :${camelToSnake(field)}`;
            if (index !== Object.keys(fields).length - 1) {
                clause += ` ${operator} `;
            }
        });
        return clause;
    }
}

export default new EmployeeService();
