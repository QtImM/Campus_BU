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

import storage from '../../../lib/storage';
import { fetchDailyDigestSourceHtml } from '../../../services/agent/dailyDigest/fetchSource';
import { parseDailyDigestItems, parseDailyDigestSummaryText } from '../../../services/agent/dailyDigest/parseSource';
import { sendDailyDigestPush } from '../../../services/agent/dailyDigest/push';
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

    beforeEach(() => {
        jest.clearAllMocks();
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
