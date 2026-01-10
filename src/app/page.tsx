"use client";

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
  Users2,
  TrendingUp,
  CheckCircle2,
  Clock,
  Target
} from "lucide-react";
import { useGlobalStore } from "@/store/useGlobalStore";
import { formatDate, formatCurrency, cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useOpportunities } from "@/hooks/useOpportunities";
import { useTasks } from "@/hooks/useTasks";
import { useCases } from "@/hooks/useCases";
import { useMemo } from "react";
import Link from "next/link";

export default function Dashboard() {
  const { locale, timeZone, currency } = useGlobalStore();
  const { user } = useAuth();
  const { opportunities, loading: oppsLoading } = useOpportunities();
  const { tasks, loading: tasksLoading } = useTasks();
  const { cases } = useCases();

  // Calculate stats
  const stats = useMemo(() => {
    const openOpps = opportunities.filter(o => !['CLOSED_WON', 'CLOSED_LOST'].includes(o.stage));
    const wonOpps = opportunities.filter(o => o.stage === 'CLOSED_WON');
    const pipeline = openOpps.reduce((sum, o) => sum + (o.amount || 0), 0);
    const wonAmount = wonOpps.reduce((sum, o) => sum + (o.amount || 0), 0);
    
    const openTasks = tasks.filter(t => t.status !== 'COMPLETED');
    const overdueTasks = tasks.filter(t => {
      if (!t.due_date || t.status === 'COMPLETED') return false;
      return new Date(t.due_date) < new Date();
    });
    
    const openCases = cases.filter(c => !['CLOSED', 'RESOLVED'].includes(c.status));
    const criticalCases = cases.filter(c => c.priority === 'CRITICAL' && !['CLOSED', 'RESOLVED'].includes(c.status));
    
    return {
      pipeline,
      wonAmount,
      openOpps: openOpps.length,
      wonOpps: wonOpps.length,
      openTasks: openTasks.length,
      overdueTasks: overdueTasks.length,
      openCases: openCases.length,
      criticalCases: criticalCases.length,
    };
  }, [opportunities, tasks, cases]);

  // Get recent items
  const recentOpportunities = useMemo(() => {
    return [...opportunities]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  }, [opportunities]);

  const upcomingTasks = useMemo(() => {
    return tasks
      .filter(t => t.status !== 'COMPLETED' && t.due_date)
      .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
      .slice(0, 5);
  }, [tasks]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Executive Command Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-1 shadow-lg shadow-indigo-500/10 border border-white/60"
      >
        <div className="relative bg-[#0F172A] rounded-xl overflow-hidden px-6 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12">
          <div className="absolute top-0 right-0 w-[500px] h-full bg-gradient-to-l from-indigo-500/20 via-violet-500/10 to-transparent blur-3xl" />
          <div className="absolute -bottom-24 -right-12 w-64 h-64 bg-indigo-500/30 rounded-full blur-[80px]" />

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8 z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_0_40px_-10px_rgba(99,102,241,0.6)] ring-4 ring-white/10 flex items-center justify-center text-2xl sm:text-3xl font-bold text-white uppercase font-outfit">
                {user.name.charAt(0)}
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight font-outfit">
                  {getGreeting()}, {user.name.split(' ')[0]}
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
              <Link href="/leads" className="h-12 px-8 bg-white text-indigo-950 font-bold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95">
                <Plus size={20} className="stroke-[3]" />
                <span className="text-sm sm:text-base">New Lead</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-sf-border rounded-[4px] p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pipeline Value</p>
          <p className="text-[22px] font-bold text-slate-800 mt-1">{formatCurrency(stats.pipeline, currency, locale)}</p>
          <p className="text-[11px] text-slate-400 mt-1">{stats.openOpps} open opportunities</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-sf-border rounded-[4px] p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Target size={18} />
            </div>
          </div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Closed Won</p>
          <p className="text-[22px] font-bold text-emerald-600 mt-1">{formatCurrency(stats.wonAmount, currency, locale)}</p>
          <p className="text-[11px] text-slate-400 mt-1">{stats.wonOpps} deals closed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-sf-border rounded-[4px] p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Open Tasks</p>
          <p className="text-[22px] font-bold text-slate-800 mt-1">{stats.openTasks}</p>
          {stats.overdueTasks > 0 && (
            <p className="text-[11px] text-red-500 mt-1 font-bold">{stats.overdueTasks} overdue</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-sf-border rounded-[4px] p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <Users2 size={18} />
            </div>
          </div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Open Cases</p>
          <p className="text-[22px] font-bold text-slate-800 mt-1">{stats.openCases}</p>
          {stats.criticalCases > 0 && (
            <p className="text-[11px] text-red-500 mt-1 font-bold">{stats.criticalCases} critical</p>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Recent Opportunities */}
        <div className="xl:col-span-2 space-y-6">
          <div className="glass-card flex flex-col overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-zenith-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white shadow-sm border border-slate-100 rounded-lg text-indigo-600">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight font-outfit">Recent Opportunities</h2>
                  <p className="text-xs text-slate-500 font-medium">Latest deals in your pipeline</p>
                </div>
              </div>
              <Link href="/opportunities" className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1 w-fit">
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="p-4">
              {oppsLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-sf-gray/50 rounded animate-pulse" />
                  ))}
                </div>
              ) : recentOpportunities.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase size={40} className="mx-auto text-slate-200 mb-3" />
                  <p className="text-[13px] text-slate-500">No opportunities yet</p>
                  <Link href="/opportunities" className="sf-btn-primary mt-4 inline-flex">
                    Create Opportunity
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOpportunities.map((opp) => (
                    <Link
                      key={opp.id}
                      href="/opportunities"
                      className="flex items-center justify-between p-4 bg-white border border-sf-border rounded-lg hover:border-sf-blue/30 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                          {(opp.name || 'UN').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 group-hover:text-sf-blue transition-colors">{opp.name || 'Untitled'}</p>
                          <p className="text-[11px] text-slate-400">{opp.account_name || 'No Account'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">{formatCurrency(opp.amount || 0, currency, locale)}</p>
                        <p className="text-[10px] text-slate-400 uppercase">{opp.stage.replace('_', ' ')}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="glass-card flex flex-col overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-zenith-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white shadow-sm border border-slate-100 rounded-lg text-emerald-600">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight font-outfit">Upcoming Tasks</h2>
                  <p className="text-xs text-slate-500 font-medium">Tasks due soon</p>
                </div>
              </div>
              <Link href="/tasks" className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1 w-fit">
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="p-4">
              {tasksLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-14 bg-sf-gray/50 rounded animate-pulse" />
                  ))}
                </div>
              ) : upcomingTasks.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 size={40} className="mx-auto text-slate-200 mb-3" />
                  <p className="text-[13px] text-slate-500">No upcoming tasks</p>
                  <Link href="/tasks" className="sf-btn-primary mt-4 inline-flex">
                    Create Task
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {upcomingTasks.map((task) => {
                    const isOverdue = task.due_date && new Date(task.due_date) < new Date();
                    return (
                      <Link
                        key={task.id}
                        href="/tasks"
                        className="flex items-center justify-between p-3 bg-white border border-sf-border rounded-lg hover:border-sf-blue/30 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center",
                            isOverdue ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"
                          )}>
                            <Clock size={16} />
                          </div>
                          <span className="font-medium text-slate-700 group-hover:text-sf-blue transition-colors text-[13px]">
                            {task.subject}
                          </span>
                        </div>
                        <span className={cn(
                          "text-[11px] font-bold",
                          isOverdue ? "text-red-500" : "text-slate-400"
                        )}>
                          {task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
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
                    <span>Pipeline Health</span>
                    <span className="text-emerald-600 font-bold">
                      {stats.openOpps > 0 ? 'Active' : 'Empty'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div 
                      className="bg-emerald-500 h-1.5 rounded-full transition-all" 
                      style={{ width: `${Math.min(stats.openOpps * 10, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 pt-1">
                    {stats.openOpps} active opportunities in pipeline
                  </p>
                </div>

                <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm space-y-3">
                  <div className="flex justify-between items-center text-xs font-medium text-slate-500">
                    <span>Task Completion</span>
                    <span className="text-indigo-600 font-bold">
                      {tasks.length > 0 
                        ? `${Math.round((tasks.filter(t => t.status === 'COMPLETED').length / tasks.length) * 100)}%`
                        : '0%'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {stats.openTasks} tasks remaining this period
                  </p>
                </div>

                <Link 
                  href="/analytics"
                  className="w-full py-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-all flex items-center justify-center gap-2"
                >
                  View Analytics <ArrowRight size={14} />
                </Link>
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
