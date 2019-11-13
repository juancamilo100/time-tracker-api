import { getRepository } from "typeorm";
import User from "../database/entities/user.entity";
import IDataService, { QueryOptions } from "../interfaces/dataService.interface";
import { camelToSnake } from "../utils/formatter";

class UserService implements IDataService<User> {
    private user = new User();

    public get(id: string) {
        return Promise.resolve(this.user);
    }

    public getByFields(fields: object, options: QueryOptions = {}) {
        const clause = this.buildWhereClause(fields, "AND");
        let query = getRepository(User)
            .createQueryBuilder("user")
            .where(clause, fields);

        if (options.showPassword) {
            query = query.addSelect("user.password");
        }

        return query.getOne();
    }

    public getByEitherFields(fields: object[]) {
        return Promise.resolve(this.user);
    }

    public getAll() {
        return getRepository(User).find();
    }

    public getAllByFields(fields: object) {
        return Promise.resolve([this.user]);
    }

    public create(entity: User) {
        const userRepo = getRepository(User);
        const newUser = userRepo.create(entity);
        return userRepo.save(newUser);
    }

    public update(entity: User) {
        return Promise.resolve(this.user);
    }

    public delete(id: string) {
        return Promise.resolve(this.user);
    }

    private buildWhereClause(fields: object, operator: string) {
        let clause = "";
        Object.keys(fields).forEach((field, index) => {
            clause += `user.${camelToSnake(field)} = :${camelToSnake(field)}`;
            if (index !== Object.keys(fields).length - 1) {
                clause += ` ${operator} `;
            }
        });
        return clause;
    }
}

export default new UserService();
