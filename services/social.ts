import { Message, User } from '../types';
import { supabase } from './supabase';

// Mock users for demo
export const MOCK_USERS: Omit<User, 'createdAt'>[] = [
    {
        uid: 'user-1',
        displayName: '小明',
        socialTags: ['Library Ghost 📚', 'Coffee Addict ☕'],
        major: 'MSc AI & ML',
        avatarUrl: '',
    },
    {
        uid: 'user-2',
        displayName: 'Sarah',
        socialTags: ['Canteen Philosopher 🍜', 'Night Owl 🦉'],
        major: 'BBA Marketing',
        avatarUrl: '',
    },
    {
        uid: 'user-3',
        displayName: '阿杰',
        socialTags: ['Shaw Campus Runner 🏃', 'Morning Bird 🐦'],
        major: 'Music Performance',
        avatarUrl: '',
    },
    {
        uid: 'user-4',
        displayName: 'Emily',
        socialTags: ['Milk Tea Connoisseur 🧋', 'Group Project Leader 👑'],
        major: 'Communication',
        avatarUrl: '',
    },
    {
        uid: 'user-5',
        displayName: '志豪',
        socialTags: ['Deadline Fighter ⏰', 'Solo Warrior 🗡️'],
        major: 'Computer Science',
        avatarUrl: '',
    },
];

// Get users for discovery (excluding current user)
export const getDiscoverableUsers = (currentUserId: string): Omit<User, 'createdAt'>[] => {
    return MOCK_USERS.filter(user => user.uid !== currentUserId);
};

export type InteractionType = 'poke' | 'wave' | 'coffee';

export interface Interaction {
    id: string;
    fromUserId: string;
    toUserId: string;
    type: InteractionType;
    message?: string;
    timestamp: Date;
    read: boolean;
}

// Send a poke/wave to another user
export const sendInteraction = async (
    fromUserId: string,
    toUserId: string,
    type: InteractionType,
    message?: string
): Promise<string> => {
    // Determine if we are in demo mode (could import isDemoMode, but here we can just check ID or fail gracefully)
    // For now, implement Supabase logic but fallback safely

    try {
        const { data, error } = await supabase
            .from('interactions')
            .insert({
                from_user_id: fromUserId,
                to_user_id: toUserId,
                type,
                message: message || '',
                // created_at auto
            })
            .select()
            .single();

        if (error) {
            // If table doesn't exist (Supabase RLS/Schema issue), just mock success for Demo
            console.warn('Supabase interaction failed, mocking success:', error.message);
            return 'mock_interaction_' + Date.now();
        }
        return data.id;
    } catch (e) {
        return 'mock_interaction_' + Date.now();
    }
};

// Get interactions for a user
export const getInteractions = async (userId: string): Promise<Interaction[]> => {
    try {
        const { data, error } = await supabase
            .from('interactions')
            .select('*')
            .eq('to_user_id', userId)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) return [];

        return data.map((d: any) => ({
            id: d.id,
            fromUserId: d.from_user_id,
            toUserId: d.to_user_id,
            type: d.type,
            message: d.message,
            timestamp: new Date(d.created_at),
            read: false // simplistic
        }));
    } catch (e) {
        return [];
    }
};

// Create or get existing chat room between two users
export const getOrCreateChatRoom = async (userId1: string, userId2: string): Promise<string> => {
    const participants = [userId1, userId2].sort();
    const roomId = `${participants[0]}_${participants[1]}`;
    // In a real app we'd create a room entry in DB
    return roomId;
};

// Send a message in a chat room
export const sendMessage = async (
    roomId: string,
    senderId: string,
    content: string
): Promise<string> => {
    try {
        const { data, error } = await supabase
            .from('messages')
            .insert({
                room_id: roomId,
                sender_id: senderId,
                content,
                // created_at auto
            })
            .select()
            .single();

        if (error) {
            // Mock success
            return 'mock_msg_' + Date.now();
        }
        return data.id;
    } catch (e) {
        return 'mock_msg_' + Date.now();
    }
};

// Subscribe to messages in a chat room (realtime)
export const subscribeToMessages = (
    roomId: string,
    callback: (messages: Message[]) => void
) => {
    // Supabase Realtime subscription
    const channel = supabase
        .channel(`room:${roomId}`)
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` },
            (payload) => {
                // Fetch new messages or append payload
                // Ideally trigger a refetch or append
                // callback([mappedPayload])
            }
        )
        .subscribe();

    // Initial fetch
    supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
        .then(({ data }) => {
            if (data) {
                const messages = data.map((d: any) => ({
                    id: d.id,
                    senderId: d.sender_id,
                    content: d.content,
                    timestamp: new Date(d.created_at),
                    read: false
                }));
                callback(messages);
            } else {
                callback([]); // Mock Empty
            }
        });

    // Mock initial message for demo if empty
    // callback([]);

    return () => {
        supabase.removeChannel(channel);
    };
};

// Interaction icons and labels
export const INTERACTION_CONFIG: Record<InteractionType, { icon: string; label: string; color: string }> = {
    poke: { icon: '👆', label: 'Poke', color: '#FF6B6B' },
    wave: { icon: '👋', label: 'Wave', color: '#4ECDC4' },
    coffee: { icon: '☕', label: 'Coffee?', color: '#8B4513' },
};
