jest.mock('../../../lib/storage', () => ({
    __esModule: true,
    default: {
        getItem: jest.fn(),
        setItem: jest.fn(),
    },
}));

jest.mock('../../../services/agent/dailyDigest/job', () => ({
    runDailyDigestJobForUser: jest.fn(),
}));

import storage from '../../../lib/storage';
import { runDailyDigestJobForUser } from '../../../services/agent/dailyDigest/job';
import {
    DAILY_DIGEST_SCHEDULE_HOUR,
    DAILY_DIGEST_SCHEDULE_MINUTE,
    runScheduledDailyDigestIfDue,
} from '../../../services/agent/dailyDigest/scheduler';

describe('daily digest scheduler', () => {
    const mockStorageGetItem = storage.getItem as jest.Mock;
    const mockStorageSetItem = storage.setItem as jest.Mock;
    const mockRunJob = runDailyDigestJobForUser as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('does not run before 10:45', async () => {
        mockStorageGetItem.mockResolvedValue(null);

        const result = await runScheduledDailyDigestIfDue('user-1', new Date(2026, 3, 24, 10, 44));

        expect(result).toEqual({ didRun: false, reason: 'before_schedule' });
        expect(mockRunJob).not.toHaveBeenCalled();
    });

    it('runs once per local date at 10:45 or later', async () => {
        mockStorageGetItem.mockResolvedValue(null);
        mockRunJob.mockResolvedValue({ ok: true });

        const now = new Date(2026, 3, 24, DAILY_DIGEST_SCHEDULE_HOUR, DAILY_DIGEST_SCHEDULE_MINUTE);
        const result = await runScheduledDailyDigestIfDue('user-1', now);

        expect(result).toEqual({ didRun: true, result: { ok: true } });
        expect(mockRunJob).toHaveBeenCalledWith('user-1', now, {
            forceRefresh: true,
            sendPush: true,
        });
        expect(mockStorageSetItem).toHaveBeenCalledWith(
            'agent_daily_digest_scheduled_run:user-1:2026-04-24',
            '1',
        );
    });

    it('does not run twice on the same date', async () => {
        mockStorageGetItem.mockResolvedValue('1');

        const result = await runScheduledDailyDigestIfDue('user-1', new Date(2026, 3, 24, 12, 0));

        expect(result).toEqual({ didRun: false, reason: 'already_ran' });
        expect(mockRunJob).not.toHaveBeenCalled();
    });
});
