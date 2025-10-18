import { loginSchema, registerSchema, taskSchema } from '../utils/validation';

describe('Validation Schemas', () => {
    describe('loginSchema', () => {
        it('should validate correct login data', () => {
            const validData = {
                username: 'testuser',
                password: 'password123',
            };

            const result = loginSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should reject username less than 3 characters', () => {
            const invalidData = {
                username: 'ab',
                password: 'password123',
            };

            const result = loginSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toContain('at least 3 characters');
            }
        });

        it('should reject username more than 50 characters', () => {
            const invalidData = {
                username: 'a'.repeat(51),
                password: 'password123',
            };

            const result = loginSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toContain('less than 50 characters');
            }
        });

        it('should reject password less than 4 characters', () => {
            const invalidData = {
                username: 'testuser',
                password: '123',
            };

            const result = loginSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toContain('at least 4 characters');
            }
        });

        it('should reject password more than 100 characters', () => {
            const invalidData = {
                username: 'testuser',
                password: 'a'.repeat(101),
            };

            const result = loginSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toContain('less than 100 characters');
            }
        });

        it('should reject missing username', () => {
            const invalidData = {
                password: 'password123',
            };

            const result = loginSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('should reject missing password', () => {
            const invalidData = {
                username: 'testuser',
            };

            const result = loginSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });

    describe('registerSchema', () => {
        it('should validate correct registration data', () => {
            const validData = {
                username: 'testuser',
                password: 'password123',
                confirmPassword: 'password123',
            };

            const result = registerSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should reject when passwords do not match', () => {
            const invalidData = {
                username: 'testuser',
                password: 'password123',
                confirmPassword: 'different',
            };

            const result = registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toContain("don't match");
            }
        });

        it('should reject username less than 3 characters', () => {
            const invalidData = {
                username: 'ab',
                password: 'password123',
                confirmPassword: 'password123',
            };

            const result = registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('should reject password less than 4 characters', () => {
            const invalidData = {
                username: 'testuser',
                password: '123',
                confirmPassword: '123',
            };

            const result = registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('should reject missing confirmPassword', () => {
            const invalidData = {
                username: 'testuser',
                password: 'password123',
            };

            const result = registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });

    describe('taskSchema', () => {
        it('should validate correct task data', () => {
            const validData = {
                title: 'Task Title',
                description: 'Task description',
                status: 'PENDING' as const,
            };

            const result = taskSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should validate task without description', () => {
            const validData = {
                title: 'Task Title',
            };

            const result = taskSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should validate task with empty description', () => {
            const validData = {
                title: 'Task Title',
                description: '',
            };

            const result = taskSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should validate task without status', () => {
            const validData = {
                title: 'Task Title',
                description: 'Description',
            };

            const result = taskSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should reject title less than 3 characters', () => {
            const invalidData = {
                title: 'ab',
                description: 'Description',
            };

            const result = taskSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toContain('at least 3 characters');
            }
        });

        it('should reject title more than 200 characters', () => {
            const invalidData = {
                title: 'a'.repeat(201),
                description: 'Description',
            };

            const result = taskSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toContain('less than 200 characters');
            }
        });

        it('should reject description more than 1000 characters', () => {
            const invalidData = {
                title: 'Task Title',
                description: 'a'.repeat(1001),
            };

            const result = taskSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toContain('less than 1000 characters');
            }
        });

        it('should reject missing title', () => {
            const invalidData = {
                description: 'Description',
            };

            const result = taskSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('should validate with COMPLETED status', () => {
            const validData = {
                title: 'Task Title',
                status: 'COMPLETED' as const,
            };

            const result = taskSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });
    });
});

