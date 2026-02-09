import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://baihmybeajpfitionsbv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhaWhteWJlYWpwZml0aW9uc2J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1Mzc4MjksImV4cCI6MjA4NjExMzgyOX0.wS-XzFRyZAJhaxl21rT32Ij2dCbWLDdCGl1hObk9OOo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
