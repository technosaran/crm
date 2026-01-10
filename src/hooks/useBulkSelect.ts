import { useState, useCallback, useMemo } from 'react';

/**
 * Hook to manage bulk selection in lists
 */
export function useBulkSelect<T extends { id: string | number }>(items: T[]) {
    const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

    const isAllSelected = useMemo(() => {
        return items.length > 0 && selectedIds.size === items.length;
    }, [items.length, selectedIds.size]);

    const isPartiallySelected = useMemo(() => {
        return selectedIds.size > 0 && selectedIds.size < items.length;
    }, [items.length, selectedIds.size]);

    const toggleSelectAll = useCallback(() => {
        if (isAllSelected) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(items.map((item) => item.id)));
        }
    }, [items, isAllSelected]);

    const toggleSelectItem = useCallback((id: string | number) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedIds(new Set());
    }, []);

    const selectedCount = selectedIds.size;

    return {
        selectedIds: Array.from(selectedIds),
        isAllSelected,
        isPartiallySelected,
        toggleSelectAll,
        toggleSelectItem,
        clearSelection,
        selectedCount,
        isSelected: (id: string | number) => selectedIds.has(id)
    };
}
