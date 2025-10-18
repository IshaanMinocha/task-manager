import api from './api';
import type { Task, CreateTaskRequest, UpdateTaskRequest, ApiResponse } from '../types';

export const taskService = {
    getTasks: async (): Promise<ApiResponse<Task[]>> => {
        const response = await api.get<ApiResponse<Task[]>>('/api/tasks');
        return response.data;
    },

    createTask: async (data: CreateTaskRequest): Promise<ApiResponse<Task>> => {
        const response = await api.post<ApiResponse<Task>>('/api/tasks', data);
        return response.data;
    },

    updateTask: async (id: string, data: UpdateTaskRequest): Promise<ApiResponse<Task>> => {
        const response = await api.put<ApiResponse<Task>>(`/api/tasks/${id}`, data);
        return response.data;
    },

    deleteTask: async (id: string): Promise<ApiResponse<{ id: string }>> => {
        const response = await api.delete<ApiResponse<{ id: string }>>(`/api/tasks/${id}`);
        return response.data;
    },
};