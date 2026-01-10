import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-slate-200 dark:bg-slate-800",
                className
            )}
        />
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-10 w-full rounded-2xl" />
            <div className="space-y-2">
                {Array.from({ length: rows }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-2xl" />
                ))}
            </div>
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-2xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                </div>
            </div>
            <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
    );
}
