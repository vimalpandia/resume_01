/**
 * Heuristic Suggestion Engine
 * Provides deterministic, high-impact resume enhancements, XYZ formula bullet transformations,
 * action verb replacements, and weakness diagnostics.
 */

const POWER_VERB_MAP = {
  worked: ['Architected', 'Engineered', 'Constructed', 'Spearheaded', 'Executed'],
  helped: ['Collaborated', 'Facilitated', 'Contributed', 'Co-engineered', 'Accelerated'],
  did: ['Executed', 'Implemented', 'Dispatched', 'Conducted', 'Orchestrated'],
  made: ['Designed', 'Synthesized', 'Engineered', 'Fabricated', 'Formulated'],
  handled: ['Administered', 'Managed', 'Resolved', 'Streamlined', 'Supervised'],
  responsible: ['Spearheaded', 'Directed', 'Owned', 'Oversaw', 'Governed'],
  assisted: ['Partnered with', 'Co-developed', 'Supported', 'Bolstered'],
  used: ['Leveraged', 'Employed', 'Utilized', 'Integrated', 'Adopted'],
  created: ['Conceptualized', 'Pioneered', 'Architected', 'Instituted', 'Authored'],
  fixed: ['Diagnosed', 'Remediated', 'Resolved', 'Refactored', 'Optimized'],
  tested: ['Validated', 'Automated end-to-end testing for', 'Benchmarked', 'Verified'],
  improved: ['Enhanced', 'Optimized', 'Elevated', 'Streamlined', 'Overhauled'],
};

class SuggestionEngine {
  /**
   * Rewrite a weak bullet point into an XYZ formula engineering bullet
   */
  static transformBullet(bullet) {
    const trimmed = bullet.trim().replace(/^[•\-\*–\d.]\s*/, '');
    const lower = trimmed.toLowerCase();

    let formula = 'Accomplished [X] as measured by [Y], by doing [Z]';
    let improved = trimmed;
    const keyImprovements = [];

    // Pattern 1: Weak "worked on / built website"
    if (lower.includes('website') || lower.includes('frontend') || lower.includes('web app')) {
      improved = `Architected responsive, accessible web application in React and Tailwind CSS, improving page load speed by 35% and supporting 1,500+ monthly active sessions.`;
      keyImprovements.push('Replaced passive phrasing with "Architected"');
      keyImprovements.push('Added quantitative metric: 35% load speed improvement');
      keyImprovements.push('Specified technical architecture and user scale');
    }
    // Pattern 2: Weak "backend / api / database"
    else if (lower.includes('api') || lower.includes('backend') || lower.includes('database') || lower.includes('server')) {
      improved = `Engineered robust RESTful microservice APIs in Node.js and MongoDB, incorporating Redis caching to reduce query response latency from 450ms to 90ms.`;
      keyImprovements.push('Replaced generic description with technical specifics ("RESTful microservice APIs")');
      keyImprovements.push('Quantified latency reduction: 450ms to 90ms (5x throughput)');
      keyImprovements.push('Emphasized caching and database optimization');
    }
    // Pattern 3: Weak "testing / bug fixing"
    else if (lower.includes('bug') || lower.includes('fix') || lower.includes('test') || lower.includes('debug')) {
      improved = `Automated unit and integration test suite using Jest and Postman, expanding test coverage to 85% and cutting regression bug escape rate by 40%.`;
      keyImprovements.push('Changed to active verb "Automated"');
      keyImprovements.push('Quantified coverage: 85% coverage');
      keyImprovements.push('Measured business outcome: 40% reduction in regression escapes');
    }
    // Pattern 4: Generic bullet transformation
    else {
      // Find weak verb to replace
      let firstWord = trimmed.split(' ')[0] || '';
      let cleanFirst = firstWord.toLowerCase().replace(/[^a-z]/g, '');
      let replacement = 'Spearheaded';

      if (POWER_VERB_MAP[cleanFirst]) {
        replacement = POWER_VERB_MAP[cleanFirst][0];
      }

      const restOfBullet = trimmed.slice(firstWord.length).trim();
      improved = `${replacement} ${restOfBullet}${trimmed.endsWith('.') ? '' : '.'} Boosted processing efficiency by 30% through modular component reusability.`;
      keyImprovements.push(`Upgraded opening verb to high-impact "${replacement}"`);
      keyImprovements.push('Appended measurable efficiency metric');
    }

    return {
      original: trimmed,
      improved,
      formula,
      keyImprovements,
    };
  }

  /**
   * Scan text for weak action verbs and provide power verb replacements
   */
  static findWeakVerbs(text = '') {
    const words = text.toLowerCase().split(/\W+/);
    const foundMap = new Map();

    for (const w of words) {
      if (POWER_VERB_MAP[w]) {
        foundMap.set(w, POWER_VERB_MAP[w]);
      }
    }

    const results = [];
    for (const [verb, alternatives] of foundMap.entries()) {
      results.push({
        verb,
        alternatives,
      });
    }

    return results;
  }

  /**
   * Generate holistic improvement suggestions
   */
  static generateComprehensiveSuggestions({ bullets = [], skills = {}, issues = [] }) {
    const sampleBullets = bullets.length > 0 
      ? bullets.slice(0, 4) 
      : [
          'Worked on user authentication using JWT and Node.js.',
          'Built responsive frontend with React and CSS.',
          'Handled database queries and fixed bugs.',
          'Helped develop ecommerce web application.'
        ];

    const improvedBullets = sampleBullets.map((b) => this.transformBullet(b));

    const weaknessExplanations = [
      {
        topic: 'Descriptive vs Outcome-Driven Bullets',
        explanation: 'Your bullets currently outline your daily tasks rather than what you achieved. Recruiters look for results: "Did this feature increase user signups, reduce server cost, or improve load times?"',
        solution: 'Frame every project around Problem -> Engineering Action -> Measurable Outcome.',
      },
      {
        topic: 'Technical Specificity',
        explanation: 'Mentioning generic terms like "used database" or "worked on UI" does not convey engineering depth to interviewers.',
        solution: 'Explicitly specify your architecture: "Designed normalized PostgreSQL schema with indexed foreign keys" or "Managed state with Redux Toolkit".',
      },
      {
        topic: 'Action Verb Diversity',
        explanation: 'Repeating "Developed" or "Worked on" diminishes the perceived impact of your engineering contributions.',
        solution: 'Use categorized power verbs: Architected for systems, Orchestrated for pipelines, Optimized for performance.',
      }
    ];

    const projectAdvice = [
      'State the scale of your projects: mention if it handles concurrent requests, number of mock data records (e.g. 10,000+ items), or Lighthouse performance score.',
      'Always include a direct link to live deployment (e.g. Vercel, Netlify) and clean GitHub repository with a polished README.',
      'Describe non-trivial challenges solved (e.g. debouncing search inputs, preventing race conditions, or securing route guards).'
    ];

    return {
      improvedBullets,
      weakVerbsFound: this.findWeakVerbs(bullets.join(' ')),
      weaknessExplanations,
      projectAdvice,
      source: 'Heuristic Rule-Based Optimizer',
    };
  }
}

module.exports = SuggestionEngine;
