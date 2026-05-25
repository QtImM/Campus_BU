jest.mock('../../../lib/storage', () => ({
    __esModule: true,
    default: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
    },
}));

jest.mock('../../../services/agent/dailyDigest/fetchSource', () => ({
    fetchDailyDigestSourceHtml: jest.fn(),
}));

jest.mock('../../../services/agent/dailyDigest/parseSource', () => ({
    parseDailyDigestItems: jest.fn(),
    parseDailyDigestSummaryText: jest.fn(),
}));

jest.mock('../../../services/agent/dailyDigest/push', () => ({
    sendDailyDigestPush: jest.fn(),
}));

jest.mock('../../../services/supabase', () => ({
    supabase: {
        from: jest.fn(),
    },
}));

import storage from '../../../lib/storage';
import { fetchDailyDigestSourceHtml } from '../../../services/agent/dailyDigest/fetchSource';
import { parseDailyDigestItems, parseDailyDigestSummaryText } from '../../../services/agent/dailyDigest/parseSource';
import { sendDailyDigestPush } from '../../../services/agent/dailyDigest/push';
import { supabase } from '../../../services/supabase';
import {
    getDailyDigestEnabled,
    setDailyDigestEnabled,
} from '../../../services/agent/dailyDigest/repository';
import { runDailyDigestJobForUser } from '../../../services/agent/dailyDigest/job';

