const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

const protect = async (req, res, next) => {
  try {

    let token;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Доступ заборонено. Токен відсутній', 401));
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(new AppError('Термін дії токена вийшов. Увійдіть знову', 401));
      }

      return next(new AppError('Невірний токен. Увійдіть знову', 401));
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError('Користувача не знайдено', 401));
    }

    req.user = user;
    next();

  } catch (err) {
    next(err);
  }
};

module.exports = protect;