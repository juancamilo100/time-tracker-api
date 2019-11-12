"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
router.post("/login", controllers_1.authController.loginUser);
router.post("/register", controllers_1.authController.registerUser);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map