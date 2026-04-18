import express from "express";
import {
  createProject,
  getProjects,
  getAdmins,
  getAvailableAdmins
} from "../controllers/ProjectController.js";

const router = express.Router();

router.post("/create", createProject);
router.get("/", getProjects);


router.get("/admins", getAdmins);
router.get("/available-admins", getAvailableAdmins);

export default router;