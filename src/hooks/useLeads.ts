"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Lead {
    id: string;
    first_name: string;
    last_name: string;
    company: string | null;
    company_name: string;
    email: string;
    phone: string | null;
    status: 'New' | 'Working' | 'Nurturing' | 'Qualified' | 'Unqualified';
    source: string;
    tags: string[] | null;
    owner_id: string;
    created_at: string;
    updated_at: string;
}

export interface LeadFilters {
    status?: string;
    search?: string;
    page: number;
    pageSize: number;
}

export function useLeads(initialFilters: Partial<LeadFilters> = {}) {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [filters, setFilters] = useState<LeadFilters>({
        page: 1,
        pageSize: 20,
        ...initialFilters
    });

    const supabase = createClient();

    const fetchLeads = useCallback(async () => {
        try {
            setLoading(true);
            const from = (filters.page - 1) * filters.pageSize;
            const to = from + filters.pageSize - 1;

            let query = supabase
                .from('leads')
                .select('*', { count: 'exact' });

            if (filters.status) {
                query = query.eq('status', filters.status);
            }

            if (filters.search) {
                query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,company_name.ilike.%${filters.search}%`);
            }

            const { data, error, count } = await query
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) throw error;
            setLeads(data || []);
            setTotalCount(count || 0);
        } catch (error: any) {
            console.error('Error fetching leads:', error);
            toast.error("Failed to load leads");
        } finally {
            setLoading(false);
        }
    }, [filters, supabase]);

    const createLead = async (lead: Partial<Lead>) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            const insertData = {
                ...lead,
                company_name: lead.company_name || lead.company || 'Unknown Company',
                owner_id: user?.id,
                status: lead.status || 'New',
                created_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('leads')
                .insert([insertData])
                .select()
                .single();

            if (error) throw error;
            setLeads(prev => [data, ...prev]);
            toast.success("Lead created successfully");
            return data;
        } catch (error: any) {
            console.error('Error creating lead:', error);
            toast.error(error.message || "Failed to create lead");
            return null;
        }
    };

    const updateLead = async (id: string, updates: Partial<Lead>) => {
        try {
            const { error } = await supabase
                .from('leads')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', id);

            if (error) throw error;
            setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
            toast.success("Lead updated");
            return true;
        } catch (error: any) {
            console.error('Error updating lead:', error);
            toast.error("Failed to update lead");
            return false;
        }
    };

    const deleteLeads = async (ids: string[]) => {
        try {
            const { error } = await supabase
                .from('leads')
                .delete()
                .in('id', ids);

            if (error) throw error;
            setLeads(prev => prev.filter(l => !ids.includes(l.id)));
            toast.success(`${ids.length} leads deleted`);
        } catch (error: any) {
            console.error('Error deleting leads:', error);
            toast.error("Failed to delete leads");
        }
    };

    const convertLead = async (leadId: string, options: {
        createAccount?: boolean;
        createContact?: boolean;
        createOpportunity?: boolean;
        opportunityName?: string;
        opportunityAmount?: number;
    } = { createAccount: true, createContact: true }) => {
        try {
            const lead = leads.find(l => l.id === leadId);
            if (!lead) throw new Error('Lead not found');

            const { data: { user } } = await supabase.auth.getUser();
            let accountId: string | null = null;

            if (options.createAccount) {
                const { data: account, error: accountError } = await supabase
                    .from('accounts')
                    .insert([{
                        name: lead.company_name || lead.company || `${lead.first_name} ${lead.last_name}`,
                        type: 'CUSTOMER',
                        owner_id: user?.id
                    }])
                    .select()
                    .single();

                if (accountError) throw accountError;
                accountId = account.id;
            }

            if (options.createContact) {
                const { error: contactError } = await supabase
                    .from('contacts')
                    .insert([{
                        first_name: lead.first_name,
                        last_name: lead.last_name,
                        email: lead.email,
                        phone: lead.phone,
                        owner_id: user?.id
                    }]);

                if (contactError) throw contactError;
            }

            if (options.createOpportunity && accountId) {
                const { error: oppError } = await supabase
                    .from('opportunities')
                    .insert([{
                        title: options.opportunityName || `${lead.company_name} - New Opportunity`,
                        account_id: accountId,
                        amount: options.opportunityAmount || 0,
                        stage: 'NEW',
                        owner_id: user?.id
                    }]);

                if (oppError) throw oppError;
            }

            await updateLead(leadId, { status: 'Qualified' });
            toast.success("Lead converted successfully!");
            return true;
        } catch (error: any) {
            console.error('Error converting lead:', error);
            toast.error(error.message || "Failed to convert lead");
            return false;
        }
    };

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    return {
        leads,
        loading,
        totalCount,
        filters,
        setFilters,
        createLead,
        updateLead,
        deleteLeads,
        convertLead,
        refresh: fetchLeads
    };
}
