import express from "express";
import Designation from "../models/Designation.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// ✅ Create designation
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name } = req.body;

    // ✅ take project from logged-in user
    const project = req.user.project;

    if (!name || !project) {
      return res.status(400).json({
        message: "Name or Project missing",
      });
    }

    const designation = await Designation.create({
      name,
      project,
    });

    res.status(201).json(designation);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get designations by project
router.get("/:projectId", verifyToken, async (req, res) => {
  try {
    const designations = await Designation.find({
      project: req.params.projectId,
    });

    res.json(designations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Designation.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;