import { getRepository } from "typeorm";
import { ObjectLiteral } from "../../types/generics";
import Customer from "../database/entities/employee.entity";
import IDataService, { QueryOptions } from "../interfaces/dataService.interface";
import { camelToSnake } from "../utils/formatter";

class CustomerService implements IDataService<Customer> {
    private employee = new Customer();

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
        return getRepository(Customer).find();
    }

    public getAllByFields(fields: object, options: QueryOptions = {}) {
        return this.buildSelectManyQuery(fields, options, "AND");
    }

    public create(entity: Customer) {
        const employeeRepo = getRepository(Customer);
        const newCustomer = employeeRepo.create(entity);
        return employeeRepo.save(newCustomer);
    }

    public update(entity: Customer) {
        return (async () => {
            const entityLiteral = entity as ObjectLiteral;
            const fieldsToUpdate = {} as ObjectLiteral;

            Object.keys(entity).forEach((field) => {
                fieldsToUpdate[camelToSnake(field)] = entityLiteral[field];
            });

            const result = await getRepository(Customer)
                .createQueryBuilder()
                .update(Customer)
                .set(fieldsToUpdate)
                .where("id = :id", { id: entity.id })
                .execute();

            return Promise.resolve(result as any);
        })();
    }

    public delete(id: string) {
        return (async () => {
            const result = await getRepository(Customer)
                .createQueryBuilder()
                .delete()
                .from(Customer)
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
        let query = getRepository(Customer)
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

export default new CustomerService();
