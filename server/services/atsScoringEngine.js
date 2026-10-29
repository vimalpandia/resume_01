/**
 * Rule-Based ATS Compatibility Scoring Engine (0 - 100)
 *
 * Fully decoupled, deterministic, and independently testable.
 * Evaluates resumes across 5 key dimensions:
 * 1. Section Completeness (20 pts)
 * 2. Content & Impact (25 pts)
 * 3. Skills Relevance & Depth (20 pts)
 * 4. Readability & Formatting (20 pts)
 * 5. Contact & Professional Links (15 pts)
 */

const POWER_ACTION_VERBS = [
  'accelerated', 'achieved', 'administered', 'analyzed', 'architected', 'automated',
  'built', 'centralized', 'championed', 'collaborated', 'composed', 'consolidated',
  'constructed', 'created', 'customized', 'decreased', 'delivered', 'deployed',
  'designed', 'developed', 'devised', 'directed', 'documented', 'doubled', 'drove',
  'eliminated', 'engineered', 'enhanced', 'established', 'executed', 'expanded',
  'expedited', 'facilitated', 'formulated', 'generated', 'guided', 'implemented',
  'improved', 'increased', 'initiated', 'innovated', 'installed', 'instituted',
  'integrated', 'introduced', 'invented', 'launched', 'led', 'leveraged',
  'maximized', 'mentored', 'migrated', 'minimized', 'modernized', 'negotiated',
  'optimized', 'orchestrated', 'overhauled', 'pioneered', 'planned', 'programmed',
  're-engineered', 'reduced', 'refactored', 'resolved', 'restructured', 'revamped',
  'scaled', 'secured', 'simplified', 'spearheaded', 'standardized', 'streamlined',
  'strengthened', 'supervised', 'surpassed', 'transformed', 'upgraded', 'validated'
];

const WEAK_VERBS = [
  'assisted', 'attempted', 'did', 'handled', 'helped', 'looked', 'made', 'participated',
  'responsible for', 'tried', 'worked on', 'worked with'
];

class AtsScoringEngine {
  /**
   * Main scoring function
   * @param {Object} parsedData
   * @param {string} parsedData.rawText
   * @param {Object} parsedData.contact
   * @param {Object} parsedData.sections
   * @param {Object} parsedData.skills
   * @returns {Object} Complete ATS Score Report
   */
  static evaluateResume({ rawText = '', contact = {}, sections = {}, skills = {} }) {
    const text = rawText || '';
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const bullets = (sections.experience || '') + '\n' + (sections.projects || '');
    const bulletList = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => /^[•\-\*–]|\b(designed|built|developed|implemented|led|created)\b/i.test(l));

    const breakdown = {
      sectionCompleteness: { score: 0, max: 20, details: '' },
      contentAndImpact: { score: 0, max: 25, details: '' },
      skillsRelevance: { score: 0, max: 20, details: '' },
      readability: { score: 0, max: 20, details: '' },
      contactCompleteness: { score: 0, max: 15, details: '' },
    };

    const strengths = [];
    const issues = [];
    const suggestions = [];

    // ==========================================
    // 1. SECTION COMPLETENESS (20 PTS)
    // ==========================================
    let secScore = 0;
    const secDetails = [];

    const hasEducation = (sections.education || '').length > 20 || /b\.?tech|bachelor|master|degree|university|college|gpa|cgpa/i.test(text);
    if (hasEducation) {
      secScore += 5;
      secDetails.push('Education present (+5)');
    } else {
      issues.push({
        type: 'missing_section',
        severity: 'critical',
        message: 'No distinct Education section found.',
        suggestion: 'Add an "Education" section with degree, university, graduation year, and GPA/percentage.',
      });
      suggestions.push({
        priority: 'high',
        category: 'Section Structure',
        message: 'Add an Education section.',
        action: 'Format as: Degree, Institution, Graduation Year, CGPA/Score.',
      });
    }

