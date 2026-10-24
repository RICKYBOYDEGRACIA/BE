const authService = require('../services/auth.service');

const register = async (req, res, next) => {
    try {
        const result = await authService.registerUser(req.body);
        return res.status(201).json(result);
    } catch (err) {
        next(err); // Passes error to your global error-handling middleware
    }
};

const login = async (req, res, next) => {
    try {
        const result = await authService.loginUser(req.body);
        return res.status(200).json(result);
    } catch (err) {
        const statusCode = err.statusCode || 500;
        return res.status(statusCode).json({ message: err.message });
    }
};

module.exports = {
    register,
    login
};