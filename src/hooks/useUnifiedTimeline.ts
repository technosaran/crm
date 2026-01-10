import { useState, useEffect, useMemo } from 'react';
import { useActivities, Activity } from './useActivities';
import { useActivityLog, ActivityLog } from './useActivityLog';
import { useCollaboration, Comment } from './useCollaboration';

export type TimelineItem = {
    id: string;
    type: 'ACTIVITY' | 'LOG' | 'COMMENT';
    timestamp: string;
    data: any;
};

/**
 * Hook to aggregate all contextual events into a single unified timeline.
 */
export function useUnifiedTimeline(entityType: string, entityId: string) {
    const { activities, loading: loadingActivities } = useActivities(entityType as any, entityId);
    const { logs, loading: loadingLogs } = useActivityLog(entityType, entityId);
    const { comments, loading: loadingComments } = useCollaboration(entityType, entityId);

    const unifiedTimeline = useMemo(() => {
        const items: TimelineItem[] = [
            ...activities.map(a => ({ id: a.id, type: 'ACTIVITY' as const, timestamp: a.occurred_at, data: a })),
            ...logs.map(l => ({ id: l.id, type: 'LOG' as const, timestamp: l.created_at, data: l })),
            ...comments.map(c => ({ id: c.id, type: 'COMMENT' as const, timestamp: c.created_at, data: c }))
        ];

        return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [activities, logs, comments]);

    const loading = loadingActivities || loadingLogs || loadingComments;

    return { timeline: unifiedTimeline, loading };
}
