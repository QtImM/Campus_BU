import { Bell, AlertTriangle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface BroadcastModalProps {
    visible: boolean;
    defaultTitle: string;
    defaultBody: string;
    sending: boolean;
    onSend: (title: string, body: string) => void;
    onCancel: () => void;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({
    visible,
    defaultTitle,
    defaultBody,
    sending,
    onSend,
    onCancel,
}) => {
    const { t } = useTranslation();
    const [title, setTitle] = useState(defaultTitle);
    const [body, setBody] = useState(defaultBody);

    useEffect(() => {
        if (visible) {
            setTitle(defaultTitle);
            setBody(defaultBody);
        }
    }, [visible, defaultTitle, defaultBody]);

    const canSend = title.trim().length > 0 && body.trim().length > 0 && !sending;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Pressable style={styles.overlay} onPress={() => { Keyboard.dismiss(); onCancel(); }}>
                    <Pressable style={styles.card} onPress={() => {}}>
                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.headerIcon}>
                                <Bell size={18} color="#1E3A8A" />
                            </View>
                            <Text style={styles.headerTitle}>{t('campus_detail.broadcast_modal_title')}</Text>
                        </View>

                        {/* Warning banner */}
                        <View style={styles.warning}>
                            <AlertTriangle size={13} color="#92400E" />
                            <Text style={styles.warningText}>{t('campus_detail.broadcast_warning')}</Text>
                        </View>

                        {/* Title field */}
                        <Text style={styles.fieldLabel}>{t('campus_detail.broadcast_notif_title_label')}</Text>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            maxLength={80}
                            editable={!sending}
                            returnKeyType="next"
                        />

                        {/* Body field */}
                        <Text style={styles.fieldLabel}>{t('campus_detail.broadcast_notif_body_label')}</Text>
                        <TextInput
                            style={[styles.input, styles.inputMultiline]}
                            value={body}
                            onChangeText={setBody}
                            maxLength={200}
                            multiline
                            numberOfLines={3}
                            editable={!sending}
                        />

                        {/* Actions */}
                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={onCancel}
                                disabled={sending}
                            >
                                <Text style={styles.cancelText}>{t('common.cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
                                onPress={() => canSend && onSend(title.trim(), body.trim())}
                                disabled={!canSend}
                            >
                                {sending ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={styles.sendText}>{t('campus_detail.broadcast_confirm')}</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 14,
    },
    headerIcon: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    warning: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 6,
        backgroundColor: '#FFFBEB',
        borderRadius: 10,
        padding: 10,
        marginBottom: 16,
    },
    warningText: {
        flex: 1,
        fontSize: 12,
        color: '#92400E',
        lineHeight: 18,
    },
    fieldLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#F4F6FB',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: '#111827',
        marginBottom: 14,
    },
    inputMultiline: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 4,
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#6B7280',
    },
    sendBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#1E3A8A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendBtnDisabled: {
        opacity: 0.4,
    },
    sendText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#fff',
    },
});
