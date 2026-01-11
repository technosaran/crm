"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { toast } from 'sonner';

export type OpportunityStage = 'NEW' | 'QUALIFICATION' | 'NEEDS_ANALYSIS' | 'VALUE_PROPOSITION' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST';

export interface Opportunity {
    id: string;
    name: string;
    description: string | null;
    account_id: string;
    account_name: string | null;
    contact_id: number | null;
    amount: number;
    stage: OpportunityStage;
    probability: number;
    expected_close_date: string;
    closed_at: string | null;
    next_step: string | null;
    lead_source: string | null;
    owner_id: string;
    created_at: string;
    updated_at: string;
}

export function useOpportunities() {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchOpportunities = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('opportunities')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOpportunities(data || []);
        } catch (error: any) {
            console.error('Error fetching opportunities:', error);
        } finally {
            setLoading(false);
        }
    };

    const createOpportunity = async (opportunity: Partial<Opportunity>) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            // Map name to title for database compatibility
            const insertData = {
                ...opportunity,
                name: opportunity.name || 'Untitled Opportunity',
                owner_id: user?.id,
                stage: opportunity.stage || 'NEW',
                probability: opportunity.probability || 10,
                amount: opportunity.amount || 0,
                expected_close_date: opportunity.expected_close_date || new Date().toISOString().split('T')[0],
                created_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('opportunities')
                .insert([insertData])
                .select()
                .single();

            if (error) throw error;
            setOpportunities(prev => [data, ...prev]);
            toast.success("Opportunity created successfully");
            return true;
        } catch (error: any) {
            console.error('Error creating opportunity:', error);
            toast.error(error.message || "Failed to create opportunity");
            return false;
        }
    };

    const updateOpportunity = async (id: string, updates: Partial<Opportunity>) => {
        try {
            const { error } = await supabase
                .from('opportunities')
                .update(updates)
                .eq('id', id);

            if (error) throw error;
            setOpportunities(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
            toast.success("Opportunity updated successfully");
            return true;
        } catch (error: any) {
            console.error('Error updating opportunity:', error);
            toast.error("Failed to update opportunity");
            return false;
        }
    };

    const updateStage = async (id: string, stage: OpportunityStage) => {
        // Calculate probability based on stage
        const stageProbabilities: Record<OpportunityStage, number> = {
            NEW: 10,
            QUALIFICATION: 20,
            NEEDS_ANALYSIS: 40,
            VALUE_PROPOSITION: 60,
            PROPOSAL: 75,
            NEGOTIATION: 90,
            CLOSED_WON: 100,
            CLOSED_LOST: 0,
        };

        const updates: Partial<Opportunity> = {
            stage,
            probability: stageProbabilities[stage],
        };

        if (stage === 'CLOSED_WON' || stage === 'CLOSED_LOST') {
            updates.closed_at = new Date().toISOString();
        }

        return updateOpportunity(id, updates);
    };

    const deleteOpportunities = async (ids: string[]) => {
        try {
            const { error } = await supabase
                .from('opportunities')
                .delete()
                .in('id', ids);

            if (error) throw error;
            setOpportunities(prev => prev.filter(o => !ids.includes(o.id)));
            toast.success("Opportunities deleted");
        } catch (error: any) {
            console.error('Error deleting opportunities:', error);
            toast.error("Failed to delete opportunities");
        }
    };

    const getOpportunityById = async (id: string) => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('opportunities')
                .select(`
                    *,
                    accounts (name),
                    user_profiles!owner_id (full_name, email)
                `)
                .eq('id', id)
                .single();

            if (error) throw error;
            return {
                ...data,
                name: data.name || 'Untitled Opportunity',
                account_name: data.accounts?.name
            };
        } catch (error: any) {
            console.error('Error fetching opportunity:', error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOpportunities();
    }, []);

    return {
        opportunities,
        loading,
        createOpportunity,
        updateOpportunity,
        updateStage,
        deleteOpportunities,
        getOpportunityById,
        refresh: fetchOpportunities
    };
}
