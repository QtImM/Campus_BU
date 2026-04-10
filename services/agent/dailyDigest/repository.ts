import storage from '../../../lib/storage';
import { DailyDigestPayload } from './types';

const getDigestKey = (userId: string, date: string) => `agent_daily_digest:${userId}:${date}`;
const getPushSentKey = (userId: string, date: string) => `agent_daily_digest_push_sent:${userId}:${date}`;
const getDigestEnabledKey = (userId: string) => `agent_daily_digest_enabled:${userId}`;

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
    return value === 'true';
};

export const setDailyDigestEnabled = async (userId: string, enabled: boolean): Promise<void> => {
    if (!userId) {
        return;
    }

    await storage.setItem(getDigestEnabledKey(userId), enabled ? 'true' : 'false');
};
