import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

export function successResponse<T>(
    data: T,
    message?: string,
    status: number = 200
): NextResponse<ApiResponse<T>> {
    return NextResponse.json(
        {
            success: true,
            data,
            message,
        },
        { status }
    );
}

export function errorResponse(
    error: string,
    status: number = 400
): NextResponse<ApiResponse> {
    return NextResponse.json(
        {
            success: false,
            error,
        },
        { status }
    );
}

export const ErrorResponses = {
    badRequest: (message: string = 'Bad request') => errorResponse(message, 400),
    invalidInput: (message: string = 'Invalid input provided') => errorResponse(message, 400),
    missingFields: (fields: string[]) =>
        errorResponse(`Missing required fields: ${fields.join(', ')}`, 400),

    unauthorized: (message: string = 'Unauthorized - Please login') =>
        errorResponse(message, 401),
    invalidToken: () => errorResponse('Invalid or expired token', 401),
    missingToken: () => errorResponse('No authorization token provided', 401),

    forbidden: (message: string = 'Forbidden - You do not have permission') =>
        errorResponse(message, 403),

    notFound: (resource: string = 'Resource') =>
        errorResponse(`${resource} not found`, 404),

    conflict: (message: string = 'Resource already exists') =>
        errorResponse(message, 409),

    serverError: (message: string = 'Internal server error') =>
        errorResponse(message, 500),
};