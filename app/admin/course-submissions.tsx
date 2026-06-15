import { useRouter } from 'expo-router';
import { ArrowLeft, BookOpen, CheckCircle2, Clock3, ShieldAlert, XCircle } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentUser } from '../../services/auth';
import {
    approveCourseSubmission,
    CourseSubmission,
    getPendingCourseSubmissions,
    rejectCourseSubmission,
} from '../../services/courses';
import { isAdmin } from '../../utils/userUtils';

type SubmissionFilter = 'pending' | 'all';

export default function CourseSubmissionsAdminScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [authorized, setAuthorized] = useState(false);
    const [reviewerId, setReviewerId] = useState<string | null>(null);
    const [filter, setFilter] = useState<SubmissionFilter>('pending');
    const [submissions, setSubmissions] = useState<CourseSubmission[]>([]);

    const loadData = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const user = await getCurrentUser();
            const canReview = await isAdmin(user?.uid);
            setAuthorized(canReview);
            setReviewerId(user?.uid || null);

            if (!canReview) {
                setSubmissions([]);
                return;
            }

            const pending = await getPendingCourseSubmissions();
            setSubmissions(pending);
        } catch (error) {
            console.error('Failed to load course submissions:', error);
            Alert.alert('加载失败', '课程申请数据加载失败，请稍后重试。');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        void loadData();
    }, [loadData]);

    const handleApprove = (submission: CourseSubmission) => {
        Alert.alert(
            '批准课程',
            `确认将「${submission.code} ${submission.name || ''}」添加到课程库？`,
            [
                { text: '取消', style: 'cancel' },
                {
                    text: '批准',
                    onPress: async () => {
                        if (!reviewerId) return;
                        const result = await approveCourseSubmission(submission.id, reviewerId);
                        if (result.success) {
                            Alert.alert('已批准', '课程已添加到课程库');
                            void loadData(true);
                        } else {
                            Alert.alert('操作失败', result.error || '请稍后重试');
                        }
                    },
                },
            ],
        );
    };

    const handleReject = (submission: CourseSubmission) => {
        Alert.alert(
            '驳回申请',
            `确认驳回「${submission.code} ${submission.name || ''}」的课程申请？`,
            [
                { text: '取消', style: 'cancel' },
                {
                    text: '驳回',
                    style: 'destructive',
                    onPress: async () => {
                        if (!reviewerId) return;
                        const result = await rejectCourseSubmission(submission.id, reviewerId, '管理员驳回');
                        if (result.success) {
                            void loadData(true);
                        } else {
                            Alert.alert('操作失败', result.error || '请稍后重试');
                        }
                    },
                },
            ],
        );
    };

    const filteredSubmissions = filter === 'pending'
        ? submissions.filter(s => s.status === 'pending')
        : submissions;

    const pendingCount = submissions.filter(s => s.status === 'pending').length;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <ArrowLeft size={20} color="#1E3A8A" />
                </TouchableOpacity>
                <Text style={styles.title}>课程申请审核</Text>
                <View style={styles.iconButton} />
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator color="#1E3A8A" />
                </View>
            ) : !authorized ? (
                <View style={styles.center}>
                    <ShieldAlert size={22} color="#DC2626" />
                    <Text style={styles.emptyText}>你没有审核权限</Text>
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.content}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={() => {
                            setRefreshing(true);
                            void loadData(true);
                        }} />
                    }
                >
                    <View style={styles.summaryRow}>
                        <View style={styles.summaryCard}>
                            <Clock3 size={16} color="#1E3A8A" />
                            <Text style={styles.summaryValue}>{pendingCount}</Text>
                            <Text style={styles.summaryLabel}>待审核</Text>
                        </View>
                        <View style={styles.summaryCard}>
                            <CheckCircle2 size={16} color="#15803D" />
                            <Text style={styles.summaryValue}>
                                {submissions.filter(s => s.status === 'approved').length}
                            </Text>
                            <Text style={styles.summaryLabel}>已通过</Text>
                        </View>
                        <View style={styles.summaryCard}>
                            <XCircle size={16} color="#DC2626" />
                            <Text style={styles.summaryValue}>
                                {submissions.filter(s => s.status === 'rejected').length}
                            </Text>
                            <Text style={styles.summaryLabel}>已驳回</Text>
                        </View>
                    </View>

                    <View style={styles.filterRow}>
                        {[
                            { key: 'pending', label: '待审核' },
                            { key: 'all', label: '全部' },
                        ].map((item) => (
                            <TouchableOpacity
                                key={item.key}
                                style={[styles.filterChip, filter === item.key && styles.filterChipActive]}
                                onPress={() => setFilter(item.key as SubmissionFilter)}
                            >
                                <Text style={[styles.filterText, filter === item.key && styles.filterTextActive]}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {filteredSubmissions.length === 0 ? (
                        <Text style={styles.emptyText}>
                            {filter === 'pending' ? '暂无待审核的课程申请' : '暂无课程申请记录'}
                        </Text>
                    ) : filteredSubmissions.map((submission) => (
                        <View style={styles.card} key={submission.id}>
                            <View style={styles.cardHeader}>
                                <View style={styles.cardTitleRow}>
                                    <BookOpen size={14} color="#1E3A8A" />
                                    <Text style={styles.cardCode}>{submission.code}</Text>
                                </View>
                                <Text style={[
                                    styles.cardStatus,
                                    submission.status === 'approved' && styles.statusApproved,
                                    submission.status === 'rejected' && styles.statusRejected,
                                ]}>
                                    {submission.status === 'pending' ? '待审核'
                                        : submission.status === 'approved' ? '已通过' : '已驳回'}
                                </Text>
                            </View>
                            {!!submission.name && (
                                <Text style={styles.cardName}>{submission.name}</Text>
                            )}
                            {!!submission.instructor && (
                                <Text style={styles.cardMeta}>教师：{submission.instructor}</Text>
                            )}
                            {!!submission.department && (
                                <Text style={styles.cardMeta}>院系：{submission.department}</Text>
                            )}
                            <Text style={styles.cardMeta}>学分：{submission.credits}</Text>
                            {!!submission.submitter_name && (
                                <Text style={styles.cardMeta}>提交人：{submission.submitter_name}</Text>
                            )}
                            <Text style={styles.cardMeta}>
                                提交时间：{submission.created_at.toLocaleString()}
                            </Text>

                            {submission.status === 'pending' && (
                                <View style={styles.actionRow}>
                                    <TouchableOpacity
                                        style={[styles.actionButton, styles.approveButton]}
                                        onPress={() => handleApprove(submission)}
                                    >
                                        <CheckCircle2 size={14} color="#fff" />
                                        <Text style={styles.actionText}>批准</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.actionButton, styles.rejectButton]}
                                        onPress={() => handleReject(submission)}
                                    >
                                        <XCircle size={14} color="#fff" />
                                        <Text style={styles.actionText}>驳回</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: {
        height: 56,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    iconButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        color: '#0F172A',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    content: {
        padding: 16,
        paddingBottom: 28,
    },
    summaryRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 12,
    },
    summaryCard: {
        flex: 1,
        borderRadius: 14,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        paddingVertical: 12,
        alignItems: 'center',
        gap: 2,
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
    },
    summaryLabel: {
        fontSize: 11,
        color: '#64748B',
        fontWeight: '600',
    },
    filterRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    filterChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: '#E2E8F0',
    },
    filterChipActive: {
        backgroundColor: '#1E3A8A',
    },
    filterText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#334155',
    },
    filterTextActive: {
        color: '#fff',
    },
    emptyText: {
        textAlign: 'center',
        color: '#64748B',
        fontSize: 14,
        marginTop: 24,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: 12,
        marginBottom: 10,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    cardTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    cardCode: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E3A8A',
    },
    cardName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#0F172A',
        marginBottom: 4,
    },
    cardStatus: {
        fontSize: 11,
        fontWeight: '700',
        color: '#D97706',
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 99,
    },
    statusApproved: {
        color: '#15803D',
        backgroundColor: '#DCFCE7',
    },
    statusRejected: {
        color: '#DC2626',
        backgroundColor: '#FEE2E2',
    },
    cardMeta: {
        fontSize: 12,
        color: '#334155',
        marginBottom: 3,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 10,
    },
    actionButton: {
        flex: 1,
        borderRadius: 10,
        paddingVertical: 9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    approveButton: {
        backgroundColor: '#15803D',
    },
    rejectButton: {
        backgroundColor: '#DC2626',
    },
    actionText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
});
