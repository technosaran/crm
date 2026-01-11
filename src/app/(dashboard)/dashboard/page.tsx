'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Users,
    Briefcase,
    CheckCircle2,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Download,
    Calendar,
    Zap,
    Sparkles,
    Search,
    ChevronRight,
    Clock
} from 'lucide-react';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { ConversionFunnel } from '@/components/dashboard/ConversionFunnel';
import { TaskMetrics } from '@/components/dashboard/TaskMetrics';
import { LeaderBoard } from '@/components/dashboard/LeaderBoard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { useDashboardData } from '@/hooks/useDashboardData';
import { cn, formatCurrency } from '@/lib/utils';
import { useGlobalStore } from '@/store/useGlobalStore';

export default function AdvancedDashboard() {
    const { data, loading } = useDashboardData();
    const { currency, locale } = useGlobalStore();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="relative">
                    <div className="h-16 w-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-indigo-500" />
                    </div>
                </div>
                <p className="mt-4 font-bold text-slate-900 font-outfit">Computing CRM Intelligence...</p>
            </div>
        );
    }

    const stats = [
        {
            label: 'TOTAL REVENUE',
            value: formatCurrency(data?.totalRevenue || 0, currency, locale),
            trend: '+12.5%',
            isPositive: true,
            icon: TrendingUp,
            color: 'indigo'
        },
        {
            label: 'WIN RATE',
            value: `${Math.round(data?.winRate || 0)}%`,
            trend: '+4.2%',
            isPositive: true,
            icon: Zap,
            color: 'emerald'
        },
        {
            label: 'ACTIVE LEADS',
            value: data?.funnelData[0]?.value || 0,
            trend: '-2.1%',
            isPositive: false,
            icon: Users,
            color: 'blue'
        },
        {
            label: 'TASKS DONE',
            value: data?.taskMetrics.completed || 0,
            trend: '+18%',
            isPositive: true,
            icon: CheckCircle2,
            color: 'purple'
        },
    ];

    return (
        <div className="space-y-8 pb-12 bg-slate-50/50 min-h-screen -m-8 p-8">
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-md">Enterprise</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">Real-time Intelligence</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight font-outfit">Performance Analytics</h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
                        <button className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-indigo-600 rounded-xl transition-all">Today</button>
                        <button className="px-4 py-2 text-xs font-bold bg-indigo-50 text-indigo-600 rounded-xl transition-all">Month</button>
                        <button className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-indigo-600 rounded-xl transition-all">Year</button>
                    </div>
                    <button className="h-11 px-6 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/10 hover:shadow-indigo-500/20 hover:bg-slate-800 transition-all flex items-center gap-2">
                        <Download size={16} />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 transition-all relative overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn(
                                "p-3 rounded-2xl bg-opacity-10",
                                stat.color === 'indigo' && "bg-indigo-500 text-indigo-600",
                                stat.color === 'emerald' && "bg-emerald-500 text-emerald-600",
                                stat.color === 'blue' && "bg-blue-500 text-blue-600",
                                stat.color === 'purple' && "bg-purple-500 text-purple-600"
                            )}>
                                <stat.icon size={22} />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-[11px] font-black px-2 mt-[-20px] py-1 rounded-full",
                                stat.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                            )}>
                                {stat.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {stat.trend}
                            </div>
                        </div>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                        <h3 className="text-3xl font-black mt-2 text-slate-900 tracking-tight font-outfit">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Revenue Chart */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-black text-slate-800 font-outfit">Revenue Forecasting</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Projected vs Actual Growth</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <div className="h-2 w-2 rounded-full bg-indigo-500" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Revenue</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 flex-1">
                        <SalesChart data={data?.revenueByMonth} />
                    </div>
                </div>

                {/* Conversion Funnel */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50">
                        <h3 className="text-lg font-black text-slate-800 font-outfit">Lead Funnel</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Conversion Efficiency</p>
                    </div>
                    <div className="p-6">
                        <ConversionFunnel data={data?.funnelData} />
                        <div className="mt-6 p-4 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-2">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-indigo-600" />
                                <span className="text-[11px] font-black text-indigo-700 uppercase">AI Insignt</span>
                            </div>
                            <p className="text-xs text-indigo-900 leading-relaxed font-medium">
                                Your pipeline shows a <span className="font-bold">24% drop-off</span> at the Proposal stage. Consider optimizing your proposal templates.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Leaderboard */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-800 font-outfit">Top Performers</h3>
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-md">Real-time</span>
                    </div>
                    <div className="p-6 flex-1">
                        <LeaderBoard reps={data?.topPerformers} />
                    </div>
                    <button className="w-full p-4 text-[11px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-50 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                        View All Sales Reps <ChevronRight size={14} />
                    </button>
                </div>

                {/* Activity Feed */}
                <div className="bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none">
                        <Clock size={120} className="text-white" />
                    </div>
                    <div className="p-6 border-b border-white/5 flex items-center justify-between relative z-10">
                        <h3 className="text-lg font-black text-white font-outfit">Global Activity Pulse</h3>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">Live</span>
                        </div>
                    </div>
                    <div className="p-6 flex-1 overflow-y-auto max-h-[400px] relative z-10 custom-scrollbar">
                        <ActivityFeed />
                    </div>
                </div>

                {/* Task Metrics */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <div className="p-6 border-b border-slate-50">
                        <h3 className="text-lg font-black text-slate-800 font-outfit">Workforce Efficiency</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Task Completion Rate</p>
                    </div>
                    <div className="p-6">
                        <TaskMetrics metrics={data?.taskMetrics} />
                    </div>
                </div>
            </div>
        </div>
    );
}
