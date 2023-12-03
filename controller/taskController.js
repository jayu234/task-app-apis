import { Op } from "sequelize";
import catchAcyncError from "../middleware/catchAcyncError.js";
import Task from "../models/Task.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const createTask = catchAcyncError(async (req, res, next) => {
  const { title, description, due } = req.body;

  if (!title || !description || !due) {
    return next(new ErrorHandler(400, "Please provide all the details"));
  }

  if (title.length < 5) {
    return next(new ErrorHandler(400, "Invalid title"));
  } else if (description.length < 5) {
    return next(new ErrorHandler(400, "Invalid description"));
  }

  const date = new Date(due);
  const isValidDate = !isNaN(date) && date instanceof Date;

  if (!isValidDate) {
    return next(new ErrorHandler(400, "Invalid due date."));
  }

  const newTask = await Task.create({
    title: title,
    description: description,
    due: date,
    createdBy: req.user.id,
  });

  if (!newTask) {
    return next(new ErrorHandler(500, "Failed to create the task."));
  }

  res.status(201).json({
    success: true,
    message: "Task created successfully!",
    result: newTask.dataValues,
  });
});

export const getTaskDetails = catchAcyncError(async (req, res, next) => {
  const id = req.params.id;
  const task = await Task.findByPk(id);
  if (!task) {
    return next(new ErrorHandler(404, "Task not found!"));
  }
  res.status(200).json({
    success: true,
    result: task.dataValues,
  });
});

export const getAllTask = catchAcyncError(async (req, res, next) => {
  const tasks = await Task.findAll();

  if (!tasks) {
    return next(new ErrorHandler(404, "Faild to get tasks"));
  }

  res.status(200).json({
    success: true,
    result: tasks,
  });
});

export const updateTask = catchAcyncError(async (req, res, next) => {
  const taskId = req.params.id;
  let task = await Task.findByPk(taskId);
  if (!task) {
    return next(new ErrorHandler(404, "Task not found!"));
  }

  const title = req.body.title ? req.body.title : task.dataValues.title;
  const description = req.body.description
    ? req.body.description
    : task.dataValues.description;
  const due = req.body.due ? req.body.due : task.dataValues.due;

  const date = new Date(due);
  const isValidDate = !isNaN(date) && date instanceof Date;
  if (!isValidDate) {
    return next(new ErrorHandler(400, "Invalid due date."));
  }

  const [updatedRows, updatedTask] = await Task.update(
    { title, description, due },
    {
      where: { id: { [Op.eq]: taskId } },
      returning: true,
    }
  );

  if (!updatedRows === 0) {
    return next(new ErrorHandler(500, "Failed to update the task."));
  }
  res.status(200).json({
    success: true,
    message: "Task updated successfully!",
    result: updatedTask,
  });
});

export const deleteTask = catchAcyncError(async (req, res, next) => {
  const taskId = req.params.id;
  const taskToDelete = await Task.findByPk(taskId);

  if (!taskToDelete) {
    return next(new ErrorHandler(404, "Task not found!"));
  }

  const deletedTask = await Task.destroy({ where: { id: taskId } });
  if (!deletedTask) {
    return next(new ErrorHandler(500, "Failed to delete the task."));
  }

  res.status(200).json({
    success: true,
    message: "Task deleted successfully!",
  });
});
