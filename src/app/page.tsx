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
    <div className="space-y-6 pb-20">
      {/* Executive Command Header */}
      <div className="bg-[#001639] text-white rounded-[4px] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#00A1E0]/20 to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#00A1E0]/10 rounded-full blur-3xl" />

        <div className="relative p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-[#0176D3] to-[#00A1E0] flex items-center justify-center text-3xl font-bold shadow-[0_0_30px_rgba(1,118,211,0.5)] ring-4 ring-white/10 uppercase">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name.split(' ')[0]}</h1>
                <div className="px-3 py-1 bg-white/10 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
                  {user.role}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-sm text-blue-200/80 font-medium">
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-blue-400" />
                  {timeZone}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-blue-400" />
                  {formatDate(new Date())}
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-amber-400" />
                  ZI Intelligence is active
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-6 py-3 bg-white text-[#001639] font-bold rounded-lg shadow-xl hover:bg-blue-50 transition-all flex items-center gap-2 scale-95 hover:scale-100">
              <Plus size={18} />
              Quick Create
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Pipeline (Kanban) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-sf-border rounded-[4px] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            <div className="p-4 border-b border-sf-border flex items-center justify-between bg-sf-gray/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-md">
                  <Briefcase size={18} />
                </div>
                <h2 className="text-[16px] font-bold text-slate-800 tracking-tight">Sales Pipeline Velocity</h2>
              </div>
              <button className="text-[12px] font-bold text-sf-blue hover:underline flex items-center gap-1">
                Configure Stages <ArrowRight size={14} />
              </button>
            </div>
            <div className="p-4 flex-1">
              <KanbanView />
            </div>
          </div>
        </div>

        {/* Intelligence & Activity Column */}
        <div className="space-y-6">
          <div className="bg-white border border-sf-border rounded-[4px] p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <BarChart2 size={80} />
            </div>
            <h3 className="text-[15px] font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Sparkles size={18} className="text-[#0176D3]" /> AI Revenue Insights
            </h3>
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                <div className="h-12 w-12 bg-sf-gray rounded-full flex items-center justify-center text-slate-300">
                  <BarChart2 size={24} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-slate-700">Predictive Engine Ready</p>
                  <p className="text-[11px] text-slate-400 max-w-[200px] mx-auto">ZI requires at least 15 closed deals to begin revenue forecasting.</p>
                </div>
              </div>
              <button className="w-full py-2 bg-sf-gray border border-sf-border rounded text-[11px] font-bold text-slate-500 hover:bg-white transition-all">
                Enable Historical Import
              </button>
            </div>
          </div>

          <div className="bg-white border border-sf-border rounded-[4px] shadow-sm flex flex-col">
            <div className="p-4 border-b border-sf-border flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <Users2 size={18} className="text-slate-500" />
                <h3 className="text-[14px] font-bold text-slate-800">Recent System Activity</h3>
              </div>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              <AuditTrail />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
