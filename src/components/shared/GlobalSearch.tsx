'use client';

import React from 'react';
import { Command } from 'cmdk';
import {
    Search,
    User,
    Users,
    Building2,
    Briefcase,
    CheckSquare,
    LifeBuoy,
    X,
    Plus,
    Loader2,
    History
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { SearchResult } from '@/lib/search/searchEngine';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const TypeIcon = ({ type }: { type: SearchResult['type'] }) => {
    switch (type) {
        case 'lead': return <Users className="h-4 w-4 text-orange-500" />;
        case 'contact': return <User className="h-4 w-4 text-blue-500" />;
        case 'account': return <Building2 className="h-4 w-4 text-indigo-500" />;
        case 'opportunity': return <Briefcase className="h-4 w-4 text-emerald-500" />;
        case 'task': return <CheckSquare className="h-4 w-4 text-purple-500" />;
        case 'case': return <LifeBuoy className="h-4 w-4 text-rose-500" />;
        default: return <Search className="h-4 w-4" />;
    }
};

export const GlobalSearch = () => {
    const router = useRouter();
    const { query, setQuery, results, loading, isOpen, setIsOpen } = useGlobalSearch();

    const onSelect = (result: SearchResult) => {
        router.push(result.href);
        setIsOpen(false);
    };

    return (
        <Command.Dialog
            open={isOpen}
            onOpenChange={setIsOpen}
            label="Global Search"
            className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 backdrop-blur-sm bg-slate-900/20 px-4"
        >
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center px-4 border-b border-slate-100 dark:border-slate-800">
                    <Search className="h-5 w-5 text-slate-400" />
                    <Command.Input
                        autoFocus
                        placeholder="Search leads, contacts, accounts..."
                        value={query}
                        onValueChange={setQuery}
                        className="flex-1 h-16 bg-transparent outline-none px-3 text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
                    />
                    {loading && <Loader2 className="h-5 w-5 text-slate-400 animate-spin mr-2" />}
                    <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-medium text-slate-500">
                        ESC
                    </kbd>
                </div>

                <Command.List className="max-h-[60vh] overflow-y-auto p-2 scrollbar-hide">
                    <Command.Empty className="py-12 text-center">
                        {query.length < 2 ? (
                            <div className="flex flex-col items-center gap-2 text-slate-400">
                                <Search className="h-10 w-10 opacity-20" />
                                <p className="text-sm">Type at least 2 characters to start searching...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-slate-400">
                                <LifeBuoy className="h-10 w-10 opacity-20" />
                                <p className="text-sm">No results found for "{query}"</p>
                            </div>
                        )}
                    </Command.Empty>

                    {results.length > 0 && (
                        <Command.Group heading="Search Results" className="px-2 pt-2 pb-1 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                            {results.map((result) => (
                                <Command.Item
                                    key={`${result.type}-${result.id}`}
                                    onSelect={() => onSelect(result)}
                                    className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-default select-none aria-selected:bg-slate-50 dark:aria-selected:bg-slate-800/80 transition-colors group"
                                >
                                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 group-aria-selected:bg-white dark:group-aria-selected:bg-slate-700 shadow-sm transition-colors">
                                        <TypeIcon type={result.type} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{result.title}</span>
                                        <span className="text-[11px] text-slate-500 font-medium">{result.subtitle}</span>
                                    </div>
                                    <span className="ml-auto text-[10px] py-1 px-2 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 font-bold uppercase group-aria-selected:bg-slate-100 group-aria-selected:text-slate-600 transition-colors">
                                        {result.type}
                                    </span>
                                </Command.Item>
                            ))}
                        </Command.Group>
                    )}

                    <Command.Separator className="h-[1px] bg-slate-100 dark:bg-slate-800 my-2" />

                    <Command.Group heading="Quick Actions" className="px-2 pt-2 pb-1 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                        <Command.Item
                            onSelect={() => { router.push('/leads/new'); setIsOpen(false); }}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl aria-selected:bg-indigo-50 dark:aria-selected:bg-indigo-500/10 aria-selected:text-indigo-600 dark:aria-selected:text-indigo-400 transition-colors group"
                        >
                            <Plus className="h-4 w-4" />
                            <span className="text-sm font-medium">Create New Lead</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => { router.push('/tasks/new'); setIsOpen(false); }}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl aria-selected:bg-indigo-50 dark:aria-selected:bg-indigo-500/10 aria-selected:text-indigo-600 dark:aria-selected:text-indigo-400 transition-colors group"
                        >
                            <Plus className="h-4 w-4" />
                            <span className="text-sm font-medium">Add New Task</span>
                        </Command.Item>
                    </Command.Group>
                </Command.List>

                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">↑↓</kbd>
                            <span>Navigate</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">↵</kbd>
                            <span>Select</span>
                        </div>
                    </div>
                    <p className="text-[10px] font-semibold text-slate-400 tracking-wider">ZENITH CRM ALPHA</p>
                </div>
            </div>
        </Command.Dialog>
    );
};
