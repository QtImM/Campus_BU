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
    return mergeNotificationsById([], data || []);
};

/**
 * Fetch unread notification summary for a specific user without loading all rows.
 */
export const fetchUnreadNotificationSummary = async (userId: string): Promise<NotificationCountSummary> => {
    const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

    if (error) throw error;

    const unreadCount = count || 0;
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
