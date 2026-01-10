import { useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useNotificationStore } from '@/store/notificationStore';
import { toast } from 'sonner';

/**
 * Hook to handle real-time notifications from Supabase
 */
export function useNotifications() {
    const { addNotification } = useNotificationStore();
    const supabase = createClient();

    useEffect(() => {
        // Listen to changes in several tables to trigger notifications
        const channel = supabase
            .channel('realtime_notifications')
            // Notify when a new task is assigned
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'tasks' },
                (payload) => {
                    console.log('Task Change received!', payload);
                    addNotification({
                        title: 'New Task Assigned',
                        message: payload.new.subject,
                        type: 'info',
                        href: '/tasks'
                    });
                    toast.info('New Task Assigned', {
                        description: payload.new.subject
                    });
                }
            )
            // Notify when a lead status changes
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'leads' },
                (payload) => {
                    if (payload.old.status !== payload.new.status) {
                        addNotification({
                            title: 'Lead Status Updated',
                            message: `${payload.new.first_name} ${payload.new.last_name} is now ${payload.new.status}`,
                            type: 'success',
                            href: `/leads/${payload.new.id}`
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, addNotification]);

    return null;
}
