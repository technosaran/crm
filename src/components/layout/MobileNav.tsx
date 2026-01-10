'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Users,
    Briefcase,
    CheckSquare,
    MoreHorizontal,
    Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav() {
    const pathname = usePathname();

    const navItems = [
        { label: 'Home', icon: Home, href: '/' },
        { label: 'Leads', icon: Users, href: '/leads' },
        { label: 'Deals', icon: Briefcase, href: '/opportunities' },
        { label: 'Tasks', icon: CheckSquare, href: '/tasks' },
        { label: 'Menu', icon: MoreHorizontal, href: '/settings' },
    ];

    if (pathname === '/login') return null;

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-6 py-3 pb-8">
            <div className="flex items-center justify-between max-w-md mx-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex flex-col items-center gap-1 group"
                        >
                            <div className={cn(
                                "p-2 rounded-2xl transition-all duration-300",
                                isActive
                                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 scale-110"
                                    : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                            )}>
                                <Icon className="h-5 w-5 stroke-[2]" />
                            </div>
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-widest",
                                isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
