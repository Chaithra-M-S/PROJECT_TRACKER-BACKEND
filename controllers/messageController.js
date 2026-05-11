import Message from "../models/Message.js";
import Task from "../models/Tasks.js";


// ✅ SEND MESSAGE
export const sendMessage = async (req, res) => {
  try {
    const { taskId, text } = req.body;

    // 🔐 Optional security (recommended)
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const msg = await Message.create({
      task: taskId,
      sender: req.user.id, // from auth middleware
      text,
    });

    const populated = await msg.populate("sender", "name");

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ GET MESSAGES FOR TASK
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      task: req.params.taskId,
      sender: req.user.id
    })
      .populate("sender", "name")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};