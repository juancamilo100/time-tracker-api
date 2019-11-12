"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const auth_routes_1 = __importDefault(require("../routes/auth.routes"));
const users_routes_1 = __importDefault(require("../routes/users.routes"));
const router = express_1.default.Router();
router.use("/auth", auth_routes_1.default);
router.use("/users", auth_middleware_1.authenticateUser, users_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map