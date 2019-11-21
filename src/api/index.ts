import express from "express";
import { authorizeAdminEmployee } from "../middleware/admin.authorization.middleware";
import { authenticateEmployee } from "../middleware/authentication.middleware";
import authRouter from "../routes/auth.routes";
import customersRouter from "../routes/customers.routes";
import employeesRouter from "../routes/employees.routes";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/employees", authenticateEmployee, employeesRouter);
router.use("/customers", authenticateEmployee, customersRouter);

export default router;
