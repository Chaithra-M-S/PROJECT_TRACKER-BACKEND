import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["SUPERADMIN", "ADMIN", "PD", "MANAGER", "TEAMLEAD","EMPLOYEE"],
    default: "EMPLOYEE"
  },
  project: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
],
  designation: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Designation"
},
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);