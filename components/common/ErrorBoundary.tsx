import { AlertTriangle, RotateCcw } from 'lucide-react-native';
import i18n from 'i18next';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { normalizeLanguage } from '../../constants/legalContent';
import { reportError } from '../../lib/monitoring';

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

// Self-contained copy: a render crash can happen before i18n is ready, and
// class components can't use the useTranslation hook, so we read the language
// off the i18n instance directly and fall back gracefully.
const COPY = {
    en: {
        title: 'Something went wrong',
        message: 'The app ran into an unexpected problem. You can try again — if it keeps happening, please restart the app.',
        retry: 'Try Again',
    },
    'zh-Hans': {
        title: '出错了',
        message: 'App 遇到了一个意外问题。你可以重试，如果反复出现，请重新启动 App。',
        retry: '重试',
    },
    'zh-Hant': {
        title: '出錯了',
        message: 'App 遇到了一個意外問題。你可以重試，如果反覆出現，請重新啟動 App。',
        retry: '重試',
    },
} as const;

/**
 * Top-level error boundary. Catches render-time crashes anywhere below it,
 * reports them to Sentry, and shows a friendly fallback instead of a white
 * screen. The "Try Again" button clears the error state to re-mount children.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo): void {
        reportError(error, { componentStack: info.componentStack });
    }

    handleReset = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render(): React.ReactNode {
        if (!this.state.hasError) {
            return this.props.children;
        }

        const copy = COPY[normalizeLanguage(i18n.language)];

        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.iconContainer}>
                        <AlertTriangle size={40} color="#fff" />
                    </View>
                    <Text style={styles.title}>{copy.title}</Text>
                    <Text style={styles.message}>{copy.message}</Text>

                    {__DEV__ && this.state.error && (
                        <View style={styles.devBox}>
                            <Text style={styles.devText}>{this.state.error.message}</Text>
                        </View>
                    )}

                    <TouchableOpacity style={styles.retryButton} onPress={this.handleReset} activeOpacity={0.8}>
                        <RotateCcw size={18} color="#fff" />
                        <Text style={styles.retryText}>{copy.retry}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: '#EF4444',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 10,
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#111827',
        textAlign: 'center',
        letterSpacing: -0.5,
        marginBottom: 12,
    },
    message: {
        fontSize: 15,
        color: '#4B5563',
        lineHeight: 24,
        textAlign: 'center',
        marginBottom: 24,
    },
    devBox: {
        backgroundColor: '#FEF2F2',
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FEE2E2',
        marginBottom: 24,
        alignSelf: 'stretch',
    },
    devText: {
        fontSize: 13,
        color: '#991B1B',
        fontFamily: 'monospace',
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#1E3A8A',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 18,
        shadowColor: '#1E3A8A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    retryText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
