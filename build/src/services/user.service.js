"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_entity_1 = __importDefault(require("../database/entities/user.entity"));
const formatter_1 = require("../utils/formatter");
class UserService {
    constructor() {
        this.user = new user_entity_1.default();
    }
    get(id) {
        return Promise.resolve(this.user);
    }
    getByFields(fields, options = {}) {
        const clause = this.buildWhereClause(fields, "AND");
        let query = typeorm_1.getRepository(user_entity_1.default)
            .createQueryBuilder("user")
            .where(clause, fields);
        if (options.showPassword) {
            query = query.addSelect("user.password");
        }
        return query.getOne();
    }
    getByEitherFields(fields) {
        return Promise.resolve(this.user);
    }
    getAll() {
        return typeorm_1.getRepository(user_entity_1.default).find();
    }
    getAllByFields(fields) {
        return Promise.resolve([this.user]);
    }
    create(entity) {
        const userRepo = typeorm_1.getRepository(user_entity_1.default);
        const newUser = userRepo.create(entity);
        return userRepo.save(newUser);
    }
    update(entity) {
        return Promise.resolve(this.user);
    }
    delete(id) {
        return Promise.resolve(this.user);
    }
    buildWhereClause(fields, operator) {
        let clause = "";
        Object.keys(fields).forEach((field, index) => {
            clause += `user.${formatter_1.camelToSnake(field)} = :${formatter_1.camelToSnake(field)}`;
            if (index !== Object.keys(fields).length - 1) {
                clause += ` ${operator} `;
            }
        });
        return clause;
    }
}
exports.default = new UserService();
//# sourceMappingURL=user.service.js.map