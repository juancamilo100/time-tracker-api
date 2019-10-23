import express from "express";
import { usersController as controller } from "../controllers";

const router = express.Router();

router.get("/", controller.getUsers);
router.get("/:id", controller.getUserById);
router.delete("/:id", controller.deleteUser);

export default router;
