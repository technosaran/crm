'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLeads, Lead } from '@/hooks/useLeads';
import { useCustomFields } from '@/hooks/useCustomFields';
import {
    History,
    MessageSquare,
    Info,
    ChevronLeft,
    Edit3,
    MoreVertical,
    Briefcase,
    Mail,
    Phone,
    Globe,
    Tag
} from 'lucide-react';
import { UnifiedTimeline } from '@/components/shared/UnifiedTimeline';
import { CommentSection } from '@/components/shared/CommentSection';
import { DynamicForm } from '@/components/shared/DynamicForm';
import { CustomFieldManager } from '@/components/admin/CustomFieldManager';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function LeadDetailPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const { leads, loading: loadingLeads } = useLeads();
    const { fields, loading: loadingFields, getEntityValues, saveValues } = useCustomFields('LEAD');

    const [lead, setLead] = useState<Lead | null>(null);
    const [activeTab, setActiveTab] = useState<'DETAILS' | 'TIMELINE' | 'COLLABORATION' | 'CUSTOM'>('TIMELINE');
    const [customValues, setCustomValues] = useState<Record<string, any>>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const foundLead = leads.find(l => l.id === id);
        if (foundLead) {
            setLead(foundLead);
            getEntityValues(id).then(setCustomValues);
        }
    }, [leads, id]);

    const handleSaveCustom = async () => {
        setIsSaving(true);
        await saveValues(id, customValues);
        setIsSaving(false);
    };

    if (loadingLeads || !lead) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Premium Header */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-6">
                        <button
                            onClick={() => router.back()}
                            className="mt-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-slate-500"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg">Lead Record</span>
                                <span className={cn(
                                    "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                                    lead.status === 'Qualified' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                )}>
                                    {lead.status}
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="text-[11px] font-bold text-slate-400">Created {new Date(lead.created_at).toLocaleDateString()}</span>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight font-outfit">
                                {lead.first_name} {lead.last_name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 mt-4">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Briefcase size={16} className="text-indigo-500" />
                                    <span className="text-sm font-bold">{lead.company_name || lead.company}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Mail size={16} className="text-indigo-500" />
                                    <span className="text-sm font-bold">{lead.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Phone size={16} className="text-indigo-500" />
                                    <span className="text-sm font-bold">{lead.phone || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="h-12 px-6 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2">
                            <Edit3 size={16} /> Edit Profile
                        </button>
                        <button className="h-12 w-12 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500">
                            <MoreVertical size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Details & Custom Fields */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Tabs */}
                    <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 px-4">
                        {[
                            { id: 'TIMELINE', label: 'Timeline', icon: History },
                            { id: 'COLLABORATION', label: 'Collaboration', icon: MessageSquare },
                            { id: 'DETAILS', label: 'Standard Info', icon: Info },
                            { id: 'CUSTOM', label: 'Advanced Data', icon: Tag },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "flex items-center gap-2 py-4 text-xs font-black uppercase tracking-widest transition-all relative",
                                    activeTab === tab.id ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="min-h-[500px]">
                        {activeTab === 'TIMELINE' && (
                            <UnifiedTimeline entityType="LEAD" entityId={id} />
                        )}

                        {activeTab === 'COLLABORATION' && (
                            <CommentSection entityType="LEAD" entityId={id} />
                        )}

                        {activeTab === 'DETAILS' && (
                            <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800">
                                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-8 flex items-center gap-3">
                                    <div className="h-2 w-8 bg-indigo-500 rounded-full" />
                                    Primary Attributes
                                </h3>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Source</p>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{lead.source}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Industry</p>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Technology</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'CUSTOM' && (
                            <div className="space-y-8">
                                <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                                            <div className="h-2 w-8 bg-indigo-500 rounded-full" />
                                            Extended Attributes
                                        </h3>
                                        <button
                                            onClick={handleSaveCustom}
                                            disabled={isSaving}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
                                        >
                                            {isSaving ? 'Saving...' : 'Save Attributes'}
                                        </button>
                                    </div>
                                    <DynamicForm
                                        fields={fields}
                                        values={customValues}
                                        onChange={(fieldId, val) => setCustomValues({ ...customValues, [fieldId]: val })}
                                    />
                                    {fields.length === 0 && (
                                        <div className="text-center py-12 text-slate-400 font-bold">
                                            No custom fields defined.
                                            <button onClick={() => setActiveTab('CUSTOM')} className="text-indigo-600 hover:underline ml-1">Configure now</button>
                                        </div>
                                    )}
                                </div>

                                <CustomFieldManager entityType="LEAD" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Predictive Insights */}
                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-500/30">
                        <h3 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Globe size={18} /> Zenith Score
                        </h3>
                        <div className="flex items-end gap-2">
                            <span className="text-6xl font-black font-outfit">84</span>
                            <span className="text-indigo-200 text-lg font-bold mb-2">/100</span>
                        </div>
                        <p className="text-indigo-100 text-xs mt-4 font-medium leading-relaxed">
                            Based on email interactions and lead source, this record has a <span className="text-white font-black underline">high probability</span> of converting to an opportunity.
                        </p>
                        <div className="mt-8 space-y-3">
                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white w-[84%]" />
                            </div>
                            <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Qualification Progress</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800">
                        <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest mb-6 border-l-2 border-indigo-500 pl-4">Next Recommended Steps</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-start gap-4">
                                <div className="h-8 w-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                                    <Mail size={16} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Send introductory deck</p>
                                    <p className="text-[10px] text-slate-500 mt-1">AI detected interest in Enterprise features</p>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-start gap-4">
                                <div className="h-8 w-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                                    <Phone size={16} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Follow up on voicemail</p>
                                    <p className="text-[10px] text-slate-500 mt-1">Best time: Today before 4 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
