process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_EXPIRES_IN = '1h';
process.env.BCRYPT_SALT_ROUNDS = '10';
process.env.DATABASE_URL = 'mongodb://localhost:27017/test';

if (!process.env.DEBUG) {
    global.console = {
        ...console,
        error: jest.fn(),
        warn: jest.fn(),
    };
}

