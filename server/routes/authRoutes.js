const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  deleteAccount,
} = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', requireAuth, getMe);
router.put('/profile', requireAuth, updateProfile);
router.delete('/account', requireAuth, deleteAccount);

module.exports = router;
