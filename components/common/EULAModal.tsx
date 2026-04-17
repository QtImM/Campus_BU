import { AlertTriangle, Ban, ShieldAlert, UserCheck } from 'lucide-react-native';
import React from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import i18n from '../../app/i18n/i18n';
import { normalizeLanguage } from '../../constants/legalContent';

interface EULAModalProps {
    visible: boolean;
    onAccept: () => void;
}

export const EULAModal: React.FC<EULAModalProps> = ({ visible, onAccept }) => {
    const language = normalizeLanguage(i18n.language);

    const copy = {
        en: {
            title: 'Community Safety Agreement',
            zeroTolerance: 'Zero-Tolerance Policy',
            policyDesc: 'HKCampus is an 18+ community. Objectionable content and abusive users are not allowed. Violating content may be removed immediately and offending accounts may be banned.',
            prohibitedTitle: 'What Is Prohibited',
            prohibitedList: 'Harassment, hate speech, threats, sexual exploitation, graphic violence, scams, spam, illegal activity, and any abusive behavior toward other users are prohibited.',
            moderationTitle: 'How You Can Protect Yourself',
            moderationDesc: 'You can report objectionable content, block abusive users, and hide posts from your feed immediately. We review reports within 24 hours.',
            enforcementTitle: 'Enforcement',
            enforcementDesc: 'When reported content violates these rules, we remove the content and eject the user who provided the offending content.',
            agreementText: 'By tapping "Accept & Continue", you agree to these community safety terms and our zero-tolerance policy.',
            accept: 'Accept & Continue',
        },
        'zh-Hans': {
            title: '社区安全协议',
            zeroTolerance: '零容忍政策',
            policyDesc: 'HKCampus 是一个 18+ 社区。我们不允许不良内容和滥用用户。违规内容会被立即移除，违规账号可能被封禁。',
            prohibitedTitle: '禁止内容',
            prohibitedList: '骚扰辱骂、仇恨歧视、威胁恐吓、性剥削、暴力内容、诈骗引流、垃圾广告、违法活动，以及任何针对其他用户的滥用行为，均被禁止。',
            moderationTitle: '你可以如何保护自己',
            moderationDesc: '你可以举报不当内容、屏蔽滥用用户，并立即将帖子从 feed 中隐藏。我们会在 24 小时内处理举报。',
            enforcementTitle: '处置方式',
            enforcementDesc: '一旦举报内容违反这些规则，我们会移除相关内容，并清退发布违规内容的用户。',
            agreementText: '点击“接受并继续”即表示你同意这些社区安全条款和零容忍政策。',
            accept: '接受并继续',
        },
        'zh-Hant': {
            title: '社群安全協議',
            zeroTolerance: '零容忍政策',
            policyDesc: 'HKCampus 是一個 18+ 社群。我們不允許不良內容和濫用使用者。違規內容會被立即移除，違規帳號可能被封鎖。',
            prohibitedTitle: '禁止內容',
            prohibitedList: '騷擾辱罵、仇恨歧視、威脅恐嚇、性剝削、暴力內容、詐騙引流、垃圾廣告、違法活動，以及任何針對其他使用者的濫用行為，均被禁止。',
            moderationTitle: '你可以如何保護自己',
            moderationDesc: '你可以舉報不當內容、封鎖濫用使用者，並立即將貼文從 feed 中隱藏。我們會在 24 小時內處理舉報。',
            enforcementTitle: '處置方式',
            enforcementDesc: '一旦舉報內容違反這些規則，我們會移除相關內容，並清退發布違規內容的使用者。',
            agreementText: '點擊「接受並繼續」即表示你同意這些社群安全條款和零容忍政策。',
            accept: '接受並繼續',
        },
    }[language];

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <ShieldAlert size={40} color="#fff" />
                        </View>
                        <Text style={styles.title}>{copy.title}</Text>
                    </View>

                    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <AlertTriangle size={20} color="#EF4444" />
                                <Text style={[styles.sectionTitle, { color: '#EF4444' }]}>{copy.zeroTolerance}</Text>
                            </View>
                            <View style={styles.cardHighlight}>
                                <Text style={styles.textHighlight}>{copy.policyDesc}</Text>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ban size={20} color="#1E3A8A" />
                                <Text style={styles.sectionTitle}>{copy.prohibitedTitle}</Text>
                            </View>
                            <Text style={styles.text}>{copy.prohibitedList}</Text>
                        </View>

                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <UserCheck size={20} color="#1E3A8A" />
                                <Text style={styles.sectionTitle}>{copy.moderationTitle}</Text>
                            </View>
                            <Text style={styles.text}>{copy.moderationDesc}</Text>
                        </View>

                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <ShieldAlert size={20} color="#1E3A8A" />
                                <Text style={styles.sectionTitle}>{copy.enforcementTitle}</Text>
                            </View>
                            <Text style={styles.text}>{copy.enforcementDesc}</Text>
                        </View>

                        <View style={styles.footerSpace} />
                    </ScrollView>

                    <View style={styles.footer}>
                        <Text style={styles.agreementText}>{copy.agreementText}</Text>
                        <TouchableOpacity style={styles.acceptButton} onPress={onAccept} activeOpacity={0.8}>
                            <Text style={styles.acceptButtonText}>{copy.accept}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 20,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: '#1E3A8A',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#1E3A8A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#111827',
        marginTop: 20,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    scrollContainer: {
        flex: 1,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1E3A8A',
        letterSpacing: -0.3,
    },
    cardHighlight: {
        backgroundColor: '#FEF2F2',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    textHighlight: {
        fontSize: 15,
        color: '#991B1B',
        lineHeight: 22,
        fontWeight: '500',
    },
    text: {
        fontSize: 15,
        color: '#4B5563',
        lineHeight: 24,
    },
    footer: {
        paddingTop: 20,
        paddingBottom: 10,
        backgroundColor: '#fff',
    },
    agreementText: {
        fontSize: 13,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 18,
        paddingHorizontal: 20,
    },
    acceptButton: {
        backgroundColor: '#1E3A8A',
        paddingVertical: 18,
        borderRadius: 18,
        alignItems: 'center',
        shadowColor: '#1E3A8A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    acceptButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
    },
    footerSpace: {
        height: 60,
    },
});
