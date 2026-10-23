const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');
const { customRateLimiter } = require('../middleware/rateLimiter.middleware');

// POST /api/auth/register
router.post(
    '/register', 
    customRateLimiter(2, 'Too many user registration'), 
    authController.register
);

// POST /api/auth/login
router.post(
    '/login',
    customRateLimiter(3, "Too many requests"),
    authController.login
);

module.exports = router;