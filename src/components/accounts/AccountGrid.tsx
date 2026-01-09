"use client";

import React from 'react';
import {
    Building2,
    Plus,
    Filter,
    ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const accounts: any[] = [];

export function AccountGrid() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {accounts.length > 0 ? (
                    accounts.map((account, idx) => (
                        <div key={idx} /> // Placeholder for mapping if data existed
                    ))
                ) : (
                    <>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white border border-sf-border rounded-[4px] p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-4 lg:col-span-2"
                        >
                            <div className="h-16 w-16 bg-[#7F8DE1]/10 text-[#7F8DE1] rounded-full flex items-center justify-center">
                                <Building2 size={32} />
                            </div>
                            <div className="max-w-md">
                                <h3 className="text-[16px] font-bold text-slate-800">No Corporate Accounts found</h3>
                                <p className="text-[13px] text-slate-500 mt-2 leading-relaxed">
                                    Track organizations you do business with. Accounts allow you to group contacts and deals under a single corporate entity.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="sf-btn-primary">Create Your First Account</button>
                                <button className="sf-btn-neutral">Import from CSV</button>
                            </div>
                        </motion.div>

                        <div className="bg-[#001639] text-white p-6 rounded-[4px] shadow-lg flex flex-col justify-between overflow-hidden relative">
                            <div className="absolute top-0 right-0 h-40 w-40 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
                            <div>
                                <h4 className="text-[15px] font-bold mb-3">Enterprise Connect</h4>
                                <p className="text-[12px] text-white/60 leading-relaxed mb-6">
                                    Zenith Intelligence can auto-enrich your accounts with firmographic data like revenue, headcount, and tech stack.
                                </p>
                            </div>
                            <button className="text-[12px] font-bold flex items-center gap-1 group hover:gap-2 transition-all text-[#00A1E0]">
                                Learn about Enrichment <ArrowRight size={14} />
                            </button>
                        </div>
                    </>
                )}
            </div>

            <div className="bg-sf-gray/30 border border-sf-border border-dashed rounded-[4px] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Filter size={14} className="text-slate-400" />
                    <span className="text-[12px] font-medium text-slate-500 italic">Filter by Industry, Owner, or Region to narrow down your search.</span>
                </div>
                <button className="sf-btn-neutral scale-90" onClick={() => { }}>
                    <Plus size={14} className="mr-2" />
                    Custom View
                </button>
            </div>
        </div>
    );
}