    const hasExperienceOrProjects = (sections.experience || '').length > 30 || (sections.projects || '').length > 30 || /experience|projects|internship/i.test(text);
    if (hasExperienceOrProjects) {
      secScore += 6;
      secDetails.push('Experience/Projects present (+6)');
    } else {
      issues.push({
        type: 'missing_section',
        severity: 'critical',
        message: 'No Experience or Technical Projects section detected.',
        suggestion: 'Include at least 2-3 substantive technical projects or internship experiences with bullet points.',
      });
      suggestions.push({
        priority: 'high',
        category: 'Experience & Projects',
        message: 'Include projects with technical details.',
        action: 'Add 2-3 projects with tech stack, problem solved, and measurable results.',
      });
    }

    const hasSkills = (sections.skills || '').length > 20 || (skills.technical && skills.technical.length >= 4);
    if (hasSkills) {
      secScore += 5;
      secDetails.push('Skills section present (+5)');
    } else {
      issues.push({
        type: 'missing_section',
        severity: 'critical',
        message: 'Technical Skills section is missing or sparsely populated.',
        suggestion: 'Create a dedicated "Skills" section categorizing languages, frameworks, databases, and developer tools.',
      });
      suggestions.push({
        priority: 'high',
        category: 'Technical Skills',
        message: 'Organize skills into clear categories.',
        action: 'Group by: Languages, Frontend, Backend, Databases, Cloud & DevOps.',
      });
    }

    const hasSummary = (sections.summary || '').length > 20 || /summary|objective|profile/i.test(text);
    if (hasSummary) {
      secScore += 2;
      secDetails.push('Summary/Objective present (+2)');
    } else {
      suggestions.push({
        priority: 'low',
        category: 'Summary',
        message: 'Consider adding a 2-3 line Professional Summary.',
        action: 'State your target role, core strengths, and primary tech stack at the top.',
      });
    }

    const hasCertifications = (sections.certifications || '').length > 10 || /certif|award|achievement|hackathon/i.test(text);
    if (hasCertifications) {
      secScore += 2;
      secDetails.push('Certifications/Achievements present (+2)');
    }

    breakdown.sectionCompleteness.score = Math.min(secScore, 20);
    breakdown.sectionCompleteness.details = secDetails.join(', ') || 'Sections need substantial restructuring';

    if (secScore >= 18) {
      strengths.push('Comprehensive section hierarchy with all standard recruitment headings present.');
    }

    // ==========================================
    // 2. CONTENT & IMPACT (25 PTS)
    // ==========================================
    let impactScore = 0;
    const impactDetails = [];

    // Quantifiable metrics (%, $, numbers, x-times, user counts)
    const metricMatches = text.match(/\b\d+(\.\d+)?%|\$\d+[kKmM]?|\b\d+\s*(?:users|clients|requests|ms|seconds|minutes|hours|days|x|fold|stars)\b|\b\d{2,}\b/g) || [];
    const metricCount = metricMatches.length;

    if (metricCount >= 6) {
      impactScore += 10;
      impactDetails.push(`${metricCount} quantifiable metrics found (+10)`);
      strengths.push(`Strong data-driven impact: identified ${metricCount} numerical metrics and measurable achievements.`);
    } else if (metricCount >= 3) {
      impactScore += 6;
      impactDetails.push(`${metricCount} quantifiable metrics found (+6)`);
      issues.push({
        type: 'low_metrics',
        severity: 'warning',
        message: 'Few quantifiable metrics detected in experience and project descriptions.',
        suggestion: 'Enhance bullets using numbers, percentages, latency reduction, user base size, or efficiency gains.',
      });
      suggestions.push({
        priority: 'medium',
        category: 'Impact Metrics',
        message: 'Quantify your achievements.',
        action: 'Use the XYZ formula: "Accomplished [X] as measured by [Y] by doing [Z]" (e.g., "Reduced latency by 35%").',
      });
    } else {
      impactScore += 2;
      impactDetails.push('Very few or no metrics (+2)');
      issues.push({
        type: 'missing_metrics',
        severity: 'critical',
        message: 'Lack of quantifiable impact. Recruiters and ATS engines heavily penalize purely descriptive bullets.',
        suggestion: 'Add numerical metrics to every project and job bullet (e.g. "Scaled API to handle 1,000+ daily queries").',
      });
      suggestions.push({
        priority: 'high',
        category: 'Impact Metrics',
        message: 'Add measurable figures to your project bullets.',
        action: 'Estimate percentages, user counts, load times, test coverage, or transactions.',
      });
    }

