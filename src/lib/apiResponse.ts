import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

/**
 * Standard API Response structure
 */
export class ApiResponse {
    static success(data: any, message: string = 'Success', status: number = 200) {
        return NextResponse.json({
            success: true,
            data,
            message,
            timestamp: new Date().toISOString()
        }, { status });
    }

    static error(message: string = 'Internal Server Error', status: number = 500, errors: any = null) {
        return NextResponse.json({
            success: false,
            message,
            errors,
            timestamp: new Date().toISOString()
        }, { status });
    }

    static handle(error: any) {
        console.error('[API Error]:', error);

        if (error instanceof ZodError) {
            return this.error('Validation failed', 400, error.issues);
        }

        if (error.code && typeof error.code === 'string' && error.code.startsWith('P')) {
            return this.error('Database operation failed', 400, error.message);
        }

        return this.error(error.message || 'An unexpected error occurred', error.status || 500);
    }
}
