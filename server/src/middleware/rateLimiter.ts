import { Request, Response, NextFunction } from 'express';

const loginAttemptsCache = new Map<string, { count: number; resetTime: number }>();

export function loginRateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || (req.headers['x-forwarded-for'] as string) || 'unknown';
  const now = Date.now();
  const limitWindow = 15 * 60 * 1000; // 15 minutes window
  const maxAttempts = 15; // 15 login attempts per window to keep dev-friendly but secure

  const record = loginAttemptsCache.get(ip);

  if (!record) {
    loginAttemptsCache.set(ip, { count: 1, resetTime: now + limitWindow });
    return next();
  }

  if (now > record.resetTime) {
    loginAttemptsCache.set(ip, { count: 1, resetTime: now + limitWindow });
    return next();
  }

  record.count += 1;
  if (record.count > maxAttempts) {
    const minutesLeft = Math.ceil((record.resetTime - now) / (1000 * 60));
    return res.status(429).json({
      success: false,
      message: `Too many login attempts from this IP. Please try again in ${minutesLeft} minute(s).`,
    });
  }

  next();
}