    // Action Verbs Analysis
    const lowerWords = text.toLowerCase().split(/\W+/);
    const matchedPowerVerbs = new Set();
    const matchedWeakVerbs = new Set();

    for (const w of lowerWords) {
      if (POWER_ACTION_VERBS.includes(w)) matchedPowerVerbs.add(w);
      if (WEAK_VERBS.includes(w)) matchedWeakVerbs.add(w);
    }

    if (matchedPowerVerbs.size >= 8) {
      impactScore += 8;
      impactDetails.push(`${matchedPowerVerbs.size} power verbs used (+8)`);
      strengths.push(`Vibrant action-oriented language with ${matchedPowerVerbs.size} distinct power verbs (e.g., ${Array.from(matchedPowerVerbs).slice(0, 3).join(', ')}).`);
    } else if (matchedPowerVerbs.size >= 4) {
      impactScore += 5;
      impactDetails.push(`${matchedPowerVerbs.size} power verbs used (+5)`);
      suggestions.push({
        priority: 'medium',
        category: 'Action Verbs',
        message: 'Diversify action verbs.',
        action: 'Begin bullets with strong verbs like Orchestrated, Automated, Spearheaded, Architected.',
      });
    } else {
      impactScore += 2;
      impactDetails.push('Low action verb density (+2)');
      issues.push({
        type: 'passive_verbs',
        severity: 'warning',
        message: 'Few strong action verbs found. Bullets may read as passive task lists.',
        suggestion: 'Replace passive phrases like "Responsible for" or "Worked on" with proactive action verbs.',
      });
    }

    if (matchedWeakVerbs.size > 0) {
      issues.push({
        type: 'weak_verbs',
        severity: 'info',
        message: `Detected passive/weak verbs (${Array.from(matchedWeakVerbs).slice(0, 4).join(', ')}).`,
        suggestion: 'Substitute with high-impact engineering verbs using the AI Resume Suggestions tool.',
      });
    }

    // Bullet formatting & length
    const goodBullets = bulletList.filter((b) => b.length >= 40 && b.length <= 220);
    if (goodBullets.length >= 6) {
      impactScore += 7;
      impactDetails.push('Well-structured bullet lengths (+7)');
    } else if (goodBullets.length >= 3) {
      impactScore += 4;
      impactDetails.push('Moderate bullet structure (+4)');
    } else {
      impactScore += 2;
      impactDetails.push('Needs better bullet structuring (+2)');
      suggestions.push({
        priority: 'medium',
        category: 'Formatting',
        message: 'Format project descriptions into crisp 1-2 line bullets.',
        action: 'Avoid dense paragraphs. Aim for bullets between 60 and 160 characters.',
      });
    }

    breakdown.contentAndImpact.score = Math.min(impactScore, 25);
    breakdown.contentAndImpact.details = impactDetails.join(', ');

    // ==========================================
    // 3. SKILLS RELEVANCE & DEPTH (20 PTS)
    // ==========================================
    let skillsScore = 0;
    const skillsDetails = [];
    const techCount = (skills.technical || []).length;
    const cats = Object.keys(skills.categories || {}).filter((k) => (skills.categories[k] || []).length > 0);

