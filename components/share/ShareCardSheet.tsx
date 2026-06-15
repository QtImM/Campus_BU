import * as Sharing from 'expo-sharing';
import { Share2, X } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Dimensions,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import { ShareCard, ShareCardPayload } from './ShareCard';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_W - 48, 360);

interface ShareCardSheetProps {
    visible: boolean;
    payload: ShareCardPayload | null;
    onClose: () => void;
}

/**
 * Bottom sheet that previews the share card and exports it as a PNG to the
 * native share dialog (WhatsApp / WeChat / IG etc.). Fully non-fatal: any
 * capture/share failure just resets the button.
 */
export const ShareCardSheet: React.FC<ShareCardSheetProps> = ({ visible, payload, onClose }) => {
    const { t } = useTranslation();
    const shotRef = useRef<ViewShot>(null);
    const [busy, setBusy] = useState(false);

    const handleShare = async () => {
        if (busy || !shotRef.current?.capture) return;
        setBusy(true);
        try {
            const uri = await shotRef.current.capture();
            if (uri && (await Sharing.isAvailableAsync())) {
                await Sharing.shareAsync(uri, {
                    mimeType: 'image/png',
                    dialogTitle: t('share.sheet_title', '分享这张卡片'),
                    UTI: 'public.png',
                });
            }
        } catch (e) {
            console.warn('ShareCard capture/share failed:', e);
        } finally {
            setBusy(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.root}>
                <Pressable style={styles.overlay} onPress={onClose} />
                <View style={styles.sheet}>
                    <View style={styles.handle} />

                    <View style={styles.headerRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title}>{t('share.sheet_title', '分享这张卡片')}</Text>
                            <Text style={styles.subtitle}>{t('share.sheet_subtitle', '丢进迎新群，帮同学少踩坑 🙌')}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <X size={22} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        contentContainerStyle={styles.previewArea}
                        showsVerticalScrollIndicator={false}
                    >
                        {payload && (
                            <ViewShot
                                ref={shotRef}
                                options={{ format: 'png', quality: 1, result: 'tmpfile' }}
                            >
                                <ShareCard payload={payload} width={CARD_WIDTH} />
                            </ViewShot>
                        )}
                    </ScrollView>

                    <TouchableOpacity
                        style={[styles.shareBtn, busy && styles.shareBtnBusy]}
                        onPress={handleShare}
                        disabled={busy}
                        activeOpacity={0.9}
                    >
                        {busy ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Share2 size={18} color="#fff" />
                                <Text style={styles.shareBtnText}>{t('share.share_action', '分享卡片')}</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15,23,42,0.55)',
    },
    sheet: {
        backgroundColor: '#F8FAFC',
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        paddingHorizontal: 20,
        paddingBottom: 36,
        paddingTop: 10,
        maxHeight: '92%',
    },
    handle: {
        alignSelf: 'center',
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#CBD5E1',
        marginBottom: 14,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
    },
    subtitle: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 3,
    },
    previewArea: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    shareBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
        backgroundColor: '#1E3A8A',
        height: 54,
        borderRadius: 16,
        marginTop: 18,
        shadowColor: '#1E3A8A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 5,
    },
    shareBtnBusy: {
        opacity: 0.7,
    },
    shareBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
