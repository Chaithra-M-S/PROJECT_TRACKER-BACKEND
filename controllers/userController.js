


import User from "../models/User.js";
import bcrypt from "bcryptjs";
import accountCreatedTemplate from "../templates/accountCreatedTemplate.js";
import { sendEmail } from "../utils/sendEmail.js";
import Project from "../models/Project.js";


export const createUser = async (req, res) => {
  try {
    console.log("🔥 BODY FROM FRONTEND:", req.body);
    const { name, email, password, role } = req.body;


    // check existing
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });



    const message = accountCreatedTemplate(name, email, password);


    await sendEmail(email, "Login Credentials", message);


    res.status(201).json({
      message: "User created successfully",
      user
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getUsers = async (req, res) => {
  try {
    let users;


    if (req.user.role === "SUPERADMIN") {
      users = await User.find({
        _id: { $ne: req.user.id }   // 👈 exclude self
      }).select("-password");
    }

    // ✅ Admin → only employees/managers
    else if (req.user.role === "ADMIN") {
      users = await User.find({
        role: { $in: ["EMPLOYEE", "MANAGER"] }
      }).select("-password");
    }

    else {
      users = [];
    }

    res.json(users);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // from token
    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(userId, {
      password: hashedPassword
    });

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const getManagers = async (req, res) => {
  try {
    const { projectId } = req.params;

    // 🚫 prevent crash
    if (!projectId || projectId === "undefined") {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const managers = await User.find({
      role: "MANAGER",
      project: projectId
    });

    res.json(managers);
  } catch (err) {
    console.error("GET MANAGERS ERROR:", err);
    res.status(500).json({ message: "Error fetching managers" });
  }
};