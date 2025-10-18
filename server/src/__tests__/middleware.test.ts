import { NextRequest } from 'next/server';
import { authMiddleware, getUserFromRequest } from '@/lib/middleware';
import { generateToken } from '@/lib/auth';

describe('Middleware', () => {
    describe('authMiddleware', () => {
        it('should authenticate with valid token', () => {
            const payload = { userId: 'user123', username: 'testuser' };
            const token = generateToken(payload);

            const request = new NextRequest('http://localhost:3000/api/tasks', {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            const result = authMiddleware(request);

            expect(result.authenticated).toBe(true);
            expect(result.userId).toBe(payload.userId);
            expect(result.username).toBe(payload.username);
            expect(result.error).toBeUndefined();
        });

        it('should reject request without authorization header', () => {
            const request = new NextRequest('http://localhost:3000/api/tasks');
            const result = authMiddleware(request);

            expect(result.authenticated).toBe(false);
            expect(result.error).toBe('No authorization header provided');
            expect(result.userId).toBeUndefined();
            expect(result.username).toBeUndefined();
        });

        it('should reject request with invalid authorization format', () => {
            const request = new NextRequest('http://localhost:3000/api/tasks', {
                headers: {
                    authorization: 'InvalidFormat token123',
                },
            });

            const result = authMiddleware(request);

            expect(result.authenticated).toBe(false);
            expect(result.error).toBe('Invalid authorization format. Use: Bearer <token>');
        });

        it('should reject request with Bearer but no token', () => {
            const request = new NextRequest('http://localhost:3000/api/tasks', {
                headers: {
                    authorization: 'Bearer',
                },
            });

            const result = authMiddleware(request);

            expect(result.authenticated).toBe(false);
            expect(result.error).toBe('Invalid authorization format. Use: Bearer <token>');
        });

        it('should reject request with invalid token', () => {
            const request = new NextRequest('http://localhost:3000/api/tasks', {
                headers: {
                    authorization: 'Bearer invalid.token.here',
                },
            });

            const result = authMiddleware(request);

            expect(result.authenticated).toBe(false);
            expect(result.error).toBe('Invalid or expired token');
        });

        it('should reject request with expired token', () => {
            const jwt = require('jsonwebtoken');
            const expiredToken = jwt.sign(
                { userId: 'user123', username: 'testuser' },
                process.env.JWT_SECRET!,
                { expiresIn: '-1h' }
            );

            const request = new NextRequest('http://localhost:3000/api/tasks', {
                headers: {
                    authorization: `Bearer ${expiredToken}`,
                },
            });

            const result = authMiddleware(request);

            expect(result.authenticated).toBe(false);
            expect(result.error).toBe('Invalid or expired token');
        });

        it('should handle token with wrong secret', () => {
            const jwt = require('jsonwebtoken');
            const wrongToken = jwt.sign(
                { userId: 'user123', username: 'testuser' },
                'wrong-secret',
                { expiresIn: '1h' }
            );

            const request = new NextRequest('http://localhost:3000/api/tasks', {
                headers: {
                    authorization: `Bearer ${wrongToken}`,
                },
            });

            const result = authMiddleware(request);

            expect(result.authenticated).toBe(false);
            expect(result.error).toBe('Invalid or expired token');
        });
    });

    describe('getUserFromRequest', () => {
        it('should return user info for valid token', async () => {
            const payload = { userId: 'user123', username: 'testuser' };
            const token = generateToken(payload);

            const request = new NextRequest('http://localhost:3000/api/tasks', {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            const user = await getUserFromRequest(request);

            expect(user).toBeDefined();
            expect(user?.userId).toBe(payload.userId);
            expect(user?.username).toBe(payload.username);
        });

        it('should return null for invalid token', async () => {
            const request = new NextRequest('http://localhost:3000/api/tasks', {
                headers: {
                    authorization: 'Bearer invalid.token.here',
                },
            });

            const user = await getUserFromRequest(request);
            expect(user).toBeNull();
        });

        it('should return null for missing token', async () => {
            const request = new NextRequest('http://localhost:3000/api/tasks');
            const user = await getUserFromRequest(request);
            expect(user).toBeNull();
        });
    });
});

