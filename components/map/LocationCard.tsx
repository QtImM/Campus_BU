import { Clock, Star, X } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../../services/locations';
import { CampusLocation } from '../../types';

interface LocationCardProps {
    location: CampusLocation;
    onClose: () => void;
    onNavigate?: () => void;
}

export const LocationCard: React.FC<LocationCardProps> = ({
    location,
    onClose,
    onNavigate
}) => {
    const categoryIcon = CATEGORY_ICONS[location.category];
    const categoryColor = CATEGORY_COLORS[location.category];

    return (
        <View className="absolute bottom-24 left-4 right-4 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            {/* Close Button */}
            <TouchableOpacity
                onPress={onClose}
                className="absolute top-3 right-3 z-10 bg-gray-100 p-2 rounded-full"
            >
                <X size={16} color="#666" />
            </TouchableOpacity>

            {/* Card Content */}
            <View className="p-4">
                {/* Header */}
                <View className="flex-row items-center mb-2">
                    <View
                        style={{ backgroundColor: categoryColor }}
                        className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    >
                        <Text className="text-xl">{categoryIcon}</Text>
                    </View>
                    <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>
                            {location.name}
                        </Text>
                        <Text className="text-sm text-gray-500">{location.category}</Text>
                    </View>
                </View>

                {/* Description */}
                <Text className="text-gray-600 text-sm mb-3" numberOfLines={2}>
                    {location.description}
                </Text>

                {/* Meta Info */}
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-4">
                        {/* Rating */}
                        {location.rating && (
                            <View className="flex-row items-center">
                                <Star size={14} color="#FFD700" fill="#FFD700" />
                                <Text className="text-sm text-gray-700 ml-1 font-medium">
                                    {location.rating.toFixed(1)}
                                </Text>
                            </View>
                        )}

                        {/* Hours */}
                        {location.hours && (
                            <View className="flex-row items-center">
                                <Clock size={14} color="#6B7280" />
                                <Text className="text-sm text-gray-500 ml-1">{location.hours}</Text>
                            </View>
                        )}
                    </View>

                    {/* Navigate Button (Future feature) */}
                    {onNavigate && (
                        <TouchableOpacity
                            onPress={onNavigate}
                            className="bg-primary px-4 py-2 rounded-full"
                        >
                            <Text className="text-white font-medium text-sm">导航</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};
