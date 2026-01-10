"use client";

import { StatCards } from "@/components/dashboard/StatCards";
import { KanbanView } from "@/components/crm/KanbanView";
import { AuditTrail } from "@/components/shared/AuditTrail";
import { motion } from "framer-motion";
import {
  Calendar,
  Globe,
  Plus,
  ArrowRight,
  Briefcase,
  Sparkles,
  BarChart2,
  Users2
} from "lucide-react";
import { useGlobalStore } from "@/store/useGlobalStore";
import { formatDate, cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { locale, timeZone } = useGlobalStore();
  const { user } = useAuth();

  return (
    <div className="space-y-8 pb-20">
      {/* Executive Command Header - Premium Version */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-1 shadow-lg shadow-indigo-500/10 border border-white/60"
      >
        <div className="relative bg-[#0F172A] rounded-xl overflow-hidden px-6 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12">

          {/* Abstract Background Shapes */}
          <div className="absolute top-0 right-0 w-[500px] h-full bg-gradient-to-l from-indigo-500/20 via-violet-500/10 to-transparent blur-3xl" />
          <div className="absolute -bottom-24 -right-12 w-64 h-64 bg-indigo-500/30 rounded-full blur-[80px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8 z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_0_40px_-10px_rgba(99,102,241,0.6)] ring-4 ring-white/10 flex items-center justify-center text-2xl sm:text-3xl font-bold text-white uppercase font-outfit">
                {user.name.charAt(0)}
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight font-outfit">
                  Good evening, {user.name.split(' ')[0]}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-slate-400 text-sm font-medium">
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-indigo-300 w-fit">
                    <Sparkles size={14} /> Global Administrator
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-500" /> {formatDate(new Date())}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button className="h-12 px-6 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 border border-white/10 transition-all flex items-center justify-center gap-2 backdrop-blur-md">
                <Globe size={18} className="text-indigo-300" />
                <span className="text-sm sm:text-base">{timeZone}</span>
              </button>
              <button className="h-12 px-8 bg-white text-indigo-950 font-bold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95">
                <Plus size={20} className="stroke-[3]" />
                <span className="text-sm sm:text-base">New Record</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <StatCards />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Pipeline (Kanban) */}
        <div className="xl:col-span-2 space-y-6">
          <div className="glass-card flex flex-col min-h-[500px] sm:min-h-[600px] overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-zenith-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white shadow-sm border border-slate-100 rounded-lg text-indigo-600">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight font-outfit">Sales Pipeline</h2>
                  <p className="text-xs text-slate-500 font-medium">Manage and track your active deals</p>
                </div>
              </div>
              <button className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1 w-fit">
                View Reports <ArrowRight size={16} />
              </button>
            </div>
            <div className="p-3 sm:p-4 flex-1 bg-slate-50/30">
              <KanbanView />
            </div>
          </div>
        </div>

        {/* Intelligence & Activity Column */}
        <div className="space-y-6 lg:space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 sm:p-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
              <BarChart2 size={120} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg text-white shadow-lg shadow-indigo-500/20">
                  <Sparkles size={18} />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-800 font-outfit">AI Revenue Intelligence</h3>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm space-y-3">
                  <div className="flex justify-between items-center text-xs font-medium text-slate-500">
                    <span>Forecast Accuracy</span>
                    <span className="text-emerald-600 font-bold">94%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full w-[94%]" />
                  </div>
                  <p className="text-xs text-slate-400 pt-1">Based on last 30 days of closes.</p>
                </div>

                <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm space-y-3">
                  <div className="flex justify-between items-center text-xs font-medium text-slate-500">
                    <span>Revenue Velocity</span>
                    <span className="text-indigo-600 font-bold">High</span>
                  </div>
                  <p className="text-xs text-slate-400">Deals are moving 12% faster than last month.</p>
                </div>

                <button className="w-full py-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-all">
                  View Detailed Forecast
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card flex flex-col"
          >
            <div className="p-4 sm:p-5 border-b border-zenith-border/50 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <Users2 size={18} className="text-slate-500" />
                <h3 className="text-sm font-bold text-slate-800 font-outfit">Recent Activity</h3>
              </div>
            </div>
            <div className="max-h-[300px] sm:max-h-[350px] overflow-y-auto p-2">
              <AuditTrail />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
