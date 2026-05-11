import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const verifyToken = async (req, res, next) => {
  try {

    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = header.split(" ")[1];

    // ✅ USE SAME SECRET
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ✅ Get full user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();

  } catch (err) {

    console.log(err);

    res.status(401).json({
      message: "Invalid token",
    });
  }
};

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("AUTH HEADER:", req.headers.authorization);

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access Denied"
            });
        }

        next();
    };
};