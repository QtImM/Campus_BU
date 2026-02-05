import React from 'react';
import { Text, TextInput, View } from 'react-native';

interface InputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    label?: string;
    error?: string;
    className?: string;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

export const Input: React.FC<InputProps> = ({
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    label,
    error,
    className = '',
    autoCapitalize = 'none',
    keyboardType = 'default',
}) => {
    return (
        <View className={`w-full mb-4 ${className}`}>
            {label && <Text className="text-gray-600 mb-2 font-medium ml-1">{label}</Text>}
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                autoCapitalize={autoCapitalize}
                keyboardType={keyboardType}
                className={`w-full bg-white p-4 rounded-2xl border-2 ${error ? 'border-red-500' : 'border-gray-100'} focus:border-primary text-gray-800 text-base`}
                placeholderTextColor="#9CA3AF"
            />
            {error && <Text className="text-red-500 text-sm mt-1 ml-1">{error}</Text>}
        </View>
    );
};
