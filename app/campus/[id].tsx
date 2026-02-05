import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, MessageCircle, Send } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { MOCK_POSTS } from '../(tabs)/campus';
import { PostCard } from '../../components/campus/PostCard';
import { Post } from '../../types';

export default function PostDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    // Find the post from mock data
    const initialPost = MOCK_POSTS.find(p => p.id === id) || MOCK_POSTS[0];
    const [post, setPost] = useState<Post>(initialPost);
    const [commentText, setCommentText] = useState('');

    const handleLike = () => {
        const isLiked = !post.isLiked;
        setPost(prev => ({
            ...prev,
            isLiked,
            likes: isLiked ? prev.likes + 1 : prev.likes - 1
        }));
    };

    const handleSendComment = () => {
        if (!commentText.trim()) return;

        const newReply = {
            id: Date.now().toString(),
            authorName: 'Me',
            content: commentText,
            createdAt: new Date(),
        };

        setPost(prev => ({
            ...prev,
            comments: prev.comments + 1,
            replies: [...(prev.replies || []), newReply]
        }));
        setCommentText('');
        Keyboard.dismiss();
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <ChevronLeft size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Post Detail</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <PostCard
                    post={post}
                    onLike={handleLike}
                />

                <View style={styles.commentsHeader}>
                    <Text style={styles.commentsTitle}>Comments ({post.comments})</Text>
                </View>

                {post.replies && post.replies.length > 0 ? (
                    <View style={styles.repliesList}>
                        {post.replies.map(reply => (
                            <View key={reply.id} style={styles.replyItem}>
                                <View style={styles.replyAvatar}>
                                    <Text style={styles.replyAvatarText}>{reply.authorName.charAt(0)}</Text>
                                </View>
                                <View style={styles.replyInfo}>
                                    <Text style={styles.replyAuthor}>{reply.authorName}</Text>
                                    <Text style={styles.replyContent}>{reply.content}</Text>
                                    <Text style={styles.replyTime}>Just now</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyComments}>
                        <MessageCircle size={48} color="#D1D5DB" />
                        <Text style={styles.emptyText}>No comments yet. Start the conversation!</Text>
                    </View>
                )}
            </ScrollView>

            {/* Sticky Input */}
            <View style={styles.inputWrapper}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Write a comment..."
                        value={commentText}
                        onChangeText={setCommentText}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !commentText.trim() && styles.sendButtonDisabled]}
                        onPress={handleSendComment}
                        disabled={!commentText.trim()}
                    >
                        <Send size={20} color={commentText.trim() ? "#1E3A8A" : "#9CA3AF"} />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        paddingTop: 56,
        paddingBottom: 16,
        paddingHorizontal: 20,
        backgroundColor: '#1E3A8A',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    commentsHeader: {
        marginTop: 24,
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    commentsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    repliesList: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    replyItem: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    replyAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F3E8FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    replyAvatarText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#7C3AED',
    },
    replyInfo: {
        flex: 1,
    },
    replyAuthor: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 2,
    },
    replyContent: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },
    replyTime: {
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 4,
    },
    emptyComments: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        marginTop: 12,
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
    },
    inputWrapper: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingBottom: Platform.OS === 'ios' ? 32 : 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#111827',
        maxHeight: 100,
    },
    sendButton: {
        padding: 8,
        marginLeft: 8,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
});
