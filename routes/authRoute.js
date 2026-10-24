const express = require('express');
const app = express.Router();
const authController = require('../controllers/authController');
const { customRateLimiter } = require('../middleware/rateLimiter.middleware');
// POST /api/auth/register
app.post(
    '/register', 
    customRateLimiter(2, 'Too many user registration'), 
    authController.register
);

// POST /api/auth/login
app.post(
    '/login',
    customRateLimiter(3, "Too many requests"),
    authController.login,
);

module.exports = app;