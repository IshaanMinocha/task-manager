import { authService } from '../services/authService';
import { taskService } from '../services/taskService';
import api from '../services/api';

jest.mock('../services/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('Services', () => {
    describe('authService', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        describe('register', () => {
            it('should call POST /api/auth/register with correct data', async () => {
                const registerData = {
                    username: 'testuser',
                    password: 'password123',
                };
                const mockResponse = {
                    data: {
                        success: true,
                        data: { id: '1', username: 'testuser' },
                        message: 'User registered successfully',
                    },
                };

                mockedApi.post.mockResolvedValue(mockResponse);

                const result = await authService.register(registerData);

                expect(mockedApi.post).toHaveBeenCalledWith('/api/auth/register', registerData);
                expect(result).toEqual(mockResponse.data);
            });

            it('should handle registration error', async () => {
                const registerData = {
                    username: 'testuser',
                    password: 'password123',
                };

                mockedApi.post.mockRejectedValue(new Error('Registration failed'));

                await expect(authService.register(registerData)).rejects.toThrow('Registration failed');
            });
        });

        describe('login', () => {
            it('should call POST /api/auth/login with correct data', async () => {
                const loginData = {
                    username: 'testuser',
                    password: 'password123',
                };
                const mockResponse = {
                    data: {
                        success: true,
                        data: {
                            token: 'test-token',
                            user: {
                                id: '1',
                                username: 'testuser',
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                            },
                        },
                        message: 'Login successful',
                    },
                };

                mockedApi.post.mockResolvedValue(mockResponse);

                const result = await authService.login(loginData);

                expect(mockedApi.post).toHaveBeenCalledWith('/api/auth/login', loginData);
                expect(result).toEqual(mockResponse.data);
            });

            it('should handle login error', async () => {
                const loginData = {
                    username: 'testuser',
                    password: 'wrongpassword',
                };

                mockedApi.post.mockRejectedValue(new Error('Invalid credentials'));

                await expect(authService.login(loginData)).rejects.toThrow('Invalid credentials');
            });
        });
    });

    describe('taskService', () => {
        const mockTask = {
            id: '1',
            title: 'Test Task',
            description: 'Test Description',
            status: 'PENDING' as const,
            userId: 'user1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        afterEach(() => {
            jest.clearAllMocks();
        });

        describe('getTasks', () => {
            it('should call GET /api/tasks', async () => {
                const mockResponse = {
                    data: {
                        success: true,
                        data: [mockTask],
                        message: 'Tasks retrieved successfully',
                    },
                };

                mockedApi.get.mockResolvedValue(mockResponse);

                const result = await taskService.getTasks();

                expect(mockedApi.get).toHaveBeenCalledWith('/api/tasks');
                expect(result).toEqual(mockResponse.data);
            });

            it('should handle empty task list', async () => {
                const mockResponse = {
                    data: {
                        success: true,
                        data: [],
                        message: 'Tasks retrieved successfully',
                    },
                };

                mockedApi.get.mockResolvedValue(mockResponse);

                const result = await taskService.getTasks();

                expect(result.data).toEqual([]);
            });

            it('should handle error when fetching tasks', async () => {
                mockedApi.get.mockRejectedValue(new Error('Failed to fetch tasks'));

                await expect(taskService.getTasks()).rejects.toThrow('Failed to fetch tasks');
            });
        });

        describe('createTask', () => {
            it('should call POST /api/tasks with correct data', async () => {
                const taskData = {
                    title: 'New Task',
                    description: 'New Description',
                    status: 'PENDING' as const,
                };
                const mockResponse = {
                    data: {
                        success: true,
                        data: { ...mockTask, ...taskData },
                        message: 'Task created successfully',
                    },
                };

                mockedApi.post.mockResolvedValue(mockResponse);

                const result = await taskService.createTask(taskData);

                expect(mockedApi.post).toHaveBeenCalledWith('/api/tasks', taskData);
                expect(result).toEqual(mockResponse.data);
            });

            it('should handle error when creating task', async () => {
                const taskData = {
                    title: 'New Task',
                };

                mockedApi.post.mockRejectedValue(new Error('Failed to create task'));

                await expect(taskService.createTask(taskData)).rejects.toThrow('Failed to create task');
            });
        });

        describe('updateTask', () => {
            it('should call PUT /api/tasks/:id with correct data', async () => {
                const updateData = {
                    title: 'Updated Task',
                    status: 'COMPLETED' as const,
                };
                const mockResponse = {
                    data: {
                        success: true,
                        data: { ...mockTask, ...updateData },
                        message: 'Task updated successfully',
                    },
                };

                mockedApi.put.mockResolvedValue(mockResponse);

                const result = await taskService.updateTask('1', updateData);

                expect(mockedApi.put).toHaveBeenCalledWith('/api/tasks/1', updateData);
                expect(result).toEqual(mockResponse.data);
            });

            it('should handle error when updating task', async () => {
                const updateData = { title: 'Updated Task' };

                mockedApi.put.mockRejectedValue(new Error('Failed to update task'));

                await expect(taskService.updateTask('1', updateData)).rejects.toThrow('Failed to update task');
            });
        });

        describe('deleteTask', () => {
            it('should call DELETE /api/tasks/:id', async () => {
                const mockResponse = {
                    data: {
                        success: true,
                        data: { id: '1' },
                        message: 'Task deleted successfully',
                    },
                };

                mockedApi.delete.mockResolvedValue(mockResponse);

                const result = await taskService.deleteTask('1');

                expect(mockedApi.delete).toHaveBeenCalledWith('/api/tasks/1');
                expect(result).toEqual(mockResponse.data);
            });

            it('should handle error when deleting task', async () => {
                mockedApi.delete.mockRejectedValue(new Error('Failed to delete task'));

                await expect(taskService.deleteTask('1')).rejects.toThrow('Failed to delete task');
            });
        });
    });
});

