import { useRouter } from 'expo-router';
import { ArrowLeft, MessageSquare, Share2 } from 'lucide-react-native';
import { StarRating } from '../../components/common/StarRating';
import { ShareCardSheet } from '../../components/share/ShareCardSheet';
import type { ShareCardPayload } from '../../components/share/ShareCard';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getCurrentUser } from '../../services/auth';
import { getRecentReviewsGlobal, RecentReview } from '../../services/courses';
import { useLoginPrompt } from '../../hooks/useLoginPrompt';
import { useThrottledCallback } from '../../hooks/useThrottle';

const PAGE_SIZE = 20;

const isHttpAvatar = (a?: string) => !!a && /^https?:\/\//.test(a);

export default function AllReviewsScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { checkLogin } = useLoginPrompt();

    const [reviews, setReviews] = useState<RecentReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [shareTarget, setShareTarget] = useState<ShareCardPayload | null>(null);
    const offsetRef = useRef(0);
    const userIdRef = useRef<string | undefined>(undefined);
    const seenIds = useRef<Set<string>>(new Set());

    const load = useCallback(async (reset: boolean) => {
        if (reset) {
            offsetRef.current = 0;
            seenIds.current = new Set();
        }
        const page = await getRecentReviewsGlobal(PAGE_SIZE, userIdRef.current, offsetRef.current);
        offsetRef.current += PAGE_SIZE;
        // Guard against duplicates across pages.
        const fresh = page.filter(r => !seenIds.current.has(r.id));
        fresh.forEach(r => seenIds.current.add(r.id));
        setReviews(prev => (reset ? fresh : [...prev, ...fresh]));
        setHasMore(page.length > 0);
    }, []);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const user = await getCurrentUser().catch(() => null);
            userIdRef.current = user?.uid || undefined;
            if (cancelled) return;
            await load(true);
            if (!cancelled) setLoading(false);
        })();
        return () => { cancelled = true; };
    }, [load]);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await load(true);
        setRefreshing(false);
    }, [load]);

    const handleLoadMore = useCallback(async () => {
        if (loadingMore || !hasMore || loading) return;
        setLoadingMore(true);
        await load(false);
        setLoadingMore(false);
    }, [loadingMore, hasMore, loading, load]);

    const handlePressReview = useThrottledCallback((courseId: string) => {
        if (!checkLogin(userIdRef.current || null)) return;
        router.push(`/courses/${courseId}` as any);
    });

    const buildReviewPayload = (item: RecentReview): ShareCardPayload => ({
        variant: 'review',
        course: { code: item.courseCode || '', name: item.courseName || '' },
        review: {
            content: item.content,
            rating: item.rating,
            author: item.isAnonymous ? t('courses.live_reviews_anon') : item.authorName,
        },
    });

    const renderItem = ({ item }: { item: RecentReview }) => {
        const anonymous = item.isAnonymous;
        const name = anonymous ? t('courses.live_reviews_anon') : item.authorName;
        const avatar = anonymous ? '👤' : item.authorAvatar;
        const courseLabel = [item.courseCode?.toUpperCase(), item.courseName].filter(Boolean).join(' · ');
        return (
            <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => handlePressReview(item.courseId)}>
                <View style={styles.cardHeader}>
                    {isHttpAvatar(avatar) ? (
                        <Image source={{ uri: avatar }} style={styles.avatarImg} />
                    ) : (
                        <Text style={styles.avatarEmoji}>{avatar || '👤'}</Text>
                    )}
                    <Text style={styles.author} numberOfLines={1}>{name}</Text>
                    {!!item.rating && (
                        <StarRating rating={item.rating} size={11} gap={1} />
                    )}
                    <TouchableOpacity
                        style={styles.shareBtn}
                        onPress={() => setShareTarget(buildReviewPayload(item))}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Share2 size={15} color="#94A3B8" />
                    </TouchableOpacity>
                </View>
                {!!courseLabel && (
                    <View style={styles.courseRow}>
                        <Text style={styles.courseLabel} numberOfLines={1}>{courseLabel}</Text>
                    </View>
                )}
                <Text style={styles.content}>{item.content.trim()}</Text>
                {item.tags.length > 0 && (
                    <View style={styles.tagRow}>
                        {item.tags.slice(0, 4).map((tag, i) => (
                            <View key={`${item.id}-tag-${i}`} style={styles.tag}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/course'))}
                >
                    <ArrowLeft size={24} color="#fff" />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{t('courses.all_reviews_title')}</Text>
                    <Text style={styles.subtitle}>{t('courses.all_reviews_subtitle')}</Text>
                </View>
            </View>

            <FlatList
                data={reviews}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.4}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#1E3A8A" />}
                ListFooterComponent={loadingMore ? (
                    <View style={styles.footer}><ActivityIndicator size="small" color="#1E3A8A" /></View>
                ) : null}
                ListEmptyComponent={
                    loading ? (
                        <View style={styles.footer}><ActivityIndicator size="large" color="#1E3A8A" /></View>
                    ) : (
                        <View style={styles.empty}>
                            <MessageSquare size={48} color="#D1D5DB" />
                            <Text style={styles.emptyText}>{t('courses.all_reviews_empty')}</Text>
                        </View>
                    )
                }
            />

            <ShareCardSheet
                visible={!!shareTarget}
                payload={shareTarget}
                onClose={() => setShareTarget(null)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingTop: 56,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#1E3A8A',
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
    },
    backButton: {
        padding: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtitle: {
        fontSize: 12,
        color: '#C7D2FE',
        marginTop: 2,
    },
    listContent: {
        padding: 16,
        paddingBottom: 60,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    avatarImg: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F1F5F9',
    },
    avatarEmoji: {
        fontSize: 22,
    },
    author: {
        flex: 1,
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
    },
    shareBtn: {
        padding: 4,
        marginLeft: 4,
    },
    ratingChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: '#FFF9C4',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    ratingChipText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#B45309',
    },
    courseRow: {
        marginBottom: 8,
    },
    courseLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1D4ED8',
    },
    content: {
        fontSize: 14,
        lineHeight: 20,
        color: '#374151',
    },
    tagRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 10,
    },
    tag: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    tagText: {
        fontSize: 11,
        color: '#64748B',
    },
    footer: {
        paddingVertical: 24,
        alignItems: 'center',
    },
    empty: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
    },
    emptyText: {
        fontSize: 15,
        color: '#6B7280',
        marginTop: 12,
    },
});
