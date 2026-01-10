import { createClient } from './supabase';
import { toast } from 'sonner';

/**
 * Custom error type for API responses
 */
export interface ApiError {
    message: string;
    code?: string;
    status?: number;
    details?: string;
}

/**
 * Standard API response structure
 */
export interface ApiResponse<T> {
    data: T | null;
    error: ApiError | null;
}

/**
 * Centralized API Client for Zenith CRM
 * Handles unified error handling, toast notifications, and retry logic for Supabase calls.
 */
export class ApiClient {
    private static supabase = createClient();

    /**
     * Processes a Supabase response, handles errors, and displays toast notifications.
     * @param promise The Supabase query promise
     * @param successMessage Optional message to show on success
     * @returns The data from the response or null if an error occurred
     */
    private static async processResponse<T>(
        promise: Promise<{ data: T | null; error: any }>,
        successMessage?: string
    ): Promise<T | null> {
        try {
            const { data, error } = await promise;

            if (error) {
                this.handleError(error);
                return null;
            }

            if (successMessage) {
                toast.success(successMessage);
            }

            return data;
        } catch (err: any) {
            this.handleError(err);
            return null;
        }
    }

    /**
     * Centralized error handler
     */
    private static handleError(error: any): void {
        const apiError: ApiError = {
            message: error.message || 'An unexpected error occurred',
            code: error.code,
            status: error.status,
            details: error.details,
        };

        console.error('[Zenith CRM API Error]:', apiError);

        // Provide user-friendly toast notification
        toast.error('Operation Failed', {
            description: apiError.message,
        });
    }

    /**
     * Executes a Supabase operation with built-in retry logic.
     * @param operation A function that returns a Supabase promise
     * @param options Configuration for the request
     */
    static async execute<T>(
        operation: () => any,
        options: {
            successMessage?: string;
            retries?: number;
            delay?: number;
        } = {}
    ): Promise<T | null> {
        const { successMessage, retries = 1, delay = 1000 } = options;
        let attempt = 0;

        while (attempt <= retries) {
            try {
                const { data, error } = await operation();

                if (!error) {
                    if (successMessage) toast.success(successMessage);
                    return data;
                }

                // If it's a transient error (e.g. network), we might want to retry
                // For now, retry all until max attempts
                if (attempt === retries) {
                    this.handleError(error);
                    return null;
                }

                attempt++;
                await new Promise(resolve => setTimeout(resolve, delay * attempt));
            } catch (err: any) {
                if (attempt === retries) {
                    this.handleError(err);
                    return null;
                }
                attempt++;
                await new Promise(resolve => setTimeout(resolve, delay * attempt));
            }
        }

        return null;
    }

    /**
     * Helper for GET requests
     */
    static async get<T>(
        table: string,
        query: (supabase: any) => any,
        options = {}
    ): Promise<T | null> {
        return this.execute<T>(() => query(this.supabase.from(table)), options);
    }

    /**
     * Helper for POST/INSERT requests
     */
    static async post<T>(
        table: string,
        data: any,
        options: { successMessage?: string } = { successMessage: 'Created successfully' }
    ): Promise<T | null> {
        return this.execute<T>(() => this.supabase.from(table).insert(data).select().single(), options);
    }

    /**
     * Helper for PATCH/UPDATE requests
     */
    static async patch<T>(
        table: string,
        id: string | number,
        data: any,
        options: { successMessage?: string } = { successMessage: 'Updated successfully' }
    ): Promise<T | null> {
        return this.execute<T>(() => this.supabase.from(table).update(data).eq('id', id).select().single(), options);
    }

    /**
     * Helper for DELETE requests
     */
    static async delete(
        table: string,
        id: string | number,
        options: { successMessage?: string } = { successMessage: 'Deleted successfully' }
    ): Promise<boolean> {
        const result = await this.execute(() => this.supabase.from(table).delete().eq('id', id), options);
        return result !== null;
    }
}

export const api = ApiClient;
