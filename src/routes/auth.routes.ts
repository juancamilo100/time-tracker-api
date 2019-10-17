import express from "express";
import { authController as controller } from "../controllers";

const router = express.Router();

router.post("/login", controller.loginUser);
router.post("/register", controller.registerUser);

export default router;
