import { Star } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

interface PioneerBadgeProps {
    shouldShow?: boolean;
    size?: 'small' | 'medium';
}

export const PioneerBadge: React.FC<PioneerBadgeProps> = ({ shouldShow = true, size = 'small' }) => {
    const { t } = useTranslation();
    if (!shouldShow) return null;

    const s = size === 'small' ? small : medium;
    return (
        <View style={s.badge}>
            <Star size={size === 'small' ? 8 : 10} color="#92400E" fill="#92400E" />
            <Text style={s.text}>{t('rewards.pioneer_badge')}</Text>
        </View>
    );
};

const small = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        paddingHorizontal: 5,
        paddingVertical: 1,
        backgroundColor: '#FEF3C7',
        borderRadius: 3,
        marginLeft: 4,
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    text: {
        fontSize: 9,
        fontWeight: '700',
        color: '#92400E',
        letterSpacing: 0.2,
    },
});

const medium = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        paddingHorizontal: 7,
        paddingVertical: 2,
        backgroundColor: '#FEF3C7',
        borderRadius: 4,
        marginLeft: 6,
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    text: {
        fontSize: 11,
        fontWeight: '700',
        color: '#92400E',
        letterSpacing: 0.2,
    },
});
