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
    enum: ["SUPERADMIN", "ADMIN", "PD", "MANAGER", "LEAD", "EMPLOYEE"],
    default: "EMPLOYEE"
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);