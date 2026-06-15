import { LinearGradient } from 'expo-linear-gradient';
import { Quote } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, View } from 'react-native';
import { StarRating } from '../common/StarRating';

const LOGO = require('../../assets/images/HKCampusicon.png');

// Warm gold reads better on the deep-indigo gradient than the list-view gold.
const STAR_GOLD = '#FBBF24';

export interface ShareCourseInfo {
    code: string;
    name: string;
    department?: string;
    credits?: number | string;
}

export interface ShareCardPayload {
    variant: 'course' | 'review';
    course: ShareCourseInfo;
    /** course variant */
    avgRating?: number;
    reviewCount?: number;
    avgDifficulty?: number;
    tags?: string[];
    quote?: { text: string; author: string } | null;
    /** review variant */
    review?: { content: string; rating?: number; author: string };
}

interface ShareCardProps {
    payload: ShareCardPayload;
    /** Logical width of the card; height grows with content. */
    width: number;
}

/**
 * The shareable "drop it in the freshman group-chat" card. Brand-forward,
 * gradient, screenshot-friendly. Rendered inside a ViewShot for capture.
 */
export const ShareCard: React.FC<ShareCardProps> = ({ payload, width }) => {
    const { t } = useTranslation();
    const { variant, course } = payload;

    const Brand = (
        <View style={styles.brandRow}>
            <Image source={LOGO} style={styles.logo} />
            <View>
                <Text style={styles.wordmark}>HKCampus</Text>
                <Text style={styles.tagline}>{t('share.card_tagline', '香港高校 · 课程点评')}</Text>
            </View>
        </View>
    );

    const Footer = (
        <View style={styles.footer}>
            <View style={styles.footerDivider} />
            <View style={styles.footerRow}>
                <View style={styles.footerDot} />
                <Text style={styles.footerText} numberOfLines={1}>
                    {t('share.card_cta', '下载 HKCampus · 查看完整评价')}
                </Text>
            </View>
        </View>
    );

    return (
        <LinearGradient
            colors={['#1E3A8A', '#312E81', '#4338CA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.card, { width }]}
        >
            {/* Decorative depth — soft light blooms behind the content. */}
            <View style={styles.blobTop} pointerEvents="none" />
            <View style={styles.blobBottom} pointerEvents="none" />

            {Brand}

            {variant === 'course' ? (
                <CourseBody payload={payload} t={t} />
            ) : (
                <ReviewBody payload={payload} t={t} />
            )}

            {Footer}
        </LinearGradient>
    );
};

const CourseBody: React.FC<{ payload: ShareCardPayload; t: (k: string, d?: any) => string }> = ({ payload, t }) => {
    const { course, avgRating = 0, reviewCount = 0, avgDifficulty = 0, tags = [], quote } = payload;

    const metaParts: string[] = [];
    metaParts.push(t('share.card_reviews_count', { count: reviewCount, defaultValue: `${reviewCount} 条评价` }) as any);
    if (avgDifficulty > 0) {
        metaParts.push(t('share.card_difficulty', { value: avgDifficulty.toFixed(1), defaultValue: `难度 ${avgDifficulty.toFixed(1)}` }) as any);
    }

    return (
        <View style={styles.body}>
            {!!course.department && (
                <Text style={styles.dept} numberOfLines={1}>{course.department.toUpperCase()}</Text>
            )}
            <View style={styles.codeRow}>
                <View style={styles.codeChip}>
                    <Text style={styles.codeChipText}>{course.code.toUpperCase()}</Text>
                </View>
            </View>
            <Text style={styles.courseName} numberOfLines={2}>{course.name}</Text>

            {avgRating > 0 ? (
                <View style={styles.ratingHero}>
                    <Text style={styles.ratingNumber}>{avgRating.toFixed(1)}</Text>
                    <Text style={styles.ratingOutOf}>/5</Text>
                    <View style={styles.ratingRight}>
                        <StarRating rating={avgRating} size={17} gap={2.5} color={STAR_GOLD} emptyColor="rgba(255,255,255,0.25)" />
                        <Text style={styles.ratingMeta}>{metaParts.join('  ·  ')}</Text>
                    </View>
                </View>
            ) : (
                <Text style={styles.ratingMeta}>{metaParts.join('  ·  ')}</Text>
            )}

            {quote && !!quote.text?.trim() && (
                <View style={styles.quoteCard}>
                    <Text style={styles.quoteText} numberOfLines={3}>{quote.text.trim()}</Text>
                    <Text style={styles.quoteAuthor}>— {quote.author}</Text>
                </View>
            )}

            {tags.length > 0 && (
                <View style={styles.tagsRow}>
                    {tags.slice(0, 3).map((tag, i) => (
                        <View key={`${tag}-${i}`} style={styles.tagPill}>
                            <Text style={styles.tagPillText}>#{tag}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

const ReviewBody: React.FC<{ payload: ShareCardPayload; t: (k: string, d?: any) => string }> = ({ payload, t }) => {
    const { course, review } = payload;
    if (!review) return null;

    return (
        <View style={styles.body}>
            <Quote size={30} color="rgba(255,255,255,0.32)" fill="rgba(255,255,255,0.32)" />
            <Text style={styles.reviewQuote} numberOfLines={6}>{review.content.trim()}</Text>

            <View style={styles.reviewAuthorRow}>
                {!!review.rating && (
                    <StarRating rating={review.rating} size={15} gap={2} color={STAR_GOLD} emptyColor="rgba(255,255,255,0.25)" />
                )}
                <Text style={styles.reviewAuthor} numberOfLines={1}>— {review.author}</Text>
            </View>

            <View style={styles.reviewCourseChip}>
                <Text style={styles.reviewCourseChipText} numberOfLines={1}>
                    {[course.code.toUpperCase(), course.name].filter(Boolean).join('  ·  ')}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 26,
        padding: 22,
        overflow: 'hidden',
    },
    blobTop: {
        position: 'absolute',
        top: -70,
        right: -50,
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(99,102,241,0.45)',
    },
    blobBottom: {
        position: 'absolute',
        bottom: -60,
        left: -40,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(59,130,246,0.30)',
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    logo: {
        width: 32,
        height: 32,
        borderRadius: 9,
    },
    wordmark: {
        fontSize: 16,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: 0.3,
    },
    tagline: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 1,
    },
    body: {
        marginTop: 20,
    },
    dept: {
        fontSize: 11,
        fontWeight: '700',
        color: 'rgba(191,219,254,0.9)',
        letterSpacing: 1,
        marginBottom: 8,
    },
    codeRow: {
        flexDirection: 'row',
    },
    codeChip: {
        backgroundColor: 'rgba(255,255,255,0.16)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    codeChipText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: 0.5,
    },
    courseName: {
        fontSize: 25,
        fontWeight: '800',
        color: '#fff',
        lineHeight: 31,
        marginTop: 12,
    },
    ratingHero: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: 18,
        gap: 4,
    },
    ratingNumber: {
        fontSize: 42,
        fontWeight: '900',
        color: '#fff',
        lineHeight: 44,
    },
    ratingOutOf: {
        fontSize: 15,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 5,
    },
    ratingRight: {
        marginLeft: 12,
        marginBottom: 3,
        gap: 5,
    },
    ratingMeta: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.8)',
        marginTop: 6,
    },
    quoteCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginTop: 20,
    },
    quoteText: {
        fontSize: 13.5,
        lineHeight: 20,
        color: '#334155',
        fontWeight: '500',
    },
    quoteAuthor: {
        fontSize: 11,
        color: '#94A3B8',
        fontWeight: '600',
        textAlign: 'right',
        marginTop: 8,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 16,
    },
    tagPill: {
        backgroundColor: 'rgba(255,255,255,0.14)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    tagPillText: {
        fontSize: 11,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.92)',
    },
    // review variant
    reviewQuote: {
        fontSize: 19,
        lineHeight: 28,
        fontWeight: '600',
        color: '#fff',
        marginTop: 6,
    },
    reviewAuthorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 18,
    },
    reviewAuthor: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.85)',
        flexShrink: 1,
    },
    reviewCourseChip: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.12)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        marginTop: 16,
    },
    reviewCourseChipText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
    },
    // footer
    footer: {
        marginTop: 22,
    },
    footerDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.18)',
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        marginTop: 12,
    },
    footerDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: STAR_GOLD,
    },
    footerText: {
        fontSize: 11.5,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.85)',
    },
});
