"use client";

import { LeadTable } from "@/components/leads/LeadTable";
import { motion } from "framer-motion";
import { UserPlus, TrendingUp, Target } from "lucide-react";

export default function LeadsPage() {
    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold tracking-tight outfit"
                    >
                        Leads Management
                    </motion.h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Track, qualify, and convert your potential customers.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {[
                    { label: 'Total Leads', value: '1,284', icon: UserPlus, color: 'text-blue-500' },
                    { label: 'Conversion Rate', value: '15.2%', icon: TrendingUp, color: 'text-emerald-500' },
                    { label: 'Avg. Lead Quality', value: '78/100', icon: Target, color: 'text-amber-500' },
                ].map((stat, i) => (
                    <div key={i} className="rounded-xl border border-border bg-card p-4 flex items-center justify-between shadow-sm">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                            <h3 className="text-xl font-bold mt-1 tracking-tight">{stat.value}</h3>
                        </div>
                        <div className={`p-2 rounded-lg bg-muted/50 ${stat.color}`}>
                            <stat.icon size={20} />
                        </div>
                    </div>
                ))}
            </div>

            <LeadTable />
        </div>
    );
}
