import { Router } from "express";
import authenticate from "../middleware/auth.js";
import { createTask, deleteTask, getAllTask, getTaskDetails, updateTask } from "../controller/taskController.js";

const router = Router();

router.route("/task/create").post(authenticate, createTask);
router.route("/task/all").get(authenticate, getAllTask);
router.route("/task/:id").get(authenticate, getTaskDetails).put(authenticate, updateTask).delete(authenticate, deleteTask);

export default router;