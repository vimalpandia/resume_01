const test = require('node:test');
const assert = require('node:assert/strict');
const JdMatcherService = require('../services/jdMatcherService');

test('JdMatcherService - matches candidate skills with job description', () => {
  const resumeText = `
    Experienced Full Stack Engineer skilled in React, Node.js, Express, MongoDB, Docker, and Git.
    Built scalable microservices and integrated payment gateways.
  `;

  const resumeSkills = {
    technical: ['React', 'Node.js', 'Express', 'MongoDB', 'Docker', 'Git'],
    soft: ['Leadership', 'Problem Solving'],
  };

  const jobDescription = `
    Job Title: Senior Full Stack Engineer
    Requirements:
    - Must have hands-on experience in React, Node.js, and MongoDB.
    - Strong knowledge of Docker and Git is required.
    - Nice to have: Kubernetes and AWS experience is a plus.
  `;

  const match = JdMatcherService.match({
    resumeText,
    resumeSkills,
    jobDescription,
  });

  assert.ok(match.matchScore >= 70, `Expected matchScore >= 70, got ${match.matchScore}`);
  assert.ok(match.keywordCoverage > 50, `Expected keywordCoverage > 50, got ${match.keywordCoverage}`);

  const matchedSkillNames = match.matchedSkills.map((s) => s.skill.toLowerCase());
  assert.ok(matchedSkillNames.includes('react'));
  assert.ok(matchedSkillNames.includes('node.js') || matchedSkillNames.includes('nodejs'));

  // Kubernetes and AWS should be flagged as missing
  const missingAll = [...match.missingRequiredSkills, ...match.missingPreferredSkills].map((s) => s.toLowerCase());
  assert.ok(missingAll.includes('kubernetes') || missingAll.includes('aws'));
  assert.ok(match.recommendations.length > 0);
});

test('JdMatcherService - throws error when job description is too short', () => {
  assert.throws(() => {
    JdMatcherService.match({
      resumeText: 'React, Node',
      resumeSkills: {},
      jobDescription: 'Too short',
    });
  }, /Please provide a substantial Job Description/);
});
