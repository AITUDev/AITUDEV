import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'aitu-dev-super-secret-key-2026-auth';

export interface TokenPayload {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'lead' | 'member';
}

/**
 * Hash a plain text password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare a plain text password with a hashed password
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Sign a JWT token for a team member
 */
export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verify a JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}

/**
 * Extract auth user from NextRequest cookies or Authorization header
 */
export function getAuthUser(req: NextRequest): TokenPayload | null {
  // Check cookie first
  const cookieToken = req.cookies.get('aitu_auth_token')?.value;
  if (cookieToken) {
    const payload = verifyToken(cookieToken);
    if (payload) return payload;
  }

  // Check Authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    return verifyToken(token);
  }

  return null;
}
