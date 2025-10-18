import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { getToken, removeToken } from '../utils/auth';
import { consts } from '../utils/consts';

const api = axios.create({
    baseURL: consts.api.baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError<{ error?: string; message?: string }>) => {
        if (error.response?.status === 401) {
            removeToken();
            window.location.href = '/login';
        }

        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            'An unexpected error occurred';

        return Promise.reject(new Error(errorMessage));
    }
);

export default api;