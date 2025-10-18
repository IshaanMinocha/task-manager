import { prisma } from '@/lib/prisma';
import { comparePassword, generateToken } from '@/lib/auth';
import { successResponse, ErrorResponses } from '@/lib/response';
import { LoginRequest, UserResponse } from '@/types';

export async function POST(request: Request) {
    try {
        const body: LoginRequest = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return ErrorResponses.missingFields(['username', 'password']);
        }

        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return ErrorResponses.unauthorized('Invalid username or password');
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return ErrorResponses.unauthorized('Invalid username or password');
        }

        const token = generateToken({
            userId: user.id,
            username: user.username,
        });

        const userResponse: UserResponse = {
            id: user.id,
            username: user.username,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        return successResponse(
            {
                token,
                user: userResponse,
            },
            'Login successful'
        );
    } catch (error) {
        console.error('Login error:', error);
        return ErrorResponses.serverError();
    }
}