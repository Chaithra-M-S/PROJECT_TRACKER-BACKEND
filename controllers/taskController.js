import Task from "../models/Tasks.js";

// CREATE
// export const createTask = async (req, res) => {
//   try {
//     const task = await Task.create({
//       project: req.body.project,
//       taskName: req.body.taskName,
//       description: req.body.description,
//       manager: req.body.manager,   // 🔥 save manager id
//       deadline: req.body.deadline,
//       priority: req.body.priority,
//       status: req.body.status
//     });

//     res.status(201).json(task);

//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

export const createTask = async (req, res) => {
  try {
    const {
      taskName,
      description,
      project,
      manager,
      assignedTo,
      deadline,
      priority,
      parentTask,
      isSubtask,
    } = req.body;

    const task = await Task.create({
      taskName,
      description,
      project,
      manager,

      assignedTo: assignedTo || [],

      deadline,
      priority,

      parentTask: parentTask || null,
      isSubtask: isSubtask || false,

      status: "Not Started",
      remarks: "",
    });

    res.status(201).json(task);
  } catch (error) {
    console.log("CREATE TASK ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL


export const getTasks = async (req, res) => {
  try {
    const user = req.user;
    let tasks = [];

    console.log("LOGGED USER:", user);

    if (user.role === "PD") {
      tasks = await Task.find({
        manager: user.id,
        isSubtask: false
      });

    } else if (user.role === "MANAGER") {
      tasks = await Task.find({
        manager: user.id,
        isSubtask: false
      });

    } else if (user.role === "EMPLOYEE") {

      tasks = await Task.find({
        assignedTo: user.id
      })
        .populate("project", "name")
        .populate("manager", "name")
        .populate("parentTask", "taskName")
        .sort({ createdAt: -1 });
    }

    res.json(tasks);

  } catch (err) {
    console.log("GET TASK ERROR:", err);
    res.status(500).json({
      message: err.message
    });
  }
};

// export const getTasks = async (req, res) => {
//   try {
//     let tasks = [];

//     // ADMIN
//     if (req.user.role === "ADMIN") {
//       tasks = await Task.find({
//         project: req.user.project
//       })
//         .populate("manager", "name")
//         .populate("project", "name")
//         .populate("assignedTo", "name");
//     }

//     // MANAGER
//     else if (req.user.role === "MANAGER") {
//       tasks = await Task.find({
//         manager: req.user.id
//       })
//         .populate("manager", "name")
//         .populate("project", "name")
//         .populate("assignedTo", "name");
//     }

//     // EMPLOYEE 🔥
//     else if (req.user.role === "EMPLOYEE") {
//       tasks = await Task.find({
//         assignedTo: req.user.id
//       })
//         .populate("manager", "name")
//         .populate("project", "name")
//         .populate("assignedTo", "name");
//     }

//     // SUPERADMIN
//     else if (req.user.role === "SUPERADMIN") {
//       tasks = await Task.find()
//         .populate("manager", "name")
//         .populate("project", "name")
//         .populate("assignedTo", "name");
//     }

//     res.json(tasks);

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// Get tasks for logged-in manager
export const getManagerTasks = async (req, res) => {
  try {
    const managerId = req.user.id; // 🔥 from token
    console.log("Logged In User:", req.user);
    const tasks = await Task.find({
      manager: managerId,
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
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: req.body.status,
          remarks: req.body.remarks,
          assignedTo: req.body.assignedTo,
        },
      },
      { new: true },
    );

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("project", "name")
      .populate("manager", "name");

    const subtasks = await Task.find({
      parentTask: req.params.id,
      isSubtask: true
    })
      .populate("assignedTo", "name")
      .sort({ createdAt: -1 });

    res.json({
      ...task._doc,
      subtasks
    });

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};