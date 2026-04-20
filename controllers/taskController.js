import Task from "../models/Tasks.js";

// CREATE
export const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("project", "name")   // ✅ THIS LINE FIXES IT
      .populate("manager", "name");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE STATUS (Manager)
export const updateTaskStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    let progress = "0%";
    if (status === "In Progress") progress = "50%";
    if (status === "Completed") progress = "100%";

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status, progress, remarks },
      { new: true }
    );

    res.json(task);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};