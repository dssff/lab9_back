const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AppError = require('../utils/AppError');

exports.registerUser = async (data) => {
  const { name, email, password, confirmPassword } = data;

  if (password !== confirmPassword) {
    throw new AppError('Паролі не збігаються', 400);
  }

  const existing = await User.findOne({ email });

  if (existing) {
    throw new AppError('Користувач вже існує', 409);
  }

  const user = await User.create({ name, email, password });

  return user;
};
exports.loginUser = async (data) => {
  const { email, password } = data;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError('Невірний email або пароль', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError('Невірний email або пароль', 401);
  }

  return user;
};