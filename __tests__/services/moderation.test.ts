import { getBlockedUserIds, reportContent } from '../../services/moderation';
import { supabase } from '../../services/supabase';

jest.mock('../../services/supabase', () => ({
    supabase: {
        from: jest.fn(),
    },
}));

describe('AI Content Moderation & Reporting Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('reportContent should retry without target_author_id when reports schema is missing the column', async () => {
        const firstSingle = jest.fn().mockResolvedValue({
            data: null,
            error: { code: '42703', message: 'column target_author_id does not exist' },
        });
        const firstSelect = jest.fn().mockReturnValue({ single: firstSingle });
        const firstInsert = jest.fn().mockReturnValue({ select: firstSelect });

        const secondSingle = jest.fn().mockResolvedValue({
            data: { id: 'fallback_report_123' },
            error: null,
        });
        const secondSelect = jest.fn().mockReturnValue({ single: secondSingle });
        const secondInsert = jest.fn().mockReturnValue({ select: secondSelect });

        const actionInsert = jest.fn().mockResolvedValue({ error: null });

        (supabase.from as jest.Mock)
            .mockReturnValueOnce({ insert: firstInsert })
            .mockReturnValueOnce({ insert: secondInsert })
            .mockReturnValueOnce({ insert: actionInsert });

        const result = await reportContent({
            reporterId: 'regular-user-789',
            targetId: 'comment-2',
            targetType: 'comment',
            targetAuthorId: 'author-42',
            reason: 'harassment',
            details: 'vulgar language',
        });

        expect(supabase.from).toHaveBeenNthCalledWith(1, 'reports');
        expect(firstInsert).toHaveBeenCalledWith(expect.objectContaining({
            reporter_id: 'regular-user-789',
            target_id: 'comment-2',
            target_type: 'comment',
            target_author_id: 'author-42',
            reason: 'harassment',
            details: 'vulgar language',
            status: 'pending',
        }));

        expect(supabase.from).toHaveBeenNthCalledWith(2, 'reports');
        expect(secondInsert).toHaveBeenCalledWith(expect.not.objectContaining({
            target_author_id: expect.anything(),
        }));
        expect(secondInsert).toHaveBeenCalledWith(expect.objectContaining({
            reporter_id: 'regular-user-789',
            target_id: 'comment-2',
            target_type: 'comment',
            reason: 'harassment',
            details: 'vulgar language',
            status: 'pending',
        }));

        expect(supabase.from).toHaveBeenNthCalledWith(3, 'moderation_actions');
        expect(actionInsert).toHaveBeenCalledWith(expect.objectContaining({
            action_type: 'report_created',
            actor_id: 'regular-user-789',
            report_id: 'fallback_report_123',
            target_user_id: 'author-42',
        }));
        expect(result).toEqual({ success: true, id: 'fallback_report_123' });
    });

    it('reportContent should insert to DB for regular user', async () => {
        const mockSingle = jest.fn().mockResolvedValue({
            data: { id: 'real_report_456' },
            error: null,
        });
        const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
        const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
        const actionInsert = jest.fn().mockResolvedValue({ error: null });

        (supabase.from as jest.Mock)
            .mockReturnValueOnce({ insert: mockInsert })
            .mockReturnValueOnce({ insert: actionInsert });

        const result = await reportContent({
            reporterId: 'regular-user-789',
            targetId: 'comment-2',
            targetType: 'comment',
            reason: 'harassment',
            details: 'vulgar language',
        });

        expect(supabase.from).toHaveBeenNthCalledWith(1, 'reports');
        expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
            reporter_id: 'regular-user-789',
            target_id: 'comment-2',
            target_type: 'comment',
            reason: 'harassment',
            details: 'vulgar language',
            status: 'pending',
        }));
        expect(supabase.from).toHaveBeenNthCalledWith(2, 'moderation_actions');
        expect(result.success).toBe(true);
        expect(result.id).toBe('real_report_456');
    });

    it('getBlockedUserIds should map data correctly', async () => {
        const mockData = [
            { blocked_id: 'userA' },
            { blocked_id: 'userB' },
        ];

        (supabase.from as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue({
                eq: jest.fn().mockResolvedValue({ data: mockData, error: null }),
            }),
        });

        const blockedIds = await getBlockedUserIds('me-111');
        expect(blockedIds).toEqual(['userA', 'userB']);
    });
});
