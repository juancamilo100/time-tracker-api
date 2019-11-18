import express from "express";
import { employeesController as controller } from "../controllers";
import { authorizeAdminEmployee } from "../middleware/admin.auth.middleware";

const router = express.Router();

router.get("/", authorizeAdminEmployee, controller.getEmployees);
router.get("/:id", controller.getEmployeeById);
router.delete("/:id", authorizeAdminEmployee, controller.deleteEmployee);

export default router;
