const catchAsync = require('../utils/catchAsync');
const taskService = require('../services/taskService');

exports.getAllTasks = catchAsync(async (req, res) => {
  const query = {};

  if (req.user && req.user.role !== 'admin') {
    query.createdBy = req.user._id;
  }

  const tasks = await taskService.getAllTasks(query);
  res.status(200).json({ success: true, count: tasks.length, data: tasks });
});

exports.getTask = catchAsync(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id);
  res.status(200).json({ success: true, data: task });
});

exports.createTask = catchAsync(async (req, res) => {
  const task = await taskService.createTask(req.body, req.user._id);
  res.status(201).json({ success: true, data: task });
});

exports.updateTask = catchAsync(async (req, res) => {
  const task = await taskService.updateTask(req.params.id, req.body, req.user);
  res.status(200).json({ success: true, data: task });
});

exports.deleteTask = catchAsync(async (req, res) => {
  await taskService.deleteTask(req.params.id);
  res.status(200).json({ success: true, message: 'Задачу видалено' });
});