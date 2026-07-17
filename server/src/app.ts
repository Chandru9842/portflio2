import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import apiRouter from './routes/api';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// 1. Security Middleware
app.use(
  helmet({
    // Disable CSP in development to allow Vite's inline scripts/styles and hot-reload WebSockets to function without issues
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    frameguard: false, // Disables X-Frame-Options to allow preview inside AI Studio iframe
  })
);

// 2. CORS Configuration with dynamic origin reflection for secure HttpOnly cookie credentials
const allowedOrigin = process.env.CLIENT_URL;
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      
      const isLocalhost = /^https?:\/\/localhost(:\d+)?$/.test(origin) || /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin);
      const isGoogleOrRunApp = /\.run\.app$/.test(origin) || /\.google\.com$/.test(origin);
      const isConfiguredOrigin = allowedOrigin === '*' || allowedOrigin === origin;

      if (isLocalhost || isGoogleOrRunApp || isConfiguredOrigin || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
  })
);

// 3. Request Size Limits, Parsing & Cookie Support
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. API Routes
app.use('/api', apiRouter);

// 5. 404 handler for unmatched /api routes
app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on this server.`,
  });
});

// 6. Centralized Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export default app;
