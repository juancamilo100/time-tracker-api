import express from "express";
import { authenticateEmployee } from "../middleware/authentication.middleware";
import authRouter from "../routes/auth.routes";
import customersRouter from "../routes/customers.routes";
import employeesRouter from "../routes/employees.routes";
import reportsRouter from "../routes/reports.routes";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/employees", authenticateEmployee, employeesRouter);
router.use("/customers", authenticateEmployee, customersRouter);
router.use("/reports", authenticateEmployee, reportsRouter);

export default router;
