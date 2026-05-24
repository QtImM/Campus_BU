/**
 * Review Confirm Modal
 *
 * Renders the confirmation view when actionPayload.uiSchema.surface === 'review_confirm_modal'.
 * Shows a summary of the review and confirm/cancel buttons.
 * See docs/agent/action-agent-contract-and-flow.md §9.3.
 */

import { X, CheckCircle } from 'lucide-react-native';
import React from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import type { ActionPayload } from '../../services/agent/action_runtime/types';

interface ReviewConfirmModalProps {
    visible: boolean;
    payload: ActionPayload | null;
    onConfirm: () => void;
    onCancel: () => void;
    onEdit?: () => void;
}

export const ReviewConfirmModal: React.FC<ReviewConfirmModalProps> = ({
    visible,
    payload,
    onConfirm,
    onCancel,
    onEdit,
}) => {
    if (!payload) return null;

    const { summary, canConfirm } = payload.action;

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent
            onRequestClose={onCancel}
        >
            <Pressable style={styles.overlay} onPress={onCancel}>
                <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>确认发布课程评价</Text>
                        <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
                            <X size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Summary */}
                    <View style={styles.body}>
                        <View style={styles.summaryCard}>
                            <CheckCircle size={24} color="#1E3A8A" />
                            <Text style={styles.summaryTitle}>{summary.title}</Text>
                        </View>
                        {summary.lines.map((line, idx) => (
                            <Text key={idx} style={styles.summaryLine}>{line}</Text>
                        ))}
                    </View>

                    {/* Actions */}
                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                            <Text style={styles.cancelButtonText}>取消</Text>
                        </TouchableOpacity>
                        {onEdit && (
                            <TouchableOpacity style={styles.editButton} onPress={onEdit}>
                                <Text style={styles.editButtonText}>修改</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={[styles.confirmButton, !canConfirm && styles.confirmButtonDisabled]}
                            onPress={onConfirm}
                            disabled={!canConfirm}
                        >
                            <Text style={styles.confirmButtonText}>确认发布</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    container: {
        backgroundColor: '#fff',
        borderRadius: 20,
        width: '100%',
        maxWidth: 360,
        paddingBottom: 24,
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
        fontSize: 17,
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
    summaryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E3A8A',
    },
    summaryLine: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 22,
        marginBottom: 4,
    },
    actions: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 20,
        gap: 10,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    editButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E3A8A',
    },
    confirmButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#1E3A8A',
        alignItems: 'center',
    },
    confirmButtonDisabled: {
        backgroundColor: '#D1D5DB',
    },
    confirmButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
});