    if (techCount >= 12) {
      skillsScore += 12;
      skillsDetails.push(`${techCount} tech skills identified (+12)`);
      strengths.push(`Rich technical vocabulary: detected ${techCount} verified modern technologies.`);
    } else if (techCount >= 7) {
      skillsScore += 8;
      skillsDetails.push(`${techCount} tech skills identified (+8)`);
    } else if (techCount >= 3) {
      skillsScore += 4;
      skillsDetails.push(`${techCount} tech skills identified (+4)`);
      issues.push({
        type: 'low_skills_count',
        severity: 'warning',
        message: 'Limited technical keyword coverage for competitive CSE roles.',
        suggestion: 'Expand your skills list with specific frameworks, libraries, databases, and development tools.',
      });
    } else {
      skillsScore += 1;
      skillsDetails.push('Critically low tech skills count (+1)');
      issues.push({
        type: 'critical_skills_shortage',
        severity: 'critical',
        message: 'Very few recognizable technical skills detected by parser.',
        suggestion: 'Ensure technical tools are explicitly named (e.g. React, Node.js, Git, SQL, Docker).',
      });
    }

    // Diversity across stacks
    if (cats.length >= 4) {
      skillsScore += 8;
      skillsDetails.push(`Broad domain coverage across ${cats.length} tech areas (+8)`);
      strengths.push(`Well-rounded stack coverage spanning ${cats.join(', ')}.`);
    } else if (cats.length >= 2) {
      skillsScore += 5;
      skillsDetails.push(`Coverage across ${cats.length} areas (+5)`);
    } else {
      skillsScore += 2;
      skillsDetails.push('Narrow technical domain breadth (+2)');
      suggestions.push({
        priority: 'medium',
        category: 'Skill Diversity',
        message: 'Broaden your listed skill categories.',
        action: 'Include relevant databases, cloud services, and testing/version control tools.',
      });
    }

    breakdown.skillsRelevance.score = Math.min(skillsScore, 20);
    breakdown.skillsRelevance.details = skillsDetails.join(', ');

    // ==========================================
    // 4. READABILITY & STRUCTURE (20 PTS)
    // ==========================================
    let readScore = 0;
    const readDetails = [];

    // Word count check (Ideal 350 - 900 words for CSE 1-page resume)
    if (wordCount >= 350 && wordCount <= 950) {
      readScore += 10;
      readDetails.push(`Optimal word count (${wordCount} words) (+10)`);
      strengths.push(`Ideal document length of ${wordCount} words fits well within standard 1-page recruiter viewing.`);
    } else if (wordCount >= 250 && wordCount <= 1200) {
      readScore += 6;
      readDetails.push(`Acceptable word count (${wordCount} words) (+6)`);
      if (wordCount < 350) {
        issues.push({
          type: 'sparse_content',
          severity: 'warning',
          message: `Resume appears brief (${wordCount} words). May look under-detailed.`,
          suggestion: 'Expand on technical project achievements, tools used, and architectural decisions.',
        });
      } else {
        issues.push({
          type: 'excessive_content',
          severity: 'info',
          message: `Resume word count is high (${wordCount} words). Ensure it does not spill past appropriate page limits.`,
          suggestion: 'Trim redundant filler words and consolidate similar bullets.',
        });
      }
    } else {
      readScore += 3;
      readDetails.push(`Word count sub-optimal (${wordCount} words) (+3)`);
      issues.push({
        type: 'extreme_word_count',
        severity: 'critical',
        message: `Word count (${wordCount}) is outside standard professional guidelines.`,
        suggestion: 'Target between 400 and 800 words for an early-career software engineering resume.',
      });
    }

    // Formatting & Cleanliness: check for unparsed artifacts or extreme symbol noise
    const symbolMatches = text.match(/[\uFFFD\u0000-\u001F]/g) || [];
    if (symbolMatches.length === 0) {
      readScore += 5;
      readDetails.push('Clean font encoding (+5)');
    } else {
      issues.push({
        type: 'corrupted_symbols',
        severity: 'warning',
        message: 'Detected special character encoding artifacts.',
        suggestion: 'Avoid decorative icon fonts or complex multi-column tables that can garble ATS parser output.',
      });
    }

    // Bullet point proportion
    if (bulletList.length >= 5) {
      readScore += 5;
      readDetails.push('Good use of bullet points (+5)');
    } else {
      readScore += 2;
      readDetails.push('Insufficient bulleted structure (+2)');
      suggestions.push({
        priority: 'high',
        category: 'Layout',
        message: 'Convert prose into bullet points.',
        action: 'ATS parsers and recruiters scan bullet points 4x faster than narrative blocks.',
      });
    }

