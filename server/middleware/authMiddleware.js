const jwt = require('jsonwebtoken');
const { UserRepository } = require('../models/User');

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production') {
    if (
      !secret ||
      secret === 'dev_secret_placement_key_2026' ||
      secret === 'dev_secret_placement_key_replace_in_production_2026'
    ) {
      throw new Error(
        '[Security Fatal] JWT_SECRET must be configured with a secure private key in production. Please set JWT_SECRET in the Render Dashboard.'
      );
    }
    return secret;
  }
  return secret || 'dev_secret_placement_key_2026';
};

const JWT_SECRET = getJwtSecret();

const requireAuth = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please log in to proceed.',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await UserRepository.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User account not found. Please log in again.',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Session expired. Please log in again.',
      });
    }
    return res.status(401).json({
      success: false,
      error: 'Invalid authentication token.',
    });
  }
};

module.exports = {
  requireAuth,
  JWT_SECRET,
};
