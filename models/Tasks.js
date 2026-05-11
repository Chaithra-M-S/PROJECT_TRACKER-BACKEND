import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  parentTask: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    default: null
  },

  isSubtask: {
    type: Boolean,
    default: false
  },

  // ✅ MULTIPLE EMPLOYEES FOR SUBTASK / TASK
  assignees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },

  taskName: {
    type: String,
    required: true
  },

  description: String,

  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  assignedTeams: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },

],
teamLead: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},

  createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
},

createdRole: {
  type: String
},
teamLead: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "User"
},

  deadline: Date,

  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium"
  },
  

  status: {
    type: String,
    enum: [
      "Not Started",
      "In Progress",
      "Completed",
      "Blocked",
      "On Hold"
    ],
    default: "Not Started"
  },

  progress: {
    type: String,
    default: "0%"
  },
  attachment: {
  type: String,
},

  remarks: {
    type: String,
    default: ""
  },

}, { timestamps: true });

export default mongoose.model("Task", taskSchema);