import { getRepository } from "typeorm";
import { ObjectLiteral } from "../../types/generics";
import Employee from "../database/entities/employee.entity";
import IDataService, { QueryOptions } from "../interfaces/dataService.interface";
import { camelToSnake } from "../utils/formatter";

class EmployeeService implements IDataService<Employee> {
    private employee = new Employee();

    public get(id: string) {
        return Promise.resolve(this.employee);
    }

    public getByFields(fields: object, options: QueryOptions = {}) {
        return this.buildSelectOneQuery(fields, options, "AND");
    }

    public getByEitherFields(fields: object, options: QueryOptions = {}) {
        return this.buildSelectOneQuery(fields, options, "OR");
    }

    public getAll() {
        return getRepository(Employee).find();
    }

    public getAllByFields(fields: object, options: QueryOptions = {}) {
        return this.buildSelectManyQuery(fields, options, "AND");
    }

    public create(entity: Employee) {
        const employeeRepo = getRepository(Employee);
        const newEmployee = employeeRepo.create(entity);
        return employeeRepo.save(newEmployee);
    }

    public update(entity: Employee) {
        return (async () => {
            const entityLiteral = entity as ObjectLiteral;
            const fieldsToUpdate = {} as ObjectLiteral;

            Object.keys(entity).forEach((field) => {
                fieldsToUpdate[camelToSnake(field)] = entityLiteral[field];
            });

            const result = await getRepository(Employee)
                .createQueryBuilder()
                .update(Employee)
                .set(fieldsToUpdate)
                .where("id = :id", { id: entity.id })
                .execute();

            return Promise.resolve(result as any);
        })();
    }

    public delete(id: string) {
        return (async () => {
            const result = await getRepository(Employee)
                .createQueryBuilder()
                .delete()
                .from(Employee)
                .where("id = :id", { id })
                .execute();

            return Promise.resolve(result as any);
        })();
    }

    private buildSelectOneQuery(fields: object, options: QueryOptions, operand: string) {
        const query = this.buildSelectQuery(fields, operand, options);
        return query.getOne();
    }

    private buildSelectManyQuery(fields: object, options: QueryOptions, operand: string) {
        const query = this.buildSelectQuery(fields, operand, options);
        return query.getMany();
    }

    private buildSelectQuery(fields: object, operand: string, options: QueryOptions) {
        const clause = this.buildWhereClauseFromFields(fields, operand);
        let query = getRepository(Employee)
            .createQueryBuilder("employee")
            .where(clause, fields);

        if (options.showPassword) {
            query = query.addSelect("employee.password");
        }

        return query;
    }

    private buildWhereClauseFromFields(fields: object, operator: string) {
        let clause = "";
        Object.keys(fields).forEach((field, index) => {
            clause += `employee.${camelToSnake(field)} = :${camelToSnake(field)}`;
            if (index !== Object.keys(fields).length - 1) {
                clause += ` ${operator} `;
            }
        });
        return clause;
    }
}

export default new EmployeeService();
