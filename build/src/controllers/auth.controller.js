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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
class AuthController {
    constructor(userService) {
        this.userService = userService;
        this.loginUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (!req.body.email || !req.body.password) {
                return next(http_errors_1.default(400, "Incomplete request"));
            }
            try {
                const user = yield this.userService.getByFields({ email: req.body.email }, { showPassword: true });
                if (!user) {
                    return next(http_errors_1.default(404, "User not found"));
                }
                const passwordIsValid = bcryptjs_1.default.compareSync(req.body.password, user.password);
                if (!passwordIsValid) {
                    return next(http_errors_1.default(401, "Unauthorized"));
                }
                const token = jsonwebtoken_1.default.sign({ userId: user.id }, config_1.ENCRYPTION_KEY, { expiresIn: 3600 });
                res.send({ auth: true, token });
            }
            catch (error) {
                return next(http_errors_1.default(500, "Something went wrong"));
            }
        });
        this.registerUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (!req.body.email ||
                !req.body.password ||
                !req.body.firstName ||
                !req.body.lastName ||
                !req.body.companyId) {
                return next(http_errors_1.default(400, "Incomplete request"));
            }
            try {
                if (yield this.userExists(req.body.email)) {
                    return next(http_errors_1.default(409, "User already exists"));
                }
            }
            catch (error) {
                return next(http_errors_1.default(500, "Something went wrong"));
            }
            const hashedPassword = bcryptjs_1.default.hashSync(req.body.password);
            try {
                const newUser = {
                    password: hashedPassword,
                    email: req.body.email,
                    first_name: req.body.firstName,
                    last_name: req.body.firstName,
                    company_id: req.body.companyId
                };
                const createdUser = yield this.userService.create(newUser);
                const token = jsonwebtoken_1.default.sign({ id: createdUser.id }, config_1.ENCRYPTION_KEY, { expiresIn: 3600 });
                res.send({ auth: true, token });
            }
            catch (error) {
                return next(http_errors_1.default(500, error));
            }
        });
        this.userExists = (email) => {
            return this.userService.getByFields({ email });
        };
    }
}
exports.default = AuthController;
//# sourceMappingURL=auth.controller.js.map