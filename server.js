require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRouter');
const AppError = require('./utils/AppError');

const app = express();

/* CORS */
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5500',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

/* 404 */
app.use((req, res, next) => {
  next(new AppError('Маршрут не знайдено', 404));
});

/* error handler */
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message
  });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(3000, () => {
      console.log('Server running on 3000');
    });
  })
  .catch(console.log);