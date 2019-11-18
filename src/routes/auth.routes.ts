import express from "express";
import { authController as controller } from "../controllers";
import { authorizeAdminEmployee } from "../middleware/admin.auth.middleware";

const router = express.Router();

router.post("/login", controller.loginEmployee);
router.post("/register", authorizeAdminEmployee, controller.registerEmployee);

export default router;
