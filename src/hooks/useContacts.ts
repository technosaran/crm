"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Contact {
    id: number;
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string | null;
    mobile: string | null;
    title: string | null;
    department: string | null;
    account_id: number | null;
    is_primary: boolean;
    do_not_call: boolean;
    do_not_email: boolean;
    owner_id: string | null;
    created_at: string;
}

export function useContacts() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('contacts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setContacts(data || []);
        } catch (error: any) {
            console.error('Error fetching contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    const createContact = async (contact: Partial<Contact>) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            const { data, error } = await supabase
                .from('contacts')
                .insert([{
                    ...contact,
                    owner_id: user?.id
                }])
                .select()
                .single();

            if (error) throw error;
            setContacts(prev => [data, ...prev]);
            toast.success("Contact created successfully");
            return true;
        } catch (error: any) {
            console.error('Error creating contact:', error);
            toast.error(error.message || "Failed to create contact");
            return false;
        }
    };

    const updateContact = async (id: number, updates: Partial<Contact>) => {
        try {
            const { error } = await supabase
                .from('contacts')
                .update(updates)
                .eq('id', id);

            if (error) throw error;
            setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
            toast.success("Contact updated successfully");
            return true;
        } catch (error: any) {
            console.error('Error updating contact:', error);
            toast.error("Failed to update contact");
            return false;
        }
    };

    const deleteContacts = async (ids: number[]) => {
        try {
            const { error } = await supabase
                .from('contacts')
                .delete()
                .in('id', ids);

            if (error) throw error;
            setContacts(prev => prev.filter(c => !ids.includes(c.id)));
            toast.success("Contacts deleted");
        } catch (error: any) {
            console.error('Error deleting contacts:', error);
            toast.error("Failed to delete contacts");
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    return { contacts, loading, createContact, updateContact, deleteContacts, refresh: fetchContacts };
}
