import { NextRequest } from 'next/server';
import { verifyToken } from './auth';
import { JWTPayload } from '@/types';

export interface AuthenticatedRequest extends NextRequest {
    userId?: string;
    username?: string;
}

export function authMiddleware(request: NextRequest): {
    authenticated: boolean;
    userId?: string;
    username?: string;
    error?: string;
} {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
            return {
                authenticated: false,
                error: 'No authorization header provided',
            };
        }

        if (!authHeader.startsWith('Bearer ')) {
            return {
                authenticated: false,
                error: 'Invalid authorization format. Use: Bearer <token>',
            };
        }

        const token = authHeader.substring(7);

        if (!token) {
            return {
                authenticated: false,
                error: 'No token provided',
            };
        }

        const decoded = verifyToken(token);

        if (!decoded) {
            return {
                authenticated: false,
                error: 'Invalid or expired token',
            };
        }

        return {
            authenticated: true,
            userId: decoded.userId,
            username: decoded.username,
        };
    } catch (error) {
        console.error('Auth middleware error:', error);
        return {
            authenticated: false,
            error: 'Authentication failed',
        };
    }
}

export async function getUserFromRequest(request: NextRequest): Promise<{
    userId: string;
    username: string;
} | null> {
    const auth = authMiddleware(request);

    if (!auth.authenticated || !auth.userId || !auth.username) {
        return null;
    }

    return {
        userId: auth.userId,
        username: auth.username,
    };
}