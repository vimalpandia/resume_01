const express = require('express');
const router = express.Router();
const {
  uploadAndParse,
  analyzeResume,
  matchJobDescription,
  getAiSuggestions,
  getHistory,
  getReportById,
  deleteReportById,
} = require('../controllers/resumeController');
const { requireAuth } = require('../middleware/authMiddleware');
const { uploadSinglePdf } = require('../middleware/uploadMiddleware');
const { uploadLimiter } = require('../middleware/rateLimiter');

// All resume routes require authentication
router.use(requireAuth);

router.post('/upload-parse', uploadLimiter, uploadSinglePdf, uploadAndParse);
router.post('/analyze', analyzeResume);
router.post('/match-jd', matchJobDescription);
router.post('/ai-suggestions', getAiSuggestions);
router.get('/history', getHistory);
router.get('/report/:id', getReportById);
router.delete('/report/:id', deleteReportById);

module.exports = router;
