/**
 * Section & Skill Extraction Service
 * Uses deterministic natural language heuristics, regular expressions,
 * and comprehensive industry taxonomy to parse resume sections and skills.
 */

const TECH_SKILLS_DICTIONARY = {
  languages: [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c', 'c#', 'go', 'golang',
    'rust', 'ruby', 'php', 'sql', 'r', 'html', 'css', 'kotlin', 'swift', 'scala', 'dart', 'bash'
  ],
  frontend: [
    'react', 'react.js', 'redux', 'next.js', 'vue', 'vue.js', 'angular', 'svelte',
    'tailwind', 'tailwind css', 'bootstrap', 'material ui', 'sass', 'webpack', 'vite',
    'html5', 'css3', 'jquery', 'chakra ui'
  ],
  backend: [
    'node.js', 'nodejs', 'express', 'express.js', 'nestjs', 'django', 'flask',
    'fastapi', 'spring boot', 'spring', 'asp.net', '.net', 'graphql', 'rest api',
    'restful api', 'microservices', 'socket.io', 'grpc', 'kafka', 'rabbitmq'
  ],
  databases: [
    'mongodb', 'postgresql', 'postgres', 'mysql', 'redis', 'sqlite', 'oracle',
    'cassandra', 'dynamodb', 'firebase', 'supabase', 'prisma', 'mongoose', 'elasticsearch'
  ],
  cloudDevOps: [
    'aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'docker',
    'kubernetes', 'k8s', 'ci/cd', 'github actions', 'jenkins', 'terraform',
    'linux', 'nginx', 'ansible', 'serverless', 'lambda'
  ],
  aiMlData: [
    'machine learning', 'deep learning', 'pytorch', 'tensorflow', 'scikit-learn',
    'pandas', 'numpy', 'nlp', 'computer vision', 'data science', 'keras',
    'opencv', 'llm', 'generative ai', 'hugging face', 'langchain'
  ],
  toolsMethodologies: [
    'git', 'github', 'gitlab', 'jira', 'agile', 'scrum', 'postman', 'jest',
    'mocha', 'cypress', 'selenium', 'figma', 'canva', 'vs code', 'linux'
  ]
};

const SOFT_SKILLS_LIST = [
  'leadership', 'teamwork', 'communication', 'problem solving', 'critical thinking',
  'time management', 'adaptability', 'collaboration', 'analytical', 'creativity',
  'mentorship', 'cross-functional', 'project management', 'troubleshooting'
];

class SectionExtractor {
  /**
   * Extract Contact Information
   */
  static extractContact(text) {
    const contact = {
      name: '',
      email: '',
      phone: '',
      linkedin: '',
      github: '',
      portfolio: '',
      location: '',
    };

    if (!text) return contact;

    // Email
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      contact.email = emailMatch[0].trim();
    }

