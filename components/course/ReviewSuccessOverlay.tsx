import { CheckCircle2 } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

interface ReviewSuccessOverlayProps {
    visible: boolean;
    /** First-ever review on this course unlocks the points reward. */
    isFirst: boolean;
    /** How many reviews this course now has (incl. the one just posted). */
    helpedCount: number;
    onClose: () => void;
}

const AUTO_DISMISS_MS = 2200;

/**
 * A short, delightful confirmation shown right after a review is posted.
 * Gives the user immediate positive feedback ("+15 积分", "已帮到 N 位同学")
 * instead of a flat system alert — the moment that turns a one-time reviewer
 * into a repeat contributor. Auto-dismisses, or tap anywhere to close early.
 */
export const ReviewSuccessOverlay: React.FC<ReviewSuccessOverlayProps> = ({ visible, isFirst, helpedCount, onClose }) => {
    const { t } = useTranslation();
    const cardScale = useSharedValue(0.7);
    const cardOpacity = useSharedValue(0);
    const checkScale = useSharedValue(0);

    useEffect(() => {
        if (!visible) return;

        cardOpacity.value = withTiming(1, { duration: 180, easing: Easing.out(Easing.ease) });
        cardScale.value = withSpring(1, { damping: 13, stiffness: 180, mass: 0.7 });
        checkScale.value = withDelay(
            120,
            withSequence(
                withSpring(1.15, { damping: 9, stiffness: 200 }),
                withSpring(1, { damping: 12, stiffness: 200 })
            )
        );

        const timer = setTimeout(() => runOnJS(onClose)(), AUTO_DISMISS_MS);
        return () => {
            clearTimeout(timer);
            cardScale.value = 0.7;
            cardOpacity.value = 0;
            checkScale.value = 0;
        };
    }, [visible]);

    const cardStyle = useAnimatedStyle(() => ({
        opacity: cardOpacity.value,
        transform: [{ scale: cardScale.value }],
    }));

    const checkStyle = useAnimatedStyle(() => ({
        transform: [{ scale: checkScale.value }],
    }));

    if (!visible) return null;

    const helpedLine = helpedCount > 1
        ? t('courses.review_success_helped', { count: helpedCount, defaultValue: '已有 {{count}} 条评价一起帮同学避坑 🙌' })
        : t('courses.review_success_helped_first', '你的评价会帮到正在选课的同学 🙌');

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.overlay} onPress={onClose}>
                <Animated.View style={[styles.card, cardStyle]}>
                    <Animated.View style={[styles.checkWrap, checkStyle]}>
                        <CheckCircle2 size={56} color="#16A34A" />
                    </Animated.View>
                    <Text style={styles.title}>{t('courses.review_success_title', '评价发布成功')}</Text>
                    {isFirst && (
                        <View style={styles.pointsPill}>
                            <Text style={styles.pointsText}>🎉 {t('courses.review_success_points', '首次评价 +15 积分')}</Text>
                        </View>
                    )}
                    <Text style={styles.subtitle}>{helpedLine}</Text>
                </Animated.View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    card: {
        width: '100%',
        maxWidth: 320,
        backgroundColor: '#fff',
        borderRadius: 24,
        paddingVertical: 32,
        paddingHorizontal: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.18,
        shadowRadius: 28,
        elevation: 12,
    },
    checkWrap: {
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 10,
    },
    pointsPill: {
        backgroundColor: '#ECFDF5',
        borderWidth: 1,
        borderColor: '#A7F3D0',
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 6,
        marginBottom: 12,
    },
    pointsText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#047857',
    },
    subtitle: {
        fontSize: 13,
        lineHeight: 19,
        color: '#64748B',
        textAlign: 'center',
    },
});
