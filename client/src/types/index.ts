export interface User {
    id: string;
    username: string;
    createdAt: string;
    updatedAt: string;
}

export type TaskStatus = 'PENDING' | 'COMPLETED';

export interface Task {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

export interface TaskState {
    tasks: Task[];
    selectedTask: Task | null;
    loading: boolean;
    error: string | null;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
}

export interface CreateTaskRequest {
    title: string;
    description?: string;
    status?: TaskStatus;
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    status?: TaskStatus;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface JWTPayload {
    userId: string;
    username: string;
}