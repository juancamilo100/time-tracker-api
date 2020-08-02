import { EntitySchema, getRepository } from "typeorm";
import { ObjectLiteral } from "../../types/generics";
import IDataService, { QueryOptions } from "../interfaces/data.service.interface";
import { camelToSnake, toSnakeCaseAllPropsKeys } from "../utils/formatter";

interface IGenericEntity {
    schema: EntitySchema;
    alias: string;
}

class BaseDataService<T> implements IDataService<T> {
    constructor(protected entity: IGenericEntity) {}

    public async get(id: string, options: QueryOptions = {}) {
        try {
            const resource = await this.getByFields({ id }, options);
            return resource;
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong while getting the resources");
        }
    }

    public async getByFields(fields: object, options: QueryOptions = {}) {
        try {
            const resource = await this.executeSelectOneQuery(fields, options, "AND");;
            return resource as any;
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong while getting the resource");
        }
    }

    public async getByEitherFields(fields: object, options: QueryOptions = {}) {
        try {
            const resource = await this.executeSelectOneQuery(fields, options, "OR");
            return resource as any;
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong while getting the resource");
        }
    }

    public async getAll(options: QueryOptions = {}) {
        try {
            const resource = await getRepository(this.entity.schema).find();
            return resource as any;
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong while getting the resources");
        }
    }

    public async getAllByIds(ids: string[], options: QueryOptions = {}) {
        try {
            const resource = await getRepository(this.entity.schema).findByIds(ids);
            return resource as any;
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong while getting the resources");
        }
    }

    public async getAllByFields(fields: object, options: QueryOptions = {}) {
        try {
            const resource = await this.executeSelectManyQuery(fields, options, "AND");
            return resource as any;
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong while getting the resources");
        }
    }

    public async create(entity: T) {
        try {
            const entityToCreate = toSnakeCaseAllPropsKeys(entity as ObjectLiteral);
            const repo = getRepository(this.entity.schema);
            const newEntity = repo.create(entityToCreate);
            const newResource = await repo.save(newEntity);
            return newResource;
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong while creating the resource");
        }
    }

    public async update(id: string, entity: T) {
        try {
            const fieldsToUpdate = toSnakeCaseAllPropsKeys(entity as ObjectLiteral);
            const resource = await getRepository(this.entity.schema)
                .createQueryBuilder()
                .update(this.entity.schema)
                .set(fieldsToUpdate)
                .where("id = :id", { id })
                .execute();
            return resource as any;
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong while udpating the resource"); 
        }
    }

    public async delete(id: string) {
        try {
            const resource = await getRepository(this.entity.schema)
                .createQueryBuilder()
                .delete()
                .from(this.entity.schema)
                .where("id = :id", { id })
                .execute();

            return resource as any;
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong while deleting the resource"); 
        }
    }

    private executeSelectOneQuery(fields: object, options: QueryOptions, operand: string) {
        const query = this.buildSelectQuery(fields, operand, options);
        return query.getOne();
    }

    private executeSelectManyQuery(fields: object, options: QueryOptions, operand: string) {
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
        let fieldsLiteral = fields as ObjectLiteral;
        Object.keys(fieldsLiteral).forEach((field, index) => {
            const clauseSegment = fieldsLiteral[field] == null ? 
                `${this.entity.alias}.${camelToSnake(field)} IS NULL` :
                `${this.entity.alias}.${camelToSnake(field)} = :${camelToSnake(field)}`

            clause += clauseSegment;
            if (index !== Object.keys(fields).length - 1) {
                clause += ` ${operator} `;
            }
        });

        return clause;
    }
}

export default BaseDataService;
