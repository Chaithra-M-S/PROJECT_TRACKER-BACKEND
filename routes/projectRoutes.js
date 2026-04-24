import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  getMyProject
} from "../controllers/ProjectController.js";

const router = express.Router();

router.post("/create", createProject);
router.get("/", getProjects);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
router.get("/my-project", verifyToken, getMyProject);



export default router;