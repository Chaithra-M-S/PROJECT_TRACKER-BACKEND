import express from "express";
import { verifyToken,protect } from "../middleware/auth.js";
import {
  createTask,
    getTasks,
    updateTaskStatus,
  getManagerTasks,
  getTaskById,
  getTasksByProject,
  updateTask
} from "../controllers/taskController.js";
import upload from "../middleware/uploads.js";
import multer from "multer";
import path from "path";

const router = express.Router();

router.post("/", verifyToken,upload.single("attachment"), createTask);
router.get("/my-tasks", verifyToken, getManagerTasks);

router.get("/", verifyToken, getTasks);

router.get("/project/:projectId", getTasksByProject);


router.get("/:id", verifyToken, getTaskById);
router.put("/:id", verifyToken, updateTaskStatus);
router.put("/:id", protect, updateTask);



export default router;