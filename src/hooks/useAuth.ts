"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Role, Permission, hasPermission } from '@/lib/rbac';

interface UserProfile {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    role: Role;
    department: string | null;
    phone: string | null;
    is_active: boolean;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        // Get initial session and profile
        const getSessionAndProfile = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setUser(session?.user ?? null);

                if (session?.user) {
                    // Fetch user profile from database
                    const { data: profileData, error } = await supabase
                        .from('user_profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    if (!error && profileData) {
                        setProfile(profileData);
                    } else if (error && error.code === 'PGRST116') {
                        // Profile doesn't exist, create one
                        const { data: newProfile } = await supabase
                            .from('user_profiles')
                            .insert([{
                                id: session.user.id,
                                email: session.user.email!,
                                full_name: session.user.user_metadata?.full_name || null,
                                role: 'SALES' // Default role
                            }])
                            .select()
                            .single();

                        if (newProfile) {
                            setProfile(newProfile);
                        }
                    }
                }
            } catch (error) {
                console.error("Auth session error:", error);
            } finally {
                setLoading(false);
            }
        };

        getSessionAndProfile();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setUser(session?.user ?? null);
                
                if (session?.user) {
                    // Fetch updated profile
                    const { data: profileData } = await supabase
                        .from('user_profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    setProfile(profileData || null);
                } else {
                    setProfile(null);
                }
                
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
    };

    const checkPermission = (permission: Permission): boolean => {
        if (!profile) return false;
        return hasPermission(profile.role, permission);
    };

    const isAdmin = profile?.role === 'SUPER_ADMIN' || profile?.role === 'ADMIN';
    const isManager = profile?.role === 'MANAGER' || isAdmin;

    return {
        user: user ? {
            ...user,
            name: profile?.full_name || user.email || 'User',
            role: profile?.role || 'GUEST'
        } : {
            name: 'Guest',
            role: 'GUEST' as Role
        },
        profile,
        loading,
        isAuthenticated: !!user && !!profile,
        signOut,
        isAdmin,
        isManager,
        hasPermission: checkPermission,
    };
}
