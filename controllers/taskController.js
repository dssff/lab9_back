const Task = require('../models/Task');
const AppError = require('../utils/AppError');

exports.getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ dueDate: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    next(err);
  }
};

exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return next(new AppError('Завдання не знайдено', 404));
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    if (!title) {
      return next(new AppError('Заголовок завдання обов\'язковий', 400));
    }
    const task = await Task.create({
      createdBy: req.user._id,
      title,
      description,
      status,
      priority,
      dueDate
    });
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const updates = (({ title, description, status, priority, dueDate }) => ({ title, description, status, priority, dueDate }))(req.body);
    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });
    if (!task) return next(new AppError('Завдання не знайдено', 404));
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return next(new AppError('Завдання не знайдено', 404));
    res.status(200).json({ success: true, message: 'Завдання видалено' });
  } catch (err) {
    next(err);
  }
};
