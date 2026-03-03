import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Supabase credentials missing in environment variables!');
}

// Only import AsyncStorage when needed and when window is available
const getAsyncStorage = () => {
    if (typeof window !== 'undefined') {
        return require('@react-native-async-storage/async-storage').default;
    }
    return {
        getItem: async () => null,
        setItem: async () => {},
        removeItem: async () => {},
    };
};

// Create Supabase client with conditional storage
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: getAsyncStorage(),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
