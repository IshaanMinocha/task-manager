import { generateToken, verifyToken, hashPassword, comparePassword } from '@/lib/auth';
import jwt from 'jsonwebtoken';

describe('Auth Utilities', () => {
    describe('generateToken', () => {
        it('should generate a valid JWT token', () => {
            const payload = { userId: 'user123', username: 'testuser' };
            const token = generateToken(payload);

            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token.split('.')).toHaveLength(3);
        });

        it('should include userId and username in token payload', () => {
            const payload = { userId: 'user123', username: 'testuser' };
            const token = generateToken(payload);
            const decoded = jwt.decode(token) as any;

            expect(decoded.userId).toBe(payload.userId);
            expect(decoded.username).toBe(payload.username);
        });

        it('should set expiration time on token', () => {
            const payload = { userId: 'user123', username: 'testuser' };
            const token = generateToken(payload);
            const decoded = jwt.decode(token) as any;

            expect(decoded.exp).toBeDefined();
            expect(decoded.exp).toBeGreaterThan(Date.now() / 1000);
        });

        it('should generate token even with partial payload', () => {
            const token = generateToken({ userId: '', username: '' });
            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
        });
    });

    describe('verifyToken', () => {
        it('should verify a valid token', () => {
            const payload = { userId: 'user123', username: 'testuser' };
            const token = generateToken(payload);
            const decoded = verifyToken(token);

            expect(decoded).toBeDefined();
            expect(decoded?.userId).toBe(payload.userId);
            expect(decoded?.username).toBe(payload.username);
        });

        it('should return null for invalid token', () => {
            const decoded = verifyToken('invalid.token.here');
            expect(decoded).toBeNull();
        });

        it('should return null for expired token', () => {
            const payload = { userId: 'user123', username: 'testuser' };
            const expiredToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '-1h' });
            const decoded = verifyToken(expiredToken);

            expect(decoded).toBeNull();
        });

        it('should return null for token with wrong secret', () => {
            const payload = { userId: 'user123', username: 'testuser' };
            const wrongToken = jwt.sign(payload, 'wrong-secret', { expiresIn: '1h' });
            const decoded = verifyToken(wrongToken);

            expect(decoded).toBeNull();
        });

        it('should return null for empty token', () => {
            const decoded = verifyToken('');
            expect(decoded).toBeNull();
        });
    });

    describe('hashPassword', () => {
        it('should hash a password', async () => {
            const password = 'mySecurePassword123';
            const hashed = await hashPassword(password);

            expect(hashed).toBeDefined();
            expect(typeof hashed).toBe('string');
            expect(hashed).not.toBe(password);
            expect(hashed.length).toBeGreaterThan(50);
        });

        it('should create different hashes for same password', async () => {
            const password = 'mySecurePassword123';
            const hash1 = await hashPassword(password);
            const hash2 = await hashPassword(password);

            expect(hash1).not.toBe(hash2);
        });

        it('should hash empty password', async () => {
            const hashed = await hashPassword('');
            expect(hashed).toBeDefined();
        });

        it('should hash long password', async () => {
            const longPassword = 'a'.repeat(100);
            const hashed = await hashPassword(longPassword);
            expect(hashed).toBeDefined();
        });
    });

    describe('comparePassword', () => {
        it('should return true for matching password', async () => {
            const password = 'mySecurePassword123';
            const hashed = await hashPassword(password);
            const isMatch = await comparePassword(password, hashed);

            expect(isMatch).toBe(true);
        });

        it('should return false for non-matching password', async () => {
            const password = 'mySecurePassword123';
            const wrongPassword = 'wrongPassword456';
            const hashed = await hashPassword(password);
            const isMatch = await comparePassword(wrongPassword, hashed);

            expect(isMatch).toBe(false);
        });

        it('should return false for empty password comparison', async () => {
            const password = 'mySecurePassword123';
            const hashed = await hashPassword(password);
            const isMatch = await comparePassword('', hashed);

            expect(isMatch).toBe(false);
        });

        it('should return false for invalid hash', async () => {
            const isMatch = await comparePassword('password', 'invalid-hash');
            expect(isMatch).toBe(false);
        });

        it('should be case sensitive', async () => {
            const password = 'MyPassword';
            const hashed = await hashPassword(password);
            const isMatch = await comparePassword('mypassword', hashed);

            expect(isMatch).toBe(false);
        });
    });
});

