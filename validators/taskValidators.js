const Joi = require('joi');

exports.createTaskSchema = Joi.object({
  title: Joi.string().required()
    .messages({
      'string.empty': 'Заголовок задачі не може бути порожнім',
      'any.required': 'Заголовок задачі обов\'язковий'
    }),
  description: Joi.string().allow('').default(''),
  status: Joi.string().valid('pending', 'in-progress', 'completed').default('pending')
    .messages({
      'any.only': 'Статус повинен бути pending, in-progress або completed'
    }),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium')
    .messages({
      'any.only': 'Пріоритет повинен бути low, medium або high'
    }),
  dueDate: Joi.date().optional()
});