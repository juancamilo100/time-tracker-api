import { getRepository, EntitySchema } from "typeorm";
import { ObjectLiteral } from "../../types/generics";
// import this.entity.schema from "../database/entities/customer.entity";
import IDataService, { QueryOptions } from "../interfaces/dataService.interface";
import { camelToSnake, toSnakeCaseAllProps } from "../utils/formatter";

interface IGenericEntity {
    schema: EntitySchema,
    alias: string
}

class BaseDataService<T> implements IDataService<T> {
    constructor(private entity: IGenericEntity) {}

    public get(id: string, options: QueryOptions = {}) {
        return this.getByFields({ id }, options);
    }

    public getByFields(fields: object, options: QueryOptions = {}) {
        return this.buildSelectOneQuery(fields, options, "AND");
    }

    public getByEitherFields(fields: object, options: QueryOptions = {}) {
        return this.buildSelectOneQuery(fields, options, "OR");
    }

    public getAll(options: QueryOptions = {}) {
        return getRepository(this.entity.schema).find();
    }

    public getAllByFields(fields: object, options: QueryOptions = {}) {
        return this.buildSelectManyQuery(fields, options, "AND");
    }

    public create(entity: T) {
        const repo = getRepository(this.entity.schema);
        const newEntity = repo.create(entity);
        return repo.save(newEntity);
    }

    public update(id: string, entity: T) {
        return (async () => {
            let fieldsToUpdate = toSnakeCaseAllProps(entity as ObjectLiteral);
            const result = await getRepository(this.entity.schema)
                .createQueryBuilder()
                .update(this.entity.schema)
                .set(fieldsToUpdate)
                .where("id = :id", { id })
                .execute();

            return Promise.resolve(result as any);
        })();
    }

    public delete(id: string) {
        return (async () => {
            const result = await getRepository(this.entity.schema)
                .createQueryBuilder()
                .delete()
                .from(this.entity.schema)
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

        let query = getRepository(this.entity.schema)
            .createQueryBuilder(this.entity.alias)
            .where(clause, fields);

        if (options.hiddenFieldsToShow) {
            options.hiddenFieldsToShow.forEach((field: string) => {
                query = query.addSelect(`${this.entity.alias}.${camelToSnake(field)}`);
            });
        }

        return query;
    }

    private buildWhereClauseFromFields(fields: object, operator: string) {
        let clause = "";
        Object.keys(fields).forEach((field, index) => {
            clause += `${this.entity.alias}.${camelToSnake(field)} = :${camelToSnake(field)}`;
            if (index !== Object.keys(fields).length - 1) {
                clause += ` ${operator} `;
            }
        });
        return clause;
    }
}

export default BaseDataService;
