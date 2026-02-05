import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
    children: React.ReactNode;
    centered?: boolean;
    className?: string;
    withScroll?: boolean;
    noPadding?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
    children,
    centered = false,
    className = '',
    withScroll = false,
    noPadding = false,
}) => {
    const paddingClass = noPadding ? 'p-0' : 'p-6';
    const contentStyle = `flex-1 w-full max-w-md mx-auto ${paddingClass} ${centered ? 'justify-center' : ''} ${className}`;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F8F8' }}>
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                {withScroll ? (
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View className={contentStyle} style={{ flex: 1 }}>
                            {children}
                        </View>
                    </ScrollView>
                ) : (
                    <View className={contentStyle} style={{ flex: 1 }}>
                        {children}
                    </View>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
