import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { toast } from 'sonner';

export interface ActivityLog {
    id: string;
    user_id: string;
    action: string;
    entity_type: string;
    entity_id: string;
    old_values: any;
    new_values: any;
    ip_address: string;
    user_agent: string;
    created_at: string;
    user_profile?: {
        name: string;
        email: string;
    };
}

/**
 * Hook to manage activity and audit logs
 */
export function useActivityLog(entityType?: string, entityId?: string) {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchLogs = async () => {
        try {
            setLoading(true);

            let query = supabase
                .from('audit_logs')
                .select(`
          *,
          user_profile:user_profiles (
            name,
            email
          )
        `)
                .order('created_at', { ascending: false });

            if (entityType && entityId) {
                query = query.eq('entity_type', entityType).eq('entity_id', entityId);
            }

            const { data, error } = await query.limit(50);

            if (error) throw error;
            setLogs(data || []);
        } catch (error: any) {
            console.error('Error fetching audit logs:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Manually log an action (though many should be automated via triggers)
     */
    const logAction = async (log: Partial<ActivityLog>) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            const { error } = await supabase
                .from('audit_logs')
                .insert([{
                    ...log,
                    user_id: user?.id,
                    created_at: new Date().toISOString()
                }]);

            if (error) throw error;
            return true;
        } catch (error: any) {
            console.error('Error creating audit log:', error);
            return false;
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [entityType, entityId]);

    return { logs, loading, logAction, refresh: fetchLogs };
}
