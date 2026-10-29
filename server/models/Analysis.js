const mongoose = require('mongoose');
const { isMongoConnected, inMemoryAnalyses, generateId } = require('./store');

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resumeTitle: {
      type: String,
      required: true,
      trim: true,
    },
    originalFileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    rawText: {
      type: String,
      default: '',
    },
    extractedSections: {
      contact: {
        name: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        github: { type: String, default: '' },
        portfolio: { type: String, default: '' },
        location: { type: String, default: '' },
      },
      summary: { type: String, default: '' },
      education: [
        {
          institution: String,
          degree: String,
          year: String,
          gpa: String,
        },
      ],
      experience: [
        {
          title: String,
          company: String,
          duration: String,
          bullets: [String],
        },
      ],
      projects: [
        {
          name: String,
          techStack: [String],
          description: String,
          bullets: [String],
        },
      ],
      skills: {
        technical: [String],
        soft: [String],
        tools: [String],
        languages: [String],
        categories: { type: Object, default: {} },
      },
      certifications: [String],
    },
    atsScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    scoreBreakdown: {
      sectionCompleteness: { score: Number, max: Number, details: String },
      contentAndImpact: { score: Number, max: Number, details: String },
      skillsRelevance: { score: Number, max: Number, details: String },
      readability: { score: Number, max: Number, details: String },
      contactCompleteness: { score: Number, max: Number, details: String },
    },
    strengths: [String],
    issues: [
      {
        type: { type: String },
        severity: { type: String, enum: ['critical', 'warning', 'info'] },
        message: String,
        suggestion: String,
      },
    ],
    suggestions: [
      {
        priority: { type: String, enum: ['high', 'medium', 'low'] },
        category: String,
        message: String,
        action: String,
      },
    ],
    targetJob: {
      title: { type: String, default: '' },
      company: { type: String, default: '' },
      descriptionText: { type: String, default: '' },
    },
    jdMatchResult: {
      matchScore: { type: Number, default: 0 },
      matchedSkills: [
        {
          skill: String,
          frequency: Number,
          category: String,
        },
      ],
      missingRequiredSkills: [String],
      missingPreferredSkills: [String],
      keywordCoverage: { type: Number, default: 0 },
      recommendations: [String],
    },
    aiSuggestions: {
      improvedBullets: [
        {
          original: String,
          improved: String,
          formula: String,
          keyImprovements: [String],
        },
      ],
      weakVerbsFound: [
        {
          verb: String,
          alternatives: [String],
        },
      ],
      generalTips: [String],
    },
  },
  {
    timestamps: true,
  }
);

const MongooseAnalysis = mongoose.model('Analysis', analysisSchema);

class AnalysisRepository {
  static async create(analysisData) {
    if (isMongoConnected()) {
      const record = new MongooseAnalysis(analysisData);
      return await record.save();
    }
    const id = generateId();
    const newRecord = {
      ...analysisData,
      _id: id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryAnalyses.set(id, newRecord);
    return newRecord;
  }

  static async findById(id) {
    if (isMongoConnected()) {
      return MongooseAnalysis.findById(id);
    }
    return inMemoryAnalyses.get(id?.toString()) || null;
  }

  static async findByUserId(userId) {
    const uidStr = userId?.toString();
    if (isMongoConnected()) {
      return MongooseAnalysis.find({ userId }).sort({ createdAt: -1 });
    }
    const results = [];
    for (const record of inMemoryAnalyses.values()) {
      if (record.userId?.toString() === uidStr) {
        results.push(record);
      }
    }
    return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static async updateById(id, updates) {
    if (isMongoConnected()) {
      return MongooseAnalysis.findByIdAndUpdate(id, updates, { new: true });
    }
    const record = inMemoryAnalyses.get(id?.toString());
    if (!record) return null;
    Object.assign(record, updates, { updatedAt: new Date() });
    inMemoryAnalyses.set(id?.toString(), record);
    return record;
  }

  static async deleteById(id) {
    if (isMongoConnected()) {
      return MongooseAnalysis.findByIdAndDelete(id);
    }
    const exists = inMemoryAnalyses.has(id?.toString());
    inMemoryAnalyses.delete(id?.toString());
    return exists;
  }

  static async deleteByUserId(userId) {
    const uidStr = userId?.toString();
    if (isMongoConnected()) {
      return MongooseAnalysis.deleteMany({ userId });
    }
    let count = 0;
    for (const [id, record] of inMemoryAnalyses.entries()) {
      if (record.userId?.toString() === uidStr) {
        inMemoryAnalyses.delete(id);
        count++;
      }
    }
    return { deletedCount: count };
  }
}

module.exports = {
  Analysis: MongooseAnalysis,
  AnalysisRepository,
};
