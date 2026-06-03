const Comment = require('../models/Comment');
const Task = require('../models/Task');
const AppError = require('../utils/AppError');

exports.getCommentsByTask = async (taskId) => {
  return await Comment.find({ task: taskId })
    .populate('user', 'name email')
    .sort({ createdAt: 1 });
};

exports.createComment = async (data, taskId, userId) => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError('Задачу не знайдено', 404);

  return await Comment.create({
    ...data,
    task: taskId,
    user: userId
  });
};

exports.deleteComment = async (commentId, currentUser) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new AppError('Коментар не знайдено', 404);

  if (
    comment.user.toString() !== currentUser._id.toString() &&
    currentUser.role !== 'admin'
  ) {
    throw new AppError('Ви не маєте прав видалити цей коментар', 403);
  }

  await comment.deleteOne();
  return comment;
};