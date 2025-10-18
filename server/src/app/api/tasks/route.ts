import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/middleware';
import { successResponse, ErrorResponses } from '@/lib/response';
import { CreateTaskRequest } from '@/types';

export async function GET(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);

        if (!user) {
            return ErrorResponses.unauthorized();
        }

        const tasks = await prisma.task.findMany({
            where: {
                userId: user.userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return successResponse(tasks, 'Tasks retrieved successfully');
    } catch (error) {
        console.error('Get tasks error:', error);
        return ErrorResponses.serverError();
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);

        if (!user) {
            return ErrorResponses.unauthorized();
        }

        const body: CreateTaskRequest = await request.json();
        const { title, description, status } = body;

        if (!title) {
            return ErrorResponses.missingFields(['title']);
        }

        if (title.trim().length < 3) {
            return ErrorResponses.invalidInput('Title must be at least 3 characters long');
        }

        if (status && !['PENDING', 'COMPLETED'].includes(status)) {
            return ErrorResponses.invalidInput('Status must be either PENDING or COMPLETED');
        }

        const task = await prisma.task.create({
            data: {
                title: title.trim(),
                description: description?.trim() || null,
                status: status || 'PENDING',
                userId: user.userId,
            },
        });

        return successResponse(task, 'Task created successfully', 201);
    } catch (error) {
        console.error('Create task error:', error);
        return ErrorResponses.serverError();
    }
}