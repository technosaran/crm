import { useState, useEffect, useCallback } from 'react';
import { searchEngine, SearchResult } from '@/lib/search/searchEngine';
import { useDebounce } from '@/hooks/useDebounce'; // Assuming this might exist or creating if not

/**
 * Custom hook for managing global search logic
 */
export function useGlobalSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Keyboard shortcut listener (Cmd+K)
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const performSearch = useCallback(async (q: string) => {
        if (q.trim().length < 2) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const data = await searchEngine.globalSearch(q);
            setResults(data);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Simple manual debounce for now since we don't know if useDebounce exists
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query) performSearch(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query, performSearch]);

    return {
        query,
        setQuery,
        results,
        loading,
        isOpen,
        setIsOpen,
    };
}
