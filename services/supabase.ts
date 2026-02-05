import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vtayzrqjwgdzvexrrpkm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0YXl6cnFqd2dkenZleHJycGttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMjAzMzYsImV4cCI6MjA4NTU5NjMzNn0.upWwdCe8reaW5keM9xeEozrDSK2OBPJ3J4MJdJqrw5c';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
