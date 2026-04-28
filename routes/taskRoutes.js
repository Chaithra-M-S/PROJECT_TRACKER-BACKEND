import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  createTask,
  getTasks,
  updateTaskStatus,
  getManagerTasks,
  getTaskById
} from "../controllers/taskController.js";

const router = express.Router();

router.post("/", verifyToken, createTask);
router.get("/my-tasks", verifyToken, getManagerTasks);

router.get("/", verifyToken, getTasks);

router.get("/:id", verifyToken, getTaskById);
router.put("/:id", verifyToken, updateTaskStatus);


export default router;