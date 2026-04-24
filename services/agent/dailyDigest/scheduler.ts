import storage from '../../../lib/storage';
import { getDailyDigestDate } from './config';
import { runDailyDigestJobForUser } from './job';
import { DigestJobResult } from './types';

export const DAILY_DIGEST_SCHEDULE_HOUR = 10;
export const DAILY_DIGEST_SCHEDULE_MINUTE = 45;

const getScheduledRunKey = (userId: string, date: string) =>
    `agent_daily_digest_scheduled_run:${userId}:${date}`;

const isBeforeSchedule = (date: Date): boolean => {
    const hour = date.getHours();
    const minute = date.getMinutes();
    return hour < DAILY_DIGEST_SCHEDULE_HOUR
        || (hour === DAILY_DIGEST_SCHEDULE_HOUR && minute < DAILY_DIGEST_SCHEDULE_MINUTE);
};

export const runScheduledDailyDigestIfDue = async (
    userId: string,
    now: Date = new Date(),
): Promise<
    | { didRun: false; reason: 'missing_user_id' | 'before_schedule' | 'already_ran' }
    | { didRun: true; result: DigestJobResult }
> => {
    if (!userId) {
        return { didRun: false, reason: 'missing_user_id' };
    }

    if (isBeforeSchedule(now)) {
        return { didRun: false, reason: 'before_schedule' };
    }

    const dateStr = getDailyDigestDate(now);
    const runKey = getScheduledRunKey(userId, dateStr);
    const alreadyRan = await storage.getItem(runKey);
    if (alreadyRan === '1') {
        return { didRun: false, reason: 'already_ran' };
    }

    const result = await runDailyDigestJobForUser(userId, now, {
        forceRefresh: true,
        sendPush: true,
    });

    await storage.setItem(runKey, '1');
    return { didRun: true, result };
};
