"use client";

import React from 'react';
import { Search, Bell, Moon, Sun, User, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
    onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
    return (
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 sm:px-6 backdrop-blur-md">
            {/* Mobile Menu Button */}
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* Search Bar */}
            <div className="flex-1 flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 transition-all max-w-md mx-4">
                <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
                <button className="relative rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive border-2 border-background" />
                </button>

                <div className="h-8 w-px bg-border mx-1 sm:mx-2 hidden sm:block" />

                <div className="flex items-center gap-2 sm:gap-3 pl-0 sm:pl-2">
                    <div className="flex flex-col items-end hidden md:flex">
                        <span className="text-sm font-semibold">Alex Rivera</span>
                        <span className="text-[10px] text-muted-foreground">Sales Director</span>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-indigo-400 text-white font-bold shadow-md shadow-primary/20">
                        AR
                    </div>
                </div>
            </div>
        </header>
    );
}
