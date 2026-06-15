import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    Easing,
    cancelAnimation,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import { ChevronRight, PencilLine } from 'lucide-react-native';
import { getRecentReviewsGlobal, RecentReview } from '../../services/courses';
import { StarRating } from '../common/StarRating';

// Fisher–Yates shuffle so the ticker doesn't just mirror the course list order.
const shuffle = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

interface RecentReviewsTickerProps {
    onPressReview: (courseId: string) => void;
    currentUserId?: string | null;
    /** When provided, an invite card ("write your own review") is appended to
        the marquee. The parent decides the target (e.g. open the first un-
        reviewed timetable course), so the card only shows when it's actionable. */
    onPressInvite?: () => void;
}

// Scroll speed in pixels / second — slow enough to read and to tap a card.
const SPEED = 38;

const isHttpAvatar = (a?: string) => !!a && /^https?:\/\//.test(a);

export const RecentReviewsTicker: React.FC<RecentReviewsTickerProps> = ({ onPressReview, currentUserId, onPressInvite }) => {
    const { t } = useTranslation();
    const router = useRouter();
    const [reviews, setReviews] = useState<RecentReview[]>([]);
    const offset = useSharedValue(0);
    const setWidthRef = useRef(0);
    const [setWidth, setSetWidth] = useState(0);

    useEffect(() => {
        let cancelled = false;
        getRecentReviewsGlobal(24, currentUserId || undefined)
            .then(data => { if (!cancelled) setReviews(shuffle(data)); })
            .catch(() => { if (!cancelled) setReviews([]); });
        return () => { cancelled = true; };
    }, [currentUserId]);

    const startMarquee = () => {
        const width = setWidthRef.current;
        if (width <= 0) return;
        cancelAnimation(offset);
        offset.value = 0;
        offset.value = withRepeat(
            withTiming(-width, { duration: (width / SPEED) * 1000, easing: Easing.linear }),
            -1,
            false
        );
    };

    useEffect(() => {
        if (setWidth > 0) startMarquee();
        return () => cancelAnimation(offset);
    }, [setWidth]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: offset.value }],
    }));

    if (reviews.length === 0) return null;

    const renderCard = (review: RecentReview, idx: number, keyPrefix: string) => {
        const anonymous = review.isAnonymous;
        const name = anonymous ? t('courses.live_reviews_anon') : review.authorName;
        const avatar = anonymous ? '👤' : review.authorAvatar;
        const snippet = review.content.replace(/\s+/g, ' ').trim();
        return (
            <TouchableOpacity
                key={`${keyPrefix}-${review.id}-${idx}`}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => onPressReview(review.courseId)}
            >
                <View style={styles.cardHeader}>
                    {isHttpAvatar(avatar) ? (
                        <Image source={{ uri: avatar }} style={styles.avatarImg} />
                    ) : (
                        <Text style={styles.avatarEmoji}>{avatar || '👤'}</Text>
                    )}
                    <Text style={styles.author} numberOfLines={1}>{name}</Text>
                    {!!review.courseCode && (
                        <View style={styles.codeChip}>
                            <Text style={styles.codeChipText}>{review.courseCode.toUpperCase()}</Text>
                        </View>
                    )}
                    {!!review.rating && (
                        <StarRating rating={review.rating} size={11} gap={1} />
                    )}
                </View>
                <Text style={styles.content} numberOfLines={2}>{snippet}</Text>
            </TouchableOpacity>
        );
    };

    const renderInviteCard = (keyPrefix: string) => (
        <TouchableOpacity
            key={`${keyPrefix}-invite`}
            style={styles.inviteCard}
            activeOpacity={0.85}
            onPress={onPressInvite}
        >
            <View style={styles.inviteIcon}>
                <PencilLine size={16} color="#fff" />
            </View>
            <Text style={styles.inviteText} numberOfLines={2}>{t('courses.live_reviews_invite', '写下你的评价 · +15 积分')}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.wrapper}>
            <View style={styles.titleRow}>
                <Text style={styles.title}>{t('courses.live_reviews_title')}</Text>
                <TouchableOpacity
                    style={styles.moreButton}
                    activeOpacity={0.7}
                    onPress={() => router.push('/courses/reviews' as any)}
                >
                    <Text style={styles.moreText}>{t('courses.live_reviews_more')}</Text>
                    <ChevronRight size={14} color="#1D4ED8" />
                </TouchableOpacity>
            </View>
            <View style={styles.viewport}>
                <Animated.View style={[styles.track, animatedStyle]}>
                    {/* First set — measured to drive the loop distance */}
                    <View
                        style={styles.set}
                        onLayout={e => {
                            const w = e.nativeEvent.layout.width;
                            if (w > 0 && Math.abs(w - setWidthRef.current) > 1) {
                                setWidthRef.current = w;
                                setSetWidth(w);
                            }
                        }}
                    >
                        {reviews.map((r, i) => renderCard(r, i, 'a'))}
                        {onPressInvite && renderInviteCard('a')}
                    </View>
                    {/* Duplicate set for a seamless wrap-around */}
                    <View style={styles.set}>
                        {reviews.map((r, i) => renderCard(r, i, 'b'))}
                        {onPressInvite && renderInviteCard('b')}
                    </View>
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        paddingTop: 12,
        paddingBottom: 4,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    moreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        paddingVertical: 2,
        paddingLeft: 8,
    },
    moreText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1D4ED8',
    },
    viewport: {
        overflow: 'hidden',
    },
    track: {
        flexDirection: 'row',
    },
    set: {
        flexDirection: 'row',
        paddingLeft: 20,
    },
    card: {
        width: 230,
        backgroundColor: '#fff',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#EEF2F7',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 6,
    },
    avatarImg: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#F1F5F9',
    },
    avatarEmoji: {
        fontSize: 18,
    },
    author: {
        flex: 1,
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
    },
    codeChip: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    codeChipText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#1D4ED8',
    },
    ratingChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        backgroundColor: '#FFF9C4',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    ratingChipText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#B45309',
    },
    content: {
        fontSize: 12,
        lineHeight: 17,
        color: '#6B7280',
    },
    inviteCard: {
        width: 170,
        backgroundColor: '#1E3A8A',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 10,
    },
    inviteIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.18)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inviteText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#fff',
        lineHeight: 18,
    },
});
