jest.mock('../../../../app/i18n/i18n', () => ({
    t: (_key: string, vars?: Record<string, any>) => vars?.code ? `course ${vars.code} not found` : 'mocked',
}));

jest.mock('../../../../services/supabase', () => ({
    supabase: {
        from: jest.fn(() => ({
            select: jest.fn(() => ({
                eq: jest.fn(() => ({
                    maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
                })),
                ilike: jest.fn(() => ({
                    maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
                    limit: jest.fn(() => ({
                        maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
                    })),
                })),
            })),
        })),
    },
}));

jest.mock('../../../../services/agent/llm', () => ({
    callDeepSeek: jest.fn().mockResolvedValue('{}'),
}));

import { detectActionType } from '../../../../services/agent/action_runtime/action_agent';

describe('schedule action detection', () => {
    it('treats explicit schedule write requests as write actions', () => {
        expect(detectActionType('帮我写课表')).toBe('write_user_schedule_entry');
        expect(detectActionType('添加课表')).toBe('write_user_schedule_entry');
        expect(detectActionType('记录课表')).toBe('write_user_schedule_entry');
    });

    it('does not treat schedule queries as write actions', () => {
        expect(detectActionType('我的课表里面有什么')).toBeNull();
        expect(detectActionType('今天我的课表有什么')).toBeNull();
    });
});
