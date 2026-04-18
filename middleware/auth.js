import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, "secret123");

    req.user = decoded; // ✅ important
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};