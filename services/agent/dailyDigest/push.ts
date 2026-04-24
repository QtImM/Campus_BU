import { createNotification } from '../../notifications';
import { isDailyDigestPushSent, markDailyDigestPushSent } from './repository';
import { DailyDigestPayload } from './types';

const DAILY_DIGEST_PUSH_BODY = 'Open Agent to read today\'s AI news digest.';

export const sendDailyDigestPush = async (userId: string, payload: DailyDigestPayload): Promise<boolean> => {
    if (!userId || payload.items.length === 0) {
        return false;
    }

    const alreadySent = await isDailyDigestPushSent(userId, payload.date);
    if (alreadySent) {
        return true;
    }

    await createNotification({
        user_id: userId,
        type: 'system',
        title: `AI news digest ${payload.date}`,
        content: DAILY_DIGEST_PUSH_BODY,
        related_id: `daily_digest:${payload.date}`,
    });

    await markDailyDigestPushSent(userId, payload.date);
    return true;
};
