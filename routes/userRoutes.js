import express, { Router } from "express";

import { verifyToken } from "../middleware/auth.js";

import { createUser, getUsers, deleteUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUser);

router.get("/getUser", getUsers);

router.get("/",  verifyToken,getUsers);

router.delete("/:id", deleteUser);
// router.put("/:id", updateUser);
export default router;