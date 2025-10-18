import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { successResponse, ErrorResponses } from '@/lib/response';
import { RegisterRequest } from '@/types';

export async function POST(request: Request) {
    try {
        const body: RegisterRequest = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return ErrorResponses.missingFields(['username', 'password']);
        }

        if (username.length < 3) {
            return ErrorResponses.invalidInput('Username must be at least 3 characters long');
        }

        if (password.length < 4) {
            return ErrorResponses.invalidInput('Password must be at least 4 characters long');
        }

        const existingUser = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            return ErrorResponses.conflict('Username already exists');
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });

        return successResponse(
            {
                id: user.id,
                username: user.username,
                createdAt: user.createdAt,
            },
            'User registered successfully',
            201
        );
    } catch (error) {
        console.error('Registration error:', error);
        return ErrorResponses.serverError();
    }
}