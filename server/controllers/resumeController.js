const PdfParserService = require('../services/pdfParserService');
const SectionExtractor = require('../services/sectionExtractor');
const AtsScoringEngine = require('../services/atsScoringEngine');
const JdMatcherService = require('../services/jdMatcherService');
const AiService = require('../services/aiService');
const { AnalysisRepository } = require('../models/Analysis');

/**
 * 1. Upload PDF and Extract Text & Structured Sections
 * POST /api/resumes/upload-parse
 */
const uploadAndParse = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No resume file uploaded. Please upload a PDF file.',
      });
    }

    const { buffer, originalname, size } = req.file;

    // Extract text from PDF buffer
    const parseResult = await PdfParserService.extractText(buffer);

    // Guard against scanned/image-only PDFs
    if (parseResult.isScanned) {
      return res.status(422).json({
        success: false,
        error: 'Scanned or Image-only PDF detected: Text could not be extracted directly. Please upload a text-based PDF or export directly from Word/Docs/LaTeX (OCR is not enabled).',
        details: {
          wordCount: parseResult.wordCount,
          pages: parseResult.numPages,
        },
      });
    }

    // Parse sections, contact details, and skills
    const contact = SectionExtractor.extractContact(parseResult.text);
    const sections = SectionExtractor.extractSections(parseResult.text);
    const skills = SectionExtractor.extractSkills(parseResult.text);
    const bullets = SectionExtractor.extractBulletPoints(parseResult.text);

    return res.json({
      success: true,
      message: 'Resume parsed successfully.',
      data: {
        fileName: originalname,
        fileSize: size,
        numPages: parseResult.numPages,
        wordCount: parseResult.wordCount,
        rawText: parseResult.text,
        extractedSections: {
          contact,
          summary: sections.summary,
          education: sections.education,
          experience: sections.experience,
          projects: sections.projects,
          skills,
          certifications: sections.certifications,
          bullets,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 2. Run Complete ATS Compatibility Analysis & Persist
 * POST /api/resumes/analyze
 */
const analyzeResume = async (req, res, next) => {
  try {
    const {
      resumeTitle,
      originalFileName,
      fileSize,
      rawText,
      extractedSections,
      jobDescription,
      targetJobTitle,
    } = req.body;

    if (!rawText || rawText.trim().length < 30) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient resume text to perform ATS scoring. Minimum 30 characters required.',
      });
    }

    const contact = extractedSections?.contact || SectionExtractor.extractContact(rawText);
    const sections = extractedSections || SectionExtractor.extractSections(rawText);
    const skills = extractedSections?.skills || SectionExtractor.extractSkills(rawText);
    const bullets = extractedSections?.bullets || SectionExtractor.extractBulletPoints(rawText);

    // Execute decoupled ATS Scoring Engine
    const scoreReport = AtsScoringEngine.evaluateResume({
      rawText,
      contact,
      sections,
      skills,
    });

    // Optional Job Description Matching
    let jdMatchResult = {
      matchScore: 0,
      matchedSkills: [],
      missingRequiredSkills: [],
      missingPreferredSkills: [],
      keywordCoverage: 0,
      recommendations: [],
    };

    if (jobDescription && jobDescription.trim().length >= 15) {
      jdMatchResult = JdMatcherService.match({
        resumeText: rawText,
        resumeSkills: skills,
        jobDescription,
      });
    }

    // AI Suggestions (initial heuristic or live Gemini generation)
    const initialSuggestions = await AiService.generateSuggestions({
      bullets,
      targetRole: targetJobTitle || req.user.targetRole || 'Software Engineer',
      jobDescription: jobDescription || '',
      customApiKey: req.user.customApiKey || '',
    });

    // Persist analysis in database
    const savedRecord = await AnalysisRepository.create({
      userId: req.user._id,
      resumeTitle: resumeTitle || originalFileName?.replace(/\.pdf$/i, '') || 'My Engineering Resume',
      originalFileName: originalFileName || 'resume.pdf',
      fileSize: fileSize || 1024,
      rawText,
      extractedSections: {
        contact,
        summary: typeof sections.summary === 'string' ? sections.summary : '',
        education: Array.isArray(sections.education) ? sections.education : [],
        experience: Array.isArray(sections.experience) ? sections.experience : [],
        projects: Array.isArray(sections.projects) ? sections.projects : [],
        skills,
        certifications: Array.isArray(sections.certifications) ? sections.certifications : [],
      },
      atsScore: scoreReport.atsScore,
      scoreBreakdown: scoreReport.scoreBreakdown,
      strengths: scoreReport.strengths,
      issues: scoreReport.issues,
      suggestions: scoreReport.suggestions,
      targetJob: {
        title: targetJobTitle || req.user.targetRole || 'Software Engineer',
        company: '',
        descriptionText: jobDescription || '',
      },
      jdMatchResult,
      aiSuggestions: initialSuggestions,
    });

    return res.status(201).json({
      success: true,
      message: 'Resume analyzed and persisted successfully.',
      data: savedRecord,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 3. Match Resume with Job Description
 * POST /api/resumes/match-jd
 */
const matchJobDescription = async (req, res, next) => {
  try {
    const { analysisId, resumeText, resumeSkills, jobDescription, targetJobTitle } = req.body;

    if (!jobDescription || jobDescription.trim().length < 20) {
      return res.status(400).json({
        success: false,
        error: 'Please paste a complete job description (minimum 20 characters).',
      });
    }

    let textToMatch = resumeText;
    let skillsToMatch = resumeSkills;

    // If analysisId is provided, pull from saved analysis and verify ownership
    if (analysisId) {
      const record = await AnalysisRepository.findById(analysisId);
      if (!record) {
        return res.status(404).json({ success: false, error: 'Analysis record not found.' });
      }
      if (record.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, error: 'Unauthorized: You do not own this analysis.' });
      }
      textToMatch = record.rawText;
      skillsToMatch = record.extractedSections?.skills || {};
    }

    if (!textToMatch) {
      return res.status(400).json({
        success: false,
        error: 'No resume text available for matching.',
      });
    }

    const matchResult = JdMatcherService.match({
      resumeText: textToMatch,
      resumeSkills: skillsToMatch,
      jobDescription,
    });

    // If analysisId was passed, update the record with new match data
    if (analysisId) {
      await AnalysisRepository.updateById(analysisId, {
        jdMatchResult: matchResult,
        targetJob: {
          title: targetJobTitle || 'Target Role',
          descriptionText: jobDescription,
        },
      });
    }

    return res.json({
      success: true,
      message: 'Job description matching completed.',
      data: matchResult,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 4. Generate AI & Heuristic Resume Suggestions
 * POST /api/resumes/ai-suggestions
 */
const getAiSuggestions = async (req, res, next) => {
  try {
    const { analysisId, bullets, targetRole, jobDescription } = req.body;

    let targetBullets = bullets || [];
    let role = targetRole || req.user.targetRole || 'Software Engineer';
    let jd = jobDescription || '';

    if (analysisId) {
      const record = await AnalysisRepository.findById(analysisId);
      if (!record) {
        return res.status(404).json({ success: false, error: 'Analysis record not found.' });
      }
      if (record.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, error: 'Unauthorized access to analysis.' });
      }
      if (!targetBullets.length) {
        targetBullets = SectionExtractor.extractBulletPoints(record.rawText);
      }
      if (!jd && record.targetJob?.descriptionText) {
        jd = record.targetJob.descriptionText;
      }
    }

    const suggestions = await AiService.generateSuggestions({
      bullets: targetBullets,
      targetRole: role,
      jobDescription: jd,
      customApiKey: req.user.customApiKey || '',
    });

    if (analysisId) {
      await AnalysisRepository.updateById(analysisId, {
        aiSuggestions: suggestions,
      });
    }

    return res.json({
      success: true,
      data: suggestions,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 5. Get User Analysis History
 * GET /api/resumes/history
 */
const getHistory = async (req, res, next) => {
  try {
    const records = await AnalysisRepository.findByUserId(req.user._id);

    // Return sanitized summary array for list view
    const history = records.map((r) => ({
      id: r._id,
      resumeTitle: r.resumeTitle,
      originalFileName: r.originalFileName,
      fileSize: r.fileSize,
      atsScore: r.atsScore,
      targetJob: r.targetJob?.title || 'Software Engineer',
      jdMatchScore: r.jdMatchResult?.matchScore || 0,
      skillsCount: (r.extractedSections?.skills?.technical || []).length,
      createdAt: r.createdAt,
    }));

    return res.json({
      success: true,
      data: history,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 6. Get Single Analysis Report
 * GET /api/resumes/report/:id
 */
const getReportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const record = await AnalysisRepository.findById(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Analysis report not found.',
      });
    }

    // Security Authorization check: Access to another user's data is strictly forbidden
    if (record.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Access denied: You are not authorized to view this analysis report.',
      });
    }

    return res.json({
      success: true,
      data: record,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 7. Delete Single Analysis Report
 * DELETE /api/resumes/report/:id
 */
const deleteReportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const record = await AnalysisRepository.findById(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Analysis report not found.',
      });
    }

    if (record.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Access denied: You cannot delete another user\'s analysis.',
      });
    }

    await AnalysisRepository.deleteById(id);

    return res.json({
      success: true,
      message: 'Analysis report deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  uploadAndParse,
  analyzeResume,
  matchJobDescription,
  getAiSuggestions,
  getHistory,
  getReportById,
  deleteReportById,
};
