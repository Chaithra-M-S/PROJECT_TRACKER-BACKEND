import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
{
    teamName: {
        type: String,
        required: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    teamLead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    employees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    }
},
{ timestamps: true }
);

export default mongoose.model("Team", teamSchema);