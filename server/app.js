const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const errorHandler = require('./middleware/errorHandler');
const { isMongoConnected } = require('./models/store');

const app = express();

// Trust reverse proxy for Render / Cloudflare load balancers (required for rate limiting)
app.set('trust proxy', 1);

// Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows flexible integration in dev/preview
    crossOriginEmbedderPolicy: false,
  })
);

// Cross-Origin Resource Sharing (handles optional trailing slashes safely)
const configuredClientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.trim().replace(/\/$/, '') : null;
const defaultDevOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: configuredClientUrl || defaultDevOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing with safe limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health & System status endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'AI Resume Analyzer Pro API',
    version: '1.0.0',
    uptime: Math.round(process.uptime()),
    database: {
      status: isMongoConnected() ? 'connected (MongoDB Atlas/Local)' : 'adaptive in-memory store active',
      isMongoConnected: isMongoConnected(),
    },
    aiProvider: process.env.GEMINI_API_KEY ? 'Google Gemini API' : 'Rule-Based Engineering Heuristics (Ready for GEMINI_API_KEY)',
    timestamp: new Date().toISOString(),
  });
});

// Mount modular API routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);

// Explicit 404 Route handler for unrecognized API endpoints
// Ensures any /api/* request returns clean JSON rather than falling through to frontend HTML
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API route ${req.method} ${req.originalUrl} not found.`,
  });
});

// Serve frontend static assets from client/dist in production
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// SPA fallback for client-side routing (React Router)
app.get('*', (req, res) => {
  const indexPath = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
        <head><meta charset="utf-8"/><title>AI Resume Analyzer Pro API</title></head>
        <body style="font-family:system-ui,-apple-system,sans-serif;padding:2rem;text-align:center;background:#0f172a;color:#f8fafc;">
          <h2>AI Resume Analyzer Pro API is Running</h2>
          <p>Frontend production bundle (<code>client/dist</code>) has not been built yet.</p>
          <p><a href="/api/health" style="color:#38bdf8;">Check System Health Status</a></p>
        </body>
      </html>
    `);
  }
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
