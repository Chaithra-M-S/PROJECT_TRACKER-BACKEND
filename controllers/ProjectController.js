import Project from "../models/Project.js";
import User from "../models/User.js";

// ✅ Create Project
export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    console.log("BACKEND BODY:", req.body);

    const project = new Project({
      name,
      description
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


export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
export const updateProject = async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
export const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
