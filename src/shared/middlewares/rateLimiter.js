const rateLimit = require('express-rate-limit');

const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 100,
  message = 'Too many requests, please try again later.',
} = {}) =>
  rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message,
      object: null,
      errors: ['RateLimitExceeded'],
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

module.exports = {
  createRateLimiter,
};

