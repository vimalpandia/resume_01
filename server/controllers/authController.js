const jwt = require('jsonwebtoken');
const { UserRepository } = require('../models/User');
const { AnalysisRepository } = require('../models/Analysis');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: '7d',
  });
};

/**
 * Register new user
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, targetRole } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid name (at least 2 characters).',
      });
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.',
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.',
      });
    }

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email address already exists.',
      });
    }

    const user = await UserRepository.create({
      name: name.trim(),
      email: email.trim(),
      password,
      targetRole: targetRole || 'Full Stack Software Engineer',
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        themePreference: user.themePreference,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * User login
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both email and password.',
      });
    }

    const user = await UserRepository.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials. Please verify your email and password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials. Please verify your email and password.',
      });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        themePreference: user.themePreference,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
  return res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      targetRole: req.user.targetRole,
      themePreference: req.user.themePreference,
      hasCustomApiKey: Boolean(req.user.customApiKey),
    },
  });
};

/**
 * Update user profile
 * PUT /api/auth/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, targetRole, themePreference, customApiKey, password } = req.body;
    const updates = {};

    if (name && name.trim().length >= 2) updates.name = name.trim();
    if (targetRole) updates.targetRole = targetRole.trim();
    if (themePreference && ['light', 'dark'].includes(themePreference)) {
      updates.themePreference = themePreference;
    }
    if (customApiKey !== undefined) updates.customApiKey = customApiKey.trim();
    if (password && password.length >= 6) updates.password = password;

    const updatedUser = await UserRepository.updateById(req.user._id, updates);

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        targetRole: updatedUser.targetRole,
        themePreference: updatedUser.themePreference,
        hasCustomApiKey: Boolean(updatedUser.customApiKey),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete account and all associated analyses
 * DELETE /api/auth/account
 */
const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Remove all analyses owned by this user
    await AnalysisRepository.deleteByUserId(userId);
    // Remove user record
    await UserRepository.deleteById(userId);

    return res.json({
      success: true,
      message: 'Account and all associated resume analyses have been permanently deleted.',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  deleteAccount,
};
