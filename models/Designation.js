// models/Designation.js
import mongoose from "mongoose";

const designationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Designation", designationSchema);