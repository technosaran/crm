"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import {
    Building2,
    Globe,
    Phone,
    Mail,
    MapPin,
    ChevronLeft,
    Plus,
    History,
    Users,
    Briefcase,
    MessageSquare,
    Loader2
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { useGlobalStore } from "@/store/useGlobalStore";
import { UnifiedTimeline } from "@/components/shared/UnifiedTimeline";
import { CommentSection } from "@/components/shared/CommentSection";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function AccountDetail() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const { currency, locale } = useGlobalStore();
    const [account, setAccount] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('TIMELINE');
    const supabase = createClient();

    useEffect(() => {
        async function loadAccount() {
            setLoading(true);
            const { data, error } = await supabase
                .from('accounts')
                .select(`
                    *,
                    owner:user_profiles!owner_id (full_name),
                    contacts (*),
                    opportunities (*)
                `)
                .eq('id', id)
                .single();

            if (data) setAccount(data);
            setLoading(false);
        }
        if (id) loadAccount();
    }, [id, supabase]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
                <Loader2 className="h-10 w-10 animate-spin mb-4" />
                <p className="font-bold text-slate-800">Loading Account...</p>
            </div>
        );
    }

    if (!account) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <p className="text-xl font-bold text-slate-800">Account not found</p>
                <Link href="/accounts" className="text-sf-blue font-bold mt-4">Return to Accounts</Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="bg-white border border-sf-border rounded-[4px] p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <button onClick={() => router.back()} className="sf-btn-neutral p-2">
                            <ChevronLeft size={16} />
                        </button>
                        <div className="bg-indigo-600 h-12 w-12 rounded flex items-center justify-center text-white shadow-lg">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-sf-blue/10 text-sf-blue text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded">Account</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-slate-500 text-[11px] font-bold uppercase">{account.type}</span>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 leading-none">{account.name}</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="sf-btn-neutral">Edit</button>
                        <button className="sf-btn-primary flex items-center gap-2">
                            <Plus size={14} /> New Opportunity
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-8 pt-8 border-t border-sf-border">
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Website</p>
                        <a href={`https://${account.website}`} target="_blank" className="text-[13px] font-bold text-sf-blue flex items-center gap-1 hover:underline">
                            <Globe size={14} /> {account.website || 'N/A'}
                        </a>
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone</p>
                        <p className="text-[13px] font-bold text-slate-700 flex items-center gap-1">
                            <Phone size={14} className="text-slate-400" /> {account.phone || 'N/A'}
                        </p>
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Industry</p>
                        <p className="text-[13px] font-bold text-slate-700">{account.industry || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Account Owner</p>
                        <p className="text-[13px] font-bold text-slate-700">{account.owner?.full_name || 'System'}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Tabs */}
                    <div className="bg-white border border-sf-border rounded-[4px] shadow-sm flex overflow-hidden">
                        {[
                            { id: 'TIMELINE', label: 'Timeline', icon: History },
                            { id: 'COLLABORATION', label: 'Collaboration', icon: MessageSquare },
                            { id: 'DETAILS', label: 'Details', icon: Building2 },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-4 text-[12px] font-bold uppercase tracking-widest transition-all",
                                    activeTab === tab.id ? "bg-sf-blue text-white shadow-inner" : "text-slate-400 hover:text-sf-blue hover:bg-sf-gray/30"
                                )}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="min-h-[400px]">
                        {activeTab === 'TIMELINE' && <UnifiedTimeline entityType="ACCOUNT" entityId={id} />}
                        {activeTab === 'COLLABORATION' && <CommentSection entityType="ACCOUNT" entityId={id} />}
                        {activeTab === 'DETAILS' && (
                            <div className="bg-white border border-sf-border rounded-[4px] p-8 shadow-sm grid grid-cols-2 gap-8">
                                {[
                                    { label: 'Annual Revenue', value: formatCurrency(account.annual_revenue || 0, currency, locale) },
                                    { label: 'Employees', value: account.number_of_employees || 'N/A' },
                                    { label: 'Billing Address', value: `${account.billing_street || ''}, ${account.billing_city || ''}` },
                                    { label: 'Description', value: account.description || 'No description available' },
                                ].map((field, i) => (
                                    <div key={i} className="space-y-1">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{field.label}</p>
                                        <p className="text-[14px] font-medium text-slate-800">{field.value}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Related Lists */}
                    <div className="bg-white border border-sf-border rounded-[4px] shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-sf-border bg-sf-gray/20 font-bold text-[13px] flex items-center justify-between">
                            <span className="flex items-center gap-2"><Users size={16} /> Contacts</span>
                            <span className="bg-slate-200 px-2 py-0.5 rounded text-[10px]">{account.contacts?.length || 0}</span>
                        </div>
                        <div className="p-2 space-y-1">
                            {account.contacts?.map((contact: any) => (
                                <Link key={contact.id} href={`/contacts/${contact.id}`} className="block p-3 hover:bg-sf-gray rounded transition-all">
                                    <p className="text-[13px] font-bold text-sf-blue">{contact.first_name} {contact.last_name}</p>
                                    <p className="text-[11px] text-slate-500 mt-1">{contact.title || 'Contact'}</p>
                                </Link>
                            ))}
                            {(!account.contacts || account.contacts.length === 0) && (
                                <p className="text-center py-6 text-slate-400 text-xs">No contacts linked</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white border border-sf-border rounded-[4px] shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-sf-border bg-sf-gray/20 font-bold text-[13px] flex items-center justify-between">
                            <span className="flex items-center gap-2"><Briefcase size={16} /> Opportunities</span>
                            <span className="bg-slate-200 px-2 py-0.5 rounded text-[10px]">{account.opportunities?.length || 0}</span>
                        </div>
                        <div className="p-2 space-y-1">
                            {account.opportunities?.map((opp: any) => (
                                <Link key={opp.id} href={`/opportunities/${opp.id}`} className="block p-3 hover:bg-sf-gray rounded transition-all">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[13px] font-bold text-sf-blue truncate">{opp.name}</p>
                                        <p className="text-[11px] font-bold text-emerald-600">{formatCurrency(opp.amount, currency, locale)}</p>
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-1 uppercase font-black">{opp.stage.replace('_', ' ')}</p>
                                </Link>
                            ))}
                            {(!account.opportunities || account.opportunities.length === 0) && (
                                <p className="text-center py-6 text-slate-400 text-xs">No opportunities linked</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
