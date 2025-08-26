import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Node.js compatible token verification (for API routes)
export function verifyToken(token: string): JWTPayload | null {
  try {
    console.log('verifyToken - JWT_SECRET:', JWT_SECRET);
    console.log('verifyToken - token length:', token.length);
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
    console.log('verifyToken - success, payload:', payload);
    return payload;
  } catch (error) {
    console.log('verifyToken - error:', error);
    return null;
  }
}

export async function authenticateUser(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      return null;
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}
