import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { signIn } from '../../services/auth';

const DEMO_MODE_KEY = 'hkcampus_demo_mode';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await signIn(email, password);
            // Auth listener in root layout will handle navigation
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    // Demo mode - skip login for testing
    const handleDemoLogin = () => {
        Alert.alert(
            '🎉 Demo Mode',
            'Entering demo mode. This bypasses Firebase authentication.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Continue',
                    onPress: async () => {
                        await AsyncStorage.setItem(DEMO_MODE_KEY, 'true');
                        router.replace('/(tabs)/campus');
                    }
                }
            ]
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Text style={styles.title}>HKCampus</Text>
                    <Text style={styles.subtitle}>Connect with your campus vibe</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Student Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. 23456789@life.hkbu.edu.hk"
                        placeholderTextColor="#9CA3AF"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your password"
                        placeholderTextColor="#9CA3AF"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <Link href="/register" asChild>
                            <Text style={styles.link}>Sign Up</Text>
                        </Link>
                    </View>

                    {/* Demo Mode Button */}
                    <TouchableOpacity
                        style={styles.demoButton}
                        onPress={handleDemoLogin}
                    >
                        <Text style={styles.demoButtonText}>🚀 Enter Demo Mode</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#1E3A8A',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
    },
    form: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        marginBottom: 16,
        color: '#111827',
    },
    button: {
        backgroundColor: '#1E3A8A',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        color: '#6B7280',
    },
    link: {
        color: '#1E3A8A',
        fontWeight: '600',
    },
    demoButton: {
        marginTop: 32,
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#39FF14',
        backgroundColor: 'rgba(57, 255, 20, 0.1)',
        alignItems: 'center',
    },
    demoButtonText: {
        color: '#39FF14',
        fontSize: 16,
        fontWeight: '600',
    },
});
