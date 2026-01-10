"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Target,
    Briefcase,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    Contact,
    MessageSquare,
    Calendar,
    FileText,
    CheckSquare,
    Files,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Users, label: 'Leads', href: '/leads' },
    { icon: Target, label: 'Opportunities', href: '/opportunities' },
    { icon: Briefcase, label: 'Accounts', href: '/accounts' },
    { icon: Contact, label: 'Contacts', href: '/contacts' },
    { icon: MessageSquare, label: 'Cases', href: '/cases' },
    { icon: Calendar, label: 'Calendar', href: '/calendar' },
    { icon: FileText, label: 'Reports', href: '/reports' },
    { icon: CheckSquare, label: 'Tasks', href: '/tasks' },
    { icon: Files, label: 'Files', href: '/files' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    { icon: Settings, label: 'Settings', href: '/settings' },
];

interface SidebarProps {
    mobileMenuOpen?: boolean;
    setMobileMenuOpen?: (open: boolean) => void;
}

export function Sidebar({ mobileMenuOpen, setMobileMenuOpen }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "hidden lg:flex sticky top-0 h-screen border-r border-white/20 bg-white/70 backdrop-blur-xl transition-all duration-300 ease-in-out z-20 shadow-2xl shadow-indigo-500/5 flex-col overflow-hidden",
                    collapsed ? "w-24" : "w-72"
                )}
            >
                <div className="flex h-20 items-center px-8">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <ShieldCheck className="h-9 w-9 text-indigo-600 transition-transform group-hover:scale-110" />
                            <div className="absolute inset-0 bg-indigo-500/20 blur-lg rounded-full animate-pulse" />
                        </div>
                        {!collapsed && (
                            <span className="font-outfit font-bold text-2xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                                Zenith
                            </span>
                        )}
                    </Link>
                </div>

                <nav className="flex-1 space-y-2 px-4 py-6 overflow-y-auto scrollbar-none">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200 group relative overflow-hidden shrink-0",
                                    isActive
                                        ? "text-white shadow-lg shadow-indigo-500/25"
                                        : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50",
                                    collapsed && "justify-center px-0"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 z-0"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <item.icon className={cn("h-5 w-5 shrink-0 relative z-10", isActive ? "text-white" : "group-hover:scale-110 transition-transform")} />
                                {!collapsed && <span className="relative z-10 font-outfit tracking-wide">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-white/40 bg-white text-slate-400 shadow-lg hover:text-indigo-600 hover:scale-110 transition-all"
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                <div className="p-4 mt-auto text-center shrink-0">
                    {!collapsed && (
                        <p className="text-[10px] text-slate-400 font-medium">v1.2.0 • Internal Build</p>
                    )}
                </div>
            </aside>

            {/* Mobile Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 h-screen w-72 border-r border-white/20 bg-white/95 backdrop-blur-xl transition-transform duration-300 ease-in-out z-50 shadow-2xl shadow-indigo-500/5 flex flex-col overflow-hidden lg:hidden",
                    mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-20 items-center px-8 justify-between">
                    <Link href="/" className="flex items-center gap-3 group" onClick={() => setMobileMenuOpen?.(false)}>
                        <div className="relative">
                            <ShieldCheck className="h-9 w-9 text-indigo-600 transition-transform group-hover:scale-110" />
                            <div className="absolute inset-0 bg-indigo-500/20 blur-lg rounded-full animate-pulse" />
                        </div>
                        <span className="font-outfit font-bold text-2xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            Zenith
                        </span>
                    </Link>
                    <button
                        onClick={() => setMobileMenuOpen?.(false)}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 space-y-2 px-4 py-6 overflow-y-auto scrollbar-none">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen?.(false)}
                                className={cn(
                                    "flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200 group relative overflow-hidden shrink-0",
                                    isActive
                                        ? "text-white shadow-lg shadow-indigo-500/25"
                                        : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="mobile-sidebar-active"
                                        className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 z-0"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <item.icon className={cn("h-5 w-5 shrink-0 relative z-10", isActive ? "text-white" : "group-hover:scale-110 transition-transform")} />
                                <span className="relative z-10 font-outfit tracking-wide">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto text-center shrink-0">
                    <p className="text-[10px] text-slate-400 font-medium">v1.2.0 • Internal Build</p>
                </div>
            </aside>
        </>
    );
}
