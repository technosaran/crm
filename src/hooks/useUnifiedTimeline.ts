import { useState, useEffect, useMemo } from 'react';
import { useAuditLogs, AuditLog } from './useAuditLogs';
import { useCollaboration, Comment } from './useCollaboration';

export type TimelineItem = {
    id: string;
    type: 'LOG' | 'COMMENT';
    timestamp: string;
    data: any;
};

/**
 * Hook to aggregate all contextual events into a single unified timeline.
 */
export function useUnifiedTimeline(entityType: string, entityId: string) {
    const { logs, loading: loadingLogs } = useAuditLogs(entityType, entityId);
    const { comments, loading: loadingComments } = useCollaboration(entityType, entityId);

    const unifiedTimeline = useMemo(() => {
        const items: TimelineItem[] = [
            ...logs.map(l => ({ id: l.id, type: 'LOG' as const, timestamp: l.created_at, data: l })),
            ...comments.map(c => ({ id: c.id, type: 'COMMENT' as const, timestamp: c.created_at, data: c }))
        ];

        return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [logs, comments]);

    const loading = loadingLogs || loadingComments;

    return { timeline: unifiedTimeline, loading };
}
