'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // You can also log the error to an error reporting service
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        // Attempt to recover by refreshing the page or simple reset
        if (typeof window !== 'undefined') {
            window.location.reload();
        }
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-2xl backdrop-blur-xl transition-all duration-500 animate-in fade-in zoom-in-95">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-rose-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
                        <div className="relative z-10 p-5 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-100 dark:border-rose-800/40">
                            <AlertTriangle className="h-12 w-12 text-rose-500" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                        Something went wrong
                    </h2>

                    <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8 leading-relaxed text-lg">
                        We've encountered an unexpected error. Don't worry, our team has been notified and we're on it.
                    </p>

                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl mb-10 w-full max-w-lg border border-slate-200/50 dark:border-slate-800/50 font-mono text-left group overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 rounded-full" />
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold mb-2 uppercase tracking-wider">Error Details</p>
                        <p className="text-sm text-rose-600 dark:text-rose-400 break-words leading-relaxed">
                            {this.state.error?.name}: {this.state.error?.message || 'An unknown error occurred within the application.'}
                        </p>
                    </div>

                    <button
                        onClick={this.handleReset}
                        className="group relative flex items-center justify-center gap-3 px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl hover:shadow-indigo-500/25 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                        <RefreshCw className="h-5 w-5 transition-transform group-hover:rotate-180 duration-700" />
                        <span className="relative z-10">Try Again</span>
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
