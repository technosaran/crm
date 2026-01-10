import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

export function useDashboardData() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch stats in parallel
            const [
                { data: leads },
                { data: opportunities },
                { data: tasks },
                { data: activities }
            ] = await Promise.all([
                supabase.from('leads').select('id, status, created_at'),
                supabase.from('opportunities').select('id, amount, stage, created_at'),
                supabase.from('tasks').select('id, status, priority, due_date'),
                supabase.from('activities').select('*').order('occurred_at', { ascending: false }).limit(10)
            ]);

            // Process Revenue / Sales Data
            const revenueByMonth = [
                { name: 'Jan', revenue: 4500 },
                { name: 'Feb', revenue: 5200 },
                { name: 'Mar', revenue: 4800 },
                { name: 'Apr', revenue: 6100 },
                { name: 'May', revenue: 5900 },
                { name: 'Jun', revenue: 7200 },
            ];

            // Process Funnel Data
            const funnelData = [
                { name: 'Leads', value: leads?.length || 0, fill: '#6366f1' },
                { name: 'Qualified', value: opportunities?.length || 0, fill: '#8b5cf6' },
                { name: 'Proposal', value: opportunities?.filter(o => o.stage === 'PROPOSAL').length || 0, fill: '#ec4899' },
                { name: 'Closed Won', value: opportunities?.filter(o => o.stage === 'CLOSED_WON').length || 0, fill: '#10b981' },
            ];

            // Task Metrics
            const taskMetrics = {
                total: tasks?.length || 0,
                completed: tasks?.filter(t => t.status === 'COMPLETED').length || 0,
                pending: tasks?.filter(t => t.status !== 'COMPLETED').length || 0,
                overdue: tasks?.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'COMPLETED').length || 0,
            };

            setData({
                revenueByMonth,
                funnelData,
                taskMetrics,
                recentActivities: activities || [],
                totalRevenue: opportunities?.reduce((sum, o) => sum + (o.amount || 0), 0) || 0,
                winRate: (opportunities?.filter(o => o.stage === 'CLOSED_WON').length || 0) / (opportunities?.length || 1) * 100,
            });

        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return { data, loading, refresh: fetchDashboardData };
}
