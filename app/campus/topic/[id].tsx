import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, MessageCircle, Heart, Plus } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { CachedRemoteImage } from '../../../components/common/CachedRemoteImage';
import { getCurrentUser } from '../../../services/auth';
import { fetchPostsByPromptId } from '../../../services/campus';
import { getPromptById, WeeklyPrompt } from '../../../services/weeklyPrompts';
import { Post } from '../../../types';
import { isRemoteImageUrl } from '../../../utils/remoteImage';
import { isHKBUEmail } from '../../../utils/userUtils';
import { EduBadge } from '../../../components/common/EduBadge';
import { formatDistanceToNow } from 'date-fns';

export default function TopicDetailScreen() {
    const { id, topicZh, topicEn, emoji } = useLocalSearchParams();
    const router = useRouter();
    const { t } = useTranslation();

    const [prompt, setPrompt] = useState<WeeklyPrompt | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | undefined>();

    const load = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const [user, promptData, postsData] = await Promise.all([
                getCurrentUser().catch(() => null),
                getPromptById(Number(id)),
                fetchPostsByPromptId(Number(id)),
            ]);
            setCurrentUserId(user?.uid);
            setPrompt(promptData);
            setPosts(postsData);
        } catch (e) {
            console.error('[TopicDetail] load failed:', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [id]);

    useEffect(() => { void load(); }, [load]);

    const handleCompose = () => {
        const p = prompt;
        router.push({
            pathname: '/campus/compose',
            params: {
                promptId: String(id),
                topicZh: p?.content_zh || p?.content || (topicZh as string) || '',
                topicEn: p?.content_en || (topicEn as string) || '',
            },
        });
    };

    const displayZh = prompt?.content_zh || prompt?.content || (topicZh as string) || '';
    const displayEn = prompt?.content_en || (topicEn as string) || '';
    const displayEmoji = prompt?.emoji || (emoji as string) || '💬';

    const renderPost = ({ item }: { item: Post }) => (
        <TouchableOpacity
            style={styles.postCard}
            activeOpacity={0.75}
            onPress={() => router.push({ pathname: '/campus/[id]' as any, params: { id: item.id } })}
        >
            <View style={styles.postHeader}>
                <View style={styles.avatarWrap}>
                    {!item.isAnonymous && isRemoteImageUrl(item.authorAvatar) ? (
                        <CachedRemoteImage uri={item.authorAvatar!} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatar, styles.avatarFallback]}>
                            <Text style={styles.avatarLetter}>
                                {item.isAnonymous ? '?' : item.authorName.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}
                </View>
                <View style={styles.authorInfo}>
                    <View style={styles.authorRow}>
                        <Text style={styles.authorName} numberOfLines={1}>
                            {item.isAnonymous ? t('teachers.anonymous_student') : item.authorName}
                        </Text>
                        <EduBadge shouldShow={!item.isAnonymous && isHKBUEmail(item.authorEmail)} size="small" />
                    </View>
                    <Text style={styles.time}>
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </Text>
                </View>
            </View>
            <Text style={styles.content} numberOfLines={5}>{item.content}</Text>
            <View style={styles.counts}>
                <View style={styles.countItem}>
                    <Heart size={13} color={item.isLiked ? '#EF4444' : '#9CA3AF'} fill={item.isLiked ? '#EF4444' : 'transparent'} />
                    <Text style={[styles.countText, item.isLiked && styles.countLiked]}>{item.likes}</Text>
                </View>
                <View style={styles.countItem}>
                    <MessageCircle size={13} color="#9CA3AF" />
                    <Text style={styles.countText}>{item.comments}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.screen}>
            {/* Header */}
            <LinearGradient colors={['#1E3A8A', '#3B82F6']} style={styles.header}>
                <TouchableOpacity style={styles.back} onPress={() => router.back()}>
                    <ChevronLeft size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerTag}>
                    <Text style={styles.headerTagText}>{t('campus.weekly_prompt.tag')}</Text>
                    <Text style={styles.headerEmoji}>{displayEmoji}</Text>
                </View>
                <Text style={styles.headerZh}>{displayZh}</Text>
                {!!displayEn && <Text style={styles.headerEn}>{displayEn}</Text>}
                <Text style={styles.responseCount}>
                    {t('campus.weekly_prompt.response_count', { count: posts.length })}
                </Text>
            </LinearGradient>

            {/* Posts */}
            {loading ? (
                <View style={styles.loadingBox}>
                    <ActivityIndicator color="#1E3A8A" size="large" />
                </View>
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={item => item.id}
                    renderItem={renderPost}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void load(true); }} tintColor="#1E3A8A" />
                    }
                    contentContainerStyle={posts.length === 0 ? styles.emptyContainer : styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyBox}>
                            <Text style={styles.emptyEmoji}>💬</Text>
                            <Text style={styles.emptyText}>{t('campus.weekly_prompt.be_first')}</Text>
                        </View>
                    }
                />
            )}

            {/* Compose FAB */}
            <TouchableOpacity style={styles.fab} activeOpacity={0.85} onPress={handleCompose}>
                <Plus size={18} color="#fff" />
                <Text style={styles.fabText}>{t('campus.weekly_prompt.join')}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#F9FAFB' },
    header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 20 },
    back: { position: 'absolute', top: 52, left: 12, padding: 8 },
    headerTag: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
    headerTagText: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.85)', letterSpacing: 0.8, textTransform: 'uppercase' },
    headerEmoji: { fontSize: 16 },
    headerZh: { fontSize: 20, fontWeight: '800', color: '#fff', lineHeight: 28, marginBottom: 4 },
    headerEn: { fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 20, marginBottom: 12 },
    responseCount: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 4 },
    loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    listContent: { padding: 12, paddingBottom: 100 },
    emptyContainer: { flex: 1 },
    emptyBox: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
    emptyEmoji: { fontSize: 40 },
    emptyText: { fontSize: 15, color: '#6B7280', textAlign: 'center', paddingHorizontal: 32 },
    postCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
    avatarWrap: {},
    avatar: { width: 36, height: 36, borderRadius: 18 },
    avatarFallback: { backgroundColor: '#1E3A8A', alignItems: 'center', justifyContent: 'center' },
    avatarLetter: { fontSize: 14, fontWeight: '700', color: '#fff' },
    authorInfo: { flex: 1 },
    authorRow: { flexDirection: 'row', alignItems: 'center' },
    authorName: { fontSize: 13, fontWeight: '700', color: '#111827' },
    time: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
    content: { fontSize: 14, color: '#374151', lineHeight: 22 },
    counts: { flexDirection: 'row', gap: 14, marginTop: 12 },
    countItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    countText: { fontSize: 12, color: '#9CA3AF' },
    countLiked: { color: '#EF4444' },
    fab: { position: 'absolute', bottom: 32, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1E3A8A', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 999, shadowColor: '#1E3A8A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 6 },
    fabText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
