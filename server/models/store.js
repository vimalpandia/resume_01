const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Storage Layer with Dual Mode:
 * 1. Mongoose / MongoDB (when connected to MONGODB_URI)
 * 2. In-Memory Adaptive Store (when MongoDB is unavailable, ensures out-of-the-box placement demo readiness)
 */

let isMongoConnected = false;

// In-Memory collections for zero-setup local dev/testing
const inMemoryUsers = new Map();
const inMemoryAnalyses = new Map();

// Helper to generate IDs
const generateId = () => new mongoose.Types.ObjectId().toString();

// Initialize demo placement user if in memory
const seedDemoData = async () => {
  if (inMemoryUsers.size === 0) {
    const demoPasswordHash = await bcrypt.hash('Demo@1234', 10);
    const demoUser = {
      _id: '670000000000000000000001',
      name: 'Aditya Sharma',
      email: 'demo@resumepro.dev',
      passwordHash: demoPasswordHash,
      targetRole: 'Full Stack Software Engineer',
      themePreference: 'dark',
      customApiKey: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      comparePassword: async function(candidate) {
        return bcrypt.compare(candidate, this.passwordHash);
      }
    };
    inMemoryUsers.set(demoUser._id, demoUser);
  }
};

seedDemoData();

function setMongoConnected(status) {
  isMongoConnected = status;
}

function getMongoConnected() {
  return isMongoConnected;
}

module.exports = {
  isMongoConnected: getMongoConnected,
  setMongoConnected,
  inMemoryUsers,
  inMemoryAnalyses,
  generateId,
};
