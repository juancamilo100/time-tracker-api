import express from "express";
import { authController as controller } from "../controllers";
import { authorizeAdminEmployee } from "../middleware/admin.authorization.middleware";
import { authenticateEmployee } from "../middleware/authentication.middleware";

const router = express.Router();

router.post("/login", controller.loginEmployee);
router.post("/register", [authenticateEmployee, authorizeAdminEmployee], controller.registerEmployee);

export default router;
