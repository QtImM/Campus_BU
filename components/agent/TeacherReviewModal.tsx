/**
 * Teacher Review Modal
 *
 * Renders the teacher review form when actionPayload.uiSchema.surface === 'teacher_review_modal'.
 * Supports rating, difficulty, workload selection, and content editing.
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
    ScrollView,
} from 'react-native';
import type { ActionPayload, PostTeacherReviewDraft } from '../../services/agent/action_runtime/types';

interface TeacherReviewModalProps {
    visible: boolean;
    payload: ActionPayload | null;
    onSubmit: (draft: PostTeacherReviewDraft) => void;
    onCancel: () => void;
}

const TEACHER_TAGS = [
    '讲课清晰', '给分大方', '有耐心', '作业多', '考试难',
    '互动好', '有趣', '严格', '宝藏老师', '照本宣科',
];

export const TeacherReviewModal: React.FC<TeacherReviewModalProps> = ({
    visible,
    payload,
    onSubmit,
    onCancel,
}) => {
    const draft = (payload?.action.draft as PostTeacherReviewDraft) ?? {
        teacherName: null,
        teacherId: null,
        rating: null,
        difficulty: null,
        workload: null,
        content: '',
        tags: [],
    };

    const teacherField = payload?.action.uiSchema.fields?.find(f => f.name === 'teacherName');
    const isTeacherLocked = teacherField?.readonly ?? false;
    const teacherLabel = teacherField?.label ?? '教师姓名';

    const [teacherName, setTeacherName] = useState(draft.teacherName ?? '');
    const [rating, setRating] = useState<number | null>(draft.rating);
    const [difficulty, setDifficulty] = useState<number | null>(draft.difficulty);
    const [workload, setWorkload] = useState<number | null>(draft.workload);
    const [content, setContent] = useState(draft.content);
    const [selectedTags, setSelectedTags] = useState<string[]>(draft.tags || []);

    // Sync state when payload changes
    useEffect(() => {
        if (payload) {
            const d = payload.action.draft as PostTeacherReviewDraft;
            setTeacherName(d.teacherName ?? '');
            setRating(d.rating);
            setDifficulty(d.difficulty);
            setWorkload(d.workload);
            setContent(d.content);
            setSelectedTags(d.tags || []);
        }
    }, [payload]);

    const handleTagToggle = useCallback((tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : prev.length < 3 ? [...prev, tag] : prev
        );
    }, []);

    const handleSubmit = useCallback(() => {
        onSubmit({
            teacherName: teacherName.trim() || null,
            teacherId: draft.teacherId,
            rating,
            difficulty,
            workload,
            content: content.trim(),
            tags: selectedTags,
        });
    }, [teacherName, rating, difficulty, workload, content, selectedTags, draft.teacherId, onSubmit]);

    const canSubmit = teacherName.trim().length > 0 && rating != null && content.trim().length > 0;

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
                        <Text style={styles.title}>发布教师评价</Text>
                        <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
                            <X size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                        {/* Teacher Name */}
                        <Text style={styles.label}>{teacherLabel} *</Text>
                        {isTeacherLocked ? (
                            <View style={styles.lockedField}>
                                <Text style={styles.lockedText}>{teacherName || '—'}</Text>
                            </View>
                        ) : (
                            <TextInput
                                style={styles.input}
                                placeholder="例如 Dr. Chan"
                                placeholderTextColor="#9CA3AF"
                                value={teacherName}
                                onChangeText={setTeacherName}
                            />
                        )}

                        {/* Rating */}
                        <Text style={styles.label}>总体评分 *</Text>
                        <View style={styles.ratingRow}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity
                                    key={star}
                                    onPress={() => setRating(star)}
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

                        {/* Difficulty */}
                        <Text style={styles.label}>难度 (1=简单, 5=困难)</Text>
                        <View style={styles.numberRow}>
                            {[1, 2, 3, 4, 5].map((level) => (
                                <TouchableOpacity
                                    key={level}
                                    onPress={() => setDifficulty(level)}
                                    style={[
                                        styles.numberButton,
                                        difficulty === level && styles.numberButtonActive,
                                    ]}
                                >
                                    <Text style={[
                                        styles.numberButtonText,
                                        difficulty === level && styles.numberButtonTextActive,
                                    ]}>
                                        {level}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Workload */}
                        <Text style={styles.label}>工作量 (1=轻松, 5=很重)</Text>
                        <View style={styles.numberRow}>
                            {[1, 2, 3, 4, 5].map((level) => (
                                <TouchableOpacity
                                    key={level}
                                    onPress={() => setWorkload(level)}
                                    style={[
                                        styles.numberButton,
                                        workload === level && styles.numberButtonActive,
                                    ]}
                                >
                                    <Text style={[
                                        styles.numberButtonText,
                                        workload === level && styles.numberButtonTextActive,
                                    ]}>
                                        {level}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Tags */}
                        <Text style={styles.label}>标签 (最多选3个)</Text>
                        <View style={styles.tagsContainer}>
                            {TEACHER_TAGS.map((tag) => (
                                <TouchableOpacity
                                    key={tag}
                                    onPress={() => handleTagToggle(tag)}
                                    style={[
                                        styles.tagItem,
                                        selectedTags.includes(tag) && styles.tagItemSelected,
                                    ]}
                                >
                                    <Text style={[
                                        styles.tagText,
                                        selectedTags.includes(tag) && styles.tagTextSelected,
                                    ]}>
                                        {tag}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Content */}
                        <Text style={styles.label}>评价内容 *</Text>
                        <TextInput
                            style={[styles.input, styles.textarea]}
                            placeholder="写下你对这位老师的评价"
                            placeholderTextColor="#9CA3AF"
                            value={content}
                            onChangeText={setContent}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
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
    lockedField: {
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    lockedText: {
        fontSize: 15,
        color: '#6B7280',
        fontWeight: '500',
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
    numberRow: {
        flexDirection: 'row',
        gap: 8,
    },
    numberButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    numberButtonActive: {
        backgroundColor: '#1E3A8A',
        borderColor: '#1E3A8A',
    },
    numberButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#6B7280',
    },
    numberButtonTextActive: {
        color: '#fff',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tagItem: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    tagItemSelected: {
        backgroundColor: '#EFF6FF',
        borderColor: '#1E3A8A',
    },
    tagText: {
        fontSize: 13,
        color: '#6B7280',
    },
    tagTextSelected: {
        color: '#1E3A8A',
        fontWeight: '500',
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
