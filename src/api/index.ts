import express from "express";
import { authenticateEmployee } from "../middleware/auth.middleware";
import authRouter from "../routes/auth.routes";
import employeesRouter from "../routes/employees.routes";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/employees", authenticateEmployee, employeesRouter);

export default router;
