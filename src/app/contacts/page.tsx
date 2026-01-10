"use client";

import React, { useState } from 'react';
import {
    User,
    Search,
    Plus,
    Mail,
    Phone,
    MapPin,
    MoreVertical,
    Filter,
    ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Modal } from '@/components/shared/Modal';
import { useContacts } from '@/hooks/useContacts';

export default function ContactsPage() {
    const { contacts, loading, createContact, deleteContacts } = useContacts();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const toggleSelect = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleDelete = async () => {
        await deleteContacts(selectedIds);
        setSelectedIds([]);
    };

    return (
        <div className="space-y-6 pb-12">
            <div className="bg-white border border-sf-border rounded-[4px] p-3 sm:p-4 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#a094ed] h-10 w-10 shadow-lg rounded-full flex items-center justify-center text-white flex-shrink-0">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Contacts</p>
                            <h2 className="text-lg sm:text-[20px] font-bold text-slate-900 leading-tight flex items-center gap-2">
                                All Contacts <ChevronDown size={14} className="text-slate-400" />
                            </h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button className="sf-btn-neutral hidden sm:flex" onClick={() => toast.info("Filter sidebar coming soon")}>
                            <Filter size={14} className="mr-2" />
                            Filter
                        </button>
                        <button className="sf-btn-primary flex-1 sm:flex-initial" onClick={() => setIsModalOpen(true)}>
                            <Plus size={14} className="mr-2" />
                            New Contact
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-sf-border rounded-[4px] shadow-sm overflow-hidden min-h-[400px]">
                <div className="p-4 border-b border-sf-border bg-sf-gray/20 flex items-center justify-between">
                    <div className="text-[13px] text-slate-500 font-medium">
                        {selectedIds.length > 0 ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sf-blue font-bold">{selectedIds.length} Selected</span>
                                <button onClick={handleDelete} className="text-red-600 hover:underline font-bold">Delete Selected</button>
                            </div>
                        ) : (
                            <span><span className="font-bold text-slate-800">{contacts.length}</span> items • Sorted by Name</span>
                        )}
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 focus-within:text-sf-blue transition-colors" />
                        <input placeholder="Search contacts..." className="bg-white border border-sf-border rounded h-8 pl-10 pr-4 text-sm focus:border-sf-blue outline-none w-64 transition-all" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-[13px] border-collapse text-slate-700">
                        <thead className="bg-[#f8f9fb] border-b border-sf-border">
                            <tr>
                                <th className="p-3 w-12 text-center">
                                    <input 
                                        type="checkbox" 
                                        className="rounded" 
                                        checked={contacts.length > 0 && selectedIds.length === contacts.length}
                                        onChange={() => setSelectedIds(selectedIds.length === contacts.length ? [] : contacts.map(c => c.id))}
                                    />
                                </th>
                                {['Name', 'Title', 'Email', 'Phone', 'Mobile'].map(h => (
                                    <th key={h} className="p-3 font-extrabold text-slate-600 uppercase text-[10px] tracking-wider">{h}</th>
                                ))}
                                <th className="p-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sf-border/50">
                            {contacts.length > 0 ? (
                                contacts.map((contact, idx) => (
                                    <motion.tr
                                        key={contact.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className={cn(
                                            "group transition-all",
                                            selectedIds.includes(contact.id) ? "bg-sf-blue/5" : "hover:bg-sf-gray/40"
                                        )}
                                    >
                                        <td className="p-3 text-center">
                                            <input 
                                                type="checkbox" 
                                                className="rounded" 
                                                checked={selectedIds.includes(contact.id)}
                                                onChange={() => toggleSelect(contact.id)}
                                            />
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-sf-blue/10 flex items-center justify-center text-sf-blue font-bold text-[10px]">
                                                    {contact.first_name[0]}{contact.last_name[0]}
                                                </div>
                                                <span className="font-bold text-sf-blue hover:underline cursor-pointer">
                                                    {contact.first_name} {contact.last_name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-3 text-slate-700 font-medium">{contact.title || '-'}</td>
                                        <td className="p-3 text-sf-blue hover:underline cursor-pointer">{contact.email || '-'}</td>
                                        <td className="p-3 text-slate-500">{contact.phone || '-'}</td>
                                        <td className="p-3 text-slate-500">{contact.mobile || '-'}</td>
                                        <td className="p-3 text-right">
                                            <button className="p-1 px-2 hover:bg-white rounded transition-all text-slate-400"><MoreVertical size={16} /></button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="p-20 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="h-16 w-16 bg-sf-gray rounded-full flex items-center justify-center text-slate-300">
                                                <User size={32} />
                                            </div>
                                            <div>
                                                <h3 className="text-[14px] font-bold text-slate-800">No contacts found</h3>
                                                <p className="text-[12px] text-slate-500 max-w-xs mx-auto">Build your relationship network by importing or creating your first business contact.</p>
                                            </div>
                                            <button className="sf-btn-primary" onClick={() => setIsModalOpen(true)}>Add Contact</button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Contact"
            >
                <ContactForm
                    onCancel={() => setIsModalOpen(false)}
                    onSuccess={async (data) => {
                        await createContact(data);
                        setIsModalOpen(false);
                    }}
                />
            </Modal>
        </div >
    );
}

function ContactForm({ onCancel, onSuccess }: { onCancel: () => void, onSuccess: (data: any) => void }) {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        mobile: '',
        title: '',
        department: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSuccess(formData);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-4">
                <h4 className="text-[14px] font-bold text-slate-900 border-b border-sf-border pb-2">Contact Information</h4>
                <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">First Name <span className="text-red-500">*</span></label>
                    <input 
                        required
                        className="w-full bg-white border border-sf-border rounded h-9 px-3 text-[13px] outline-none focus:border-sf-blue transition-all"
                        value={formData.first_name} 
                        onChange={e => setFormData({ ...formData, first_name: e.target.value })} 
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Last Name <span className="text-red-500">*</span></label>
                    <input 
                        required
                        className="w-full bg-white border border-sf-border rounded h-9 px-3 text-[13px] outline-none focus:border-sf-blue transition-all"
                        value={formData.last_name} 
                        onChange={e => setFormData({ ...formData, last_name: e.target.value })} 
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Title</label>
                    <input 
                        className="w-full bg-white border border-sf-border rounded h-9 px-3 text-[13px] outline-none focus:border-sf-blue transition-all"
                        value={formData.title} 
                        onChange={e => setFormData({ ...formData, title: e.target.value })} 
                    />
                </div>
            </div>
            <div className="space-y-4">
                <h4 className="text-[14px] font-bold text-slate-900 border-b border-sf-border pb-2">Contact Details</h4>
                <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Email</label>
                    <input 
                        type="email"
                        className="w-full bg-white border border-sf-border rounded h-9 px-3 text-[13px] outline-none focus:border-sf-blue transition-all"
                        value={formData.email} 
                        onChange={e => setFormData({ ...formData, email: e.target.value })} 
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Phone</label>
                    <input 
                        className="w-full bg-white border border-sf-border rounded h-9 px-3 text-[13px] outline-none focus:border-sf-blue transition-all"
                        value={formData.phone} 
                        onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Mobile</label>
                    <input 
                        className="w-full bg-white border border-sf-border rounded h-9 px-3 text-[13px] outline-none focus:border-sf-blue transition-all"
                        value={formData.mobile} 
                        onChange={e => setFormData({ ...formData, mobile: e.target.value })} 
                    />
                </div>
            </div>
            <div className="col-span-2 flex justify-end gap-2 pt-4 border-t border-sf-border">
                <button type="button" onClick={onCancel} className="sf-btn-neutral" disabled={isSubmitting}>Cancel</button>
                <button type="submit" className="sf-btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Contact'}
                </button>
            </div>
        </form>
    );
}
