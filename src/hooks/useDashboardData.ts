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
            const now = new Date();
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(now.getMonth() - 5);

            const [
                { data: leads },
                { data: opportunities },
                { data: tasks },
                { data: auditLogs }
            ] = await Promise.all([
                supabase.from('leads').select('id, status, created_at'),
                supabase.from('opportunities').select(`
                    id, 
                    amount, 
                    stage, 
                    created_at, 
                    owner:user_profiles (
                        full_name,
                        avatar_url
                    )
                `),
                supabase.from('tasks').select('id, status, priority, due_date'),
                supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(10)
            ]);

            // Process Leaderboard
            const leaderboardMap = new Map();
            opportunities?.forEach(opp => {
                const owner = Array.isArray(opp.owner) ? opp.owner[0] : opp.owner;
                if (opp.stage === 'CLOSED_WON' && owner) {
                    const ownerName = owner.full_name || 'Unknown User';
                    const current = leaderboardMap.get(ownerName) || { revenue: 0, deals: 0, name: ownerName };
                    current.revenue += (opp.amount || 0);
                    current.deals += 1;
                    leaderboardMap.set(ownerName, current);
                }
            });
            const topPerformers = Array.from(leaderboardMap.values())
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5)
                .map((p, i) => ({ ...p, id: i + 1, growth: '+5%' })); // Growth still mock for now

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

            // Process Revenue / Sales Data
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const revenueByMonthMap = new Map();

            // Initialize last 6 months
            for (let i = 5; i >= 0; i--) {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                revenueByMonthMap.set(months[d.getMonth()], 0);
            }

            opportunities?.forEach(opp => {
                if (opp.stage === 'CLOSED_WON' && opp.created_at) {
                    const date = new Date(opp.created_at);
                    const monthName = months[date.getMonth()];
                    if (revenueByMonthMap.has(monthName)) {
                        revenueByMonthMap.set(monthName, (revenueByMonthMap.get(monthName) || 0) + (opp.amount || 0));
                    }
                }
            });

            const revenueByMonth = Array.from(revenueByMonthMap.entries()).map(([name, revenue]) => ({
                name,
                revenue
            }));

            setData({
                topPerformers,
                revenueByMonth,
                funnelData,
                taskMetrics,
                recentActivities: auditLogs || [],
                totalRevenue: opportunities?.filter(o => o.stage === 'CLOSED_WON').reduce((sum, o) => sum + (o.amount || 0), 0) || 0,
                winRate: opportunities?.length
                    ? (opportunities.filter(o => o.stage === 'CLOSED_WON').length / opportunities.length) * 100
                    : 0,
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
