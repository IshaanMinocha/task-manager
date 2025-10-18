import { hashPassword, comparePassword } from '@/lib/auth';

const mockPrisma = {
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
};

jest.mock('@/lib/prisma', () => ({
    prisma: mockPrisma,
}));

import { POST as registerPOST } from '@/app/api/auth/register/route';
import { POST as loginPOST } from '@/app/api/auth/login/route';

describe('Auth Endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const mockUser = {
                id: 'user123',
                username: 'testuser',
                password: 'hashedPassword123',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.user.findUnique.mockResolvedValue(null);
            mockPrisma.user.create.mockResolvedValue(mockUser);

            const request = new Request('http://localhost:3000/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    username: 'testuser',
                    password: 'password123',
                }),
            });

            const response = await registerPOST(request);
            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data.success).toBe(true);
            expect(data.message).toBe('User registered successfully');
            expect(data.data.username).toBe('testuser');
            expect(data.data.password).toBeUndefined();
        });

        it('should reject registration with missing username', async () => {
            const request = new Request('http://localhost:3000/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    password: 'password123',
                }),
            });

            const response = await registerPOST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.success).toBe(false);
            expect(data.error).toContain('username');
        });

        it('should reject registration with missing password', async () => {
            const request = new Request('http://localhost:3000/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    username: 'testuser',
                }),
            });

            const response = await registerPOST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.success).toBe(false);
            expect(data.error).toContain('password');
        });

        it('should reject registration with username less than 3 characters', async () => {
            const request = new Request('http://localhost:3000/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    username: 'ab',
                    password: 'password123',
                }),
            });

            const response = await registerPOST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.success).toBe(false);
            expect(data.error).toContain('at least 3 characters');
        });

        it('should reject registration with password less than 4 characters', async () => {
            const request = new Request('http://localhost:3000/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    username: 'testuser',
                    password: '123',
                }),
            });

            const response = await registerPOST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.success).toBe(false);
            expect(data.error).toContain('at least 4 characters');
        });

        it('should reject registration with duplicate username', async () => {
            const existingUser = {
                id: 'existingUser',
                username: 'testuser',
                password: 'hashedPassword',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.user.findUnique.mockResolvedValue(existingUser);

            const request = new Request('http://localhost:3000/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    username: 'testuser',
                    password: 'password123',
                }),
            });

            const response = await registerPOST(request);
            const data = await response.json();

            expect(response.status).toBe(409);
            expect(data.success).toBe(false);
            expect(data.error).toContain('already exists');
        });

        it('should handle database errors gracefully', async () => {
            mockPrisma.user.findUnique.mockRejectedValue(new Error('Database error'));

            const request = new Request('http://localhost:3000/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    username: 'testuser',
                    password: 'password123',
                }),
            });

            const response = await registerPOST(request);
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data.success).toBe(false);
        });

        it('should hash the password before storing', async () => {
            const mockUser = {
                id: 'user123',
                username: 'testuser',
                password: 'hashedPassword123',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.user.findUnique.mockResolvedValue(null);
            mockPrisma.user.create.mockResolvedValue(mockUser);

            const request = new Request('http://localhost:3000/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    username: 'testuser',
                    password: 'password123',
                }),
            });

            await registerPOST(request);

            expect(mockPrisma.user.create).toHaveBeenCalled();
            const createCall = mockPrisma.user.create.mock.calls[0][0];
            expect(createCall.data.password).not.toBe('password123');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully with valid credentials', async () => {
            const hashedPwd = await hashPassword('password123');
            const mockUser = {
                id: 'user123',
                username: 'testuser',
                password: hashedPwd,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.user.findUnique.mockResolvedValue(mockUser);

            const request = new Request('http://localhost:3000/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    username: 'testuser',
                    password: 'password123',
                }),
            });

            const response = await loginPOST(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(data.message).toBe('Login successful');
            expect(data.data.token).toBeDefined();
            expect(data.data.user.username).toBe('testuser');
            expect(data.data.user.password).toBeUndefined();
        });

        it('should reject login with missing username', async () => {
            const request = new Request('http://localhost:3000/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    password: 'password123',
                }),
            });

            const response = await loginPOST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.success).toBe(false);
            expect(data.error).toContain('username');
        });

        it('should reject login with missing password', async () => {
            const request = new Request('http://localhost:3000/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    username: 'testuser',
                }),
            });

            const response = await loginPOST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.success).toBe(false);
            expect(data.error).toContain('password');
        });

        it('should reject login with non-existent username', async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);

            const request = new Request('http://localhost:3000/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    username: 'nonexistent',
                    password: 'password123',
                }),
            });

            const response = await loginPOST(request);
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data.success).toBe(false);
            expect(data.error).toContain('Invalid username or password');
        });

        it('should reject login with incorrect password', async () => {
            const hashedPwd = await hashPassword('correctPassword');
            const mockUser = {
                id: 'user123',
                username: 'testuser',
                password: hashedPwd,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.user.findUnique.mockResolvedValue(mockUser);

            const request = new Request('http://localhost:3000/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    username: 'testuser',
                    password: 'wrongPassword',
                }),
            });

            const response = await loginPOST(request);
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data.success).toBe(false);
            expect(data.error).toContain('Invalid username or password');
        });

        it('should handle database errors gracefully', async () => {
            mockPrisma.user.findUnique.mockRejectedValue(new Error('Database error'));

            const request = new Request('http://localhost:3000/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    username: 'testuser',
                    password: 'password123',
                }),
            });

            const response = await loginPOST(request);
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data.success).toBe(false);
        });

        it('should not return password in response', async () => {
            const hashedPwd = await hashPassword('password123');
            const mockUser = {
                id: 'user123',
                username: 'testuser',
                password: hashedPwd,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.user.findUnique.mockResolvedValue(mockUser);

            const request = new Request('http://localhost:3000/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    username: 'testuser',
                    password: 'password123',
                }),
            });

            const response = await loginPOST(request);
            const data = await response.json();

            expect(data.data.user.password).toBeUndefined();
            expect(data.data.user.username).toBeDefined();
        });

        it('should return a valid JWT token', async () => {
            const hashedPwd = await hashPassword('password123');
            const mockUser = {
                id: 'user123',
                username: 'testuser',
                password: hashedPwd,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.user.findUnique.mockResolvedValue(mockUser);

            const request = new Request('http://localhost:3000/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    username: 'testuser',
                    password: 'password123',
                }),
            });

            const response = await loginPOST(request);
            const data = await response.json();

            expect(data.data.token).toBeDefined();
            expect(typeof data.data.token).toBe('string');
            expect(data.data.token.split('.')).toHaveLength(3);
        });
    });
});

