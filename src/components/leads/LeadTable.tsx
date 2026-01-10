"use client";

import React, { useState } from 'react';
import {
    Search,
    Filter,
    Settings,
    RefreshCw,
    Plus,
    LayoutGrid,
    ChevronDown,
    MoreVertical,
    Tag,
    Download,
    Mail,
    Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Modal } from '@/components/shared/Modal';
import { useLeads } from '@/hooks/useLeads';
import { validateName, validateEmail, validatePhone, sanitizeString } from '@/lib/validation';

const initialLeads: any[] = [];

export function LeadTable() {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Use Supabase Hook
    const { leads, loading, createLead, deleteLeads } = useLeads();

    const toggleSelect = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (leads.length === 0) return;
        setSelectedIds(selectedIds.length === leads.length ? [] : leads.map(l => l.id));
    };

    const handleDelete = async () => {
        await deleteLeads(selectedIds);
        setSelectedIds([]);
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Salesforce List View Header */}
            <div className="bg-white border border-sf-border rounded-[4px] p-3 sm:p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#f2672a] h-10 w-10 shadow-lg rounded-full flex items-center justify-center text-white flex-shrink-0">
                            <LayoutGrid size={20} />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider">Object: Leads</p>
                            <h2 className="text-lg sm:text-[20px] font-bold text-slate-900 leading-tight flex items-center gap-2">
                                All Open Leads <ChevronDown size={14} className="text-slate-400" />
                            </h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="flex border border-sf-border rounded-[4px] bg-white overflow-hidden">
                            <button className="p-2 hover:bg-sf-gray border-r border-sf-border"><LayoutGrid size={14} /></button>
                            <button className="p-2 hover:bg-sf-gray"><Settings size={14} /></button>
                        </div>
                        <button className="sf-btn-neutral hidden sm:flex" onClick={() => setShowFilters(!showFilters)}>
                            <Filter size={14} className={cn("mr-2", showFilters && "text-sf-blue")} />
                            Filter
                        </button>
                        <button className="sf-btn-primary flex-1 sm:flex-initial" onClick={() => setIsModalOpen(true)}>
                            <Plus size={14} className="mr-2" />
                            New Lead
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
                {/* Main Table Area */}
                <div className="flex-1 bg-white border border-sf-border rounded-[4px] flex flex-col shadow-sm relative overflow-hidden min-h-[400px]">
                    {/* Action Header */}
                    <div className="p-2 sm:p-3 border-b border-sf-border bg-sf-gray/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                        <div className="flex items-center gap-3 text-[12px] text-slate-500 font-bold">
                            {selectedIds.length > 0 ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-2 sm:gap-3">
                                    <span className="text-sf-blue">{selectedIds.length} Selected</span>
                                    <button onClick={handleDelete} className="text-red-600 hover:underline">Delete</button>
                                    <button className="text-sf-blue hover:underline hidden sm:inline">Mass Update</button>
                                </motion.div>
                            ) : (
                                <span>Showing {leads.length} leads</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <div className="relative group flex-1 sm:flex-initial">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input placeholder="Filter results..." className="bg-white border border-sf-border rounded-[4px] h-8 pl-9 pr-4 text-[12px] w-full sm:w-48 focus:border-sf-blue outline-none transition-all" />
                            </div>
                            <button className="p-1 px-2 border border-sf-border rounded-[4px] hover:bg-white text-slate-500" disabled={leads.length === 0}><Download size={14} /></button>
                            <button className="p-1 px-2 border border-sf-border rounded-[4px] hover:bg-white text-slate-500"><RefreshCw size={14} /></button>
                        </div>
                    </div>

                    <div className="overflow-x-auto overflow-y-auto max-h-[60vh]">
                        <table className="w-full text-left text-[13px] border-collapse relative min-w-[800px]">
                            <thead>
                                <tr className="bg-white border-b border-sf-border sticky top-0 z-10">
                                    <th className="p-3 w-12 text-center pointer-events-auto">
                                        <input type="checkbox" className="rounded" checked={leads.length > 0 && selectedIds.length === leads.length} onChange={toggleAll} disabled={leads.length === 0} />
                                    </th>
                                    {['Lead Name', 'Company', 'Status', 'Owner', 'Source', 'Email'].map(h => (
                                        <th key={h} className="p-3 font-bold text-slate-600 uppercase text-[11px] tracking-wider border-r border-sf-border/30">{h}</th>
                                    ))}
                                    <th className="p-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sf-border/50">
                                {leads.length > 0 ? (
                                    leads.map((lead, idx) => (
                                        <motion.tr
                                            key={lead.id}
                                            layout
                                            className={cn(
                                                "group transition-all",
                                                selectedIds.includes(lead.id) ? "bg-sf-blue/5" : "hover:bg-sf-gray/40"
                                            )}
                                        >
                                            <td className="p-3 text-center">
                                                <input type="checkbox" className="rounded" checked={selectedIds.includes(lead.id)} onChange={() => toggleSelect(lead.id)} />
                                            </td>
                                            <td className="p-3 flex items-center gap-3">
                                                <span className="font-bold text-sf-blue hover:underline transition-all cursor-pointer truncate max-w-[150px]">
                                                    {lead.first_name} {lead.last_name}
                                                </span>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-1 hover:bg-white rounded border border-sf-border/50 text-slate-400"><Mail size={12} /></button>
                                                    <button className="p-1 hover:bg-white rounded border border-sf-border/50 text-slate-400"><Phone size={12} /></button>
                                                </div>
                                            </td>
                                            <td className="p-3 font-semibold text-slate-700">{lead.company}</td>
                                            <td className="p-3">
                                                <span className={cn(
                                                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                                                    lead.status === 'New' ? "bg-blue-50 text-blue-600 border-blue-200" :
                                                        lead.status === 'Working' ? "bg-amber-50 text-amber-600 border-amber-200" :
                                                            "bg-emerald-50 text-emerald-600 border-emerald-200"
                                                )}>
                                                    {lead.status}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-full bg-sf-gray flex items-center justify-center text-[10px] font-bold text-slate-500 ring-1 ring-sf-border">
                                                        {(lead.first_name || 'U')[0]}
                                                    </div>
                                                    <span className="text-[12px] font-medium text-slate-600">Unassigned</span>
                                                </div>
                                            </td>
                                            <td className="p-3 text-slate-500 font-medium">{lead.source}</td>
                                            <td className="p-3 text-sf-blue hover:underline cursor-pointer font-medium">{lead.email}</td>
                                            <td className="p-3 text-right">
                                                <button className="p-1 px-2 hover:bg-white rounded transition-all text-slate-400"><MoreVertical size={16} /></button>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="p-12 text-center">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="flex flex-col items-center justify-center space-y-4"
                                            >
                                                <div className="h-16 w-16 bg-sf-gray rounded-full flex items-center justify-center text-slate-300">
                                                    <LayoutGrid size={32} />
                                                </div>
                                                <div>
                                                    <h3 className="text-[14px] font-bold text-slate-800">No leads to display</h3>
                                                    <p className="text-[12px] text-slate-500">Connect a database or create a new lead to get started.</p>
                                                </div>
                                                <button className="sf-btn-primary" onClick={() => setIsModalOpen(true)}>
                                                    Create Your First Lead
                                                </button>
                                            </motion.div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Filters Sidebar (UX Enhancement) */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 300, opacity: 0 }}
                            className="w-80 bg-white border border-sf-border rounded-[4px] shadow-sm shrink-0 flex flex-col"
                        >
                            <div className="p-4 border-b border-sf-border flex items-center justify-between bg-sf-gray/20">
                                <h3 className="font-bold text-[14px]">Filter Panel</h3>
                                <button onClick={() => setShowFilters(false)} className="text-slate-400 hover:text-slate-700">
                                    <Plus className="rotate-45" size={18} />
                                </button>
                            </div>
                            <div className="p-6 space-y-8 h-full overflow-y-auto">
                                <FilterGroup title="Lead Status">
                                    {['New', 'Working', 'Nurturing', 'Qualified'].map(s => (
                                        <label key={s} className="flex items-center gap-2 text-[13px] text-slate-600 cursor-pointer hover:bg-sf-gray/50 p-1 rounded transition-colors">
                                            <input type="checkbox" className="rounded" /> {s}
                                        </label>
                                    ))}
                                </FilterGroup>
                                <FilterGroup title="Created Period">
                                    {['Last 7 Days', 'Current Month', 'Last 90 Days'].map(p => (
                                        <label key={p} className="flex items-center gap-2 text-[13px] text-slate-600 cursor-pointer hover:bg-sf-gray/50 p-1 rounded transition-colors">
                                            <input type="radio" name="period" className="rounded" /> {p}
                                        </label>
                                    ))}
                                </FilterGroup>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* New Lead Modal (UX Enhancement) */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Lead"
            >
                <LeadForm
                    onCancel={() => setIsModalOpen(false)}
                    onSuccess={(lead) => {
                        createLead(lead);
                        setIsModalOpen(false);
                    }}
                />
            </Modal>
        </div>
    );
}

function LeadForm({ onCancel, onSuccess }: { onCancel: () => void, onSuccess: (data: any) => void }) {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        company: '',
        email: '',
        phone: '',
        source: 'Web'
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        // Validate fields using imported functions
        const newErrors: Record<string, string> = {};

        const firstNameValidation = validateName(formData.first_name);
        if (formData.first_name && !firstNameValidation.valid) {
            newErrors.first_name = firstNameValidation.error!;
        }

        const lastNameValidation = validateName(formData.last_name);
        if (!lastNameValidation.valid) {
            newErrors.last_name = lastNameValidation.error!;
        }

        const companyValidation = validateName(formData.company);
        if (!companyValidation.valid) {
            newErrors.company = companyValidation.error!;
        }

        if (formData.email) {
            const emailValidation = validateEmail(formData.email);
            if (!emailValidation.valid) {
                newErrors.email = emailValidation.error!;
            }
        }

        if (formData.phone) {
            const phoneValidation = validatePhone(formData.phone);
            if (!phoneValidation.valid) {
                newErrors.phone = phoneValidation.error!;
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        // Sanitize and submit
        const sanitizedData = {
            first_name: sanitizeString(formData.first_name),
            last_name: sanitizeString(formData.last_name),
            company: sanitizeString(formData.company),
            email: formData.email ? sanitizeString(formData.email.toLowerCase()) : '',
            phone: formData.phone ? sanitizeString(formData.phone) : '',
            source: formData.source
        };

        try {
            await onSuccess(sanitizedData);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-4">
                <h4 className="text-[14px] font-bold text-slate-900 border-b border-sf-border pb-2">Lead Information</h4>
                <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">First Name</label>
                    <input 
                        className={`w-full bg-white border rounded h-9 px-3 text-[13px] outline-none focus:border-sf-blue transition-all ${errors.first_name ? 'border-red-500' : 'border-sf-border'}`}
                        value={formData.first_name} 
                        onChange={e => setFormData({ ...formData, first_name: e.target.value })} 
                    />
                    {errors.first_name && <p className="text-xs text-red-600">{errors.first_name}</p>}
                </div>
                <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Last Name <span className="text-red-500">*</span></label>
                    <input 
                        className={`w-full bg-white border rounded h-9 px-3 text-[13px] outline-none focus:border-sf-blue transition-all ${errors.last_name ? 'border-red-500' : 'border-sf-border'}`}
                        required
                        value={formData.last_name} 
                        onChange={e => setFormData({ ...formData, last_name: e.target.value })} 
                    />
                    {errors.last_name && <p className="text-xs text-red-600">{errors.last_name}</p>}
                </div>
                <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Company <span className="text-red-500">*</span></label>
                    <input 
                        className={`w-full bg-white border rounded h-9 px-3 text-[13px] outline-none focus:border-sf-blue transition-all ${errors.company ? 'border-red-500' : 'border-sf-border'}`}
                        required
                        value={formData.company} 
                        onChange={e => setFormData({ ...formData, company: e.target.value })} 
                    />
                    {errors.company && <p className="text-xs text-red-600">{errors.company}</p>}
                </div>
            </div>
            <div className="space-y-4">
                <h4 className="text-[14px] font-bold text-slate-900 border-b border-sf-border pb-2">Contact Details</h4>
                <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Email</label>
                    <input 
                        type="email" 
                        className={`w-full bg-white border rounded h-9 px-3 text-[13px] outline-none focus:border-sf-blue transition-all ${errors.email ? 'border-red-500' : 'border-sf-border'}`}
                        value={formData.email} 
                        onChange={e => setFormData({ ...formData, email: e.target.value })} 
                    />
                    {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                </div>
                <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Phone</label>
                    <input 
                        className={`w-full bg-white border rounded h-9 px-3 text-[13px] outline-none focus:border-sf-blue transition-all ${errors.phone ? 'border-red-500' : 'border-sf-border'}`}
                        value={formData.phone} 
                        onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                    />
                    {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
                </div>
                <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Lead Source</label>
                    <select className="w-full bg-white border border-sf-border rounded h-9 px-3 text-[13px] outline-none focus:border-sf-blue transition-all"
                        value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value })}>
                        <option>Web</option>
                        <option>Referral</option>
                        <option>LinkedIn</option>
                        <option>Cold Outreach</option>
                    </select>
                </div>
            </div>
            <div className="col-span-2 flex justify-end gap-2 pt-4 border-t border-sf-border">
                <button type="button" onClick={onCancel} className="sf-btn-neutral" disabled={isSubmitting}>Cancel</button>
                <button type="submit" className="sf-btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Lead'}
                </button>
            </div>
        </form>
    );
}

function FilterGroup({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="space-y-4">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Tag size={12} /> {title}
            </h4>
            <div className="space-y-2 pl-1">
                {children}
            </div>
        </div>
    );
}

function InputField({ label, placeholder, required, type = "text" }: { label: string, placeholder?: string, required?: boolean, type?: string }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                className="w-full bg-white border border-sf-border rounded h-9 px-3 text-[13px] outline-none hover:border-slate-400 focus:border-sf-blue focus:ring-4 focus:ring-sf-blue/5 transition-all"
            />
        </div>
    );
}
