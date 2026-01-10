"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Grid,
    Search,
    Settings,
    Bell,
    HelpCircle,
    Plus,
    ChevronDown,
    Star,
    History,
    Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlobalSwitcher } from './GlobalSwitcher';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationProps {
    onMenuClick?: () => void;
}

export function Navigation({ onMenuClick }: NavigationProps) {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (pathname === '/login') return null;

    return (
        <div className={cn(
            "sticky top-0 z-40 flex flex-col transition-all duration-300 backdrop-blur-md bg-white/80 border-b border-white/20",
            scrolled ? "shadow-sm" : ""
        )}>
            {/* Salesforce Global Header - Refined for Zen mode */}
            <header className="h-[64px] flex items-center justify-between px-4 sm:px-6">
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                        <Menu size={20} className="stroke-[1.5]" />
                    </button>
                    
                    <div className="relative hidden sm:block group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search anything... (⌘K)"
                            className="w-[200px] md:w-[320px] bg-slate-100/50 border border-slate-200 focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 h-10 rounded-xl pl-10 pr-4 text-sm transition-all outline-none text-slate-700 placeholder:text-slate-400 font-medium"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                    <GlobalSwitcher />
                    <div className="flex items-center gap-1 border-l border-slate-200 ml-2 pl-2 sm:pl-4">
                        {[Plus, History, Star, HelpCircle, Settings, Bell].map((Icon, i) => (
                            <button key={i} className={cn(
                                "p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all relative group",
                                (i === 1 || i === 2 || i === 3) && "hidden sm:flex"
                            )}>
                                <Icon size={20} className="stroke-[1.5]" />
                                {i === 5 && <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />}
                            </button>
                        ))}
                    </div>
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-500/20 cursor-pointer hover:scale-105 transition-all">
                        AR
                    </div>
                </div>
            </header>
        </div>
    );
}
