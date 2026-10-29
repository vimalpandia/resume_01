const SectionExtractor = require('./sectionExtractor');

/**
 * Job Description Matcher Service
 * Evaluates semantic alignment, keyword coverage, and skill overlap
 * between candidate resume and target role description.
 */
class JdMatcherService {
  /**
   * Match resume against Job Description
   * @param {Object} params
   * @param {string} params.resumeText
   * @param {Object} params.resumeSkills
   * @param {string} params.jobDescription
   * @returns {Object} Match report
   */
  static match({ resumeText = '', resumeSkills = {}, jobDescription = '' }) {
    if (!jobDescription || jobDescription.trim().length < 15) {
      throw new Error('Please provide a substantial Job Description to perform matching.');
    }

    const jdText = jobDescription.toLowerCase();
    const resumeTextLower = resumeText.toLowerCase();

    // 1. Extract skills from the Job Description
    const jdSkillsResult = SectionExtractor.extractSkills(jobDescription);
    const jdTechSkills = jdSkillsResult.technical || [];
    const jdSoftSkills = jdSkillsResult.soft || [];

    // Candidate verified skills (from SectionExtractor)
    const candidateTech = new Set(
      (resumeSkills.technical || []).map((s) => s.toLowerCase())
    );
    const candidateSoft = new Set(
      (resumeSkills.soft || []).map((s) => s.toLowerCase())
    );

    // 2. Classify required vs preferred skills in JD
    const requiredPatterns = /required|must have|minimum|essential|requirements|core competency|proficient in|hands-on experience/i;
    const preferredPatterns = /preferred|nice to have|plus|bonus|optional|familiarity with|good to have/i;

    const matchedSkills = [];
    const missingRequiredSkills = [];
    const missingPreferredSkills = [];

    // Break JD into lines/sentences to check context of each skill
    const jdSentences = jobDescription.split(/[.\n;•]+/).map((s) => s.trim()).filter(Boolean);

    for (const skill of jdTechSkills) {
      const skillLower = skill.toLowerCase();
      // Count frequency of this skill in the JD
      const regex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const frequency = (jdText.match(regex) || []).length;

      // Determine if skill context is required or preferred
      let isExplicitlyPreferred = false;
      for (const sent of jdSentences) {
        if (regex.test(sent)) {
          if (preferredPatterns.test(sent)) {
            isExplicitlyPreferred = true;
            break;
          }
        }
      }

      // Check if candidate resume supports this skill
      const isCandidatePossesses = candidateTech.has(skillLower) || regex.test(resumeTextLower);

      if (isCandidatePossesses) {
        matchedSkills.push({
          skill,
          frequency,
          category: 'Technical',
          status: 'verified',
        });
      } else {
        if (isExplicitlyPreferred) {
          missingPreferredSkills.push(skill);
        } else {
          missingRequiredSkills.push(skill);
        }
      }
    }

    // Process soft skills matching
    for (const soft of jdSoftSkills) {
      const softLower = soft.toLowerCase();
      const regex = new RegExp(`\\b${softLower}\\b`, 'gi');
      const freq = (jdText.match(regex) || []).length;
      if (candidateSoft.has(softLower) || regex.test(resumeTextLower)) {
        matchedSkills.push({
          skill: soft,
          frequency: freq,
          category: 'Soft Skill',
          status: 'verified',
        });
      }
    }

    // 3. Compute Keyword Coverage & Match Score
    const totalJdSkills = jdTechSkills.length;
    let matchScore = 0;
    let keywordCoverage = 0;

    if (totalJdSkills > 0) {
      const verifiedTechCount = matchedSkills.filter((s) => s.category === 'Technical').length;
      keywordCoverage = Math.round((verifiedTechCount / totalJdSkills) * 100);

      const requiredTotal = missingRequiredSkills.length + verifiedTechCount;
      const reqMatchedRatio = requiredTotal > 0 ? (verifiedTechCount / requiredTotal) : 1;

      const prefTotal = missingPreferredSkills.length;
      const prefPenalty = prefTotal > 4 ? 10 : prefTotal * 2;

      matchScore = Math.round(reqMatchedRatio * 85 + (keywordCoverage > 60 ? 15 : keywordCoverage * 0.25) - prefPenalty);
      matchScore = Math.max(10, Math.min(98, matchScore));
    } else {
      // General term overlap fallback if no explicit catalog skills were in JD
      const jdWords = new Set(jdText.split(/\W+/).filter((w) => w.length > 4));
      const resumeWords = new Set(resumeTextLower.split(/\W+/).filter((w) => w.length > 4));
      let overlap = 0;
      for (const w of jdWords) {
        if (resumeWords.has(w)) overlap++;
      }
      keywordCoverage = jdWords.size > 0 ? Math.round((overlap / jdWords.size) * 100) : 50;
      matchScore = Math.min(85, Math.max(20, keywordCoverage));
    }

    // 4. Actionable recommendations
    const recommendations = [];

    if (missingRequiredSkills.length > 0) {
      recommendations.push(
        `Critical Skill Gap: The job explicitly mentions ${missingRequiredSkills.slice(0, 4).join(', ')}. If you have academic, project, or personal lab experience with these, incorporate them into your Skills and Project bullets.`
      );
    }

    if (missingPreferredSkills.length > 0) {
      recommendations.push(
        `Competitive Edge: Incorporating preferred competencies like ${missingPreferredSkills.slice(0, 3).join(', ')} will place your application in the top 15% of applicant pool.`
      );
    }

    if (keywordCoverage < 60) {
      recommendations.push(
        'Keyword Alignment: Your keyword coverage is below 60%. Customize the terminology in your project descriptions to mirror the phrasing used in the job description.'
      );
    } else {
      recommendations.push(
        'Strong Alignment: Excellent vocabulary symmetry with the job specification. Ensure your project metrics highlight the business problems emphasized in the job description.'
      );
    }

    recommendations.push(
      'Targeted Project Framing: Highlight projects where your tech stack directly maps to the core technologies demanded in this role.'
    );

    return {
      matchScore,
      keywordCoverage,
      totalJdSkillsFound: totalJdSkills,
      matchedSkills: matchedSkills.sort((a, b) => b.frequency - a.frequency),
      missingRequiredSkills,
      missingPreferredSkills,
      recommendations,
    };
  }
}

module.exports = JdMatcherService;
