import express from "express";
import { tasksController as controller } from "../controllers";

const router = express.Router({ mergeParams: true });

router.post("/", controller.createTask);
router.patch("/:taskId", controller.updateTaskById);
router.delete("/:taskId", controller.deleteTaskById);

export default router;