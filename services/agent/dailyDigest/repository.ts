import storage from '../../../lib/storage';
import { supabase } from '../../supabase';
import { DailyDigestPayload } from './types';

const getDigestKey = (userId: string, date: string) => `agent_daily_digest:${userId}:${date}`;
const getPushSentKey = (userId: string, date: string) => `agent_daily_digest_push_sent:${userId}:${date}`;
const getDigestEnabledKey = (userId: string) => `agent_daily_digest_enabled:${userId}`;

type DailyDigestRow = {
    digest_date: string;
    source_url: string;
    summary: string;
    message: string;
    items: DailyDigestPayload['items'];
    created_at?: string | null;
};

const mapRowToPayload = (row: DailyDigestRow): DailyDigestPayload => ({
    digestId: `digest_${row.digest_date}`,
    date: row.digest_date,
    sourceUrl: row.source_url,
    summary: row.summary,
    items: Array.isArray(row.items) ? row.items : [],
    message: row.message,
    createdAt: row.created_at || new Date().toISOString(),
});

const mapPayloadToRow = (payload: DailyDigestPayload): DailyDigestRow => ({
    digest_date: payload.date,
    source_url: payload.sourceUrl,
    summary: payload.summary,
    message: payload.message,
    items: payload.items,
    created_at: payload.createdAt,
});

export const getCachedDailyDigest = async (userId: string, date: string): Promise<DailyDigestPayload | null> => {
    try {
        const raw = await storage.getItem(getDigestKey(userId, date));
        if (!raw) {
            return null;
        }
        return JSON.parse(raw) as DailyDigestPayload;
    } catch (error) {
        console.warn('[DailyDigest] Failed to read cached digest:', error);
        return null;
    }
};

export const saveCachedDailyDigest = async (userId: string, payload: DailyDigestPayload): Promise<void> => {
    await storage.setItem(getDigestKey(userId, payload.date), JSON.stringify(payload));
};

export const getDatabaseDailyDigest = async (date: string): Promise<DailyDigestPayload | null> => {
    if (!date) {
        return null;
    }

    try {
        const { data, error } = await supabase
            .from('daily_digests')
            .select('digest_date, source_url, summary, message, items, created_at')
            .eq('digest_date', date)
            .maybeSingle();

        if (error || !data) {
            return null;
        }

        return mapRowToPayload(data as DailyDigestRow);
    } catch (error) {
        console.warn('[DailyDigest] Failed to read digest from Supabase:', error);
        return null;
    }
};

export const getLatestDatabaseDailyDigest = async (maxDate?: string): Promise<DailyDigestPayload | null> => {
    try {
        let query = supabase
            .from('daily_digests')
            .select('digest_date, source_url, summary, message, items, created_at');

        if (maxDate) {
            query = query.lte('digest_date', maxDate);
        }

        const { data, error } = await query
            .order('digest_date', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error || !data) {
            return null;
        }

        return mapRowToPayload(data as DailyDigestRow);
    } catch (error) {
        console.warn('[DailyDigest] Failed to read latest digest from Supabase:', error);
        return null;
    }
};

export const saveDatabaseDailyDigest = async (payload: DailyDigestPayload): Promise<void> => {
    try {
        const { error } = await supabase
            .from('daily_digests')
            .upsert(mapPayloadToRow(payload), { onConflict: 'digest_date' });

        if (error) {
            console.warn('[DailyDigest] Failed to save digest to Supabase:', error);
        }
    } catch (error) {
        console.warn('[DailyDigest] Failed to save digest to Supabase:', error);
    }
};

export const isDailyDigestPushSent = async (userId: string, date: string): Promise<boolean> => {
    const value = await storage.getItem(getPushSentKey(userId, date));
    return value === '1';
};

export const markDailyDigestPushSent = async (userId: string, date: string): Promise<void> => {
    await storage.setItem(getPushSentKey(userId, date), '1');
};

export const getDailyDigestEnabled = async (userId: string): Promise<boolean> => {
    if (!userId) {
        return false;
    }

    const value = await storage.getItem(getDigestEnabledKey(userId));
    if (value === 'true' || value === 'false') {
        return value === 'true';
    }

    try {
        const { data, error } = await supabase
            .from('user_daily_digest_preferences')
            .select('enabled')
            .eq('user_id', userId)
            .maybeSingle();

        if (!error && data && typeof data.enabled === 'boolean') {
            await storage.setItem(getDigestEnabledKey(userId), data.enabled ? 'true' : 'false');
            return data.enabled;
        }
    } catch (error) {
        console.warn('[DailyDigest] Failed to read digest preference from Supabase:', error);
    }

    return false;
};

export const setDailyDigestEnabled = async (userId: string, enabled: boolean): Promise<void> => {
    if (!userId) {
        return;
    }

    await storage.setItem(getDigestEnabledKey(userId), enabled ? 'true' : 'false');

    try {
        const { error } = await supabase
            .from('user_daily_digest_preferences')
            .upsert({
                user_id: userId,
                enabled,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });

        if (error) {
            console.warn('[DailyDigest] Failed to save digest preference to Supabase:', error);
        }
    } catch (error) {
        console.warn('[DailyDigest] Failed to save digest preference to Supabase:', error);
    }
};
