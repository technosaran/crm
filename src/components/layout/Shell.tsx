"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Navigation } from "./Navigation";
import { Sidebar } from "./Sidebar"; // Import Sidebar
import { CommandMenu } from "./CommandMenu";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

import { AIAssistant } from "@/components/shared/AIAssistant";

export function Shell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    if (isLoginPage) {
        return (
            <>
                <Toaster position="top-right" richColors />
                <main className="min-h-screen">
                    {children}
                </main>
            </>
        );
    }

    return (
        <div className="flex min-h-screen bg-zenith-bg">
            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar (Fixed/Sticky behavior handled by its own styles or flex) */}
            <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <Navigation onMenuClick={() => setMobileMenuOpen(true)} />
                <CommandMenu />
                <AIAssistant />
                <Toaster position="top-right" richColors />
                <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
