import { useRouter } from 'expo-router';
import { ArrowLeft, Check, Sparkles, Trophy } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { getCurrentUser } from '../../services/auth';
import { buildTaskList, getLevelInfo, getUserRewards, RewardTask } from '../../services/rewards';

export default function TasksScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const [points, setPoints] = useState(0);
    const [tasks, setTasks] = useState<RewardTask[]>(() => buildTaskList([]));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const user = await getCurrentUser();
                if (!user?.uid) return;
                const rewards = await getUserRewards(user.uid);
                setPoints(rewards.points);
                setTasks(buildTaskList(rewards.completedTasks));
            } catch (e) {
                console.error('[TasksScreen]', e);
            } finally {
                setLoading(false);
            }
        };
        void load();
    }, []);

    const level = getLevelInfo(points);
    const completedCount = tasks.filter(t => t.completed).length;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <ArrowLeft size={20} color="#1E3A8A" />
                </TouchableOpacity>
                <Text style={styles.title}>积分任务</Text>
                <View style={styles.iconButton} />
            </View>

            {loading ? (
                <View style={styles.center}><ActivityIndicator color="#1E3A8A" /></View>
            ) : (
                <ScrollView contentContainerStyle={styles.content}>
                    {/* Points summary */}
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryTop}>
                            <View style={[styles.levelBadge, { backgroundColor: level.bg }]}>
                                <Trophy size={16} color={level.color} />
                                <Text style={[styles.levelText, { color: level.color }]}>{t(level.label)}</Text>
                            </View>
                            <View style={styles.pointsRow}>
                                <Sparkles size={16} color="#D97706" />
                                <Text style={styles.pointsText}>{points} 积分</Text>
                            </View>
                        </View>

                        <View style={styles.progressTrack}>
                            <View style={[styles.progressFill, { width: `${Math.min(level.progress * 100, 100)}%`, backgroundColor: level.color }]} />
                        </View>

                        <Text style={styles.progressHint}>
                            {level.pointsToNext > 0
                                ? `再得 ${level.pointsToNext} 积分升级`
                                : '已达最高等级 🎉'}
                        </Text>

                        <Text style={styles.taskCount}>{completedCount}/{tasks.length} 个任务完成</Text>
                    </View>

                    {/* Task list */}
                    <Text style={styles.sectionLabel}>所有任务</Text>
                    {tasks.map(task => (
                        <TouchableOpacity
                            key={task.id}
                            style={[styles.taskRow, task.completed && styles.taskRowDone]}
                            activeOpacity={task.completed ? 1 : 0.7}
                            disabled={task.completed}
                            onPress={() => router.push(task.route as any)}
                        >
                            <View style={[styles.checkCircle, task.completed && styles.checkCircleDone]}>
                                {task.completed
                                    ? <Check size={16} color="#fff" />
                                    : <Text style={styles.emoji}>{task.emoji}</Text>
                                }
                            </View>
                            <Text style={[styles.taskLabel, task.completed && styles.taskLabelDone]} numberOfLines={1}>
                                {t(`rewards.tasks.${task.id}`)}
                            </Text>
                            <Text style={[styles.taskPoints, task.completed && styles.taskPointsDone]}>
                                +{task.points}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: {
        height: 56, paddingHorizontal: 16,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
    },
    iconButton: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    content: { padding: 16, paddingBottom: 32, gap: 8 },
    summaryCard: {
        backgroundColor: '#fff', borderRadius: 16, padding: 16,
        borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 8,
    },
    summaryTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
    levelBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
    levelText: { fontSize: 14, fontWeight: '700' },
    pointsRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    pointsText: { fontSize: 16, fontWeight: '800', color: '#92400E' },
    progressTrack: { height: 8, borderRadius: 4, backgroundColor: '#F3F4F6', overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 4 },
    progressHint: { fontSize: 13, color: '#6B7280', marginTop: 8 },
    taskCount: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
    sectionLabel: { fontSize: 12, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 8, marginBottom: 4 },
    taskRow: {
        flexDirection: 'row', alignItems: 'center', gap: 12,
        backgroundColor: '#fff', borderRadius: 14, padding: 14,
        borderWidth: 1, borderColor: '#F1F5F9',
    },
    taskRowDone: { backgroundColor: '#F0FDF4', borderColor: '#DCFCE7' },
    checkCircle: {
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0',
        alignItems: 'center', justifyContent: 'center',
    },
    checkCircleDone: { backgroundColor: '#22C55E', borderColor: '#22C55E' },
    emoji: { fontSize: 16 },
    taskLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: '#0F172A' },
    taskLabelDone: { color: '#9CA3AF', textDecorationLine: 'line-through' },
    taskPoints: { fontSize: 14, fontWeight: '700', color: '#D97706' },
    taskPointsDone: { color: '#9CA3AF' },
});
