import { supabase } from './supabase';

export type TaskId =
    | 'set_avatar'
    | 'first_post'
    | 'first_like'
    | 'first_follow'
    | 'first_comment'
    | 'first_review';

export interface RewardTask {
    id: TaskId;
    label: string;
    points: number;
    completed: boolean;
    route: string;
    emoji: string;
}

export interface UserRewards {
    points: number;
    completedTasks: TaskId[];
    isPioneer: boolean;
}

export interface LevelInfo {
    label: string;
    color: string;
    bg: string;
    progress: number;
    pointsToNext: number;
}

export const TASK_DEFINITIONS: Omit<RewardTask, 'completed'>[] = [
    { id: 'set_avatar',    label: '设置头像',        points: 10, route: '/(auth)/setup',     emoji: '🖼️' },
    { id: 'first_post',    label: '发第一篇帖子',     points: 20, route: '/campus/compose',   emoji: '✍️' },
    { id: 'first_like',    label: '给帖子点个赞',     points: 5,  route: '/(tabs)/campus',    emoji: '❤️' },
    { id: 'first_follow',  label: '关注一位同学',     points: 5,  route: '/(tabs)/connect',   emoji: '👋' },
    { id: 'first_comment', label: '评论一条帖子',     points: 10, route: '/(tabs)/campus',    emoji: '💬' },
    { id: 'first_review',  label: '写第一条课程评价', points: 15, route: '/(tabs)/course',    emoji: '📚' },
];

export const TOTAL_TASK_POINTS = TASK_DEFINITIONS.reduce((s, t) => s + t.points, 0); // 65 pts

const pointsForTask = (taskId: TaskId): number =>
    TASK_DEFINITIONS.find(t => t.id === taskId)?.points ?? 0;

export function getLevelInfo(points: number): LevelInfo {
    // label values are i18n keys resolved by the caller via t(level.label)
    if (points >= 100) {
        return { label: 'rewards.levels.master', color: '#D97706', bg: '#FEF3C7', progress: 1, pointsToNext: 0 };
    }
    if (points >= 65) {
        return { label: 'rewards.levels.contributor', color: '#7C3AED', bg: '#EDE9FE', progress: (points - 65) / 35, pointsToNext: 100 - points };
    }
    if (points >= 30) {
        return { label: 'rewards.levels.active', color: '#2563EB', bg: '#DBEAFE', progress: (points - 30) / 35, pointsToNext: 65 - points };
    }
    return { label: 'rewards.levels.novice', color: '#6B7280', bg: '#F3F4F6', progress: points / 30, pointsToNext: 30 - points };
}

export async function getUserRewards(uid: string): Promise<UserRewards> {
    const { data, error } = await supabase
        .from('user_reward_tasks')
        .select('task_id, points')
        .eq('user_id', uid);

    if (error) {
        console.error('[rewards] getUserRewards failed:', error);
        return { points: 0, completedTasks: [], isPioneer: false };
    }

    const rows = data ?? [];
    const completedTasks = rows.map(row => row.task_id as TaskId);
    return {
        points: rows.reduce((sum, row) => sum + (row.points ?? 0), 0),
        completedTasks,
        isPioneer: completedTasks.length >= TASK_DEFINITIONS.length,
    };
}

export async function completeTask(uid: string, taskId: TaskId): Promise<UserRewards> {
    const task = TASK_DEFINITIONS.find(t => t.id === taskId);
    if (!task) return getUserRewards(uid);

    // Idempotent: the (user_id, task_id) primary key means a repeat completion
    // is silently ignored instead of double-counting points.
    const { error } = await supabase
        .from('user_reward_tasks')
        .upsert(
            { user_id: uid, task_id: taskId, points: pointsForTask(taskId) },
            { onConflict: 'user_id,task_id', ignoreDuplicates: true },
        );

    if (error) {
        console.error('[rewards] completeTask failed:', error);
    }

    return getUserRewards(uid);
}

export function buildTaskList(completedTasks: TaskId[]): RewardTask[] {
    return TASK_DEFINITIONS.map(t => ({ ...t, completed: completedTasks.includes(t.id) }));
}
