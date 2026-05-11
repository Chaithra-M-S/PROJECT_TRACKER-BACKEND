import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import Message from "./models/Message.js";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import designationRoutes from "./routes/designationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";

import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger-output.json" with { type: "json" };



const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/designations", designationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/team", teamRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("DB connection failed:", error.message);
    process.exit(1);
  }
};
connectDB();

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("joinTask", (taskId) => {
    socket.join(taskId);
    console.log(`Socket ${socket.id} joined room ${taskId}`);
  });

  socket.on("sendMessage", (message) => {
       console.log("SOCKET MESSAGE:", message);

    const roomId =
      message.taskId ||
      (typeof message.task === "object" ? message.task._id : message.task);

      console.log("EMITTING TO ROOM:", roomId);

    io.to(roomId).emit("receiveMessage", message);
  });
});

server.listen(process.env.PORT, () =>
  console.log(`Server + Socket running on port ${process.env.PORT}`),
);
