import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
    onPress: () => void;
    title: string;
    variant?: 'primary' | 'secondary' | 'accent' | 'outline';
    loading?: boolean;
    disabled?: boolean;
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({
    onPress,
    title,
    variant = 'primary',
    loading = false,
    disabled = false,
    className = '',
}) => {
    const getBackgroundColor = () => {
        if (disabled) return 'bg-gray-400';
        switch (variant) {
            case 'primary': return 'bg-primary';
            case 'accent': return 'bg-accent';
            case 'secondary': return 'bg-gray-200';
            case 'outline': return 'bg-transparent border-2 border-primary';
            default: return 'bg-primary';
        }
    };

    const getTextColor = () => {
        if (disabled) return 'text-white';
        switch (variant) {
            case 'primary': return 'text-white';
            case 'accent': return 'text-black';
            case 'secondary': return 'text-gray-800';
            case 'outline': return 'text-primary';
            default: return 'text-white';
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            className={`py-4 px-6 rounded-2xl items-center justify-center shadow-sm ${getBackgroundColor()} ${className}`}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'accent' ? '#000' : '#fff'} />
            ) : (
                <Text className={`font-bold text-lg ${getTextColor()}`}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};
