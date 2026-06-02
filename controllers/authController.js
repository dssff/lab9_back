const catchAsync = require('../utils/catchAsync');
const authService = require('../services/authService');

exports.register = catchAsync(async (req, res) => {
  const { user } = await authService.register(req.body);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }
  });
});

exports.login = catchAsync(async (req, res) => {
  const { token, user } = await authService.login(req.body);

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

exports.getMe = catchAsync(async (req, res) => {
  const user = await authService.getMe(req.user.id);

  res.status(200).json({
    success: true,
    user
  });
});
