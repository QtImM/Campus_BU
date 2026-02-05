import { useRouter } from 'expo-router';
import { Building, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PostCard } from '../../components/campus/PostCard';
import { Post, PostCategory } from '../../types';

const CATEGORIES: PostCategory[] = ['All', 'Events', 'Reviews', 'Guides', 'Lost & Found'];

// Mock posts for demo
export const MOCK_POSTS: Post[] = [
    {
        id: '1',
        authorId: 'user1',
        authorName: '小明',
        authorMajor: 'Computer Science',
        content: '🎉 下周五有校园音乐节！AAB广场晚上7点开始，有兴趣的同学一起来啊！',
        category: 'Events',
        likes: 42,
        comments: 2,
        replies: [
            { id: 'r1', authorName: '小红', content: '我也想去！是在AAB哪个广场？', createdAt: new Date(Date.now() - 1800000) },
            { id: 'r2', authorName: '阿强', content: '去年我也去了，气氛超级棒！', createdAt: new Date(Date.now() - 900000) },
        ],
        createdAt: new Date(Date.now() - 3600000),
        isAnonymous: false,
    },
    {
        id: '2',
        authorId: 'user2',
        authorName: '匿名用户',
        authorMajor: 'Anonymous',
        content: '请问有人知道Shaw Tower的咖啡厅营业时间吗？周末开门吗？',
        category: 'Guides',
        likes: 15,
        comments: 3,
        createdAt: new Date(Date.now() - 7200000),
        isAnonymous: true,
    },
    {
        id: '3',
        authorId: 'user3',
        authorName: '图书馆猫咪观察员',
        authorMajor: 'Media Studies',
        content: '📚 今天在图书馆5楼发现了一只超可爱的橘猫！在window seat那边晒太阳，太治愈了～',
        category: 'Reviews',
        likes: 128,
        comments: 24,
        createdAt: new Date(Date.now() - 86400000),
        isAnonymous: false,
    },
    {
        id: '4',
        authorId: 'user4',
        authorName: '大四学长',
        content: '失物招领：在CVA发现一个黑色双肩包，里面有笔记本电脑。联系我认领！',
        category: 'Lost & Found',
        likes: 8,
        comments: 2,
        createdAt: new Date(Date.now() - 172800000),
        isAnonymous: false,
    },
];

export default function CampusScreen() {
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState<PostCategory>('All');
    const [refreshing, setRefreshing] = useState(false);
    const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);

    const filteredPosts = activeCategory === 'All'
        ? posts
        : posts.filter(post => post.category === activeCategory);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    const handleCompose = () => {
        router.push('/compose');
    };

    const handlePostPress = (postId: string) => {
        router.push(`/campus/${postId}` as any);
    };

    const handleFindClassroom = () => {
        router.push('/classroom');
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <Text style={styles.headerTitle}>Campus Circle</Text>
                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.actionButton} onPress={handleFindClassroom}>
                            <Building size={16} color="#4B0082" />
                            <Text style={styles.actionText}>找教室</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Category Filter */}
            <View style={styles.filterContainer}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={CATEGORIES}
                    keyExtractor={(item) => item}
                    contentContainerStyle={styles.filterList}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.filterButton,
                                activeCategory === item && styles.filterButtonActive
                            ]}
                            onPress={() => setActiveCategory(item)}
                        >
                            <Text style={[
                                styles.filterText,
                                activeCategory === item && styles.filterTextActive
                            ]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Posts Feed */}
            <FlatList
                data={filteredPosts}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.feedList}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#4B0082"
                    />
                }
                renderItem={({ item }) => (
                    <PostCard
                        post={item}
                        onPress={() => handlePostPress(item.id)}
                        onLike={() => {
                            // Toggle like locally for demo
                            setPosts(prev => prev.map(p =>
                                p.id === item.id ? {
                                    ...p,
                                    isLiked: !p.isLiked,
                                    likes: p.isLiked ? p.likes - 1 : p.likes + 1
                                } : p
                            ));
                        }}
                        onComment={() => handlePostPress(item.id)}
                    />
                )}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No posts found.</Text>
                        <Text style={styles.emptySubtext}>Be the first to post!</Text>
                    </View>
                }
            />

            {/* FAB */}
            <TouchableOpacity style={styles.fab} onPress={handleCompose}>
                <Plus size={28} color="#fff" />
            </TouchableOpacity>
        </View>
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
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    filterContainer: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    filterList: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        marginRight: 8,
    },
    filterButtonActive: {
        backgroundColor: '#1E3A8A',
    },
    filterText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4B5563',
    },
    filterTextActive: {
        color: '#fff',
    },
    feedList: {
        padding: 16,
        paddingBottom: 100,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
    },
    emptySubtext: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    fab: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#1E3A8A',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#4B0082',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    actionText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1E3A8A',
        marginLeft: 4,
    },
});
