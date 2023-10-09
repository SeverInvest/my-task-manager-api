const Task = require("../models/task");
const { STATUS_OK, STATUS_CREATED } = require("../utils/statuses");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");
const { MSG_404, MSG_403, MSG_DELETE_TASK } = require("../utils/constants");

module.exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ owner: req.user._id });
    res.status(STATUS_OK).send(tasks);
  } catch (err) {
    next(err);
  }
};

module.exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ owner: req.user._id, _id: req.params.taskId });
    res.status(STATUS_OK).send(task);
  } catch (err) {
    next(err);
  }
};

module.exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status, deadline, tags } = req.body;
    const task = await Task.create({
      title,
      description,
      status,
      deadline,
      tags,
      owner: req.user._id,
    });
    await task.save();
    res.status(STATUS_CREATED).send(task);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      throw new NotFoundError(MSG_404);
    }
    if (task.owner.toString() === req.user._id.toString()) {
      await Task.deleteOne(task);
      res.status(STATUS_OK).send({ data: task, message: MSG_DELETE_TASK });
    } else {
      throw new ForbiddenError(MSG_403);
    }
  } catch (err) {
    next(err);
  }
};

module.exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      throw new NotFoundError(MSG_404);
    }
    if (task.owner.toString() === req.user._id.toString()) {
      const { title, description, status, deadline, tags } = req.body;
      const newTask = await Task.findByIdAndUpdate(
        task._id,
        { title, description, status, deadline, tags },
        { new: true },
      );
      await res.status(STATUS_OK).send(newTask);
    } else {
      throw new ForbiddenError(MSG_403);
    }
  } catch (err) {
    next(err);
  }
};