    // Phone (various international & local formats)
    const phoneMatch = text.match(/(?:(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{4})/);
    if (phoneMatch) {
      contact.phone = phoneMatch[0].trim();
    }

    // LinkedIn
    const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in|profile)\/([a-zA-Z0-9_-]+)/i);
    if (linkedinMatch) {
      contact.linkedin = linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : `https://${linkedinMatch[0]}`;
    } else if (/linkedin/i.test(text)) {
      const match = text.match(/linkedin\.com\/in\/[^\s,]+/i);
      if (match) contact.linkedin = match[0].startsWith('http') ? match[0] : `https://${match[0]}`;
    }

    // GitHub
    const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
    if (githubMatch) {
      contact.github = githubMatch[0].startsWith('http') ? githubMatch[0] : `https://${githubMatch[0]}`;
    }

    // Portfolio / Personal Site (excluding generic social networks)
    const portfolioMatch = text.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:vercel\.app|netlify\.app|github\.io|me|dev|tech|portfolio|io|com))\b(?!\/(?:in|company|posts))/i);
    if (portfolioMatch && !/linkedin|github|gmail|yahoo/i.test(portfolioMatch[0])) {
      contact.portfolio = portfolioMatch[0].startsWith('http') ? portfolioMatch[0] : `https://${portfolioMatch[0]}`;
    }

    // Extract Likely Candidate Name: First 1-3 lines that look like a human name
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    for (let i = 0; i < Math.min(lines.length, 5); i++) {
      const line = lines[i];
      if (
        line.length > 2 &&
        line.length < 40 &&
        !line.includes('@') &&
        !line.includes('http') &&
        !line.includes('www.') &&
        !/(resume|curriculum|cv|contact|profile|education|experience)/i.test(line) &&
        /^[a-zA-Z\s.'-]+$/.test(line)
      ) {
        contact.name = line;
        break;
      }
    }

    return contact;
  }

  /**
   * Identify and partition text into major resume sections
   */
  static extractSections(text) {
    const rawSections = {
      summary: '',
      education: '',
      experience: '',
      projects: '',
      skills: '',
      certifications: '',
    };

    if (!text) return rawSections;

    // Section header patterns
    const headerRegexes = [
      { key: 'summary', regex: /\b(summary|professional\s+summary|objective|career\s+objective|profile|about\s+me)\b/i },
      { key: 'education', regex: /\b(education|academic\s+background|qualifications|academic\s+history|university)\b/i },
      { key: 'experience', regex: /\b(experience|work\s+experience|professional\s+experience|employment\s+history|internships|work\s+history)\b/i },
      { key: 'projects', regex: /\b(projects|technical\s+projects|academic\s+projects|personal\s+projects|key\s+projects)\b/i },
      { key: 'skills', regex: /\b(skills|technical\s+skills|core\s+competencies|technologies|tech\s+stack|expertise)\b/i },
      { key: 'certifications', regex: /\b(certifications|certificates|licenses|courses|achievements|awards)\b/i },
    ];

    const lines = text.split('\n');
    let currentKey = null;
    const sectionBuffers = {
      summary: [],
      education: [],
      experience: [],
      projects: [],
      skills: [],
      certifications: [],
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Check if line is a header candidate (short, matches section keyword, possibly uppercase or followed by separator)
      let foundHeaderKey = null;
      if (line.length <= 40) {
        for (const h of headerRegexes) {
          if (h.regex.test(line)) {
            foundHeaderKey = h.key;
            break;
          }
        }
      }

      if (foundHeaderKey) {
        currentKey = foundHeaderKey;
      } else if (currentKey) {
        sectionBuffers[currentKey].push(line);
      }
    }

    for (const key of Object.keys(rawSections)) {
      rawSections[key] = sectionBuffers[key].join('\n');
    }

    return rawSections;
  }

  /**
   * Extract skills categorized into tech categories & soft skills
   */
  static extractSkills(text) {
    if (!text) {
      return {
        technical: [],
        soft: [],
        tools: [],
        languages: [],
        categories: {},
      };
    }

    const lowerText = ` ${text.toLowerCase().replace(/[/\\(),:;]/g, ' ')} `;
    const foundTech = new Set();
    const categoriesFound = {};

    for (const [catName, skillList] of Object.entries(TECH_SKILLS_DICTIONARY)) {
      categoriesFound[catName] = [];
      for (const skill of skillList) {
        // Word boundary matching or literal token match
        const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = new RegExp(`(?:^|[\\s,•\\-|/])${escaped}(?:$|[\\s,•\\-|/])`, 'i');
        if (pattern.test(lowerText)) {
          const capitalized = skill.charAt(0).toUpperCase() + skill.slice(1);
          foundTech.add(capitalized);
          categoriesFound[catName].push(capitalized);
        }
      }
    }

    const foundSoft = new Set();
    for (const soft of SOFT_SKILLS_LIST) {
      const escaped = soft.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`(?:^|[\\s,•\\-|/])${escaped}(?:$|[\\s,•\\-|/])`, 'i');
      if (pattern.test(lowerText)) {
        foundSoft.add(soft.charAt(0).toUpperCase() + soft.slice(1));
      }
    }

    return {
      technical: Array.from(foundTech),
      soft: Array.from(foundSoft),
      languages: categoriesFound.languages || [],
      tools: categoriesFound.toolsMethodologies || [],
      categories: categoriesFound,
    };
  }

  /**
   * Extract bullet points from text for evaluation & AI refinement
   */
  static extractBulletPoints(text) {
    if (!text) return [];

    const bullets = [];
    const lines = text.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      // Match bullet indicators like •, -, *, or numbered items
      if (/^[•\-\*–]\s*(.+)/.test(trimmed)) {
        const content = trimmed.replace(/^[•\-\*–]\s*/, '').trim();
        if (content.length > 15) bullets.push(content);
      } else if (/^\d+\.\s*(.+)/.test(trimmed)) {
        const content = trimmed.replace(/^\d+\.\s*/, '').trim();
        if (content.length > 15) bullets.push(content);
      } else if (trimmed.length > 30 && trimmed.length < 220 && /^[A-Z]/.test(trimmed) && trimmed.endsWith('.')) {
        bullets.push(trimmed);
      }
    }

    return bullets;
  }
}

module.exports = SectionExtractor;
