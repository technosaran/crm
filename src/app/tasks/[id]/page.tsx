"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    ChevronLeft,
    CheckCircle2,
    Calendar,
    Clock,
    AlertTriangle,
    User,
    Tag,
    Share2,
    RefreshCw,
    MoreVertical,
    CheckCircle,
    Circle,
    Flag,
    FileText,
    MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTasks } from "@/hooks/useTasks";
import { CommentSection } from "@/components/shared/CommentSection";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { toast } from "sonner";

export default function TaskDetail() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const { getTaskById, completeTask, updateTask } = useTasks();
    const [task, setTask] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [completing, setCompleting] = useState(false);

    const loadTask = async () => {
        setLoading(true);
        const data = await getTaskById(id);
        if (data) setTask(data);
        setLoading(false);
    };

    useEffect(() => {
        if (id) loadTask();
    }, [id]);

    const handleComplete = async () => {
        setCompleting(true);
        const success = await completeTask(parseInt(id));
        if (success) {
            toast.success("Task marked as complete");
            loadTask();
        }
        setCompleting(false);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
                <RefreshCw size={24} className="animate-spin mb-2" />
                <p className="text-sm font-black tracking-widest uppercase">Syncing Activity...</p>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Activity Record Not Found</h2>
                <Link href="/tasks" className="text-sf-blue hover:underline mt-2 font-bold">Return to Task List</Link>
            </div>
        );
    }

    const isCompleted = task.status === 'COMPLETED';

    return (
        <div className="flex flex-col gap-6 pb-12 animate-in fade-in duration-500">
            {/* Minimalist Professional Header */}
            <div className="bg-white border border-sf-border rounded-[4px] p-6 shadow-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleComplete}
                            disabled={isCompleted || completing}
                            className={cn(
                                "h-12 w-12 rounded-full flex items-center justify-center transition-all shrink-0",
                                isCompleted
                                    ? "bg-emerald-100 text-emerald-600 cursor-default"
                                    : "bg-slate-50 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 border border-slate-200"
                            )}
                        >
                            {isCompleted ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                        </button>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <button
                                    onClick={() => router.back()}
                                    className="p-1 hover:bg-slate-100 rounded transition-all text-slate-400"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Task Detail • ID {task.id}</span>
                                <StatusBadge status={task.status} type="task" />
                            </div>
                            <h1 className={cn(
                                "text-2xl font-bold tracking-tight leading-tight",
                                isCompleted ? "text-slate-400 line-through" : "text-slate-900"
                            )}>
                                {task.subject}
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button className="flex-1 md:flex-initial sf-btn-neutral flex items-center justify-center gap-2">
                            <Share2 size={14} /> Share
                        </button>
                        {!isCompleted && (
                            <button
                                onClick={handleComplete}
                                disabled={completing}
                                className="flex-1 md:flex-initial bg-[#4BC076] hover:bg-[#3da664] text-white px-6 h-9 rounded font-bold text-[13px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                            >
                                {completing ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                                Mark Complete
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Details Column */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white border border-sf-border rounded-[4px] p-6 shadow-sm min-h-[300px]">
                        <div className="flex items-center gap-2 mb-6 border-b border-sf-border pb-4">
                            <FileText size={16} className="text-slate-400" />
                            <h3 className="text-sm font-bold text-slate-800">Activity Description</h3>
                        </div>
                        <div className="text-[14px] text-slate-600 leading-relaxed whitespace-pre-wrap">
                            {task.description || (
                                <div className="flex flex-col items-center justify-center py-12 text-slate-300">
                                    <FileText size={48} className="mb-2 opacity-20" />
                                    <p className="italic text-[13px]">No additional details provided for this task.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Collaboration Section */}
                    <div className="bg-white border border-sf-border rounded-[4px] shadow-sm overflow-hidden">
                        <div className="bg-sf-gray/20 p-4 border-b border-sf-border flex items-center gap-2">
                            <MessageSquare size={16} className="text-sf-blue" />
                            <h3 className="text-sm font-bold text-slate-800 font-outfit uppercase tracking-widest text-[11px]">Chatter & Discussion</h3>
                        </div>
                        <div className="p-6">
                            <CommentSection entityType="TASK" entityId={task.id.toString()} />
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white border border-sf-border rounded-[4px] p-6 shadow-sm">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">Task Intelligence</h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 bg-indigo-50 rounded-[4px] flex items-center justify-center text-sf-blue shrink-0">
                                    <User size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Assigned To</p>
                                    <p className="font-bold text-slate-800">{task.assigned_to?.full_name || 'Unassigned'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 bg-amber-50 rounded-[4px] flex items-center justify-center text-amber-600 shrink-0">
                                    <Calendar size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Due Date</p>
                                    <p className={cn(
                                        "font-bold",
                                        task.due_date && new Date(task.due_date) < new Date() && !isCompleted ? "text-red-600" : "text-slate-800"
                                    )}>
                                        {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No Limit'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 bg-sf-gray rounded-[4px] flex items-center justify-center text-slate-500 shrink-0">
                                    <Flag size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Priority Level</p>
                                    <PriorityBadge priority={task.priority} />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-sf-border space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500">Related Record</span>
                                <span className="text-xs font-black uppercase text-sf-blue">{task.entity_type || 'Internal'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500">Created At</span>
                                <span className="text-xs font-bold">{new Date(task.created_at).toLocaleDateString()}</span>
                            </div>
                            {isCompleted && (
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-500">Closed At</span>
                                    <span className="text-xs font-bold text-emerald-600">{new Date(task.completed_at).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* AI Productivity Widget */}
                    <div className="bg-[#001639] rounded-[4px] p-6 text-white shadow-xl overflow-hidden relative group">
                        <div className="absolute top-0 right-0 h-32 w-32 bg-white/5 rounded-full blur-2xl -mr-12 -mt-12 transition-all group-hover:bg-white/10" />
                        <div className="flex items-center gap-2 mb-4">
                            <RefreshCw size={16} className="text-emerald-400" />
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-white/50">Smart Assistant</h4>
                        </div>
                        <p className="text-[12px] text-white/80 leading-relaxed mb-6 font-medium">
                            This task is currently <span className="text-emerald-400 font-bold">{isCompleted ? 'closed' : 'ahead'}</span> of the projected SLA for this account.
                        </p>
                        <button className="text-[11px] font-black uppercase tracking-widest text-white hover:text-emerald-400 flex items-center gap-1 transition-all">
                            Analyze Workflow <ChevronLeft size={12} className="rotate-180" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
