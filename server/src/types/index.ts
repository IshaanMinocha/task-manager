export interface User {
    id: string;
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserResponse {
    id: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Task {
    id: string;
    title: string;
    description: string | null;
    status: 'PENDING' | 'COMPLETED';
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface RegisterRequest {
    username: string;
    password: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: UserResponse;
}

export interface CreateTaskRequest {
    title: string;
    description?: string;
    status?: 'PENDING' | 'COMPLETED';
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    status?: 'PENDING' | 'COMPLETED';
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface JWTPayload {
    userId: string;
    username: string;
}