const rateLimit = require('express-rate-limit');

const customRateLimiter = (maxRequest, customMessage) => {
    return rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: maxRequest,
        message: { message: customMessage || `Too many requests, please try again later.` },
        standardHeaders: true,
        legacyHeaders: false,
    });
}

module.exports = {customRateLimiter};