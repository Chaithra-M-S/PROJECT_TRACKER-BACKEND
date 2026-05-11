import express from "express";
import { sendMessage, getMessages } from "../controllers/messageController.js";
import { protect } from "../middleware/auth.js";
import Task from "../models/Tasks.js";

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/:taskId", protect, getMessages);

export default router;