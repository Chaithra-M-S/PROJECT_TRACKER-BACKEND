import express, { Router } from "express";

import { verifyToken } from "../middleware/auth.js";

import { createUser, getUsers, deleteUser, changePassword, getManagers } from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUser);

router.get("/getUser", getUsers);

router.get("/", verifyToken, getUsers);


router.put("/change-password", verifyToken, changePassword);
// router.put("/:id", updateUser);
router.get("/managers/:projectId", getManagers);
router.delete("/:id", deleteUser);
export default router;