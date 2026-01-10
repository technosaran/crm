import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ErrorBoundary } from '../ErrorBoundary';

const ProblemChild = () => {
    throw new Error('Explosion!');
};

describe('ErrorBoundary', () => {
    it('should catch errors and display fallback UI', () => {
        // Suppress console.error for this test
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        render(
            <ErrorBoundary>
                <ProblemChild />
            </ErrorBoundary>
        );

        expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
        expect(screen.getByText(/Try Again/i)).toBeInTheDocument();

        consoleSpy.mockRestore();
    });

    it('should render children normally if there is no error', () => {
        render(
            <ErrorBoundary>
                <div>Safe Content</div>
            </ErrorBoundary>
        );

        expect(screen.getByText('Safe Content')).toBeInTheDocument();
    });
});
