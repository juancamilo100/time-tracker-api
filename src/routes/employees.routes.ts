import express from "express";
import { employeesController as controller } from "../controllers";

const router = express.Router();

router.get("/", controller.getEmployees);
router.get("/:id", controller.getEmployeeById);
router.delete("/:id", controller.deleteEmployee);

export default router;