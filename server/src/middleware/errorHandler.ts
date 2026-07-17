import { Request, Response, NextFunction } from 'express';

export interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: any;
  errors?: any;
}

export function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  const errors: string[] = [];

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    if (err.errors) {
      Object.keys(err.errors).forEach((key) => {
        errors.push(err.errors[key].message);
      });
    }
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 400;
    const key = err.keyValue ? Object.keys(err.keyValue)[0] : 'field';
    message = `Duplicate field value entered: ${key}. Please use another value.`;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Resource not found. Invalid ID format.';
  }

  // Consistent API Response Format
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length > 0 ? { errors } : {}),
    // Expose stack trace only in development
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
}
