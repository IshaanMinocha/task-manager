import { NextRequest } from 'next/server';
import { generateToken } from '@/lib/auth';

const mockPrisma = {
    task: {
        findMany: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};

jest.mock('@/lib/prisma', () => ({
    prisma: mockPrisma,
}));

import { GET as getTasks, POST as createTask } from '@/app/api/tasks/route';
import { PUT as updateTask, DELETE as deleteTask } from '@/app/api/tasks/[id]/route';

describe('Task Endpoints', () => {
    let authToken: string;
    const mockUser = {
        userId: 'user123',
        username: 'testuser',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        authToken = generateToken(mockUser);
    });

    describe('GET /api/tasks', () => {
        it('should return all tasks for authenticated user', async () => {
            const mockTasks = [
                {
                    id: 'task1',
                    title: 'Task 1',
                    description: 'Description 1',
                    status: 'PENDING',
                    userId: 'user123',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 'task2',
                    title: 'Task 2',
                    description: 'Description 2',
                    status: 'COMPLETED',
                    userId: 'user123',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            mockPrisma.task.findMany.mockResolvedValue(mockTasks);

            const request = new NextRequest('http://localhost:3000/api/tasks', {
                headers: {
                    authorization: `Bearer ${authToken}`,
                },
            });

            const response = await getTasks(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(data.data).toHaveLength(2);
            expect(data.data[0].title).toBe('Task 1');
        });

        it('should return empty array when user has no tasks', async () => {
            mockPrisma.task.findMany.mockResolvedValue([]);

            const request = new NextRequest('http://localhost:3000/api/tasks', {
                headers: {
                    authorization: `Bearer ${authToken}`,
                },
            });

            const response = await getTasks(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(data.data).toEqual([]);
        });

        it('should reject request without authentication', async () => {
            const request = new NextRequest('http://localhost:3000/api/tasks');

            const response = await getTasks(request);
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data.success).toBe(false);
        });

        it('should reject request with invalid token', async () => {
            const request = new NextRequest('http://localhost:3000/api/tasks', {
                headers: {
                    authorization: 'Bearer invalid.token.here',
                },
            });

            const response = await getTasks(request);
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data.success).toBe(false);
        });

        it('should handle database errors gracefully', async () => {
            mockPrisma.task.findMany.mockRejectedValue(new Error('Database error'));

            const request = new NextRequest('http://localhost:3000/api/tasks', {
                headers: {
                    authorization: `Bearer ${authToken}`,
                },
            });

            const response = await getTasks(request);
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data.success).toBe(false);
        });
    });

    describe('POST /api/tasks', () => {
        it('should create a new task successfully', async () => {
            const mockTask = {
                id: 'task1',
                title: 'New Task',
                description: 'Task description',
                status: 'PENDING',
                userId: 'user123',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.task.create.mockResolvedValue(mockTask);

            const request = new NextRequest('http://localhost:3000/api/tasks', {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    title: 'New Task',
                    description: 'Task description',
                }),
            });

            const response = await createTask(request);
            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data.success).toBe(true);
            expect(data.message).toBe('Task created successfully');
            expect(data.data.title).toBe('New Task');
        });

        it('should create task without description', async () => {
            const mockTask = {
                id: 'task1',
                title: 'New Task',
                description: null,
                status: 'PENDING',
                userId: 'user123',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.task.create.mockResolvedValue(mockTask);

            const request = new NextRequest('http://localhost:3000/api/tasks', {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    title: 'New Task',
                }),
            });

            const response = await createTask(request);
            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data.success).toBe(true);
            expect(data.data.description).toBeNull();
        });

        it('should create task with specified status', async () => {
            const mockTask = {
                id: 'task1',
                title: 'New Task',
                description: 'Task description',
                status: 'COMPLETED',
                userId: 'user123',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.task.create.mockResolvedValue(mockTask);

            const request = new NextRequest('http://localhost:3000/api/tasks', {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    title: 'New Task',
                    description: 'Task description',
                    status: 'COMPLETED',
                }),
            });

            const response = await createTask(request);
            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data.data.status).toBe('COMPLETED');
        });

        it('should reject task creation without title', async () => {
            const request = new NextRequest('http://localhost:3000/api/tasks', {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    description: 'Task description',
                }),
            });

            const response = await createTask(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.success).toBe(false);
            expect(data.error).toContain('title');
        });

        it('should reject task with title less than 3 characters', async () => {
            const request = new NextRequest('http://localhost:3000/api/tasks', {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    title: 'ab',
                    description: 'Task description',
                }),
            });

            const response = await createTask(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.success).toBe(false);
            expect(data.error).toContain('at least 3 characters');
        });

        it('should reject task with invalid status', async () => {
            const request = new NextRequest('http://localhost:3000/api/tasks', {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    title: 'New Task',
                    status: 'INVALID_STATUS',
                }),
            });

            const response = await createTask(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.success).toBe(false);
            expect(data.error).toContain('PENDING or COMPLETED');
        });

        it('should reject unauthenticated request', async () => {
            const request = new NextRequest('http://localhost:3000/api/tasks', {
                method: 'POST',
                body: JSON.stringify({
                    title: 'New Task',
                }),
            });

            const response = await createTask(request);
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data.success).toBe(false);
        });

        it('should trim title and description', async () => {
            const mockTask = {
                id: 'task1',
                title: 'Trimmed Task',
                description: 'Trimmed description',
                status: 'PENDING',
                userId: 'user123',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.task.create.mockResolvedValue(mockTask);

            const request = new NextRequest('http://localhost:3000/api/tasks', {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    title: '  Trimmed Task  ',
                    description: '  Trimmed description  ',
                }),
            });

            await createTask(request);

            expect(mockPrisma.task.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        title: 'Trimmed Task',
                        description: 'Trimmed description',
                    }),
                })
            );
        });
    });

    describe('PUT /api/tasks/[id]', () => {
        it('should update task successfully', async () => {
            const existingTask = {
                id: 'task1',
                title: 'Old Title',
                description: 'Old description',
                status: 'PENDING',
                userId: 'user123',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const updatedTask = {
                ...existingTask,
                title: 'Updated Title',
                description: 'Updated description',
            };

            mockPrisma.task.findUnique.mockResolvedValue(existingTask);
            mockPrisma.task.update.mockResolvedValue(updatedTask);

            const request = new NextRequest('http://localhost:3000/api/tasks/task1', {
                method: 'PUT',
                headers: {
                    authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    title: 'Updated Title',
                    description: 'Updated description',
                }),
            });

            const response = await updateTask(request, { params: Promise.resolve({ id: 'task1' }) });
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(data.message).toBe('Task updated successfully');
            expect(data.data.title).toBe('Updated Title');
        });

        it('should update only status', async () => {
            const existingTask = {
                id: 'task1',
                title: 'Task Title',
                description: 'Task description',
                status: 'PENDING',
                userId: 'user123',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const updatedTask = {
                ...existingTask,
                status: 'COMPLETED',
            };

            mockPrisma.task.findUnique.mockResolvedValue(existingTask);
            mockPrisma.task.update.mockResolvedValue(updatedTask);

            const request = new NextRequest('http://localhost:3000/api/tasks/task1', {
                method: 'PUT',
                headers: {
                    authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    status: 'COMPLETED',
                }),
            });

            const response = await updateTask(request, { params: Promise.resolve({ id: 'task1' }) });
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.data.status).toBe('COMPLETED');
        });

        it('should reject update for non-existent task', async () => {
            mockPrisma.task.findUnique.mockResolvedValue(null);

            const request = new NextRequest('http://localhost:3000/api/tasks/nonexistent', {
                method: 'PUT',
                headers: {
                    authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    title: 'Updated Title',
                }),
            });

            const response = await updateTask(request, { params: Promise.resolve({ id: 'nonexistent' }) });
            const data = await response.json();

            expect(response.status).toBe(404);
            expect(data.success).toBe(false);
            expect(data.error).toContain('not found');
        });

        it('should reject update for task owned by another user', async () => {
            const existingTask = {
                id: 'task1',
                title: 'Task Title',
                description: 'Task description',
                status: 'PENDING',
                userId: 'differentUser',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.task.findUnique.mockResolvedValue(existingTask);

            const request = new NextRequest('http://localhost:3000/api/tasks/task1', {
                method: 'PUT',
                headers: {
                    authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    title: 'Updated Title',
                }),
            });

            const response = await updateTask(request, { params: Promise.resolve({ id: 'task1' }) });
            const data = await response.json();

            expect(response.status).toBe(403);
            expect(data.success).toBe(false);
            expect(data.error).toContain('permission');
        });

        it('should reject update with no fields provided', async () => {
            const existingTask = {
                id: 'task1',
                title: 'Task Title',
                description: 'Task description',
                status: 'PENDING',
                userId: 'user123',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.task.findUnique.mockResolvedValue(existingTask);

            const request = new NextRequest('http://localhost:3000/api/tasks/task1', {
                method: 'PUT',
                headers: {
                    authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({}),
            });

            const response = await updateTask(request, { params: Promise.resolve({ id: 'task1' }) });
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.success).toBe(false);
            expect(data.error).toContain('At least one field');
        });

        it('should reject update with invalid status', async () => {
            const existingTask = {
                id: 'task1',
                title: 'Task Title',
                description: 'Task description',
                status: 'PENDING',
                userId: 'user123',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.task.findUnique.mockResolvedValue(existingTask);

            const request = new NextRequest('http://localhost:3000/api/tasks/task1', {
                method: 'PUT',
                headers: {
                    authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    status: 'INVALID_STATUS',
                }),
            });

            const response = await updateTask(request, { params: Promise.resolve({ id: 'task1' }) });
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.success).toBe(false);
            expect(data.error).toContain('PENDING or COMPLETED');
        });

        it('should reject unauthenticated request', async () => {
            const request = new NextRequest('http://localhost:3000/api/tasks/task1', {
                method: 'PUT',
                body: JSON.stringify({
                    title: 'Updated Title',
                }),
            });

            const response = await updateTask(request, { params: Promise.resolve({ id: 'task1' }) });
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data.success).toBe(false);
        });
    });

    describe('DELETE /api/tasks/[id]', () => {
        it('should delete task successfully', async () => {
            const existingTask = {
                id: 'task1',
                title: 'Task to delete',
                description: 'Task description',
                status: 'PENDING',
                userId: 'user123',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.task.findUnique.mockResolvedValue(existingTask);
            mockPrisma.task.delete.mockResolvedValue(existingTask);

            const request = new NextRequest('http://localhost:3000/api/tasks/task1', {
                method: 'DELETE',
                headers: {
                    authorization: `Bearer ${authToken}`,
                },
            });

            const response = await deleteTask(request, { params: Promise.resolve({ id: 'task1' }) });
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(data.message).toBe('Task deleted successfully');
            expect(data.data.id).toBe('task1');
        });

        it('should reject delete for non-existent task', async () => {
            mockPrisma.task.findUnique.mockResolvedValue(null);

            const request = new NextRequest('http://localhost:3000/api/tasks/nonexistent', {
                method: 'DELETE',
                headers: {
                    authorization: `Bearer ${authToken}`,
                },
            });

            const response = await deleteTask(request, { params: Promise.resolve({ id: 'nonexistent' }) });
            const data = await response.json();

            expect(response.status).toBe(404);
            expect(data.success).toBe(false);
            expect(data.error).toContain('not found');
        });

        it('should reject delete for task owned by another user', async () => {
            const existingTask = {
                id: 'task1',
                title: 'Task to delete',
                description: 'Task description',
                status: 'PENDING',
                userId: 'differentUser',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.task.findUnique.mockResolvedValue(existingTask);

            const request = new NextRequest('http://localhost:3000/api/tasks/task1', {
                method: 'DELETE',
                headers: {
                    authorization: `Bearer ${authToken}`,
                },
            });

            const response = await deleteTask(request, { params: Promise.resolve({ id: 'task1' }) });
            const data = await response.json();

            expect(response.status).toBe(403);
            expect(data.success).toBe(false);
            expect(data.error).toContain('permission');
        });

        it('should reject unauthenticated request', async () => {
            const request = new NextRequest('http://localhost:3000/api/tasks/task1', {
                method: 'DELETE',
            });

            const response = await deleteTask(request, { params: Promise.resolve({ id: 'task1' }) });
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data.success).toBe(false);
        });

        it('should handle database errors gracefully', async () => {
            const existingTask = {
                id: 'task1',
                title: 'Task to delete',
                description: 'Task description',
                status: 'PENDING',
                userId: 'user123',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.task.findUnique.mockResolvedValue(existingTask);
            mockPrisma.task.delete.mockRejectedValue(new Error('Database error'));

            const request = new NextRequest('http://localhost:3000/api/tasks/task1', {
                method: 'DELETE',
                headers: {
                    authorization: `Bearer ${authToken}`,
                },
            });

            const response = await deleteTask(request, { params: Promise.resolve({ id: 'task1' }) });
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data.success).toBe(false);
        });
    });
});

