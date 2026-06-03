const express = require('express');
const router = express.Router({ mergeParams: true }); // важливо!
const protect = require('../middleware/protect');
const validate = require('../middleware/validate');
const { createCommentSchema } = require('../validators/commentValidators');
const { getComments, createComment, deleteComment } = require('../controllers/commentController');

router.get('/', getComments);
router.post('/', protect, validate(createCommentSchema), createComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;