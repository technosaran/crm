'use client';

import React from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';
import { locales } from '@/lib/translateService';
import {
    Globe,
    ChevronDown,
    Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const LanguageSwitcher = () => {
    const { locale, setLocale } = useGlobalStore();
    const [isOpen, setIsOpen] = React.useState(false);

    const selectedLocale = locales.find(l => l.code === locale) || locales[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-all group"
            >
                <div className="h-5 w-5 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg flex items-center justify-center text-[11px] font-black text-indigo-600">
                    <Globe size={14} />
                </div>
                <span className="text-[11px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest hidden md:inline">
                    {selectedLocale.code.split('-')[0]}
                </span>
                <ChevronDown size={14} className={cn("text-slate-400 transition-transform", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
                        >
                            <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">Select Language</p>
                            </div>
                            <div className="p-1">
                                {locales.map((l) => (
                                    <button
                                        key={l.code}
                                        onClick={() => {
                                            setLocale(l.code);
                                            setIsOpen(false);
                                            window.location.reload(); // Traditional simple reload for i18n
                                        }}
                                        className={cn(
                                            "w-full flex items-center justify-between p-3 rounded-xl transition-all",
                                            locale === l.code
                                                ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600"
                                                : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm">{l.flag}</span>
                                            <div className="text-left">
                                                <p className="text-xs font-black uppercase tracking-tight leading-none">{l.name}</p>
                                                <p className="text-[9px] font-bold text-slate-400 mt-0.5">{l.code}</p>
                                            </div>
                                        </div>
                                        {locale === l.code && <Check size={14} className="text-indigo-600" />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
