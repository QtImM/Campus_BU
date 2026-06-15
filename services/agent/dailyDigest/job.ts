import { composeDailyDigestMessage } from './composeMessage';
import { buildDailyDigestSourceUrl, DAILY_DIGEST_CONFIG, getDailyDigestDate } from './config';
import { fetchDailyDigestSourceHtml } from './fetchSource';
import { parseDailyDigestItems, parseDailyDigestSummaryText } from './parseSource';
import { sendDailyDigestPush } from './push';
import {
    getCachedDailyDigest,
    getDatabaseDailyDigest,
    getLatestDatabaseDailyDigest,
    saveCachedDailyDigest,
    saveDatabaseDailyDigest,
} from './repository';
import { buildDailyDigestSummary } from './summarize';
import { DailyDigestJobOptions, DailyDigestPayload, DigestJobResult } from './types';

const isLegacyListMessage = (message?: string): boolean =>
    Boolean(message && (
        message.includes('相关新闻链接：')
        || message.startsWith('今日摘要\n')
        || message.includes('\n· ')
        || !message.includes('【1】(')
        || !message.startsWith('· ')
        || (message.includes('【1】(') && !/【\d+】\([^)]+\)[、，,；;]/.test(message))
    ));

const hasStructuredLineRefs = (items?: DailyDigestPayload['items']): boolean =>
    Boolean(items && items.length > 0 && items.every((item) => typeof item.lineIndex === 'number' && !!item.contextSnippet));

const isStaleCachedMessage = (payload: DailyDigestPayload): boolean =>
    composeDailyDigestMessage(payload.summary, payload.items) !== payload.message;

const normalizePayload = (payload: DailyDigestPayload | null | undefined): DailyDigestPayload | null => {
    if (!payload || payload.items.length === 0 || !hasStructuredLineRefs(payload.items)) {
        return null;
    }

    if (isLegacyListMessage(payload.message) || isStaleCachedMessage(payload)) {
        return {
            ...payload,
            message: composeDailyDigestMessage(payload.summary, payload.items),
        };
    }

    return payload;
};

const addDays = (date: Date, offsetDays: number): Date => {
    const next = new Date(date);
    next.setDate(next.getDate() + offsetDays);
    return next;
};

const logDailyDigestDebug = (stage: string, payload: {
    userId: string,
    date: string,
    sourceUrl?: string,
    fromCache?: boolean,
    extractedSummary?: string | null,
    items?: DailyDigestPayload['items'],
}) => {
    console.log(`[DailyDigest] ${stage}`, {
        userId: payload.userId,
        date: payload.date,
        sourceUrl: payload.sourceUrl,
        fromCache: payload.fromCache,
        itemCount: payload.items?.length ?? 0,
        summaryLineCount: payload.extractedSummary?.split('\n').filter(Boolean).length ?? 0,
    });
};

