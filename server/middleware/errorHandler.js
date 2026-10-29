// Centralized express error handler
const errorHandler = (err, req, res, next) => {
  console.error(`[API Error] ${req.method} ${req.url} - ${err.message}`);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    error: err.message || 'An unexpected internal server error occurred.',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
