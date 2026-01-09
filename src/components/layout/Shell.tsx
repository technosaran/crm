"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "./Navigation";
import { CommandMenu } from "./CommandMenu";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

import { AIAssistant } from "@/components/shared/AIAssistant";

export function Shell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";

    return (
        <>
            <Navigation />
            <CommandMenu />
            <AIAssistant />
            <Toaster position="top-right" richColors />
            <main className={cn(
                "min-h-screen transition-all",
                !isLoginPage && "mt-[90px] p-4 min-h-[calc(100vh-90px)]"
            )}>
                {children}
            </main>
        </>
    );
}
