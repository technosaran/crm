"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    ChevronLeft,
    MoreVertical,
    Mail,
    Phone,
    Globe,
    MapPin,
    TrendingUp,
    Calendar,
    User,
    Building2,
    Clock,
    Tag,
    Share2,
    RefreshCw
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { UnifiedTimeline } from "@/components/shared/UnifiedTimeline";
import { CommentSection } from "@/components/shared/CommentSection";
import { useGlobalStore } from "@/store/useGlobalStore";
import { toast } from "sonner";

export default function LeadDetail() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const [lead, setLead] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('TIMELINE');
    const supabase = createClient();

    useEffect(() => {
        async function loadLead() {
            setLoading(true);
            const { data, error } = await supabase
                .from('leads')
                .select(`
                    *,
                    owner:user_profiles!owner_id (full_name)
                `)
                .eq('id', id)
                .single();

            if (data) setLead(data);
            setLoading(false);
        }
        if (id) loadLead();
    }, [id, supabase]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
                <RefreshCw size={24} className="animate-spin mb-2" />
                <p className="text-sm font-bold">Retrieving lead intelligence...</p>
            </div>
        );
    }

    if (!lead) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <h2 className="text-xl font-bold text-slate-800">Lead Intelligence Not Found</h2>
                <Link href="/leads" className="text-indigo-600 hover:underline mt-2 font-bold">Return to Leads Database</Link>
            </div>
        );
    }

    const tabs = [
        { id: 'TIMELINE', label: 'Activity Feed' },
        { id: 'COLLABORATION', label: 'Collaboration' },
        { id: 'DETAILS', label: 'Full Profile' },
    ];

    return (
        <div className="flex flex-col gap-6 pb-12">
            {/* Header Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="bg-orange-500 h-16 w-16 shadow-xl shadow-orange-500/20 rounded-2xl flex items-center justify-center text-white shrink-0">
                            <User size={32} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <button
                                    onClick={() => router.back()}
                                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all text-slate-400"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <span className="bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">Lead Profile</span>
                                <span className="text-slate-300 dark:text-slate-700">•</span>
                                <span className="text-slate-500 text-[11px] font-bold uppercase tracking-widest flex items-center gap-1">
                                    Status: <span className="text-slate-900 dark:text-white">{lead.status}</span>
                                </span>
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-none tracking-tight font-outfit">
                                {lead.first_name} {lead.last_name}
                            </h1>
                            <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                    <Building2 size={14} className="text-slate-400" />
                                    {lead.company_name}
                                </div>
                                <div className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                    <MapPin size={14} className="text-slate-400" />
                                    {lead.city || 'Location unset'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button className="flex-1 md:flex-initial h-11 px-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                            <Share2 size={16} />
                            Share
                        </button>
                        <button className="flex-1 md:flex-initial sf-btn-primary h-11 px-8 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
                            <TrendingUp size={16} />
                            Convert Lead
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Information Column (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Quick Stats */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-hidden relative">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Discovery Data</h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Primary Email</p>
                                    <p className="font-bold text-slate-900 dark:text-white break-all">{lead.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Direct Phone</p>
                                    <p className="font-bold text-slate-900 dark:text-white">{lead.phone || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                                    <Globe size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Lead Source</p>
                                    <p className="font-bold text-slate-900 dark:text-white uppercase tracking-tighter">{lead.source}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata Card */}
                    <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-900/20">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">System Meta</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500">Managed By</span>
                                <span className="text-xs font-black uppercase text-indigo-400">{lead.owner?.full_name || 'Unassigned'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500">Record Created</span>
                                <span className="text-xs font-bold">{new Date(lead.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500">Lead Strength</span>
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <div key={s} className={cn("h-1 w-3 rounded-full", s <= 4 ? "bg-amber-500" : "bg-slate-700")} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area Column (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                        {/* Custom Tab Navigation */}
                        <div className="flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "px-6 py-5 text-[11px] font-black uppercase tracking-widest transition-all relative",
                                        activeTab === tab.id
                                            ? "text-indigo-600 dark:text-indigo-400"
                                            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                    )}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-6 right-6 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="p-6 flex-1">
                            {activeTab === 'TIMELINE' && (
                                <UnifiedTimeline entityType="LEAD" entityId={lead.id} />
                            )}
                            {activeTab === 'COLLABORATION' && (
                                <CommentSection entityType="LEAD" entityId={lead.id} />
                            )}
                            {activeTab === 'DETAILS' && (
                                <div className="grid grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="space-y-4">
                                        <h4 className="text-[11px] font-black text-indigo-500 uppercase tracking-widest">Contact Details</h4>
                                        <div className="grid grid-cols-1 gap-4">
                                            <DetailItem label="Full Name" value={`${lead.first_name} ${lead.last_name}`} />
                                            <DetailItem label="Job Title" value={lead.title || 'Executive'} />
                                            <DetailItem label="Department" value={lead.department || 'N/A'} />
                                            <DetailItem label="Website" value={lead.website || 'N/A'} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-[11px] font-black text-indigo-500 uppercase tracking-widest">Business Info</h4>
                                        <div className="grid grid-cols-1 gap-4">
                                            <DetailItem label="Entity Name" value={lead.company_name} />
                                            <DetailItem label="Industry" value={lead.industry || 'Unknown'} />
                                            <DetailItem label="Team Size" value={lead.employee_count || 'Unset'} />
                                            <DetailItem label="Revenue Range" value={lead.annual_revenue || 'Confidential'} />
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

function DetailItem({ label, value }: { label: string, value: any }) {
    return (
        <div className="group transition-all">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-[13px] font-bold text-slate-700 dark:text-slate-300">{value}</p>
        </div>
    );
}
