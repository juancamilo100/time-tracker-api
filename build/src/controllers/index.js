"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = __importDefault(require("./auth.controller"));
const users_controller_1 = __importDefault(require("./users.controller"));
const user_service_1 = __importDefault(require("../services/user.service"));
const authController = new auth_controller_1.default(user_service_1.default);
exports.authController = authController;
const usersController = new users_controller_1.default(user_service_1.default);
exports.usersController = usersController;
//# sourceMappingURL=index.js.map