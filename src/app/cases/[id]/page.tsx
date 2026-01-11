"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    ChevronLeft,
    MoreVertical,
    MessageSquare,
    Clock,
    CheckCircle2,
    Plus,
    FileText,
    User,
    Building2,
    Calendar,
    Tag,
    Share2,
    RefreshCw,
    LifeBuoy,
    AlertTriangle,
    ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { UnifiedTimeline } from "@/components/shared/UnifiedTimeline";
import { CommentSection } from "@/components/shared/CommentSection";
import { useCases } from "@/hooks/useCases";
import { toast } from "sonner";

export default function CaseDetail() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const { getCaseById } = useCases();
    const [caseItem, setCaseItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('TIMELINE');

    const loadCase = async () => {
        setLoading(true);
        const data = await getCaseById(id);
        if (data) setCaseItem(data);
        setLoading(false);
    };

    useEffect(() => {
        if (id) loadCase();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
                <RefreshCw size={24} className="animate-spin mb-2" />
                <p className="text-sm font-bold tracking-tight">Accessing Support Operations...</p>
            </div>
        );
    }

    if (!caseItem) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Case Record Not Accessible</h2>
                <Link href="/cases" className="text-sf-blue hover:underline mt-2 font-bold">Return to Support Console</Link>
            </div>
        );
    }

    const tabs = [
        { id: 'TIMELINE', label: 'Case History' },
        { id: 'COLLABORATION', label: 'Chatter' },
        { id: 'DETAILS', label: 'Intelligence' },
    ];

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'NEW': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'ESCALATED': return 'bg-red-50 text-red-600 border-red-200 animate-pulse';
            case 'CLOSED': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
            default: return 'bg-slate-50 text-slate-600 border-slate-200';
        }
    };

    return (
        <div className="flex flex-col gap-6 pb-12">
            {/* Context Header */}
            <div className="bg-white border border-sf-border rounded-[4px] p-6 shadow-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#00a1e0] h-14 w-14 shadow-lg rounded-[4px] flex items-center justify-center text-white shrink-0">
                            <LifeBuoy size={28} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <button
                                    onClick={() => router.back()}
                                    className="p-1 hover:bg-slate-100 rounded transition-all text-slate-400"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Service Cloud • {caseItem.case_number}</span>
                                <span className={cn(
                                    "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ml-2",
                                    getStatusStyles(caseItem.status)
                                )}>
                                    {caseItem.status}
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 leading-tight tracking-tight">
                                {caseItem.subject}
                            </h1>
                            <div className="flex items-center gap-4 mt-1.5">
                                <Link href={`/accounts/${caseItem.account_id}`} className="text-xs font-bold text-sf-blue hover:underline flex items-center gap-1.5">
                                    <Building2 size={12} className="text-slate-400" />
                                    {caseItem.account?.name || 'Isolated Case'}
                                </Link>
                                <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                                    <User size={12} className="text-slate-400" />
                                    {caseItem.contact ? `${caseItem.contact.first_name} ${caseItem.contact.last_name}` : 'Unknown Reporter'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button className="flex-1 md:flex-initial sf-btn-neutral flex items-center justify-center gap-2 shadow-sm">
                            <Share2 size={14} /> Share
                        </button>
                        <button className="flex-1 md:flex-initial sf-btn-primary flex items-center justify-center gap-2 shadow-lg shadow-sf-blue/20">
                            <CheckCircle2 size={14} /> Resolve Case
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Metrics Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Urgency Matrix */}
                    <div className="bg-white border border-sf-border rounded-[4px] p-6 shadow-sm">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            System Priority
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "h-10 w-10 rounded-[4px] flex items-center justify-center",
                                        caseItem.priority === 'CRITICAL' ? "bg-red-50 text-red-600" : "bg-sf-gray text-slate-400"
                                    )}>
                                        <ShieldAlert size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Priority</p>
                                        <p className="font-bold text-slate-800">{caseItem.priority}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Origin</p>
                                    <p className="font-bold text-slate-800 tracking-tighter">{caseItem.origin || 'WEB'}</p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-sf-border space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-500">Case Owner</span>
                                    <span className="text-xs font-black uppercase text-sf-blue">{caseItem.owner?.full_name || 'Dispatch Queue'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-500">SLA Response</span>
                                    <span className="text-xs font-bold text-emerald-600">Within Range</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Labels */}
                    <div className="bg-[#001639] rounded-[4px] p-6 text-white shadow-xl">
                        <h3 className="text-[11px] font-black text-white/40 uppercase tracking-widest mb-6">Categorization</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-white/50 uppercase tracking-widest">Type</span>
                                <span className="text-xs font-bold bg-white/10 px-2 py-0.5 rounded uppercase">{caseItem.type || 'QUESTION'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-white/50 uppercase tracking-widest">Opened</span>
                                <span className="text-xs font-bold">{new Date(caseItem.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Interaction Area */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white border border-sf-border rounded-[4px] shadow-sm flex flex-col min-h-[600px]">
                        {/* Tab Nav */}
                        <div className="flex border-b border-sf-border bg-sf-gray/20 font-outfit">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "px-8 py-4 text-[11px] font-black uppercase tracking-widest transition-all relative",
                                        activeTab === tab.id
                                            ? "text-sf-blue bg-white border-t-2 border-sf-blue"
                                            : "text-slate-400 hover:text-sf-blue"
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-6 flex-1">
                            {activeTab === 'TIMELINE' && (
                                <UnifiedTimeline entityType="CASE" entityId={caseItem.id} />
                            )}
                            {activeTab === 'COLLABORATION' && (
                                <CommentSection entityType="CASE" entityId={caseItem.id} />
                            )}
                            {activeTab === 'DETAILS' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div>
                                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Initial Assessment</h4>
                                        <div className="bg-sf-gray/30 p-4 rounded border border-sf-border/30 italic text-slate-600 text-[13px] leading-relaxed">
                                            "{caseItem.description || 'No initial description provided by the reporter.'}"
                                        </div>
                                    </div>

                                    {caseItem.resolution && (
                                        <div>
                                            <h4 className="text-[11px] font-black text-emerald-600 uppercase tracking-widest mb-4">Official Resolution</h4>
                                            <div className="bg-emerald-50 p-4 rounded border border-emerald-100 text-slate-700 text-[13px] leading-relaxed">
                                                {caseItem.resolution}
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-8 pt-4 border-t border-sf-border">
                                        <div className="space-y-4">
                                            <h4 className="text-[11px] font-black text-sf-blue uppercase tracking-widest">Case Metadata</h4>
                                            <div className="space-y-3">
                                                <DataRow label="Last Updated" value={new Date(caseItem.updated_at).toLocaleString()} />
                                                <DataRow label="Escalated" value={caseItem.escalated_at ? 'YES' : 'NO'} />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-[11px] font-black text-sf-blue uppercase tracking-widest">Contact Info</h4>
                                            <div className="space-y-3">
                                                <DataRow label="Method" value={caseItem.origin || 'Direct'} />
                                                <DataRow label="Response Due" value="4h 12m" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DataRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
            <span className="text-[12px] font-bold text-slate-700">{value}</span>
        </div>
    );
}
