'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { toast } from 'sonner';

export type CustomFieldType = 'text' | 'number' | 'date' | 'boolean' | 'select';

export interface CustomField {
    id: string;
    entity_type: string;
    name: string;
    label: string;
    field_type: CustomFieldType;
    options?: string[];
    is_required: boolean;
    default_value?: string;
}

export function useCustomFields(entityType: string) {
    const [fields, setFields] = useState<CustomField[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchFields = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('custom_fields')
                .select('*')
                .eq('entity_type', entityType)
                .order('order_index', { ascending: true });

            if (error) throw error;
            setFields(data || []);
        } catch (error: any) {
            console.error('Error fetching custom fields:', error);
        } finally {
            setLoading(false);
        }
    };

    const getEntityValues = async (entityId: string) => {
        try {
            const { data, error } = await supabase
                .from('custom_field_values')
                .select('field_id, value')
                .eq('entity_id', entityId);

            if (error) throw error;
            return data?.reduce((acc: any, curr) => {
                acc[curr.field_id] = curr.value;
                return acc;
            }, {}) || {};
        } catch (error) {
            console.error('Error fetching field values:', error);
            return {};
        }
    };

    const saveValues = async (entityId: string, values: Record<string, any>) => {
        try {
            const upserts = Object.entries(values).map(([fieldId, value]) => ({
                field_id: fieldId,
                entity_id: entityId,
                value: value?.toString() || null
            }));

            const { error } = await supabase
                .from('custom_field_values')
                .upsert(upserts, { onConflict: 'field_id, entity_id' });

            if (error) throw error;
            return true;
        } catch (error: any) {
            toast.error('Failed to save custom fields');
            return false;
        }
    };

    useEffect(() => {
        if (entityType) fetchFields();
    }, [entityType]);

    return { fields, loading, getEntityValues, saveValues, refresh: fetchFields };
}
