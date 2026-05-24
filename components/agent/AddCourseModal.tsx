/**
 * Add Course Modal
 *
 * Bottom sheet modal for submitting a new course for review.
 * Triggered when actionPayload.uiSchema.surface === 'add_course_modal'.
 */

import { X, Hash, BookOpen, User, Building } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { getCurrentUser } from '../../services/auth';
import { submitCourseForReview } from '../../services/courses';

interface AddCourseModalProps {
    visible: boolean;
    courseCode: string;
    onSubmit: (result: { success: boolean; courseCode: string }) => void;
    onCancel: () => void;
}

export const AddCourseModal: React.FC<AddCourseModalProps> = ({
    visible,
    courseCode: initialCode,
    onSubmit,
    onCancel,
}) => {
    const { t } = useTranslation();
    const [code, setCode] = useState(initialCode);
    const [name, setName] = useState('');
    const [instructor, setInstructor] = useState('');
    const [department, setDepartment] = useState('');
    const [credits, setCredits] = useState('3');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            setCode(initialCode);
            setName('');
            setInstructor('');
            setDepartment('');
            setCredits('3');
            setLoading(false);
        }
    }, [visible, initialCode]);

    const handleSubmit = useCallback(async () => {
        if (!code.trim() || !name.trim()) return;

        setLoading(true);
        try {
            const user = await getCurrentUser();
            if (!user) {
                Alert.alert(t('courses.add_course.session_error'), t('courses.add_course.must_be_logged_in'));
                setLoading(false);
                return;
            }

            const { error } = await submitCourseForReview(
                {
                    code: code.trim(),
                    name: name.trim(),
                    instructor: instructor.trim() || undefined,
                    department: department.trim() || undefined,
                    credits: parseInt(credits) || 3,
                },
                {
                    userId: user.uid,
                    name: user.displayName || user.email,
                    email: user.email,
                }
            );

            if (error) {
                if (error.message === 'COURSE_EXISTS') {
                    Alert.alert(t('courses.add_course.course_exists'), t('courses.add_course.course_exists_msg'));
                } else if (error.message === 'SUBMISSION_PENDING') {
                    Alert.alert(t('courses.add_course.already_submitted'), t('courses.add_course.already_submitted_msg'));
                } else {
                    Alert.alert(t('common.error'), t('courses.add_course.unexpected_error'));
                }
                setLoading(false);
                return;
            }

            onSubmit({ success: true, courseCode: code.trim().toUpperCase() });
        } catch {
            Alert.alert(t('common.error'), t('courses.add_course.unexpected_error'));
            setLoading(false);
        }
    }, [code, name, instructor, department, credits, onSubmit, t]);

    const canSubmit = code.trim().length > 0 && name.trim().length > 0 && !loading;

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
                        <Text style={styles.title}>{t('courses.add_course.title')}</Text>
                        <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
                            <X size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                        {/* Course Code */}
                        <Text style={styles.label}>{t('courses.add_course.course_code')} *</Text>
                        <View style={styles.inputContainer}>
                            <Hash size={18} color="#9CA3AF" />
                            <TextInput
                                style={styles.input}
                                placeholder={t('courses.add_course.course_code_placeholder')}
                                placeholderTextColor="#9CA3AF"
                                value={code}
                                onChangeText={setCode}
                                autoCapitalize="characters"
                            />
                        </View>

                        {/* Course Name */}
                        <Text style={styles.label}>{t('courses.add_course.course_name')} *</Text>
                        <View style={styles.inputContainer}>
                            <BookOpen size={18} color="#9CA3AF" />
                            <TextInput
                                style={styles.input}
                                placeholder={t('courses.add_course.course_name_placeholder')}
                                placeholderTextColor="#9CA3AF"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        {/* Instructor */}
                        <Text style={styles.label}>{t('courses.add_course.instructor')}</Text>
                        <View style={styles.inputContainer}>
                            <User size={18} color="#9CA3AF" />
                            <TextInput
                                style={styles.input}
                                placeholder={t('courses.add_course.instructor_placeholder')}
                                placeholderTextColor="#9CA3AF"
                                value={instructor}
                                onChangeText={setInstructor}
                            />
                        </View>

                        {/* Department */}
                        <Text style={styles.label}>{t('courses.add_course.department')}</Text>
                        <View style={styles.inputContainer}>
                            <Building size={18} color="#9CA3AF" />
                            <TextInput
                                style={styles.input}
                                placeholder={t('courses.add_course.department_placeholder')}
                                placeholderTextColor="#9CA3AF"
                                value={department}
                                onChangeText={setDepartment}
                            />
                        </View>

                        {/* Credits */}
                        <Text style={styles.label}>{t('courses.add_course.credits')}</Text>
                        <View style={styles.creditsContainer}>
                            {['0', '1', '2', '3', '4'].map((c) => (
                                <TouchableOpacity
                                    key={c}
                                    style={[
                                        styles.creditButton,
                                        credits === c && styles.creditButtonActive,
                                    ]}
                                    onPress={() => setCredits(c)}
                                >
                                    <Text
                                        style={[
                                            styles.creditText,
                                            credits === c && styles.creditTextActive,
                                        ]}
                                    >
                                        {c}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.reviewHint}>
                            {t('courses.add_course.review_notice')}
                        </Text>
                    </ScrollView>

                    {/* Actions */}
                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                            <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
                            onPress={handleSubmit}
                            disabled={!canSubmit}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={[styles.submitButtonText, !canSubmit && styles.submitButtonTextDisabled]}>
                                    {t('courses.add_course.submit')}
                                </Text>
                            )}
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
        marginTop: 14,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 46,
    },
    input: {
        flex: 1,
        marginLeft: 8,
        fontSize: 15,
        color: '#111827',
    },
    creditsContainer: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 2,
    },
    creditButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    creditButtonActive: {
        backgroundColor: '#1E3A8A',
    },
    creditText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#6B7280',
    },
    creditTextActive: {
        color: '#fff',
    },
    reviewHint: {
        fontSize: 12,
        color: '#92400E',
        backgroundColor: '#FEF3C7',
        borderRadius: 8,
        padding: 10,
        marginTop: 16,
        lineHeight: 17,
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
