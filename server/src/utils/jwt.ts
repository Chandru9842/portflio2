import jwt from 'jsonwebtoken';

interface TokenPayload {
  sub: string;
  role: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  const secret = process.env.JWT_SECRET || 'fallback_secret_for_development_only_123456';
  const expiresIn = process.env.JWT_EXPIRES_IN || '15m';
  return jwt.sign(payload, secret, { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] });
}

export function generateRefreshToken(payload: TokenPayload): string {
  const secret = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_for_development_only_123456';
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] });
}

export function verifyAccessToken(token: string): TokenPayload {
  const secret = process.env.JWT_SECRET || 'fallback_secret_for_development_only_123456';
  return jwt.verify(token, secret) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  const secret = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_for_development_only_123456';
  return jwt.verify(token, secret) as TokenPayload;
}
