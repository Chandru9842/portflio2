import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { protect } from '../middleware/auth';
import { loginRateLimiter } from '../middleware/rateLimiter';
import { AuthenticatedRequest } from '../types';

const router = Router();

// POST /api/auth/login
// Protected by in-memory rate limiting against brute force attempts
router.post('/login', loginRateLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || typeof usernameOrEmail !== 'string' || usernameOrEmail.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Username or email is required.',
      });
    }

    if (!password || typeof password !== 'string' || password === '') {
      return res.status(400).json({
        success: false,
        message: 'Password is required.',
      });
    }

    const searchStr = usernameOrEmail.toLowerCase().trim();

    // Look up the admin by either username or email
    const admin = await Admin.findOne({
      $or: [{ username: searchStr }, { email: searchStr }],
    });

    // Handle authentication failure generically to prevent account enumeration
    const genericFailureResponse = () => res.status(401).json({
      success: false,
      message: 'Invalid username/email or password.',
    });

    if (!admin) {
      return genericFailureResponse();
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This administrator account is currently inactive. Please contact support.',
      });
    }

    // Verify password hash
    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isPasswordValid) {
      return genericFailureResponse();
    }

    // Generate short-lived Access Token and longer-lived Refresh Token
    const payload = { sub: String(admin._id), role: admin.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Set refresh token as a secure, HttpOnly, SameSite cookie
    const cookieMaxAge = 7 * 24 * 60 * 60 * 1000; // 7 days matching standard refresh token expiration
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: cookieMaxAge,
      path: '/api/auth', // Scoped to auth operations only for enhanced security
    });

    return res.json({
      success: true,
      data: {
        accessToken,
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          fullName: admin.fullName,
          role: admin.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Session has ended or is invalid. Please sign in again.',
      });
    }

    try {
      const decoded = verifyRefreshToken(refreshToken);

      const admin = await Admin.findById(decoded.sub);
      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'The administrator account associated with this session no longer exists.',
        });
      }

      if (!admin.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Your administrator account has been deactivated.',
        });
      }

      // Generate a brand new short-lived access token
      const accessToken = generateAccessToken({
        sub: String(admin._id),
        role: admin.role,
      });

      return res.json({
        success: true,
        data: {
          accessToken,
          admin: {
            id: admin._id,
            username: admin.username,
            email: admin.email,
            fullName: admin.fullName,
            role: admin.role,
          },
        },
      });
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh session. Please sign in again.',
      });
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/logout
router.post('/logout', (req: Request, res: Response) => {
  // Clear the secure HttpOnly cookie
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/api/auth',
  });

  return res.json({
    success: true,
    message: 'Logged out successfully.',
  });
});

// GET /api/auth/me
// Protected endpoint
router.get('/me', protect as any, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated.',
      });
    }

    return res.json({
      success: true,
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
