import Project from "../models/Project.js";
import User from "../models/User.js";

// ✅ Create Project
export const createProject = async (req, res) => {
  try {
    const { name, description, assignedAdmin } = req.body;

    const project = new Project({
      name,
      description,
      assignedAdmin
    });

    await project.save();

    res.status(201).json({
      message: "Project created successfully",
      project
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get All Projects (with Admin Name)
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("assignedAdmin", "name email");

    res.json(projects);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Only ADMIN users (for dropdown)
export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "ADMIN" })
      .select("name email");

    res.json(admins);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAvailableAdmins = async (req, res) => {
  try {
    // 1. Get all projects
    const projects = await Project.find();

    // 2. Extract assigned admin IDs
    const assignedAdminIds = projects.map(p => p.assignedAdmin);

    // 3. Find admins NOT already assigned
    const availableAdmins = await User.find({
      role: "ADMIN",
      _id: { $nin: assignedAdminIds }
    }).select("name email");

    res.json(availableAdmins);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};