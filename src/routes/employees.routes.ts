import express from "express";
import { employeesController as controller } from "../controllers";
import { authorizeAdminEmployee } from "../middleware/admin.authorization.middleware";
import { authorizeEmployeeById } from "../middleware/id.authorization.middleware";

const router = express.Router();

router.get("/", authorizeAdminEmployee, controller.getEmployees);
router.get("/:id", authorizeEmployeeById, controller.getEmployeeById);
router.patch("/:id", authorizeEmployeeById, controller.updateEmployeeById);
router.patch("/:id/password", authorizeEmployeeById, controller.updateEmployeePasswordById);
router.delete("/:id", authorizeAdminEmployee, controller.deleteEmployeeById);

export default router;
