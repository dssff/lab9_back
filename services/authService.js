const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const AppError = require('../utils/AppError');

// Генерація JWT токена
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

exports.register = async ({ name, email, password, confirmPassword }) => {
  if (password !== confirmPassword) {
    throw new AppError('Паролі не збігаються', 400);
  }

  const existing = await User.findOne({ email });
  if (existing) throw new AppError('Користувач із таким email вже існує', 409);

  const user = await User.create({ name, email, password });

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }
  };
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) throw new AppError('Невірний email або пароль', 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError('Невірний email або пароль', 401);

  const token = generateToken(user._id);

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

exports.getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('Користувача не знайдено', 404);

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
};