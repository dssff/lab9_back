const catchAsync = require('../utils/catchAsync');
const commentService = require('../services/commentService');

exports.getComments = catchAsync(async (req, res) => {
  const comments = await commentService.getCommentsByTask(req.params.taskId);
  res.status(200).json({ success: true, count: comments.length, data: comments });
});

exports.createComment = catchAsync(async (req, res) => {
  const comment = await commentService.createComment(
    req.body,
    req.params.taskId,
    req.user._id
  );
  res.status(201).json({ success: true, data: comment });
});

exports.deleteComment = catchAsync(async (req, res) => {
  await commentService.deleteComment(req.params.id, req.user);
  res.status(200).json({ success: true, message: 'Коментар видалено' });
});