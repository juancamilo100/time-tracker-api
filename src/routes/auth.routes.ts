import express from "express";
import { authController as controller } from "../controllers";

const router = express.Router();

router.post("/login", controller.loginEmployee);
router.post("/register", controller.registerEmployee);

export default router;
