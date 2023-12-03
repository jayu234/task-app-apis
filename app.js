import express from "express";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
dotenv.config({ path: "config/config.env" });

const app = express();
app.use(express.json());
app.use(cookieParser());

import users from "./routes/userRoutes.js";
import tasks from "./routes/taskRoutes.js";
import errorMiddleware from "./middleware/error.js";


import User from "./models/User.js";
import Task from "./models/Task.js";

// associations
User.hasMany(Task, {
  foreignKey: "createdBy",
  as: "tasks",
});

Task.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
});

app.use("/api/v1", users);
app.use("/api/v1", tasks);
app.use(errorMiddleware);

export default app;