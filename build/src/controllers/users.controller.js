"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class UsersController {
    constructor(userService) {
        this.userService = userService;
        this.getUsers = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userService.getAll({ showPassword: true });
            res.send(users);
        });
        this.getUserById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            res.send(`getting User by id: ${req.params.id}`);
        });
        this.deleteUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            res.send("deleting User");
        });
    }
}
exports.default = UsersController;
//# sourceMappingURL=users.controller.js.map