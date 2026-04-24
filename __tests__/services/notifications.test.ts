jest.mock('../../services/supabase', () => ({
    supabase: {},
}));

import {
    filterVisibleNotifications,
    isDailyDigestNotification,
    mergeNotificationsById,
    Notification,
} from '../../services/notifications';

const makeNotification = (overrides: Partial<Notification> = {}): Notification => ({
    id: 'notif-1',
    user_id: 'user-1',
    type: 'comment',
    title: 'Title',
    content: 'Content',
    related_id: 'post-1',
    is_read: false,
    created_at: '2026-04-23T10:00:00.000Z',
    ...overrides,
});

describe('mergeNotificationsById', () => {
    it('keeps notification ids unique when the same realtime row arrives twice', () => {
        const existing = [
            makeNotification({ id: 'notif-2', created_at: '2026-04-23T09:00:00.000Z' }),
            makeNotification({ id: 'notif-1', created_at: '2026-04-23T08:00:00.000Z' }),
        ];

        const incoming = [
            makeNotification({ id: 'notif-1', created_at: '2026-04-23T10:00:00.000Z' }),
        ];

        expect(mergeNotificationsById(existing, incoming)).toEqual([
            makeNotification({ id: 'notif-1', created_at: '2026-04-23T10:00:00.000Z' }),
            makeNotification({ id: 'notif-2', created_at: '2026-04-23T09:00:00.000Z' }),
        ]);
    });

    it('prefers the latest copy of a notification when read state changes', () => {
        const existing = [
            makeNotification({ id: 'notif-1', is_read: false, created_at: '2026-04-23T10:00:00.000Z' }),
        ];

        const incoming = [
            makeNotification({ id: 'notif-1', is_read: true, created_at: '2026-04-23T10:00:00.000Z' }),
        ];

        expect(mergeNotificationsById(existing, incoming)).toEqual([
            makeNotification({ id: 'notif-1', is_read: true, created_at: '2026-04-23T10:00:00.000Z' }),
        ]);
    });
});

describe('daily digest notification visibility', () => {
    it('identifies daily digest notification rows', () => {
        expect(isDailyDigestNotification(makeNotification({
            type: 'system',
            title: 'AI news digest 2026-04-24',
            related_id: 'daily_digest:2026-04-24',
        }))).toBe(true);

        expect(isDailyDigestNotification(makeNotification({
            type: 'system',
            title: 'System notice',
            related_id: undefined,
        }))).toBe(false);
    });

    it('hides daily digest rows from in-app notification lists', () => {
        const visible = makeNotification({ id: 'visible-1', title: 'New Comment' });
        const digest = makeNotification({
            id: 'digest-1',
            type: 'system',
            title: 'AI news digest 2026-04-24',
            related_id: 'daily_digest:2026-04-24',
        });

        expect(filterVisibleNotifications([digest, visible])).toEqual([visible]);
    });
});
