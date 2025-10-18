import { z } from 'zod';

export const loginSchema = z.object({
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(50, 'Username must be less than 50 characters'),
    password: z
        .string()
        .min(4, 'Password must be at least 4 characters')
        .max(100, 'Password must be less than 100 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
    .object({
        username: z
            .string()
            .min(3, 'Username must be at least 3 characters')
            .max(50, 'Username must be less than 50 characters'),
        password: z
            .string()
            .min(4, 'Password must be at least 4 characters')
            .max(100, 'Password must be less than 100 characters'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const taskSchema = z.object({
    title: z
        .string()
        .min(3, 'Title must be at least 3 characters')
        .max(200, 'Title must be less than 200 characters'),
    description: z
        .string()
        .max(1000, 'Description must be less than 1000 characters')
        .optional()
        .or(z.literal('')),
    status: z.enum(['PENDING', 'COMPLETED']).optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;