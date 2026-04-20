import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  project: String,
  taskName: String,
  description: String,
  manager: String,
  deadline: Date,
  priority: String,
  status: {
    type: String,
    default: "Not Started"
  },
  progress: {
    type: String,
    default: "0%"
  },
  remarks: {
    type: String,
    default: ""
  }
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);