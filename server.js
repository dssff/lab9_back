require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRouter');
const AppError = require('./utils/AppError');

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use((req, res, next) => {
  next(new AppError(`Маршрут ${req.originalUrl} не знайдено`, 404));
});

app.use((err, req, res, next) => {
  let error = err;

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message).join('. ');
    error = new AppError(messages, 400);
  }

  if (err.code && err.code === 11000) {
    const field = Object.keys(err.keyValue || {}).join(', ');
    error = new AppError(`Дублювання значення для поля: ${field}`, 409);
  }

  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : 'Внутрішня помилка сервера';
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });