import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image as ImageIcon, MapPin, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { getCurrentUser } from '../services/auth';
import { createPost } from '../services/posts';
import { PostType } from '../types';
import { compressImage } from '../utils/image';

const POST_TYPES: { label: string; value: PostType; color: string }[] = [
    { label: 'Event', value: 'event', color: '#8B5CF6' },
    { label: 'Review', value: 'review', color: '#F59E0B' },
    { label: 'Guide', value: 'guide', color: '#10B981' },
    { label: 'Lost', value: 'lost_found', color: '#EF4444' },
];

export default function ComposeScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const initialLocation = params.fromMap === 'true' && params.lat && params.lng
        ? `Location(${Number(params.lat || 0).toFixed(4)}, ${Number(params.lng || 0).toFixed(4)})`
        : '';

    const [content, setContent] = useState('');
    const [postType, setPostType] = useState<PostType>('review');
    const [image, setImage] = useState<string | null>(null);
    const [locationTag, setLocationTag] = useState(initialLocation);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            const compressedUri = await compressImage(result.assets[0].uri);
            setImage(compressedUri);
        }
    };

    const handleSubmit = async () => {
        if (!content.trim()) {
            Alert.alert('Empty Post', 'Please write something to share!');
            return;
        }

        const user = await getCurrentUser();
        if (!user) {
            Alert.alert('Session Error', 'You must be logged in');
            return;
        }

        setLoading(true);
        try {
            await createPost(
                user.uid,
                user.displayName || 'Anonymous',
                [], // majors
                user.photoURL || '',
                content,
                postType,
                locationTag || 'HKBU',
                // Use params lat/lng if available, else default
                params.fromMap === 'true'
                    ? { latitude: Number(params.lat), longitude: Number(params.lng) }
                    : { latitude: 22.3380, longitude: 114.1813 },
                image ? [image] : []
            );

            Alert.alert('Success', 'Post published!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
                    <X size={24} color="#111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Post</Text>
                <TouchableOpacity
                    style={[styles.postButton, (!content.trim() || loading) && styles.postButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={!content.trim() || loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Text style={styles.postButtonText}>Post</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Input Area */}
                <TextInput
                    multiline
                    placeholder="What's happening on campus?"
                    placeholderTextColor="#9CA3AF"
                    value={content}
                    onChangeText={setContent}
                    style={styles.textInput}
                    textAlignVertical="top"
                />

                {/* Image Preview */}
                {image && (
                    <View style={styles.imagePreviewContainer}>
                        <Image source={{ uri: image }} style={styles.imagePreview} />
                        <TouchableOpacity
                            style={styles.removeImageButton}
                            onPress={() => setImage(null)}
                        >
                            <X size={14} color="white" />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Toolbar */}
                <View style={styles.toolbar}>
                    <TouchableOpacity onPress={pickImage} style={styles.toolButton}>
                        <ImageIcon size={20} color="#6B7280" />
                        <Text style={styles.toolText}>Photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.toolButton}
                        onPress={() => setLocationTag(locationTag ? '' : 'Main Canteen')}
                    >
                        <MapPin size={20} color={locationTag ? "#1E3A8A" : "#6B7280"} />
                        <Text style={[styles.toolText, locationTag && styles.locationActiveText]}>
                            {locationTag || 'Location'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Category Selector */}
                <Text style={styles.sectionLabel}>Category</Text>
                <View style={styles.categoryContainer}>
                    {POST_TYPES.map((type) => {
                        const isSelected = postType === type.value;
                        return (
                            <TouchableOpacity
                                key={type.value}
                                onPress={() => setPostType(type.value)}
                                style={[
                                    styles.categoryChip,
                                    isSelected && { backgroundColor: type.color + '20', borderColor: type.color }
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.categoryText,
                                        isSelected && { color: type.color, fontWeight: 'bold' }
                                    ]}
                                >
                                    {type.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 56, // Safe Area
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    closeButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#111',
    },
    postButton: {
        backgroundColor: '#1E3A8A',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        minWidth: 70,
        alignItems: 'center',
    },
    postButtonDisabled: {
        backgroundColor: '#E5E7EB',
    },
    postButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    textInput: {
        fontSize: 18,
        color: '#111',
        minHeight: 120,
        marginBottom: 20,
        lineHeight: 26,
    },
    imagePreviewContainer: {
        marginBottom: 20,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    imagePreview: {
        width: '100%',
        height: 200,
        backgroundColor: '#F3F4F6',
    },
    removeImageButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 6,
        borderRadius: 12,
    },
    toolbar: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#F3F4F6',
        paddingVertical: 12,
        marginBottom: 24,
    },
    toolButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24,
    },
    toolText: {
        fontSize: 14,
        color: '#6B7280',
        marginLeft: 6,
        fontWeight: '500',
    },
    locationActiveText: {
        color: '#1E3A8A',
        fontWeight: '600',
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#fff',
    },
    categoryText: {
        fontSize: 14,
        color: '#6B7280',
    },
});
