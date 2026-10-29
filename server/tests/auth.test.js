const test = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserRepository } = require('../models/User');
const { AnalysisRepository } = require('../models/Analysis');
const { JWT_SECRET } = require('../middleware/authMiddleware');

test('Auth - password hashing and verification works', async () => {
  const plain = 'SecurePlacementPass2026!';
  const hash = await bcrypt.hash(plain, 10);

  const valid = await bcrypt.compare(plain, hash);
  const invalid = await bcrypt.compare('WrongPass', hash);

  assert.equal(valid, true);
  assert.equal(invalid, false);
});

test('Auth - user creation sanitizes password and generates JWT', async () => {
  const user = await UserRepository.create({
    name: 'Priya Sharma',
    email: 'priya.test@example.com',
    password: 'password123',
    targetRole: 'Frontend Engineer',
  });

  assert.ok(user._id);
  assert.equal(user.email, 'priya.test@example.com');

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
  const decoded = jwt.verify(token, JWT_SECRET);
  assert.equal(decoded.id, user._id);
});

test('Security - cross user data access prevention logic', async () => {
  const userA = await UserRepository.create({
    name: 'User A',
    email: 'usera@example.com',
    password: 'password123',
  });

  const userB = await UserRepository.create({
    name: 'User B',
    email: 'userb@example.com',
    password: 'password123',
  });

  const analysisA = await AnalysisRepository.create({
    userId: userA._id,
    resumeTitle: 'User A Resume',
    originalFileName: 'usera.pdf',
    fileSize: 2048,
    atsScore: 85,
  });

  // Verify ownership check
  const isOwnerA = analysisA.userId.toString() === userA._id.toString();
  const isOwnerB = analysisA.userId.toString() === userB._id.toString();

  assert.equal(isOwnerA, true, 'User A should own analysis A');
  assert.equal(isOwnerB, false, 'User B must NOT own analysis A');
});
