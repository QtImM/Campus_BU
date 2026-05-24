import { useLocalSearchParams, useRouter } from 'expo-router';
import { BookOpen, Building, Clock, Hash, User, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafetyNotice } from '../../components/common/SafetyNotice';
import { getCurrentUser } from '../../services/auth';
import { submitCourseForReview } from '../../services/courses';

export default function AddCourseScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const params = useLocalSearchParams<{ code?: string; name?: string }>();
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [instructor, setInstructor] = useState('');
    const [department, setDepartment] = useState('');
    const [credits, setCredits] = useState('3');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (typeof params.code === 'string' && params.code.trim()) {
            setCode(params.code);
        }
        if (typeof params.name === 'string' && params.name.trim()) {
            setName(params.name);
        }
    }, [params.code, params.name]);

    const handleSubmit = async () => {
        const user = await getCurrentUser();
        if (!user) {
            Alert.alert(t('courses.add_course.session_error'), t('courses.add_course.must_be_logged_in'));
            return;
        }

        if (!code.trim()) {
            Alert.alert(t('common.error'), t('courses.add_course.error_code_required'));
            return;
        }

        if (!name.trim()) {
            Alert.alert(t('common.error'), t('courses.add_course.error_name_required'));
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await submitCourseForReview(
                {
                    code: code.trim(),
                    name: name.trim(),
                    instructor: instructor.trim() || undefined,
                    department: department.trim() || undefined,
                    credits: parseInt(credits)
                },
                {
                    userId: user.uid,
                    name: user.displayName || user.email,
                    email: user.email
                }
            );

            if (error) {
                if (error.message === 'COURSE_EXISTS') {
                    Alert.alert(t('courses.add_course.course_exists'), t('courses.add_course.course_exists_msg'));
                } else if (error.message === 'SUBMISSION_PENDING') {
                    Alert.alert(t('courses.add_course.already_submitted'), t('courses.add_course.already_submitted_msg'));
                } else {
                    Alert.alert(t('common.error'), `${t('courses.add_course.unexpected_error')} ${error.message || ''}`);
                }
                console.error('Submit course error:', error);
            } else {
                Alert.alert(
                    t('courses.add_course.submitted'),
                    t('courses.add_course.submitted_msg'),
                    [{ text: t('common.ok'), onPress: () => router.canGoBack() ? router.back() : router.replace('/(tabs)/course') }]
                );
            }
        } catch (err) {
            Alert.alert(t('common.error'), t('courses.add_course.unexpected_error'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('courses.add_course.title')}</Text>
                <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/course')} style={styles.closeButton}>
                    <X size={24} color="#374151" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.form}>
                    <View style={styles.reviewNotice}>
                        <Clock size={18} color="#D97706" />
                        <Text style={styles.reviewNoticeText}>
                            {t('courses.add_course.review_notice')}
                        </Text>
                    </View>

                    <Text style={styles.description}>
                        {t('courses.add_course.description')}
                    </Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('courses.add_course.course_code')}</Text>
                        <View style={styles.inputContainer}>
                            <Hash size={20} color="#9CA3AF" />
                            <TextInput
                                style={styles.input}
                                placeholder={t('courses.add_course.course_code_placeholder')}
                                value={code}
                                onChangeText={setCode}
                                autoCapitalize="characters"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('courses.add_course.course_name')}</Text>
                        <View style={styles.inputContainer}>
                            <BookOpen size={20} color="#9CA3AF" />
                            <TextInput
                                style={styles.input}
                                placeholder={t('courses.add_course.course_name_placeholder')}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('courses.add_course.instructor')}</Text>
                        <View style={styles.inputContainer}>
                            <User size={20} color="#9CA3AF" />
                            <TextInput
                                style={styles.input}
                                placeholder={t('courses.add_course.instructor_placeholder')}
                                value={instructor}
                                onChangeText={setInstructor}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('courses.add_course.department')}</Text>
                        <View style={styles.inputContainer}>
                            <Building size={20} color="#9CA3AF" />
                            <TextInput
                                style={styles.input}
                                placeholder={t('courses.add_course.department_placeholder')}
                                value={department}
                                onChangeText={setDepartment}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('courses.add_course.credits')}</Text>
                        <View style={styles.creditsContainer}>
                            {['0', '1', '2', '3', '4'].map((c) => (
                                <TouchableOpacity
                                    key={c}
                                    style={[
                                        styles.creditButton,
                                        credits === c && styles.creditButtonActive
                                    ]}
                                    onPress={() => setCredits(c)}
                                >
                                    <Text style={[
                                        styles.creditText,
                                        credits === c && styles.creditTextActive
                                    ]}>{c}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <SafetyNotice variant="compact" />

                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        <Text style={styles.submitText}>
                            {loading ? t('courses.add_course.submitting') : t('courses.add_course.submit')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    closeButton: {
        padding: 4,
    },
    form: {
        padding: 24,
    },
    reviewNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
        gap: 10,
    },
    reviewNoticeText: {
        flex: 1,
        fontSize: 13,
        color: '#92400E',
        lineHeight: 18,
    },
    description: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 32,
        lineHeight: 20,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 50,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#111827',
    },
    creditsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    creditButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    creditButtonActive: {
        backgroundColor: '#1E3A8A',
    },
    creditText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },
    creditTextActive: {
        color: '#fff',
    },
    footer: {
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    submitButton: {
        backgroundColor: '#1E3A8A',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
