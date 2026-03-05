import { createClient } from '@supabase/supabase-js';
import storage from '../lib/storage';

// 这里只需要切换 true / false 即可
const IS_PROD = true; // 开发时 false，打包正式/TestFlight 改成 true

const DEV_CONFIG = {
    url: 'https://baihmybeajpfitionsbv.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhaWhteWJlYWpwZml0aW9uc2J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1Mzc4MjksImV4cCI6MjA4NjExMzgyOX0.wS-XzFRyZAJhaxl21rT32Ij2dCbWLDdCGl1hObk9OOo'
};

const PROD_CONFIG = {
    url: 'https://fcbsekidlijtidqzkddx.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjYnNla2lkbGlqdGlkcXprZGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NzgzMDAsImV4cCI6MjA4ODI1NDMwMH0.nOSFfSYw0_xAF9zt4S1qpppsCX3cD7BzRJoJI33Kxoo'
};

const config = IS_PROD ? PROD_CONFIG : DEV_CONFIG;

export const supabase = createClient(config.url, config.key, {
    auth: {
        storage: storage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
