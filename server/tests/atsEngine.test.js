const test = require('node:test');
const assert = require('node:assert/strict');
const AtsScoringEngine = require('../services/atsScoringEngine');

test('AtsScoringEngine - produces valid score bounded between 0 and 100', () => {
  const result = AtsScoringEngine.evaluateResume({
    rawText: 'Minimal sample text',
    contact: {},
    sections: {},
    skills: {},
  });

  assert.ok(typeof result.atsScore === 'number');
  assert.ok(result.atsScore >= 0 && result.atsScore <= 100);
  assert.ok(result.scoreBreakdown);
  assert.ok(result.disclaimer.includes('automated estimation'));
});

test('AtsScoringEngine - awards high score for comprehensive engineering resume', () => {
  const comprehensiveText = `
ADITYA SHARMA
aditya.sharma@gmail.com | +91 9876543210 | linkedin.com/in/adityasharma | github.com/adityasharma

PROFESSIONAL SUMMARY
Dynamic Full-Stack Software Engineer with 2+ years experience building scalable web applications.

EDUCATION
Bachelor of Technology in Computer Science and Engineering, National Institute of Technology, 2024. CGPA: 8.9/10

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Python, Java, C++, SQL
Frontend: React, Redux, Next.js, Tailwind CSS, HTML5, CSS3
Backend: Node.js, Express, REST APIs, Microservices
Databases: MongoDB, PostgreSQL, Redis
Cloud & Tools: Docker, Git, GitHub Actions, AWS, Linux, Postman, Jest

WORK EXPERIENCE & PROJECTS
Software Engineering Intern - FinTech Solutions (June 2023 - Present)
• Architected high-throughput payment settlement microservice using Node.js and Redis, decreasing transaction latency by 42% for 250,000+ daily queries.
• Engineered responsive financial dashboard with React and Tailwind CSS, increasing user engagement by 28% across 15,000 active sessions.
• Automated CI/CD deployment pipeline using GitHub Actions and Docker, reducing build deployment time by 60%.
• Spearheaded migration from monolithic database to PostgreSQL with indexed schemas, saving $12,000 in monthly cloud infrastructure costs.

AI Code Reviewer - Open Source Project
• Developed full-stack code review assistant using React, Python, and FastAPI, serving 1,200+ monthly GitHub repository scans.
• Optimized query execution pipeline cutting API response duration from 650ms to 120ms (5x throughput improvement).

CERTIFICATIONS & AWARDS
• AWS Certified Cloud Practitioner
• Winner, Smart India Hackathon 2023 (1st place among 50+ college teams)
  `;

  const skills = {
    technical: ['JavaScript', 'TypeScript', 'Python', 'React', 'Node.js', 'MongoDB', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'Git', 'Tailwind CSS'],
    categories: {
      languages: ['JavaScript', 'TypeScript', 'Python'],
      frontend: ['React', 'Tailwind CSS'],
      backend: ['Node.js', 'Express'],
      databases: ['MongoDB', 'PostgreSQL', 'Redis'],
      cloudDevOps: ['Docker', 'AWS'],
    },
  };

  const contact = {
    email: 'aditya.sharma@gmail.com',
    phone: '+91 9876543210',
    linkedin: 'https://linkedin.com/in/adityasharma',
    github: 'https://github.com/adityasharma',
  };

  const sections = {
    summary: 'Dynamic Full-Stack Software Engineer',
    education: 'Bachelor of Technology in Computer Science',
    experience: 'Software Engineering Intern',
    projects: 'AI Code Reviewer',
    skills: 'JavaScript, TypeScript, Python, React',
    certifications: 'AWS Certified Cloud Practitioner, Winner Smart India Hackathon',
  };

  const report = AtsScoringEngine.evaluateResume({
    rawText: comprehensiveText,
    contact,
    sections,
    skills,
  });

  // A comprehensive resume should score well above 80
  assert.ok(report.atsScore >= 80, `Expected score >= 80, got ${report.atsScore}`);
  assert.ok(report.strengths.length >= 3, 'Expected at least 3 detected strengths');
  assert.equal(report.scoreBreakdown.sectionCompleteness.score, 20);
  assert.equal(report.scoreBreakdown.contactCompleteness.score, 15);
});

test('AtsScoringEngine - penalizes missing contact details and lack of metrics', () => {
  const weakText = `
John Doe
About Me
I love coding and making computers do cool things.

Projects
Made a website for a local shop.
Helped build an app using HTML and CSS.
Did some javascript testing.
  `;

  const report = AtsScoringEngine.evaluateResume({
    rawText: weakText,
    contact: {}, // No email, no phone, no linkedin, no github
    sections: {
      summary: 'I love coding',
      projects: 'Made a website',
    },
    skills: {
      technical: ['HTML', 'CSS', 'JavaScript'],
      categories: {},
    },
  });

  // Should have low score and clear critical issues
  assert.ok(report.atsScore < 50, `Expected weak resume score < 50, got ${report.atsScore}`);
  const hasMissingEmail = report.issues.some((i) => i.type === 'missing_email');
  const hasMissingMetrics = report.issues.some((i) => i.type === 'missing_metrics');
  assert.ok(hasMissingEmail, 'Should flag missing email');
  assert.ok(hasMissingMetrics, 'Should flag missing metrics');
});
