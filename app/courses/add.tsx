import { useRouter } from 'expo-router';
import { BookOpen, Building, Hash, User, X } from 'lucide-react-native';
import React, { useState } from 'react';
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
import { getCurrentUser } from '../../services/auth';
import { addLocalCourse } from '../../services/courses';

export default function AddCourseScreen() {
    const router = useRouter();
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [instructor, setInstructor] = useState('');
    const [department, setDepartment] = useState('');
    const [credits, setCredits] = useState('3');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const user = await getCurrentUser();
        if (!user) {
            Alert.alert('Session Error', 'You must be logged in');
            return;
        }

        if (!code.trim()) {
            Alert.alert('Error', 'Please enter the course code');
            return;
        }

        setLoading(true);
        try {
            // Priority: Add locally for immediate testing
            const { data, error } = await addLocalCourse({
                code: code.trim(),
                name: name.trim() || undefined,
                instructor: instructor.trim() || undefined,
                department: department.trim() || undefined,
                credits: parseInt(credits)
            });

            if (error) {
                Alert.alert('Error', `Failed to add course: ${error.message || 'Please try again.'}`);
                console.error('Add course local error:', error);
            } else {
                Alert.alert(
                    'Success',
                    'Course added locally successfully!',
                    [{ text: 'OK', onPress: () => router.back() }]
                );
            }
        } catch (err) {
            Alert.alert('Error', 'An unexpected error occurred.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Add New Course</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <X size={24} color="#374151" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.form}>
                    <Text style={styles.description}>
                        Help us expand the course database. Please ensure the information is accurate.
                    </Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Course Code</Text>
                        <View style={styles.inputContainer}>
                            <Hash size={20} color="#9CA3AF" />
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. COMP3015"
                                value={code}
                                onChangeText={setCode}
                                autoCapitalize="characters"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Course Name</Text>
                        <View style={styles.inputContainer}>
                            <BookOpen size={20} color="#9CA3AF" />
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Data Communications"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Instructor</Text>
                        <View style={styles.inputContainer}>
                            <User size={20} color="#9CA3AF" />
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Dr. Jean Lai"
                                value={instructor}
                                onChangeText={setInstructor}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Department</Text>
                        <View style={styles.inputContainer}>
                            <Building size={20} color="#9CA3AF" />
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Computer Science"
                                value={department}
                                onChangeText={setDepartment}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Credits</Text>
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

                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitText}>Submit Course</Text>
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
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
