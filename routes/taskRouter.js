const express = require('express');
const router = express.Router();
const protect = require('../middleware/protect');
const restrictTo = require('../middleware/restrictTo');
const validate = require('../middleware/validate');
const { createTaskSchema } = require('../validators/taskValidators');
const {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const commentRouter = require('./commentRouter');
router.get('/', protect, getAllTasks);
router.get('/:id', protect, getTask);
router.post('/', protect, validate(createTaskSchema), createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, restrictTo('admin'), deleteTask);
router.use('/:taskId/comments', commentRouter);
module.exports = router;