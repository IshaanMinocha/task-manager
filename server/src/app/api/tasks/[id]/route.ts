import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/middleware';
import { successResponse, ErrorResponses } from '@/lib/response';
import { UpdateTaskRequest } from '@/types';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getUserFromRequest(request);

        if (!user) {
            return ErrorResponses.unauthorized();
        }

        const { id: taskId } = await params;

        const existingTask = await prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!existingTask) {
            return ErrorResponses.notFound('Task');
        }

        if (existingTask.userId !== user.userId) {
            return ErrorResponses.forbidden('You do not have permission to update this task');
        }

        const body: UpdateTaskRequest = await request.json();
        const { title, description, status } = body;

        if (!title && description === undefined && !status) {
            return ErrorResponses.invalidInput('At least one field must be provided for update');
        }

        if (title !== undefined && title.trim().length < 3) {
            return ErrorResponses.invalidInput('Title must be at least 3 characters long');
        }

        if (status && !['PENDING', 'COMPLETED'].includes(status)) {
            return ErrorResponses.invalidInput('Status must be either PENDING or COMPLETED');
        }

        const updateData: any = {};
        if (title !== undefined) updateData.title = title.trim();
        if (description !== undefined) updateData.description = description?.trim() || null;
        if (status !== undefined) updateData.status = status;

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: updateData,
        });

        return successResponse(updatedTask, 'Task updated successfully');
    } catch (error) {
        console.error('Update task error:', error);
        return ErrorResponses.serverError();
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getUserFromRequest(request);

        if (!user) {
            return ErrorResponses.unauthorized();
        }

        const { id: taskId } = await params;

        const existingTask = await prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!existingTask) {
            return ErrorResponses.notFound('Task');
        }

        if (existingTask.userId !== user.userId) {
            return ErrorResponses.forbidden('You do not have permission to delete this task');
        }

        await prisma.task.delete({
            where: { id: taskId },
        });

        return successResponse(
            { id: taskId },
            'Task deleted successfully'
        );
    } catch (error) {
        console.error('Delete task error:', error);
        return ErrorResponses.serverError();
    }
}