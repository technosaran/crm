'use client';

import React from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';
import {
    DollarSign,
    Coins,
    ChevronDown,
    Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
];

export const CurrencySwitcher = () => {
    const { currency, setCurrency } = useGlobalStore();
    const [isOpen, setIsOpen] = React.useState(false);

    const selectedCurrency = currencies.find(c => c.code === currency) || currencies[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-all group"
            >
                <div className="h-5 w-5 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg flex items-center justify-center text-[10px] font-black text-indigo-600">
                    {selectedCurrency.symbol}
                </div>
                <span className="text-[11px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                    {selectedCurrency.code}
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
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">Select Currency</p>
                            </div>
                            <div className="p-1">
                                {currencies.map((c) => (
                                    <button
                                        key={c.code}
                                        onClick={() => {
                                            setCurrency(c.code);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "w-full flex items-center justify-between p-3 rounded-xl transition-all",
                                            currency === c.code
                                                ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600"
                                                : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm">{c.flag}</span>
                                            <div className="text-left">
                                                <p className="text-xs font-black uppercase tracking-tight leading-none">{c.code}</p>
                                                <p className="text-[9px] font-bold text-slate-400 mt-0.5">{c.name}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-black">{c.symbol}</span>
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
