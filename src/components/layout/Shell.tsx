"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Navigation } from "./Navigation";
import { Sidebar } from "./Sidebar"; // Import Sidebar
import { GlobalSearch } from "@/components/shared/GlobalSearch";
import { MobileNav } from "./MobileNav";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

import { AIAssistant } from "@/components/shared/AIAssistant";
import { useNotifications } from "@/hooks/useNotifications";

export function Shell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Initialize real-time notifications
    useNotifications();

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
                <GlobalSearch />
                <AIAssistant />
                <Toaster position="top-right" richColors />
                <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden pb-24 lg:pb-8">
                    {children}
                </main>
                <MobileNav />
            </div>
        </div>
    );
}
