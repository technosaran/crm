"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Task {
    id: number;
    subject: string;
    description: string | null;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'WAITING' | 'DEFERRED';
    priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
    due_date: string | null;
    reminder_at: string | null;
    completed_at: string | null;
    entity_id: number | null;
    entity_type: string | null;
    assigned_to_id: string | null;
    owner_id: string | null;
    created_at: string;
}

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .or(`assigned_to_id.eq.${user?.id},owner_id.eq.${user?.id}`)
                .order('due_date', { ascending: true, nullsFirst: false });

            if (error) throw error;
            setTasks(data || []);
        } catch (error: any) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const createTask = async (task: Partial<Task>) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            const { data, error } = await supabase
                .from('tasks')
                .insert([{
                    ...task,
                    owner_id: user?.id,
                    assigned_to_id: task.assigned_to_id || user?.id,
                    status: task.status || 'NOT_STARTED',
                    priority: task.priority || 'NORMAL',
                    created_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;
            setTasks(prev => [data, ...prev]);
            toast.success("Task created successfully");
            return true;
        } catch (error: any) {
            console.error('Error creating task:', error);
            toast.error(error.message || "Failed to create task");
            return false;
        }
    };

    const updateTask = async (id: number, updates: Partial<Task>) => {
        try {
            const { error } = await supabase
                .from('tasks')
                .update(updates)
                .eq('id', id);

            if (error) throw error;
            setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
            toast.success("Task updated successfully");
            return true;
        } catch (error: any) {
            console.error('Error updating task:', error);
            toast.error("Failed to update task");
            return false;
        }
    };

    const deleteTasks = async (ids: number[]) => {
        try {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .in('id', ids);

            if (error) throw error;
            setTasks(prev => prev.filter(t => !ids.includes(t.id)));
            toast.success("Tasks deleted");
        } catch (error: any) {
            console.error('Error deleting tasks:', error);
            toast.error("Failed to delete tasks");
        }
    };

    const completeTask = async (id: number) => {
        return updateTask(id, {
            status: 'COMPLETED',
            completed_at: new Date().toISOString()
        });
    };

    const getTaskById = async (id: string | number) => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('tasks')
                .select(`
                    *,
                    assigned_to:user_profiles!assigned_to_id(full_name),
                    owner:user_profiles!owner_id(full_name)
                `)
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error: any) {
            console.error('Error fetching task:', error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return { tasks, loading, createTask, updateTask, deleteTasks, completeTask, getTaskById, refresh: fetchTasks };
}
