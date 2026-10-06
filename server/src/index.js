// DisasterOS Server Entrypoint
import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';
import { eventBus } from './services/eventBus.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Telemetry Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[DisasterOS API] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Mount Master API
app.use('/api', apiRouter);

// Global Error Handler (Section 41: Structured Errors, No Raw Stack Leaks)
app.use((err, req, res, next) => {
  console.error('[DisasterOS Error]', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: err.message || "An internal emergency server error occurred",
    timestamp: new Date().toISOString()
  });
});

// Create HTTP server & bind WebSocket Server
const server = http.createServer(app);
eventBus.initialize(server);

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🌍 DISASTEROS ENGINE OPERATIONAL`);
  console.log(`⚡ HTTP Server running on: http://localhost:${PORT}`);
  console.log(`📡 WebSocket Stream active on: ws://localhost:${PORT}/ws`);
  console.log(`🛡️  RBAC & Multi-Provider AI Architecture Ready`);
  console.log(`=======================================================`);
});

export { app, server };
