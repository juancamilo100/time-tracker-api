import express from "express";
import { authController as controller } from "../controllers";
import { authorizeAdminEmployee } from "../middleware/admin.auth.middleware";
import { authenticateEmployee } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/login", controller.loginEmployee);
router.post("/register", [authenticateEmployee, authorizeAdminEmployee], controller.registerEmployee);

export default router;
