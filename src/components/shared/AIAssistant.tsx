"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    X,
    Zap,
    Search,
    Send,
    Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'chat' | 'insights'>('insights');

    return (
        <>
            {/* Floating Trigger Button (Zoho Zia Style) */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-[100] h-14 w-14 bg-gradient-to-br from-[#00A1E0] to-[#0176D3] rounded-full shadow-2xl flex items-center justify-center text-white border-2 border-white/20 hover:shadow-sf-blue/40 transition-shadow"
            >
                <Sparkles size={24} className="animate-pulse" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white" />
            </motion.button>

            {/* AI Sidebar Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: 400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 400, opacity: 0 }}
                        className="fixed top-0 right-0 bottom-0 w-[380px] bg-white z-[110] shadow-[-20px_0_50px_rgba(0,0,0,0.1)] border-l border-sf-border flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-sf-border bg-[#001639] text-white flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 bg-sf-blue rounded-lg flex items-center justify-center shadow-lg">
                                    <Bot size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[15px] leading-tight">Zenith Intelligence</h3>
                                    <p className="text-[10px] text-blue-200 uppercase tracking-widest font-bold">Powered by ZI-1</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-md transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-sf-border">
                            <button
                                onClick={() => setActiveTab('insights')}
                                className={cn(
                                    "flex-1 py-3 text-[12px] font-bold transition-all border-b-2",
                                    activeTab === 'insights' ? "border-sf-blue text-sf-blue" : "border-transparent text-slate-500 hover:text-slate-700"
                                )}
                            >
                                Smarter Insights
                            </button>
                            <button
                                onClick={() => setActiveTab('chat')}
                                className={cn(
                                    "flex-1 py-3 text-[12px] font-bold transition-all border-b-2",
                                    activeTab === 'chat' ? "border-sf-blue text-sf-blue" : "border-transparent text-slate-500 hover:text-slate-700"
                                )}
                            >
                                Ask ZI
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {activeTab === 'insights' ? (
                                <>
                                    <div className="flex flex-col items-center justify-center text-center space-y-4 py-8 opacity-60">
                                        <div className="h-12 w-12 bg-sf-gray rounded-full flex items-center justify-center text-slate-300">
                                            <Zap size={24} />
                                        </div>
                                        <div className="max-w-[200px]">
                                            <h4 className="text-[13px] font-bold text-slate-800">Pending Analysis</h4>
                                            <p className="text-[11px] text-slate-500 mt-1">
                                                ZI is analyzing your data patterns. Insights will appear here once sufficient activity is recorded.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-sf-border">
                                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Active Filters</h4>
                                        <p className="text-[11px] text-slate-400 italic">No filters applied</p>
                                    </div>
                                </>
                            ) : (
                                <div className="h-full flex flex-col justify-end gap-4 pb-4">
                                    <div className="space-y-4 overflow-y-auto pr-2">
                                        <div className="flex gap-3">
                                            <div className="h-8 w-8 rounded-full bg-sf-blue/10 flex items-center justify-center text-sf-blue shrink-0">
                                                <Bot size={16} />
                                            </div>
                                            <div className="bg-sf-gray/50 rounded-2xl rounded-tl-none p-3 text-[13px] text-slate-700">
                                                Hello Alex! I can help you search records, analyze pipeline, or create new items. What's on your mind?
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <input
                                            placeholder="Ask ZI to find a lead or create a task..."
                                            className="w-full bg-sf-gray border border-sf-border rounded-xl px-4 py-3 pr-12 text-[13px] focus:bg-white focus:border-sf-blue outline-none transition-all"
                                        />
                                        <button className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-sf-blue text-white rounded-lg flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors">
                                            <Send size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-sf-border bg-sf-gray/20 flex items-center gap-2">
                            <Search size={14} className="text-slate-400" />
                            <span className="text-[11px] text-slate-500 font-medium">Try "Find open deals over $50k"</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

