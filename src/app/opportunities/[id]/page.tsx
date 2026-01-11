"use client";

import { SalesPipeline } from "@/components/crm/SalesPipeline";
import { ChevronLeft, Share2, MoreHorizontal, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useOpportunities } from "@/hooks/useOpportunities";

export default function OpportunityDetail() {
    const params = useParams();
    const id = params.id as string;
    const { getOpportunityById } = useOpportunities();
    const [opportunity, setOpportunity] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        const data = await getOpportunityById(id);
        setOpportunity(data);
        setLoading(false);
    };

    useEffect(() => {
        if (id) loadData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
                <Loader2 className="h-10 w-10 animate-spin mb-4" />
                <p className="font-bold text-slate-800 tracking-tight">Loading Opportunity...</p>
            </div>
        );
    }

    if (!opportunity) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
                <p className="font-bold text-slate-800 tracking-tight">Opportunity not found</p>
                <Link href="/opportunities" className="text-sf-blue font-bold mt-4">Return to Pipeline</Link>
            </div>
        );
    }

    return (
        <div className="space-y-4 pb-12">
            {/* Context Breadcrumb */}
            <div className="flex items-center justify-between px-1">
                <Link
                    href="/opportunities"
                    className="flex items-center gap-1 text-[13px] font-bold text-sf-blue hover:underline"
                >
                    <ChevronLeft size={16} /> Back to Pipeline
                </Link>
                <div className="flex items-center gap-2">
                    <button className="sf-btn-neutral flex items-center gap-2"><Share2 size={14} /> Share</button>
                    <button className="sf-btn-neutral"><MoreHorizontal size={14} /></button>
                </div>
            </div>

            <SalesPipeline opportunity={opportunity} onUpdate={loadData} />
        </div>
    );
}
