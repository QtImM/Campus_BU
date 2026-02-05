import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Post } from '../../types';

interface PostCardProps {
    post: Post;
    onLike?: () => void;
    onComment?: () => void;
    onPress?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment, onPress }) => {
    const timeAgo = formatDistanceToNow(post.createdAt, { addSuffix: true });

    const categoryColors: Record<string, string> = {
        'Events': '#FF6B6B',
        'Reviews': '#4ECDC4',
        'Guides': '#FFE66D',
        'Lost & Found': '#95E1D3',
    };

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {post.isAnonymous ? '?' : post.authorName.charAt(0)}
                    </Text>
                </View>
                <View style={styles.authorInfo}>
                    <Text style={styles.authorName}>
                        {post.isAnonymous ? '匿名用户' : post.authorName}
                    </Text>
                    <Text style={styles.timeText}>{timeAgo}</Text>
                </View>
                {post.category && (
                    <View style={[styles.categoryBadge, { backgroundColor: categoryColors[post.category] || '#E5E7EB' }]}>
                        <Text style={styles.categoryText}>{post.category}</Text>
                    </View>
                )}
            </View>

            {/* Content */}
            <Text style={styles.content}>{post.content}</Text>

            {/* Image if exists */}
            {post.imageUrl && (
                <Image
                    source={{ uri: post.imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                />
            )}

            {/* Actions */}
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={onLike}>
                    <Heart
                        size={20}
                        color={post.isLiked ? '#EF4444' : '#6B7280'}
                        fill={post.isLiked ? '#EF4444' : 'transparent'}
                    />
                    <Text style={[styles.actionText, post.isLiked && { color: '#EF4444' }]}>{post.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={onComment}>
                    <MessageCircle size={20} color="#6B7280" />
                    <Text style={styles.actionText}>{post.comments}</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1E3A8A',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    authorInfo: {
        flex: 1,
    },
    authorName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    timeText: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    categoryBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#111827',
    },
    content: {
        fontSize: 15,
        lineHeight: 22,
        color: '#374151',
        marginBottom: 12,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 12,
    },
    actions: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24,
    },
    actionText: {
        marginLeft: 6,
        fontSize: 14,
        color: '#6B7280',
    },
});