    breakdown.readability.score = Math.min(readScore, 20);
    breakdown.readability.details = readDetails.join(', ');

    // ==========================================
    // 5. CONTACT & PROFESSIONAL LINKS (15 PTS)
    // ==========================================
    let contactScore = 0;
    const contactDetails = [];

    if (contact.email) {
      contactScore += 4;
      contactDetails.push('Email found (+4)');
      if (/gmail\.com|outlook\.com|yahoo\.com|\.edu/i.test(contact.email)) {
        // clean professional provider
      }
    } else {
      issues.push({
        type: 'missing_email',
        severity: 'critical',
        message: 'No contact email address identified.',
        suggestion: 'Place a professional email address (e.g., name@gmail.com) prominently at the top.',
      });
    }

    if (contact.phone) {
      contactScore += 3;
      contactDetails.push('Phone found (+3)');
    } else {
      issues.push({
        type: 'missing_phone',
        severity: 'warning',
        message: 'No telephone contact number found.',
        suggestion: 'Include an active mobile number with country code.',
      });
    }

    if (contact.linkedin) {
      contactScore += 4;
      contactDetails.push('LinkedIn profile linked (+4)');
      strengths.push('Professional LinkedIn presence included.');
    } else {
      issues.push({
        type: 'missing_linkedin',
        severity: 'warning',
        message: 'LinkedIn URL is absent.',
        suggestion: 'Add a customized LinkedIn profile link (e.g. linkedin.com/in/yourname).',
      });
      suggestions.push({
        priority: 'medium',
        category: 'Contact Links',
        message: 'Add your LinkedIn profile.',
        action: 'Ensure your profile slug is clean and updated with matching projects.',
      });
    }

    if (contact.github || contact.portfolio) {
      contactScore += 4;
      contactDetails.push('GitHub / Portfolio linked (+4)');
      strengths.push('Verified engineering portfolio / GitHub profile provided.');
    } else {
      issues.push({
        type: 'missing_github',
        severity: 'warning',
        message: 'No GitHub profile or live portfolio URL found.',
        suggestion: 'Include your GitHub link so recruiters can evaluate your code repositories.',
      });
      suggestions.push({
        priority: 'high',
        category: 'Portfolio',
        message: 'Add your GitHub profile.',
        action: 'Crucial for CSE placement drives; showcase your active repositories and contributions.',
      });
    }

    breakdown.contactCompleteness.score = Math.min(contactScore, 15);
    breakdown.contactCompleteness.details = contactDetails.join(', ');

    // ==========================================
    // TOTAL OVERALL SCORE
    // ==========================================
    const totalScore = Math.round(
      breakdown.sectionCompleteness.score +
      breakdown.contentAndImpact.score +
      breakdown.skillsRelevance.score +
      breakdown.readability.score +
      breakdown.contactCompleteness.score
    );

    const boundedScore = Math.max(0, Math.min(100, totalScore));

    const calculationExplanation = `Overall ATS Compatibility Score (${boundedScore}/100) is synthesized from 5 weighted pillars: Section Completeness (${breakdown.sectionCompleteness.score}/${breakdown.sectionCompleteness.max}), Content & Impact (${breakdown.contentAndImpact.score}/${breakdown.contentAndImpact.max}), Skills Relevance & Depth (${breakdown.skillsRelevance.score}/${breakdown.skillsRelevance.max}), Readability & Structure (${breakdown.readability.score}/${breakdown.readability.max}), and Contact & Professional Links (${breakdown.contactCompleteness.score}/${breakdown.contactCompleteness.max}).`;

    return {
      atsScore: boundedScore,
      scoreBreakdown: breakdown,
      strengths,
      issues,
      suggestions,
      calculationExplanation,
      disclaimer: 'This score is an automated estimation based on standard ATS parsing heuristics and resume best practices. It is not an official score from any employer ATS, and does not guarantee placement screening outcomes.',
    };
  }
}

module.exports = AtsScoringEngine;
