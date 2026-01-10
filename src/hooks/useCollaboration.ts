'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Comment {
    id: string;
    content: string;
    user_id: string;
    created_at: string;
    user_profile?: {
        name: string;
        avatar_url?: string;
    };
}

export function useCollaboration(entityType: string, entityId: string) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchComments = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('comments')
                .select(`
          *,
          user_profile:user_profiles (
            name,
            avatar_url
          )
        `)
                .eq('entity_type', entityType)
                .eq('entity_id', entityId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setComments(data || []);
        } catch (error: any) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const addComment = async (content: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('comments')
                .insert([{
                    entity_type: entityType,
                    entity_id: entityId,
                    user_id: user.id,
                    content
                }])
                .select(`
          *,
          user_profile:user_profiles (
            name,
            avatar_url
          )
        `)
                .single();

            if (error) throw error;
            setComments(prev => [data, ...prev]);
            return true;
        } catch (error: any) {
            toast.error('Failed to add comment');
            return false;
        }
    };

    useEffect(() => {
        if (entityId) fetchComments();
    }, [entityId, entityType]);

    return { comments, loading, addComment, refresh: fetchComments };
}
