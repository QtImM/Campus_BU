import { useFocusEffect, useRouter } from 'expo-router';
import { Check, ChevronRight, Sparkles, Trophy } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
    RewardTask,
    buildTaskList,
    getLevelInfo,
    getUserRewards,
} from '../../services/rewards';

interface RewardsCardProps {
    userId: string | null;
    /** Bumped by the parent whenever a task may have been completed, to force a reload. */
    refreshKey?: number;
}

export default function RewardsCard({ userId, refreshKey = 0 }: RewardsCardProps) {
    const router = useRouter();
    const { t } = useTranslation();
    const [points, setPoints] = useState(0);
    const [tasks, setTasks] = useState<RewardTask[]>(() => buildTaskList([]));
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(false);

    const load = useCallback(async () => {
        if (!userId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const rewards = await getUserRewards(userId);
            setPoints(rewards.points);
            setTasks(buildTaskList(rewards.completedTasks));
        } catch (error) {
            console.error('[RewardsCard] Failed to load rewards:', error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        void load();
    }, [load, refreshKey]);

    // Reload whenever the profile tab regains focus, so newly-completed tasks
    // (e.g. posting from another tab) show up without a manual refresh.
    useFocusEffect(
        useCallback(() => {
            void load();
        }, [load])
    );

    // Guests don't see the rewards card.
    if (!userId) return null;

    const level = getLevelInfo(points);
    const completedCount = tasks.filter(t => t.completed).length;
    const allDone = completedCount === tasks.length;
    // Show the next 1-2 incomplete tasks when collapsed, all tasks when expanded.
    const incomplete = tasks.filter(t => t.completed === false);
    const visibleTasks = expanded ? tasks : incomplete.slice(0, 2);

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={[styles.levelBadge, { backgroundColor: level.bg }]}>
                        <Trophy size={14} color={level.color} />
                        <Text style={[styles.levelText, { color: level.color }]}>{t(level.label)}</Text>
                    </View>
                    <View style={styles.pointsRow}>
                        <Sparkles size={14} color="#D97706" />
                        <Text style={styles.pointsText}>{t('rewards.points', { count: points })}</Text>
                    </View>
                </View>
                <Text style={styles.taskCounter}>{completedCount}/{tasks.length}</Text>
            </View>

            {/* Level progress bar */}
            <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${Math.min(level.progress * 100, 100)}%`, backgroundColor: level.color }]} />
            </View>
            <Text style={styles.progressHint}>
                {allDone
                    ? t('rewards.progress_done')
                    : level.pointsToNext > 0
                        ? t('rewards.progress_next', { count: level.pointsToNext })
                        : t('rewards.progress_start')}
            </Text>

            {loading ? (
                <View style={styles.loadingBox}>
                    <ActivityIndicator color="#1E3A8A" />
                </View>
            ) : (
                <View style={styles.taskList}>
                    {visibleTasks.length === 0 ? (
                        <View style={styles.allDoneBox}>
                            <Trophy size={28} color="#D97706" />
                            <Text style={styles.allDoneText}>{t('rewards.all_done')}</Text>
                        </View>
                    ) : (
                        visibleTasks.map(task => (
                            <TouchableOpacity
                                key={task.id}
                                style={[styles.taskRow, task.completed && styles.taskRowDone]}
                                activeOpacity={task.completed ? 1 : 0.7}
                                disabled={task.completed}
                                onPress={() => router.push(task.route as any)}
                            >
                                <View style={[styles.checkCircle, task.completed && styles.checkCircleDone]}>
                                    {task.completed ? (
                                        <Check size={14} color="#fff" />
                                    ) : (
                                        <Text style={styles.taskEmoji}>{task.emoji}</Text>
                                    )}
                                </View>
                                <Text style={[styles.taskLabel, task.completed && styles.taskLabelDone]} numberOfLines={1}>
                                    {t(`rewards.tasks.${task.id}`)}
                                </Text>
                                <View style={styles.taskRight}>
                                    <Text style={[styles.taskPoints, task.completed && styles.taskPointsDone]}>
                                        +{task.points}
                                    </Text>
                                    {!task.completed && <ChevronRight size={16} color="#9CA3AF" />}
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </View>
            )}

            {!loading && tasks.length > 2 && incomplete.length > 0 && (
                <TouchableOpacity style={styles.expandBtn} onPress={() => setExpanded(v => !v)}>
                    <Text style={styles.expandText}>{expanded ? t('rewards.collapse') : t('rewards.expand', { count: tasks.length })}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16, padding: 16, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    levelBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
    levelText: { fontSize: 13, fontWeight: '700' },
    pointsRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    pointsText: { fontSize: 14, fontWeight: '700', color: '#92400E' },
    taskCounter: { fontSize: 13, fontWeight: '700', color: '#9CA3AF' },
    progressTrack: { height: 8, borderRadius: 4, backgroundColor: '#F3F4F6', marginTop: 14, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 4 },
    progressHint: { fontSize: 12, color: '#6B7280', marginTop: 8 },
    loadingBox: { paddingVertical: 24, alignItems: 'center' },
    taskList: { marginTop: 14, gap: 8 },
    taskRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#F3F4F6' },
    taskRowDone: { backgroundColor: '#F0FDF4', borderColor: '#DCFCE7' },
    checkCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
    checkCircleDone: { backgroundColor: '#22C55E', borderColor: '#22C55E' },
    taskEmoji: { fontSize: 14 },
    taskLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: '#111827' },
    taskLabelDone: { color: '#9CA3AF', textDecorationLine: 'line-through' },
    taskRight: { flexDirection: 'row', alignItems: 'center', gap: 2 },
    taskPoints: { fontSize: 13, fontWeight: '700', color: '#D97706' },
    taskPointsDone: { color: '#9CA3AF' },
    allDoneBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 20, gap: 8 },
    allDoneText: { fontSize: 14, fontWeight: '700', color: '#475569' },
    expandBtn: { marginTop: 12, alignItems: 'center', paddingVertical: 8 },
    expandText: { fontSize: 13, fontWeight: '600', color: '#1E3A8A' },
});
