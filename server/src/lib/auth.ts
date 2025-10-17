import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { consts } from './consts';
import { JWTPayload } from '@/types';

const JWT_SECRET = consts.jwt.secret!;
const JWT_EXPIRES_IN = consts.jwt.expiresIn!;
const SALT_ROUNDS = parseInt(consts.bcrypt.saltRounds!);

export function generateToken(payload: { userId: string; username: string }): string {
    try {
        const token = jwt.sign(
            {
                userId: payload.userId,
                username: payload.username,
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
        );
        return token;
    } catch (error) {
        console.error('Error generating token:', error);
        throw new Error('Failed to generate token');
    }
}

export function verifyToken(token: string): JWTPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        return decoded;
    } catch (error) {
        console.error('Error verifying token:', error);
        return null;
    }
}

export async function hashPassword(password: string): Promise<string> {
    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Failed to hash password');
    }
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error('Error comparing password:', error);
        return false;
    }
}