import { createClient } from '@supabase/supabase-js';

// Production credentials from .env.production
const supabaseUrl = 'https://fcbsekidlijtidqzkddx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjYnNla2lkbGlqdGlkcXprZGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NzgzMDAsImV4cCI6MjA4ODI1NDMwMH0.nOSFfSYw0_xAF9zt4S1qpppsCX3cD7BzRJoJI33Kxoo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    console.log("Checking push tokens...");
    const { data: tokens, error: tokensError } = await supabase
        .from('user_push_tokens')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

    if (tokensError) {
        console.error("Error fetching tokens:", tokensError.message);
    } else {
        console.log(`Found ${tokens?.length || 0} push tokens in the database.`);
        console.log(tokens);
    }

    console.log("\nChecking recent notifications...");
    const { data: notifs, error: notifsError } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

    if (notifsError) {
        console.error("Error fetching notifications:", notifsError.message);
    } else {
        console.log(`Found ${notifs?.length || 0} recent notifications in the database.`);
        console.log(notifs);
    }
}

checkData();
