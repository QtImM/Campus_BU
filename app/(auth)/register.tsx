import { useRouter } from 'expo-router';
import { ArrowLeft, ArrowUp, Check, ChevronDown, Eye, EyeOff, Globe, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, FlatList, Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { sendOTP, updatePassword, verifyOTP } from '../../services/auth';
import { AUTH_DOMAIN_OPTIONS, AUTH_LANGUAGE_OPTIONS } from '../../constants/authOptions';
import { changeLanguage } from '../i18n/i18n';

export default function RegisterScreen() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const [emailPrefix, setEmailPrefix] = useState('');
    const [emailSuffix, setEmailSuffix] = useState('@life.hkbu.edu.hk');
    const [loading, setLoading] = useState(false);
    const [showDomainPicker, setShowDomainPicker] = useState(false);
    const [showLangPicker, setShowLangPicker] = useState(false);
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

    React.useEffect(() => {
        let timer: any;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleLanguageChange = async (lang: string) => {
        await changeLanguage(lang);
        setShowLangPicker(false);
    };

    const requireTerms = (msgKey: string, onAgreed: () => void) => {
        if (hasAcceptedTerms) { onAgreed(); return; }
        Alert.alert(
            t('common.tip', 'Tip'),
            t(msgKey),
            [
                { text: t('common.cancel', 'Cancel'), style: 'cancel' },
                { text: t('auth.agree_and_continue', 'Agree & Continue'), onPress: () => { setHasAcceptedTerms(true); onAgreed(); } },
            ]
        );
    };

    const doSendOTP = async () => {
        if (!emailPrefix) {
            const placeholder = emailSuffix === 'other' ? t('auth.email_label') : t('auth.email_placeholder');
            Alert.alert(t('common.tip', 'Tip'), placeholder);
            return;
        }

        let prefix = emailPrefix.trim();
        if (emailSuffix !== 'other' && prefix.toLowerCase().endsWith(emailSuffix.toLowerCase())) {
            prefix = prefix.substring(0, prefix.length - emailSuffix.length);
        }

        const fullEmail = emailSuffix === 'other' ? prefix.toLowerCase() : (prefix + emailSuffix).toLowerCase();

        setOtpLoading(true);
        try {
            await sendOTP(fullEmail);
            setCountdown(60);
            const isResend = isOtpSent;
            setIsOtpSent(true);
            if (isResend) {
                Alert.alert(t('auth.resend_success', 'Resent'), t('auth.resend_msg', 'New OTP sent to your email'));
            } else {
                Alert.alert(t('auth.send_success', 'Sent'), t('auth.send_msg', 'Verification code sent to your email'));
            }
        } catch (error: any) {
            Alert.alert(t('common.error', 'Error'), error.message || t('auth.otp_failed', 'Failed to send verification code'));
        } finally {
            setOtpLoading(false);
        }
    };

    const handleSendOTP = () => {
        requireTerms('auth.must_accept_terms_before_send_code', () => { void doSendOTP(); });
    };

    const doRegister = async () => {
        if (!isOtpSent) {
            Alert.alert(t('common.tip', 'Tip'), t('auth.send_otp_first', 'Please send verification code first'));
            return;
        }
        if (otp.length !== 6) {
            Alert.alert(t('common.tip', 'Tip'), t('auth.otp_invalid', 'Invalid verification code'));
            return;
        }
        if (password.length < 6) {
            Alert.alert(t('common.tip', 'Tip'), t('auth.password_too_short', 'Password must be at least 6 characters'));
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert(t('common.tip', 'Tip'), t('auth.password_mismatch', 'Passwords do not match'));
            return;
        }

        let prefix = emailPrefix.trim();
        if (emailSuffix !== 'other' && prefix.toLowerCase().endsWith(emailSuffix.toLowerCase())) {
            prefix = prefix.substring(0, prefix.length - emailSuffix.length);
        }
        const fullEmail = emailSuffix === 'other' ? prefix.toLowerCase() : (prefix + emailSuffix).toLowerCase();

        setLoading(true);
        try {
            const user = await verifyOTP(fullEmail, otp);
            if (!user) throw new Error('Verification failed');

            await updatePassword(password);
            router.replace('/(auth)/setup');
        } catch (error: any) {
            Alert.alert(t('common.error', 'Error'), error.message || t('auth.register_failed', 'Registration failed'));
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = () => {
        requireTerms('auth.must_accept_terms_before_register', () => { void doRegister(); });
    };

    const renderDomainItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.pickerItem}
            onPress={() => {
                setEmailSuffix(item.value);
                setShowDomainPicker(false);
            }}
        >
            <Text style={[styles.pickerItemText, emailSuffix === item.value && styles.pickerItemTextActive]}>
                {item.label}
            </Text>
        </TouchableOpacity>
    );

    const renderLangItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.pickerItem}
            onPress={() => handleLanguageChange(item.value)}
        >
            <Text style={[styles.pickerItemText, i18n.language === item.value && styles.pickerItemTextActive]}>
                {item.label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <ArrowLeft size={24} color="#1E3A8A" />
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#64748B' }}>Language</Text>
                    <TouchableOpacity style={styles.langSelector} onPress={() => setShowLangPicker(true)}>
                        <Globe size={18} color="#4B5563" />
                        <Text style={styles.langSelectorText}>
                            {AUTH_LANGUAGE_OPTIONS.find(l => l.value === i18n.language)?.label || 'Language'}
                        </Text>
                        <ChevronDown size={14} color="#4B5563" />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableWithoutFeedback
                testID="auth-background-register"
                onPress={Keyboard.dismiss}
                accessible={false}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <Mail size={26} color="#1E3A8A" />
                        </View>
                        <Text style={styles.title}>{t('auth.register_title')}</Text>
                    </View>

                    <View style={styles.form}>
                        <Text style={styles.label}>{t('auth.email_label')}</Text>

                        {emailSuffix === 'other' ? (
                            <View style={[styles.inputContainer, styles.fullEmailContainer]}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="example@email.com"
                                    placeholderTextColor="#9CA3AF"
                                    value={emailPrefix}
                                    onChangeText={setEmailPrefix}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                                <TouchableOpacity
                                    style={styles.domainReset}
                                    onPress={() => setEmailSuffix('@life.hkbu.edu.hk')}
                                >
                                    <ChevronDown size={16} color="#4B5563" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.emailRow}>
                                <View style={[styles.inputContainer, { flex: 2 }]}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={emailSuffix === '@life.hkbu.edu.hk' ? t('auth.email_placeholder') : t('auth.email_prefix_placeholder', 'example')}
                                        placeholderTextColor="#9CA3AF"
                                        value={emailPrefix}
                                        onChangeText={setEmailPrefix}
                                        autoCapitalize="none"
                                    />
                                </View>

                                <TouchableOpacity
                                    style={styles.domainSelector}
                                    onPress={() => setShowDomainPicker(true)}
                                >
                                    <Text style={styles.domainSelectorText}>{emailSuffix}</Text>
                                    <ChevronDown size={16} color="#4B5563" />
                                </TouchableOpacity>
                            </View>
                        )}

                        {emailSuffix !== 'other' && (
                            <View style={styles.emailTipRow}>
                                <Text style={styles.emailTipText}>{t('auth.email_suffix_tip', 'No school email? Tap to switch')}</Text>
                                <ArrowUp size={10} color="#9CA3AF" />
                            </View>
                        )}

                        <Text style={styles.label}>{t('auth.verification_code', 'Verification Code')}</Text>
                        <View style={styles.otpRow}>
                            <View style={[styles.inputContainer, { flex: 1 }]}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="000000"
                                    placeholderTextColor="#9CA3AF"
                                    value={otp}
                                    onChangeText={setOtp}
                                    keyboardType="number-pad"
                                    maxLength={6}
                                />
                            </View>
                            <TouchableOpacity
                                style={[styles.sendCodeBtn, (countdown > 0 || otpLoading) && styles.sendCodeBtnDisabled]}
                                onPress={handleSendOTP}
                                disabled={countdown > 0 || otpLoading}
                            >
                                {otpLoading ? (
                                    <ActivityIndicator size="small" color="#1E3A8A" />
                                ) : (
                                    <Text style={[styles.sendCodeText, countdown > 0 && styles.sendCodeTextDisabled]}>
                                        {countdown > 0 ? `${countdown}s` : (isOtpSent ? t('auth.resend_action', 'Resend') : t('auth.send_code', 'Send Code'))}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>{t('auth.password_label')}</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder={t('auth.password_placeholder')}
                                placeholderTextColor="#9CA3AF"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                {showPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>{t('auth.confirm_password_label', 'Confirm Password')}</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder={t('auth.confirm_password_placeholder', 'Enter password again')}
                                placeholderTextColor="#9CA3AF"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={styles.eyeIcon}
                            >
                                {showConfirmPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>{t('auth.register_btn_final', 'Sign Up')}</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.agreementCard}>
                            <Text style={styles.agreementNotice}>{t('auth.age_gate_notice', 'This app is intended for users 18+.')}</Text>
                            <Text style={styles.agreementLinksText}>
                                <Text style={styles.agreementLink} onPress={() => router.push({ pathname: '/legal', params: { tab: 'terms' } } as any)}>{t('auth.user_agreement', 'Terms')}</Text>
                                <Text style={styles.agreementSep}> · </Text>
                                <Text style={styles.agreementLink} onPress={() => router.push({ pathname: '/legal', params: { tab: 'privacy' } } as any)}>{t('auth.privacy_policy', 'Privacy Policy')}</Text>
                                <Text style={styles.agreementSep}> · </Text>
                                <Text style={styles.agreementLink} onPress={() => router.push({ pathname: '/legal', params: { tab: 'terms' } } as any)}>{t('auth.community_rules', 'Community Safety Rules')}</Text>
                            </Text>
                            <TouchableOpacity
                                testID="auth-agreement-checkbox-register"
                                style={styles.checkboxRow}
                                activeOpacity={0.85}
                                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                                onPress={() => setHasAcceptedTerms((value) => !value)}
                            >
                                <View style={[styles.checkbox, hasAcceptedTerms && styles.checkboxChecked]}>
                                    {hasAcceptedTerms && <Check size={14} color="#FFFFFF" />}
                                </View>
                                <Text style={styles.checkboxText}>
                                    {t('auth.agreement_checkbox_prefix', 'I have read and agree to the terms, privacy policy, and community safety rules.')}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>{t('auth.go_to_login_prefix', 'Already have an account?')}</Text>
                            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                                <Text style={styles.link}>{t('auth.go_to_login_link', 'Login')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>

            <Modal visible={showDomainPicker} transparent animationType="fade">
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowDomainPicker(false)}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t('auth.select_domain', 'Select Domain')}</Text>
                        </View>
                        <FlatList data={[...AUTH_DOMAIN_OPTIONS]} renderItem={renderDomainItem} keyExtractor={item => item.value} />
                    </View>
                </TouchableOpacity>
            </Modal>

            <Modal visible={showLangPicker} transparent animationType="fade">
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowLangPicker(false)}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t('auth.language_select')}</Text>
                        </View>
                        <FlatList data={[...AUTH_LANGUAGE_OPTIONS]} renderItem={renderLangItem} keyExtractor={item => item.value} />
                    </View>
                </TouchableOpacity>
            </Modal>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
    },
    backButton: {
        padding: 4,
    },
    langSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    langSelectorText: {
        fontSize: 14,
        color: '#4B5563',
        fontWeight: '500',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        paddingTop: 16,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(30, 58, 138, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1E3A8A',
    },
    form: {
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 6,
        marginLeft: 4,
    },
    emailRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 4,
    },
    inputContainer: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
    },
    fullEmailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    domainReset: {
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    input: {
        flex: 1,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: '#111827',
    },
    domainSelector: {
        flex: 1.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 14,
    },
    domainSelectorText: {
        fontSize: 13,
        color: '#111827',
        fontWeight: '500',
    },
    emailTipRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 3,
        marginBottom: 14,
        paddingRight: 2,
    },
    emailTipText: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    button: {
        backgroundColor: '#1E3A8A',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        marginTop: 4,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
        marginBottom: 8,
    },
    agreementCard: {
        marginTop: 12,
        padding: 12,
        borderRadius: 16,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    agreementNotice: {
        marginBottom: 6,
        color: '#475569',
        fontSize: 12,
        textAlign: 'center',
    },
    agreementLinksText: {
        marginTop: 4,
        textAlign: 'center',
        lineHeight: 20,
    },
    agreementLink: {
        color: '#3B82F6',
        fontWeight: '600',
        fontSize: 11,
    },
    agreementSep: {
        color: '#9CA3AF',
        fontSize: 10,
    },
    footerText: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    link: {
        color: '#1E3A8A',
        fontWeight: '700',
        fontSize: 14,
        marginLeft: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 40,
        maxHeight: '60%',
    },
    modalHeader: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    pickerItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F9FAFB',
    },
    pickerItemText: {
        fontSize: 16,
        color: '#4B5563',
        textAlign: 'center',
    },
    pickerItemTextActive: {
        color: '#1E3A8A',
        fontWeight: 'bold',
    },
    otpRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 14,
    },
    sendCodeBtn: {
        backgroundColor: '#DBEAFE',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 0,
        minWidth: 80,
    },
    sendCodeBtnDisabled: {
        backgroundColor: '#F3F4F6',
    },
    sendCodeText: {
        color: '#1E3A8A',
        fontWeight: '600',
        fontSize: 13,
    },
    sendCodeTextDisabled: {
        color: '#9CA3AF',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 14,
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: '#111827',
    },
    eyeIcon: {
        padding: 12,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        marginTop: 10,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 1.5,
        borderColor: '#94A3B8',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 1,
    },
    checkboxChecked: {
        backgroundColor: '#1E3A8A',
        borderColor: '#1E3A8A',
    },
    checkboxText: {
        flex: 1,
        color: '#334155',
        fontSize: 12.2,
        lineHeight: 18,
        letterSpacing: -0.15,
    },
});
