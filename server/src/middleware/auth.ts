import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { Admin } from '../models/Admin';
import { AuthenticatedRequest } from '../types';

export async function protect(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authorization token provided.',
      });
    }

    try {
      const decoded = verifyAccessToken(token);

      // Find admin associated with this token ID
      const admin = await Admin.findById(decoded.sub);
      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'The administrator account associated with this session no longer exists.',
        });
      }

      if (!admin.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Your administrator account has been deactivated.',
        });
      }

      // Attach authenticated admin to the request
      req.admin = admin;
      next();
    } catch (jwtError: any) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Session expired. Please sign in again.',
          code: 'TOKEN_EXPIRED',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization token. Please sign in again.',
      });
    }
  } catch (error) {
    next(error);
  }
}
