const test = require('node:test');
const assert = require('node:assert/strict');
const SectionExtractor = require('../services/sectionExtractor');

test('SectionExtractor - extracts email, phone, and links reliably', () => {
  const text = `
    Rohan Verma
    Email: rohan.verma@domain.edu
    Mobile: +91 9988776655
    LinkedIn: linkedin.com/in/rohanverma-dev
    GitHub: https://github.com/rohanverma
  `;

  const contact = SectionExtractor.extractContact(text);

  assert.equal(contact.name, 'Rohan Verma');
  assert.equal(contact.email, 'rohan.verma@domain.edu');
  assert.equal(contact.phone, '+91 9988776655');
  assert.ok(contact.linkedin.includes('rohanverma-dev'));
  assert.ok(contact.github.includes('rohanverma'));
});

test('SectionExtractor - categorizes technical skills accurately', () => {
  const text = `
    Skills & Tools:
    Languages: Python, JavaScript, TypeScript, Go
    Frontend: React, Tailwind CSS, Next.js, Redux
    Backend: Node.js, Express, Docker, Kubernetes
    Databases: MongoDB, PostgreSQL, Redis
  `;

  const skills = SectionExtractor.extractSkills(text);

  assert.ok(skills.technical.includes('Python'));
  assert.ok(skills.technical.includes('React'));
  assert.ok(skills.technical.includes('Docker'));
  assert.ok(skills.technical.includes('Mongodb') || skills.technical.includes('MongoDB'));
  assert.ok(skills.categories.databases.length >= 2);
});

test('SectionExtractor - extracts bullet points with clean prefixes', () => {
  const text = `
    Experience:
    • Engineered microservice in Node.js reducing latency by 40%.
    - Built customer dashboard using React and Tailwind CSS.
    * Integrated Stripe payment gateway with webhook verification.
  `;

  const bullets = SectionExtractor.extractBulletPoints(text);

  assert.equal(bullets.length, 3);
  assert.ok(bullets[0].startsWith('Engineered microservice'));
  assert.ok(bullets[1].startsWith('Built customer dashboard'));
});
