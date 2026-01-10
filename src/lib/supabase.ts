import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
    // Use placeholder values during build if env vars are not set
    // This allows the build to succeed while still requiring proper config at runtime
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
    
    return createBrowserClient(
        supabaseUrl,
        supabaseAnonKey
    );
}
