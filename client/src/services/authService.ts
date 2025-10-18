import api from './api';
import type { LoginRequest, RegisterRequest, LoginResponse, ApiResponse } from '../types';

export const authService = {
    register: async (data: RegisterRequest): Promise<ApiResponse<{ id: string; username: string }>> => {
        const response = await api.post<ApiResponse<{ id: string; username: string }>>(
            '/api/auth/register',
            data
        );
        return response.data;
    },

    login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
        const response = await api.post<ApiResponse<LoginResponse>>('/api/auth/login', data);
        return response.data;
    },
};