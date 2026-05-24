/**
 * Review Modal
 *
 * Renders the course review form when actionPayload.uiSchema.surface === 'review_modal'.
 * Supports rating selection, preset content templates, and field editing.
 * See docs/agent/action-agent-contract-and-flow.md §8.2, §12.
 */

import { X, Star } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Switch,
    ScrollView,
} from 'react-native';
import type { ActionPayload, PostCourseReviewDraft } from '../../services/agent/action_runtime/types';
import { REVIEW_PRESETS } from '../../services/agent/action_runtime/contract';

interface ReviewModalProps {
    visible: boolean;
    payload: ActionPayload | null;
    onSubmit: (draft: PostCourseReviewDraft) => void;
    onCancel: () => void;
}

const PRESET_TEMPLATES = REVIEW_PRESETS.ratingToContentTemplates;

export const ReviewModal: React.FC<ReviewModalProps> = ({
    visible,
    payload,
    onSubmit,
    onCancel,
}) => {
    const draft = (payload?.action.draft as PostCourseReviewDraft) ?? {
        courseCode: null,
        rating: null,
        content: '',
        anonymous: false,
    };

    const [courseCode, setCourseCode] = useState(draft.courseCode ?? '');
    const [rating, setRating] = useState<number | null>(draft.rating);
    const [content, setContent] = useState(draft.content);
    const [anonymous, setAnonymous] = useState(draft.anonymous);
    const [showPresets, setShowPresets] = useState(false);

    // Sync state when payload changes
    useEffect(() => {
        if (payload) {
            const d = payload.action.draft as PostCourseReviewDraft;
            setCourseCode(d.courseCode ?? '');
            setRating(d.rating);
            setContent(d.content);
            setAnonymous(d.anonymous);
        }
    }, [payload]);

    const handleRatingSelect = useCallback((selected: number) => {
        setRating(selected);
        // Auto-fill preset content if content is empty
        if (!content.trim()) {
            const templates = PRESET_TEMPLATES[String(selected) as keyof typeof PRESET_TEMPLATES];
            if (templates && templates.length > 0) {
                setContent(templates[0]);
                setShowPresets(true);
            }
        }
    }, [content]);

    const handlePresetSelect = useCallback((text: string) => {
        setContent(text);
        setShowPresets(false);
    }, []);

    const handleSubmit = useCallback(() => {
        onSubmit({
            courseCode: courseCode.trim().toUpperCase() || null,
            rating,
            content: content.trim(),
            anonymous,
        });
    }, [courseCode, rating, content, anonymous, onSubmit]);

    const canSubmit = courseCode.trim().length > 0 && rating != null && content.trim().length > 0;

    if (!payload) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onCancel}
        >
            <Pressable style={styles.overlay} onPress={onCancel}>
                <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>发布课程评价</Text>
                        <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
                            <X size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                        {/* Course Code */}
                        <Text style={styles.label}>课程代码 *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="例如 COMP3015"
                            placeholderTextColor="#9CA3AF"
                            value={courseCode}
                            onChangeText={setCourseCode}
                            autoCapitalize="characters"
                        />

                        {/* Rating */}
                        <Text style={styles.label}>评分 *</Text>
                        <View style={styles.ratingRow}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity
                                    key={star}
                                    onPress={() => handleRatingSelect(star)}
                                    style={styles.starButton}
                                >
                                    <Star
                                        size={32}
                                        color={star <= (rating ?? 0) ? '#F59E0B' : '#D1D5DB'}
                                        fill={star <= (rating ?? 0) ? '#F59E0B' : 'none'}
                                    />
                                </TouchableOpacity>
                            ))}
                            {rating != null && (
                                <Text style={styles.ratingText}>{rating}/5</Text>
                            )}
                        </View>

                        {/* Preset Templates */}
                        {showPresets && rating != null && (
                            <View style={styles.presetsContainer}>
                                <Text style={styles.presetsLabel}>推荐文案：</Text>
                                {(PRESET_TEMPLATES[String(rating) as keyof typeof PRESET_TEMPLATES] || []).map(
                                    (template, idx) => (
                                        <TouchableOpacity
                                            key={idx}
                                            style={[
                                                styles.presetItem,
                                                content === template && styles.presetItemSelected,
                                            ]}
                                            onPress={() => handlePresetSelect(template)}
                                        >
                                            <Text
                                                style={[
                                                    styles.presetText,
                                                    content === template && styles.presetTextSelected,
                                                ]}
                                            >
                                                {template}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                )}
                            </View>
                        )}

                        {/* Content */}
                        <Text style={styles.label}>评价内容 *</Text>
                        <TextInput
                            style={[styles.input, styles.textarea]}
                            placeholder="写下你的上课体验"
                            placeholderTextColor="#9CA3AF"
                            value={content}
                            onChangeText={setContent}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />

                        {/* Anonymous Toggle */}
                        <View style={styles.anonymousRow}>
                            <Text style={styles.anonymousLabel}>匿名发布</Text>
                            <Switch
                                value={anonymous}
                                onValueChange={setAnonymous}
                                trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                                thumbColor={anonymous ? '#1E3A8A' : '#F3F4F6'}
                            />
                        </View>
                    </ScrollView>

                    {/* Actions */}
                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                            <Text style={styles.cancelButtonText}>取消</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
                            onPress={handleSubmit}
                            disabled={!canSubmit}
                        >
                            <Text style={[styles.submitButtonText, !canSubmit && styles.submitButtonTextDisabled]}>
                                提交评价
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '85%',
        paddingBottom: 34,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F2F8',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    body: {
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 6,
        marginTop: 16,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: '#111827',
    },
    textarea: {
        minHeight: 100,
        paddingTop: 12,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    starButton: {
        padding: 4,
    },
    ratingText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#F59E0B',
        marginLeft: 8,
    },
    presetsContainer: {
        marginTop: 12,
        backgroundColor: '#F0F9FF',
        borderRadius: 12,
        padding: 12,
    },
    presetsLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1E3A8A',
        marginBottom: 8,
    },
    presetItem: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#DBEAFE',
        borderRadius: 10,
        padding: 10,
        marginBottom: 6,
    },
    presetItemSelected: {
        borderColor: '#1E3A8A',
        backgroundColor: '#EFF6FF',
    },
    presetText: {
        fontSize: 13,
        color: '#4B5563',
        lineHeight: 18,
    },
    presetTextSelected: {
        color: '#1E3A8A',
        fontWeight: '500',
    },
    anonymousRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingVertical: 8,
    },
    anonymousLabel: {
        fontSize: 15,
        color: '#374151',
    },
    actions: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 16,
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#6B7280',
    },
    submitButton: {
        flex: 2,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#1E3A8A',
        alignItems: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#D1D5DB',
    },
    submitButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
    },
    submitButtonTextDisabled: {
        color: '#9CA3AF',
    },
});
