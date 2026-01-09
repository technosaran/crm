"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Case {
    id: number;
    case_number: string;
    subject: string;
    description: string | null;
    status: 'NEW' | 'OPEN' | 'IN_PROGRESS' | 'ESCALATED' | 'ON_HOLD' | 'CLOSED' | 'RESOLVED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    type: 'QUESTION' | 'PROBLEM' | 'FEATURE_REQUEST' | 'BUG' | 'OTHER' | null;
    origin: 'PHONE' | 'EMAIL' | 'WEB' | 'CHAT' | 'SOCIAL_MEDIA' | null;
    account_id: number | null;
    contact_id: number | null;
    owner_id: string | null;
    resolution: string | null;
    created_at: string;
}

export function useCases() {
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchCases = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('cases')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCases(data || []);
        } catch (error: any) {
            console.error('Error fetching cases:', error);
        } finally {
            setLoading(false);
        }
    };

    const createCase = async (caseData: Partial<Case>) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            const { data, error } = await supabase
                .from('cases')
                .insert([{
                    ...caseData,
                    owner_id: user?.id,
                    status: caseData.status || 'NEW',
                    priority: caseData.priority || 'MEDIUM',
                    created_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;
            setCases(prev => [data, ...prev]);
            toast.success("Case created successfully");
            return true;
        } catch (error: any) {
            console.error('Error creating case:', error);
            toast.error(error.message || "Failed to create case");
            return false;
        }
    };

    const updateCase = async (id: number, updates: Partial<Case>) => {
        try {
            const { error } = await supabase
                .from('cases')
                .update(updates)
                .eq('id', id);

            if (error) throw error;
            setCases(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
            toast.success("Case updated successfully");
            return true;
        } catch (error: any) {
            console.error('Error updating case:', error);
            toast.error("Failed to update case");
            return false;
        }
    };

    const deleteCases = async (ids: number[]) => {
        try {
            const { error } = await supabase
                .from('cases')
                .delete()
                .in('id', ids);

            if (error) throw error;
            setCases(prev => prev.filter(c => !ids.includes(c.id)));
            toast.success("Cases deleted");
        } catch (error: any) {
            console.error('Error deleting cases:', error);
            toast.error("Failed to delete cases");
        }
    };

    const closeCase = async (id: number, resolution: string) => {
        return updateCase(id, {
            status: 'CLOSED',
            resolution,
        });
    };

    useEffect(() => {
        fetchCases();
    }, []);

    return { cases, loading, createCase, updateCase, deleteCases, closeCase, refresh: fetchCases };
}
