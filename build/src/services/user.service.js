"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserService {
    get(id) {
        return "some cool user";
    }
    getByFields(fields) {
        console.log("getByFields");
    }
    getByEitherFields(fields) {
        console.log("getByEitherFields");
    }
    getAll() {
        return "some cool users";
    }
    getAllByFields(fields) {
        console.log("getAllByFields");
    }
    create(entity) {
        console.log("create");
    }
    update(entity) {
        console.log("update");
    }
    delete(id) {
        console.log("delete");
    }
}
exports.default = new UserService();
//# sourceMappingURL=user.service.js.map