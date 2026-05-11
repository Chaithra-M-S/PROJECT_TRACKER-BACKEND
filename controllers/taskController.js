import Task from "../models/Tasks.js";

export const createTask = async (req, res) => {
  try {
    const {
      taskName,
      description,
      project,
      manager,
      assignedTo,
      assignedTeams,
      deadline,
      priority,
      parentTask,
    } = req.body;

    const task = await Task.create({
  taskName,
  description,
  project,

  assignedTo: assignedTo  || [],
  assignedTeams: req.body.assignedTeams || [],

  deadline,
  priority,

  parentTask: parentTask || null,

  isSubtask: !!parentTask,

  manager:
  req.user.role === "PD"
    ? manager
    : req.user.role === "MANAGER"
    ? req.user.id
    : null,

  teamLead:
    req.body.teamLead ||
    (req.user.role === "TEAMLEAD"
      ? req.user.id
      : null),

  createdBy: req.user.id,

  createdRole: req.user.role,

  status: "Not Started",

  remarks: "",

  attachment: req.file
    ? req.file.filename
    : "",
});

    res.status(201).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// GET TASKS
export const getTasks = async (req, res) => {
  try {
    const user = req.user;
    let tasks = [];

    console.log("Logged In User:", user);

    /* =====================================
       PROJECT DIRECTOR DASHBOARD
       Show ONLY tasks created by PD
    ===================================== */
    if (user.role === "PD") {
      tasks = await Task.find({
        createdBy: user.id,
        isSubtask: false,
      })
        .populate("project", "name")
        .populate("manager", "name")
        .sort({ createdAt: -1 });
    }
     else if (user.role === "MANAGER") {
      tasks = await Task.find({
        manager: user.id,
        isSubtask: false,
      })
        .populate("project", "name")
        .populate("manager", "name")
        .populate("teamLead", "name email")
        .sort({ createdAt: -1 });
    }
    else if (user.role === "TEAMLEAD") {

  // Tasks assigned by manager to this TL
  tasks = await Task.find({
    assignedTo: user.id,
    isSubtask: false,
  })
    .populate("project", "name")
    .populate("manager", "name")
    .sort({ createdAt: -1 });
} 
    else if (user.role === "EMPLOYEE" ) {
      /* =====================================
       EMPLOYEE DASHBOARD
       Show assigned subtasks/tasks
    ===================================== */
      tasks = await Task.find({
        assignedTo: user.id,
      })
        .populate("project", "name")
        .populate("manager", "name")
        .populate("parentTask", "taskName")
        .populate("assignedTo", "name")
        .sort({ createdAt: -1 });
    }

    console.log("Tasks Found:", tasks);

    res.json(tasks);
  } catch (err) {
    console.log("GET TASK ERROR:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get tasks for logged-in manager
export const getManagerTasks = async (req, res) => {
  try {
    const managerId = req.user.id; // 🔥 from token
    console.log("Logged In User:", req.user);
    const tasks = await Task.find({
      manager: managerId,
      isSubtask: false,
    })
      .populate("project", "name")
      .populate("manager", "name");

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE STATUS (Manager)
export const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    console.log("Logged User:", req.user);

    if (req.body.status) {
      task.status = req.body.status;
    }

    if (req.body.message) {
      task.messages.push({
        sender: req.user.role,
        text: req.body.message,
        createdAt: new Date(),
      });
    }

    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("project", "name")
      .populate("manager", "name")
      .populate("assignedTo", "name")
      .populate("teamLead", "name");

    const subtasks = await Task.find({
      parentTask: req.params.id,
      isSubtask: true,
    })
      .populate("assignedTo", "name")
      .sort({ createdAt: -1 });

    res.json({
      ...task._doc,
      subtasks,
      messages: task.messages || [],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    console.log("PROJECT ID:", projectId);

    const tasks = await Task.find({
      project: projectId,
      isSubtask: false,
    })
      .populate("assignedTo", "name")
      .populate("manager", "name")
      .populate("project", "name")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.log("GET TASKS BY PROJECT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (req.body.assignedTo !== undefined) {
      task.assignedTo = req.body.assignedTo;
    }

    if (req.body.teamLead !== undefined) {
      task.teamLead = req.body.teamLead;
    }

    if (req.body.status) {
      task.status = req.body.status;
    }

    await task.save();

    res.json(task);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};