describe('agent daily digest opt-in', () => {
    const mockStorageGetItem = storage.getItem as jest.Mock;
    const mockStorageSetItem = storage.setItem as jest.Mock;
    const mockFetchHtml = fetchDailyDigestSourceHtml as jest.Mock;
    const mockParseItems = parseDailyDigestItems as jest.Mock;
    const mockParseSummary = parseDailyDigestSummaryText as jest.Mock;
    const mockSendPush = sendDailyDigestPush as jest.Mock;
    const mockSupabaseFrom = supabase.from as jest.Mock;
    let dailyDigestQueryBuilder: any;
    let preferencesQueryBuilder: any;

    const createQueryBuilder = (options?: {
        maybeSingleResult?: { data: any; error: any };
        upsertResult?: { error: any };
    }) => {
        const builder: any = {
            select: jest.fn(() => builder),
            eq: jest.fn(() => builder),
            lte: jest.fn(() => builder),
            order: jest.fn(() => builder),
            limit: jest.fn(() => builder),
            maybeSingle: jest.fn().mockResolvedValue(options?.maybeSingleResult ?? { data: null, error: null }),
            upsert: jest.fn().mockResolvedValue(options?.upsertResult ?? { error: null }),
        };

        return builder;
    };

    beforeEach(() => {
        jest.clearAllMocks();
        dailyDigestQueryBuilder = createQueryBuilder();
        preferencesQueryBuilder = createQueryBuilder();
        mockSupabaseFrom.mockImplementation((table: string) => {
            if (table === 'daily_digests') {
                return dailyDigestQueryBuilder;
            }

            if (table === 'user_daily_digest_preferences') {
                return preferencesQueryBuilder;
            }

            return createQueryBuilder();
        });
    });

    it('defaults the daily digest preference to disabled', async () => {
        mockStorageGetItem.mockResolvedValue(null);

        await expect(getDailyDigestEnabled('user-1')).resolves.toBe(false);
    });

    it('persists the daily digest preference when toggled', async () => {
        await setDailyDigestEnabled('user-1', true);

        expect(mockStorageSetItem).toHaveBeenCalledWith('agent_daily_digest_enabled:user-1', 'true');
    });

    it('does not fetch or push when the user has not opted into daily digest', async () => {
        mockStorageGetItem.mockImplementation(async (key: string) => {
            if (key === 'agent_daily_digest_enabled:user-1') return null;
            return null;
        });

        const result = await runDailyDigestJobForUser('user-1', new Date('2026-04-01T08:00:00Z'));

        expect(result).toEqual({ ok: false, reason: 'disabled' });
        expect(mockFetchHtml).not.toHaveBeenCalled();
        expect(mockSendPush).not.toHaveBeenCalled();
    });

    it('fetches and pushes once the user opts in', async () => {
        mockStorageGetItem.mockImplementation(async (key: string) => {
            if (key === 'agent_daily_digest_enabled:user-1') return 'true';
            return null;
        });
        mockFetchHtml.mockResolvedValue('<html></html>');
        mockParseItems.mockReturnValue([
            { title: 'Story A', url: 'https://example.com/a', lineIndex: 0, contextSnippet: 'Story A' },
        ]);
        mockParseSummary.mockReturnValue('Daily summary');
        mockSendPush.mockResolvedValue(true);

        const result = await runDailyDigestJobForUser('user-1', new Date('2026-04-01T08:00:00Z'));

        expect(result.ok).toBe(true);
        expect(mockFetchHtml).toHaveBeenCalledTimes(1);
        expect(mockSendPush).toHaveBeenCalledTimes(1);
    });

    it('uses the latest digest already stored in Supabase before fetching the source again', async () => {
        mockStorageGetItem.mockImplementation(async (key: string) => {
            if (key === 'agent_daily_digest_enabled:user-1') return 'true';
            return null;
        });
        mockFetchHtml.mockImplementation(() => {
            throw new Error('source fetch should not run when Supabase already has the latest digest');
        });
        dailyDigestQueryBuilder.maybeSingle.mockResolvedValue({
            data: {
                digest_date: '2026-05-24',
                source_url: 'https://hex2077.dev/docs/2026-05/2026-05-24/',
                summary: 'Daily summary',
                message: 'Persisted message',
                items: [
                    { title: 'Story A', url: 'https://example.com/a', lineIndex: 0, contextSnippet: 'Story A' },
                ],
                created_at: '2026-05-24T02:45:00.000Z',
            },
            error: null,
        });

        const result = await runDailyDigestJobForUser('user-1', new Date('2026-05-25T08:00:00+08:00'), {
            sendPush: false,
            ignoreEnabledCheck: true,
        });

        expect(result.ok).toBe(true);
        expect(result.payload?.date).toBe('2026-05-24');
        expect(result.fromCache).toBe(true);
        expect(mockFetchHtml).not.toHaveBeenCalled();
    });

    it('falls back to the most recent published digest when today is not available yet', async () => {
        mockStorageGetItem.mockImplementation(async (key: string) => {
            if (key === 'agent_daily_digest_enabled:user-1') return 'true';
            return null;
        });
        mockFetchHtml
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce('<html></html>');
        mockParseItems.mockReturnValue([
            { title: 'Story A', url: 'https://example.com/a', lineIndex: 0, contextSnippet: 'Story A' },
        ]);
        mockParseSummary.mockReturnValue('Daily summary');

        const result = await runDailyDigestJobForUser('user-1', new Date('2026-05-25T08:00:00+08:00'), {
            sendPush: false,
            ignoreEnabledCheck: true,
        });

        expect(result.ok).toBe(true);
        expect(result.payload?.date).toBe('2026-05-24');
        expect(mockFetchHtml).toHaveBeenNthCalledWith(1, 'https://hex2077.dev/docs/2026-05/2026-05-25/');
        expect(mockFetchHtml).toHaveBeenNthCalledWith(2, 'https://hex2077.dev/docs/2026-05/2026-05-24/');
        expect(mockStorageSetItem).toHaveBeenCalledWith(
            'agent_daily_digest:user-1:2026-05-24',
            expect.stringContaining('"date":"2026-05-24"')
        );
    });

    it('can fetch digest content without sending a push', async () => {
        mockStorageGetItem.mockImplementation(async (key: string) => {
            if (key === 'agent_daily_digest_enabled:user-1') return 'true';
            return null;
        });
        mockFetchHtml.mockResolvedValue('<html></html>');
        mockParseItems.mockReturnValue([
            { title: 'Story A', url: 'https://example.com/a', lineIndex: 0, contextSnippet: 'Story A' },
        ]);
        mockParseSummary.mockReturnValue('Daily summary');

        const result = await runDailyDigestJobForUser('user-1', new Date('2026-04-01T08:00:00Z'), {
            sendPush: false,
        });

        expect(result.ok).toBe(true);
        expect(mockSendPush).not.toHaveBeenCalled();
    });

    it('does not push when the source has no new digest items', async () => {
        mockStorageGetItem.mockImplementation(async (key: string) => {
            if (key === 'agent_daily_digest_enabled:user-1') return 'true';
            return null;
        });
        mockFetchHtml.mockResolvedValue('<html></html>');
        mockParseItems.mockReturnValue([]);
        mockParseSummary.mockReturnValue(null);

        const result = await runDailyDigestJobForUser('user-1', new Date('2026-04-01T08:00:00Z'), {
            forceRefresh: true,
        });

        expect(result).toEqual({ ok: false, reason: 'no_new_content' });
        expect(mockSendPush).not.toHaveBeenCalled();
    });

    it('does not log the full daily digest content', async () => {
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        mockStorageGetItem.mockImplementation(async (key: string) => {
            if (key === 'agent_daily_digest_enabled:user-1') return 'true';
            return null;
        });
        mockFetchHtml.mockResolvedValue('<html></html>');
        mockParseItems.mockReturnValue([
            { title: 'Story A', url: 'https://example.com/a', lineIndex: 0, contextSnippet: 'Very detailed snippet' },
        ]);
        mockParseSummary.mockReturnValue('Daily summary');
        mockSendPush.mockResolvedValue(true);

        await runDailyDigestJobForUser('user-1', new Date('2026-04-01T08:00:00Z'));

        expect(consoleLogSpy).toHaveBeenCalledWith(
            '[DailyDigest] fetched',
            expect.objectContaining({
                userId: 'user-1',
                date: '2026-04-01',
                itemCount: 1,
            })
        );
        expect(consoleLogSpy).toHaveBeenCalledWith(
            '[DailyDigest] fetched',
            expect.not.objectContaining({
                summary: expect.anything(),
            })
        );
        expect(consoleLogSpy).toHaveBeenCalledWith(
            '[DailyDigest] fetched',
            expect.not.objectContaining({
                message: expect.anything(),
            })
        );
        expect(consoleLogSpy).toHaveBeenCalledWith(
            '[DailyDigest] fetched',
            expect.not.objectContaining({
                items: expect.anything(),
            })
        );

        consoleLogSpy.mockRestore();
    });
});
