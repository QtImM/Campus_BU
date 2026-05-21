import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';
import storage from '../lib/storage';

// Single-database mode: read Expo env vars first so the app and scripts stay
// aligned, while keeping the current production project as a fallback.
export const SUPABASE_URL =
    process.env.EXPO_PUBLIC_SUPABASE_URL?.trim()
    || 'https://fcbsekidlijtidqzkddx.supabase.co';
export const SUPABASE_KEY =
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim()
    || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjYnNla2lkbGlqdGlkcXprZGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NzgzMDAsImV4cCI6MjA4ODI1NDMwMH0.nOSFfSYw0_xAF9zt4S1qpppsCX3cD7BzRJoJI33Kxoo';

const SUPABASE_FETCH_TIMEOUT_MS = 15000;
const SUPABASE_FETCH_RETRIES = 2;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableStatus = (status: number) =>
    status === 408 || status === 409 || status === 429 || status === 500 || status === 502 || status === 503 || status === 504 || status === 520;

const fetchWithTimeoutAndRetry: typeof fetch = async (input, init) => {
    let lastError: unknown = null;

    for (let attempt = 0; attempt <= SUPABASE_FETCH_RETRIES; attempt += 1) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), SUPABASE_FETCH_TIMEOUT_MS);

        try {
            const response = await fetch(input, {
                ...init,
                signal: init?.signal ?? controller.signal,
            });

            clearTimeout(timeoutId);

            if (attempt < SUPABASE_FETCH_RETRIES && isRetryableStatus(response.status)) {
                await sleep(400 * (attempt + 1));
                continue;
            }

            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            lastError = error;

            if (attempt >= SUPABASE_FETCH_RETRIES) {
                throw error;
            }

            await sleep(400 * (attempt + 1));
        }
    }

    throw lastError instanceof Error ? lastError : new Error('Supabase request failed');
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        storage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
    global: {
        fetch: fetchWithTimeoutAndRetry,
    },
});

if (Platform.OS !== 'web') {
    AppState.addEventListener('change', (state) => {
        if (state === 'active') {
            supabase.auth.startAutoRefresh();
        } else {
            supabase.auth.stopAutoRefresh();
        }
    });
}
