import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { RegisterRequest } from '@/types';

export async function POST(request: Request) {
    try {
        const body: RegisterRequest = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { success: false, error: 'Username and password are required' },
                { status: 400 }
            );
        }

        if (username.length < 3) {
            return NextResponse.json(
                { success: false, error: 'Username must be at least 3 characters long' },
                { status: 400 }
            );
        }

        if (password.length < 4) {
            return NextResponse.json(
                { success: false, error: 'Password must be at least 4 characters long' },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, error: 'Username already exists' },
                { status: 400 }
            );
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: 'User registered successfully',
                data: {
                    id: user.id,
                    username: user.username,
                    createdAt: user.createdAt,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}