import { supabase } from './supabase';
import { searchUserProfiles, UserSearchResult } from './auth';

export interface AdminRecord {
    userId: string;
    email: string;
    displayName: string;
    avatarUrl: string | null;
    grantedAt: Date;
}

export const fetchActiveAdmins = async (): Promise<AdminRecord[]> => {
    const { data, error } = await supabase
        .from('app_admins')
        .select('user_id, email, granted_at, users!user_id(display_name, avatar_url)')
        .eq('is_active', true)
        .order('granted_at', { ascending: true });

    if (error) {
        console.error('[fetchActiveAdmins]', error);
        throw error;
    }

    return (data ?? []).map((row: any) => ({
        userId: row.user_id,
        email: row.email,
        displayName: row.users?.display_name ?? row.email,
        avatarUrl: row.users?.avatar_url?.startsWith('blob:') ? null : (row.users?.avatar_url ?? null),
        grantedAt: new Date(row.granted_at),
    }));
};

export const grantAdmin = async (
    targetUserId: string,
    targetEmail: string,
    granterUserId: string,
): Promise<void> => {
    const { data, error } = await supabase.rpc('grant_admin_status', {
        target_user_id: targetUserId,
        target_email: targetEmail,
        granter_user_id: granterUserId,
    });
    if (error) throw error;
    if (!data?.success) throw new Error(data?.error ?? 'Failed to grant admin');
};

export const revokeAdmin = async (
    targetUserId: string,
    revokerUserId: string,
): Promise<void> => {
    const { data, error } = await supabase.rpc('revoke_admin_status', {
        target_user_id: targetUserId,
        revoker_user_id: revokerUserId,
    });
    if (error) throw error;
    if (!data?.success) throw new Error(data?.error ?? 'Failed to revoke admin');
};

export { searchUserProfiles };
export type { UserSearchResult };
