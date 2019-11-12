"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
router.get("/", controllers_1.usersController.getUsers);
router.get("/:id", controllers_1.usersController.getUserById);
router.delete("/:id", controllers_1.usersController.deleteUser);
exports.default = router;
//# sourceMappingURL=users.routes.js.map