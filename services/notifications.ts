import { supabase } from './supabase';

export interface Notification {
    id: string;
    user_id: string;
    type: 'comment' | 'like' | 'system' | 'agent_match';
    title: string;
    content: string;
    related_id?: string;
    is_read: boolean;
    created_at: string;
}

export interface NotificationCountSummary {
    unreadCount: number;
    hasUnread: boolean;
}

export const isDailyDigestNotification = (notification: Pick<Notification, 'type' | 'title' | 'related_id'>): boolean => {
    const relatedId = notification.related_id || '';
    const title = (notification.title || '').toLowerCase();

    return notification.type === 'system' && (
        relatedId.startsWith('daily_digest:')
        || title.includes('ai news digest')
        || title.includes('ai资讯摘要')
        || title.includes('ai資訊摘要')
        || title.includes('ai璧勮鎽樿')
        || title.includes('ai璩囪▕鎽樿')
    );
};

export const filterVisibleNotifications = (notifications: Notification[]): Notification[] =>
    notifications.filter(notification => !isDailyDigestNotification(notification));

export const mergeNotificationsById = (
    existing: Notification[],
    incoming: Notification[],
): Notification[] => {
    const merged = new Map<string, Notification>();

    for (const notification of existing) {
        merged.set(notification.id, notification);
    }

    for (const notification of incoming) {
        merged.set(notification.id, notification);
    }

    return Array.from(merged.values()).sort(
        (left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
    );
};

/**
 * Fetch all notifications for a specific user
 */
export const fetchNotifications = async (userId: string): Promise<Notification[]> => {
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return filterVisibleNotifications(mergeNotificationsById([], data || []));
};

/**
 * Fetch unread notification summary for a specific user without loading all rows.
 */
export const fetchUnreadNotificationSummary = async (userId: string): Promise<NotificationCountSummary> => {
    const { data, error } = await supabase
        .from('notifications')
        .select('id,user_id,type,title,content,related_id,is_read,created_at')
        .eq('user_id', userId)
        .eq('is_read', false);

    if (error) throw error;

    const unreadCount = filterVisibleNotifications((data || []) as Notification[]).length;
    return {
        unreadCount,
        hasUnread: unreadCount > 0,
    };
};

/**
 * Mark a specific notification as read
 */
export const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

    if (error) throw error;
};

/**
 * Mark all notifications as read for a user
 */
export const markAllAsRead = async (userId: string) => {
    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

    if (error) throw error;
};

/**
 * Create a new notification (usually called on the server side or from a service)
 */
export const createNotification = async (data: Omit<Notification, 'id' | 'created_at' | 'is_read'>) => {
    const { error } = await supabase
        .from('notifications')
        .insert([{ ...data, is_read: false }]);

    if (error) throw error;
};

/**
 * Subscribe to real-time notification updates for a user
 */
export const subscribeToNotifications = (userId: string, callback: (payload: any) => void) => {
    const channel = supabase.channel(`notifications:${userId}:${Date.now()}`);

    channel.on(
        'postgres_changes',
        {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
        },
        callback
    );

    channel.on(
        'postgres_changes',
        {
            event: 'UPDATE',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
        },
        callback
    );

    channel.subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};
