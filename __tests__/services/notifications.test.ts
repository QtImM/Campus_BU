jest.mock('../../services/supabase', () => ({
    supabase: {},
}));

import { mergeNotificationsById, Notification } from '../../services/notifications';

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
