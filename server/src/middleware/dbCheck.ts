import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export function dbCheck(req: Request, res: Response, next: NextFunction) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database is currently disconnected. Please verify your MONGODB_URI configuration in your environment or Settings.',
    });
  }
  next();
}
