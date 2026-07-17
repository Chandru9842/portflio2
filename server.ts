import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import app from './server/src/app';
import { connectDB, validateDatabaseConfig } from './server/src/config/db';
import { syncAdminCredentials } from './server/src/utils/adminSync';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;

async function startServer() {
  console.log('🚀 Starting Portfolio CMS Server initialization...');

  try {
    // 1. Load environment variables & Validate MONGODB_URI
    console.log('📋 Validating database configuration...');
    validateDatabaseConfig();

    // 2. Connect to MongoDB and Confirm connection
    await connectDB();
    console.log('✅ MongoDB connection verified and established successfully.');

    // 3. Auto-sync administrator credentials
    console.log('🔄 Checking and synchronizing administrator credentials...');
    await syncAdminCredentials();
  } catch (error: any) {
    console.error("==========================================================================");
    console.error("⚠️  DATABASE INITIALIZATION FAILED ON STARTUP!");
    console.error("==========================================================================");
    console.error(error.message || error);
    console.error("\nPlease configure your environment variables correctly. The server is starting in a limited state.");
    console.error("==========================================================================");
  }

  // 3. Client Routing & Bundler Integration (Start Express Server)

  if (process.env.NODE_ENV !== 'production') {
    console.log('🚧 Running in DEVELOPMENT mode. Mounting Vite Dev Middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    // Let Vite handle non-API assets and HTML rendering
    app.use(vite.middlewares);
  } else {
    console.log('📦 Running in PRODUCTION mode. Serving static assets...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 4. Bind and Listen
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`📡 Portfolio CMS API and client server running on http://localhost:${PORT}`);
  });
}

// Global process exception safety
process.on('unhandledRejection', (reason, promise) => {
  console.error('🔴 Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('🔴 Uncaught Exception thrown:', error);
});

startServer();
