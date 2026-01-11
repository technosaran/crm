"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import {
    User,
    Building2,
    Phone,
    Mail,
    ChevronLeft,
    History,
    MessageSquare,
    Loader2,
    MapPin,
    Twitter,
    Linkedin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UnifiedTimeline } from "@/components/shared/UnifiedTimeline";
import { CommentSection } from "@/components/shared/CommentSection";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ContactDetail() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const [contact, setContact] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('TIMELINE');
    const supabase = createClient();

    useEffect(() => {
        async function loadContact() {
            setLoading(true);
            const { data, error } = await supabase
                .from('contacts')
                .select(`
                    *,
                    account:accounts!account_id (id, name),
                    owner:user_profiles!owner_id (full_name)
                `)
                .eq('id', id)
                .single();

            if (data) setContact(data);
            setLoading(false);
        }
        if (id) loadContact();
    }, [id, supabase]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
                <Loader2 className="h-10 w-10 animate-spin mb-4" />
                <p className="font-bold text-slate-800">Loading Contact...</p>
            </div>
        );
    }

    if (!contact) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <p className="text-xl font-bold text-slate-800">Contact not found</p>
                <Link href="/contacts" className="text-sf-blue font-bold mt-4">Return to Contacts</Link>
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
                        <div className="bg-[#a094ed] h-12 w-12 rounded flex items-center justify-center text-white shadow-lg">
                            <User size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded">Contact</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-slate-500 text-[11px] font-bold uppercase">{contact.title || 'Executive'}</span>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 leading-none">{contact.first_name} {contact.last_name}</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="sf-btn-neutral">Edit</button>
                        <button className="sf-btn-primary">Add to Campaign</button>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-8 pt-8 border-t border-sf-border">
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Account</p>
                        {contact.account ? (
                            <Link href={`/accounts/${contact.account.id}`} className="text-[13px] font-bold text-sf-blue flex items-center gap-1 hover:underline">
                                <Building2 size={14} /> {contact.account.name}
                            </Link>
                        ) : <p className="text-[13px] text-slate-400 italic">No Account</p>}
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email</p>
                        <p className="text-[13px] font-bold text-slate-700 flex items-center gap-1">
                            <Mail size={14} className="text-slate-400" /> {contact.email || 'N/A'}
                        </p>
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mobile</p>
                        <p className="text-[13px] font-bold text-slate-700 flex items-center gap-1">
                            <Phone size={14} className="text-slate-400" /> {contact.mobile || contact.phone || 'N/A'}
                        </p>
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Department</p>
                        <p className="text-[13px] font-bold text-slate-700">{contact.department || 'N/A'}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-sf-border rounded-[4px] shadow-sm flex overflow-hidden">
                        {[
                            { id: 'TIMELINE', label: 'Timeline', icon: History },
                            { id: 'COLLABORATION', label: 'Collaboration', icon: MessageSquare },
                            { id: 'DETAILS', label: 'Standard Info', icon: User },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-4 text-[12px] font-bold uppercase tracking-widest transition-all",
                                    activeTab === tab.id ? "bg-sf-blue text-white" : "text-slate-400 hover:text-sf-blue hover:bg-sf-gray"
                                )}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="min-h-[400px]">
                        {activeTab === 'TIMELINE' && <UnifiedTimeline entityType="CONTACT" entityId={id} />}
                        {activeTab === 'COLLABORATION' && <CommentSection entityType="CONTACT" entityId={id} />}
                        {activeTab === 'DETAILS' && (
                            <div className="bg-white border border-sf-border rounded-[4px] p-8 shadow-sm space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    {[
                                        { label: 'Address', value: `${contact.mailing_street || ''}, ${contact.mailing_city || ''}` },
                                        { label: 'Reports To', value: 'N/A' },
                                        { label: 'Contact Owner', value: contact.owner?.full_name || 'System' },
                                        { label: 'Lead Source', value: 'Web' },
                                    ].map((field, i) => (
                                        <div key={i} className="space-y-1">
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{field.label}</p>
                                            <p className="text-[14px] font-medium text-slate-800">{field.value}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-8 border-t border-sf-border flex items-center gap-6">
                                    <button className="flex items-center gap-2 text-slate-500 hover:text-[#1DA1F2] transition-colors">
                                        <Twitter size={20} /> <span className="text-xs font-bold">Twitter</span>
                                    </button>
                                    <button className="flex items-center gap-2 text-slate-500 hover:text-[#0A66C2] transition-colors">
                                        <Linkedin size={20} /> <span className="text-xs font-bold">LinkedIn</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-[#001639] to-[#0176D3] rounded-[4px] p-6 text-white shadow-xl">
                        <h3 className="text-[14px] font-bold uppercase mb-4 tracking-widest">Contact Intelligence</h3>
                        <p className="text-[12px] text-blue-100/70 mb-6 leading-relaxed">
                            A high-value stakeholder at {contact.account?.name || 'their company'}. Based on recent interaction patterns,
                            they respond best to afternoon emails.
                        </p>
                        <div className="space-y-3">
                            <div className="p-3 bg-white/10 rounded flex items-center justify-between">
                                <span className="text-[11px] font-bold opacity-60">ENGAGEMENT</span>
                                <span className="text-[11px] font-bold text-emerald-400">HIGH</span>
                            </div>
                            <div className="p-3 bg-white/10 rounded flex items-center justify-between">
                                <span className="text-[11px] font-bold opacity-60">PROBABILITY</span>
                                <span className="text-[11px] font-bold text-emerald-400">82%</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-sf-border rounded-[4px] p-6 shadow-sm">
                        <h3 className="text-[13px] font-bold text-slate-800 mb-4 uppercase tracking-widest border-l-2 border-sf-blue pl-3">Preferences</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[12px] text-slate-600 font-medium">Do Not Call</span>
                                <span className={cn("text-[10px] font-black uppercase px-2 py-0.5 rounded", contact.do_not_call ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600")}>
                                    {contact.do_not_call ? 'Yes' : 'No'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[12px] text-slate-600 font-medium">Email Opt-Out</span>
                                <span className={cn("text-[10px] font-black uppercase px-2 py-0.5 rounded", contact.do_not_email ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600")}>
                                    {contact.do_not_email ? 'Yes' : 'No'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