export const runDailyDigestJobForUser = async (
    userId: string,
    date: Date = new Date(),
    options: DailyDigestJobOptions = {}
): Promise<DigestJobResult> => {
    if (!userId) {
        return {
            ok: false,
            reason: 'missing_user_id',
        };
    }

    const dateStr = getDailyDigestDate(date);
    const shouldSendPush = options.sendPush === true;
    const todayStr = getDailyDigestDate(new Date());
    const shouldFallbackToRecent = dateStr === todayStr;

    if (!options.forceRefresh) {
        const cached = await getCachedDailyDigest(userId, dateStr);

        const normalizedCached = normalizePayload(cached);
        if (normalizedCached) {
            logDailyDigestDebug('cache_hit', {
                userId,
                date: dateStr,
                sourceUrl: normalizedCached.sourceUrl,
                fromCache: true,
                items: normalizedCached.items,
            });
            if (shouldSendPush) {
                await sendDailyDigestPush(userId, normalizedCached);
            }
            return {
                ok: true,
                payload: normalizedCached,
                fromCache: true,
            };
        }

        const stored = await getDatabaseDailyDigest(dateStr);
        const normalizedStored = normalizePayload(stored);
        if (normalizedStored) {
            await saveCachedDailyDigest(userId, normalizedStored);
            if (shouldSendPush) {
                await sendDailyDigestPush(userId, normalizedStored);
            }
            return {
                ok: true,
                payload: normalizedStored,
                fromCache: true,
            };
        }

        if (shouldFallbackToRecent) {
            const latestStored = await getLatestDatabaseDailyDigest(dateStr);
            const normalizedLatestStored = normalizePayload(latestStored);
            if (normalizedLatestStored) {
                await saveCachedDailyDigest(userId, normalizedLatestStored);
                if (shouldSendPush) {
                    await sendDailyDigestPush(userId, normalizedLatestStored);
                }
                return {
                    ok: true,
                    payload: normalizedLatestStored,
                    fromCache: true,
                };
            }
        }
    }

    try {
        let sawPublishedPage = false;

        for (let offset = 0; offset <= (shouldFallbackToRecent ? DAILY_DIGEST_CONFIG.maxFallbackDays : 0); offset += 1) {
            const targetDate = addDays(date, -offset);
            const targetDateStr = getDailyDigestDate(targetDate);

            if (!options.forceRefresh) {
                const fallbackCached = await getCachedDailyDigest(userId, targetDateStr);
                const normalizedFallbackCached = normalizePayload(fallbackCached);
                if (normalizedFallbackCached) {
                    if (shouldSendPush) {
                        await sendDailyDigestPush(userId, normalizedFallbackCached);
                    }
                    return {
                        ok: true,
                        payload: normalizedFallbackCached,
                        fromCache: true,
                    };
                }

                const fallbackStored = await getDatabaseDailyDigest(targetDateStr);
                const normalizedFallbackStored = normalizePayload(fallbackStored);
                if (normalizedFallbackStored) {
                    await saveCachedDailyDigest(userId, normalizedFallbackStored);
                    if (shouldSendPush) {
                        await sendDailyDigestPush(userId, normalizedFallbackStored);
                    }
                    return {
                        ok: true,
                        payload: normalizedFallbackStored,
                        fromCache: true,
                    };
                }
            }

            const sourceUrl = buildDailyDigestSourceUrl(targetDateStr);
            const html = await fetchDailyDigestSourceHtml(sourceUrl);

            if (!html) {
                continue;
            }

            sawPublishedPage = true;

            const items = parseDailyDigestItems(html, sourceUrl);
            const extractedSummary = parseDailyDigestSummaryText(html);

            if (items.length === 0) {
                logDailyDigestDebug('no_new_content', {
                    userId,
                    date: targetDateStr,
                    sourceUrl,
                    fromCache: false,
                    extractedSummary,
                    items,
                });
                continue;
            }

            const summary = buildDailyDigestSummary(items, targetDateStr, extractedSummary);
            const message = composeDailyDigestMessage(summary, items);

            const payload: DailyDigestPayload = {
                digestId: `digest_${targetDateStr}`,
                date: targetDateStr,
                sourceUrl,
                summary,
                items,
                message,
                createdAt: new Date().toISOString(),
            };

            logDailyDigestDebug('fetched', {
                userId,
                date: targetDateStr,
                sourceUrl,
                fromCache: false,
                extractedSummary,
                items,
            });

            await saveCachedDailyDigest(userId, payload);
            await saveDatabaseDailyDigest(payload);
            if (shouldSendPush) {
                await sendDailyDigestPush(userId, payload);
            }

            return {
                ok: true,
                payload,
                fromCache: false,
            };
        }

        return {
            ok: false,
            reason: sawPublishedPage ? 'no_new_content' : 'not_published',
        };
    } catch (error) {
        console.error('[DailyDigest] job failed:', error);
        return {
            ok: false,
            reason: 'job_failed',
        };
    }
};
