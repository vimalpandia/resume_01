const mongoose = require('mongoose');
const { setMongoConnected } = require('../models/store');

const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/resume_analyzer_pro';

  if (!process.env.MONGODB_URI) {
    console.warn(`[DB Notice] MONGODB_URI is not set. Seamlessly activating Zero-Config Adaptive Storage.`);
    setMongoConnected(false);
    return { status: 'in-memory-fallback', reason: 'MONGODB_URI not provided' };
  }

  try {
    mongoose.set('strictQuery', false);
    const timeoutMs = isProduction ? 15000 : 3000;
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: timeoutMs,
      connectTimeoutMS: timeoutMs,
    });
    setMongoConnected(true);
    console.log(`[DB] Successfully connected to MongoDB: ${conn.connection.host}/${conn.connection.name}`);
    return { status: 'connected', host: conn.connection.host };
  } catch (err) {
    setMongoConnected(false);
    console.warn(`[DB Notice] MongoDB connection failed (${err.message}). Activating Adaptive In-Memory Storage.`);
    return { status: 'in-memory-fallback', reason: err.message };
  }
};

module.exports = connectDB;
