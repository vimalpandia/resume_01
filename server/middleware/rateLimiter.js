const rateLimit = require('express-rate-limit');

// Rate limiter for authentication routes (login / register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // allow up to 50 attempts per 15 min window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  },
});

// Rate limiter for file uploads and analysis
const uploadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 60, // allow up to 60 analyses
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Analysis rate limit reached. Please wait a few moments before submitting another resume.',
  },
});

module.exports = {
  authLimiter,
  uploadLimiter,
};
