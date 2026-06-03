const Joi = require('joi');


exports.registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required()
        .messages({
            'string.min': 'Ім\'я має містити мінімум 2 символи',
            'string.empty': 'Ім\'я не може бути порожнім',
            'any.required': 'Ім\'я обов\'язкове'
        }),

    email: Joi.string().email().required()
        .messages({
            'string.email': 'Введіть коректний email',
            'string.empty': 'Email не може бути порожнім',
            'any.required': 'Email обов\'язковий'
        }),

    password: Joi.string().min(8).required()
        .messages({
            'string.min': 'Пароль має містити мінімум 8 символів',
            'string.empty': 'Пароль не може бути порожнім',
            'any.required': 'Пароль обов\'язковий'
        }),

    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
        .messages({
            'any.only': 'Паролі не збігаються',
            'string.empty': 'Підтвердження пароля не може бути порожнім'
        })
});


exports.loginSchema = Joi.object({
    email: Joi.string().email().required()
        .messages({
            'string.email': 'Введіть коректний email',
            'string.empty': 'Email не може бути порожнім',
            'any.required': 'Email обов\'язковий'
        }),
    password: Joi.string().required()
        .messages({
            'string.empty': 'Пароль не може бути порожнім',
            'any.required': 'Пароль обов\'язковий'
        })
});