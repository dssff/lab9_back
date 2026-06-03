const Joi = require('joi');

exports.createCommentSchema = Joi.object({
  text: Joi.string().required()
    .messages({
      'string.empty': "Текст коментаря не може бути порожнім",
      'any.required': "Текст коментаря обов'язковий"
    })
});