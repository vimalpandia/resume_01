const mongoose = require('mongoose');
const { setMongoConnected } = require('../models/store');

const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const uri = process.env.MONGODB_URI || (isProduction ? '' : 'mongodb://127.0.0.1:27017/resume_analyzer_pro');

  if (isProduction && !uri) {
    throw new Error(
      '[DB Fatal] MONGODB_URI is required in production environment. Please configure your MongoDB Atlas connection string in the Render Dashboard.'
    );
  }

  try {
    mongoose.set('strictQuery', false);
    // Use 15-second timeout in production for cloud Atlas cold-start TLS negotiation,
    // or quick 2.5-second timeout in local dev to avoid blocking if local mongod is absent.
    const timeoutMs = isProduction ? 15000 : 2500;
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: timeoutMs,
      connectTimeoutMS: timeoutMs,
    });
    setMongoConnected(true);
    console.log(`[DB] Successfully connected to MongoDB: ${conn.connection.host}/${conn.connection.name}`);
    return { status: 'connected', host: conn.connection.host };
  } catch (err) {
    setMongoConnected(false);

    if (isProduction) {
      console.error(`[DB Fatal] Production MongoDB connection failed: ${err.message}`);
      throw new Error(
        `[DB Fatal] Failed to connect to production database: ${err.message}. Refusing silent in-memory fallback in production to prevent data loss.`
      );
    }

    console.warn(`[DB Notice] MongoDB not reachable at ${uri || 'default'} (${err.message}).`);
    console.log(`[DB Adaptive Mode] Seamlessly activated Zero-Config Resilient In-Memory Storage.`);
    console.log(`[DB Adaptive Mode] All models, JWT auth, and persistence will function out-of-the-box.`);
    return { status: 'in-memory-fallback', reason: err.message };
  }
};

module.exports = connectDB;
