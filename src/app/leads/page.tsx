"use client";

import { LeadTable } from "@/components/leads/LeadTable";
import { motion } from "framer-motion";
import { UserPlus, TrendingUp, Target } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { cn } from "@/lib/utils";

export default function LeadsPage() {
    const { stats, loading } = useAnalytics();

    const leadStats = [
        {
            label: 'Total Leads',
            value: loading ? '...' : stats?.dataCounts.leads.toLocaleString(),
            icon: UserPlus,
            color: 'text-blue-500',
            bg: 'bg-blue-50'
        },
        {
            label: 'Conversion Rate',
            value: loading ? '...' : `${Math.round(stats?.conversionRate || 0)}%`,
            icon: TrendingUp,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50'
        },
        {
            label: 'Avg. Lead Quality',
            value: loading ? '...' : 'Premium', // Custom logic could be added here
            icon: Target,
            color: 'text-amber-500',
            bg: 'bg-amber-50'
        },
    ];

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-black tracking-tight text-slate-900 font-outfit"
                    >
                        Leads Intelligence
                    </motion.h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-slate-500 text-sm font-medium">
                            Synthesizing live data streams for {stats?.dataCounts.leads || 0} entities
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {leadStats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="rounded-3xl border border-slate-100 bg-white p-6 flex items-center justify-between shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-default"
                    >
                        <div>
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-2xl font-black mt-1 tracking-tight text-slate-900 font-outfit">{stat.value}</h3>
                        </div>
                        <div className={cn("p-3 rounded-2xl", stat.bg, stat.color)}>
                            <stat.icon size={24} />
                        </div>
                    </motion.div>
                ))}
            </div>

            <LeadTable />
        </div>
    );
}
