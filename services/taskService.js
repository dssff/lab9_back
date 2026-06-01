const Task = require('../models/Task');
const AppError = require('../utils/AppError');

exports.getAllTasks = async (query = {}) => {
  const tasks = await Task.find(query)
    .populate('createdBy', 'name email')
    .sort({ dueDate: 1, createdAt: -1 });
  return tasks;
};

exports.getTaskById = async (id) => {
  const task = await Task.findById(id).populate('createdBy', 'name email');
  if (!task) throw new AppError('Задачу не знайдено', 404);
  return task;
};

exports.createTask = async (data, userId) => {
  return await Task.create({ ...data, createdBy: userId });
};

exports.updateTask = async (id, data, currentUser) => {
  const task = await Task.findById(id);
  if (!task) throw new AppError('Задачу не знайдено', 404);

  if (
    task.createdBy.toString() !== currentUser._id.toString() &&
    currentUser.role !== 'admin'
  ) {
    throw new AppError('Ви не маєте прав редагувати цю задачу', 403);
  }

  Object.assign(task, data);
  await task.save();
  return task;
};

exports.deleteTask = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  if (!task) throw new AppError('Задачу не знайдено', 404);
  return task;
};