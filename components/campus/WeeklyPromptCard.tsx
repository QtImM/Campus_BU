import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { WeeklyPrompt } from '../../services/weeklyPrompts';

interface WeeklyPromptCardProps {
    prompt: WeeklyPrompt | null;
    onJoin: () => void;
}

export default function WeeklyPromptCard({ prompt, onJoin }: WeeklyPromptCardProps) {
    const { t } = useTranslation();
    if (!prompt) return null;

    const zh = prompt.content_zh || prompt.content;
    const en = prompt.content_en;

    return (
        <TouchableOpacity activeOpacity={0.88} onPress={onJoin} style={styles.wrapper}>
            <LinearGradient
                colors={['#1E3A8A', '#3B82F6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
            >
                <View style={styles.tagRow}>
                    <View style={styles.tag}>
                        <Text style={styles.tagText}>{t('campus.weekly_prompt.tag')}</Text>
                    </View>
                    <Text style={styles.emoji}>{prompt.emoji}</Text>
                </View>

                {/* Chinese — primary */}
                <Text style={styles.contentZh} numberOfLines={3}>{zh}</Text>

                {/* English — secondary, only shown when available */}
                {!!en && (
                    <Text style={styles.contentEn} numberOfLines={2}>{en}</Text>
                )}

                <View style={styles.joinRow}>
                    <Text style={styles.joinText}>{t('campus.weekly_prompt.join')}</Text>
                    <ArrowRight size={14} color="#fff" />
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginHorizontal: 12,
        marginBottom: 12,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#1E3A8A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    card: {
        padding: 16,
    },
    tagRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    tag: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.35)',
    },
    tagText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.5,
    },
    emoji: {
        fontSize: 20,
    },
    contentZh: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        lineHeight: 24,
        marginBottom: 4,
    },
    contentEn: {
        fontSize: 13,
        fontWeight: '400',
        color: 'rgba(255,255,255,0.75)',
        lineHeight: 18,
        marginBottom: 14,
    },
    joinRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 10,
    },
    joinText: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.9)',
    },
});
