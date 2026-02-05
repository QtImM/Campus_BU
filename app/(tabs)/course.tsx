import { useFocusEffect, useRouter } from 'expo-router';
import { ArrowLeftRight, BookOpen, ChevronLeft, Plus, Search, Star } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { getLocalCourses } from '../../services/courses';
import { supabase } from '../../services/supabase';
import { Course } from '../../types';

// Mock Data as fallback/initial
const MOCK_COURSES: Course[] = [
    {
        id: '1',
        code: 'COMP3015',
        name: 'Data Communications and Networking',
        instructor: 'Dr. Jean Lai',
        department: 'Computer Science',
        credits: 3,
        rating: 4.5,
        reviewCount: 12
    }
];

export default function CoursesScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
    const [refreshing, setRefreshing] = useState(false);

    const fetchCourses = async () => {
        setRefreshing(true);
        try {
            // 1. Fetch from Supabase (may fail if table missing)
            const { data: dbData, error: dbError } = await supabase
                .from('courses')
                .select('*')
                .order('created_at', { ascending: false });

            let dbCourses: Course[] = [];
            if (dbData && !dbError) {
                dbCourses = dbData.map(d => ({
                    id: d.id,
                    code: d.code,
                    name: d.name || '',
                    instructor: d.instructor || '',
                    department: d.department || '',
                    credits: d.credits || 3,
                    rating: d.rating || 0,
                    reviewCount: d.review_count || 0
                }));
            }

            // 2. Fetch from Local Storage
            const localCourses = await getLocalCourses();

            // 3. Merge All (Local > DB > Mock)
            const allItems = [...localCourses, ...dbCourses];

            MOCK_COURSES.forEach(mock => {
                if (!allItems.find(c => c.code === mock.code)) {
                    allItems.push(mock);
                }
            });

            setCourses(allItems);
        } catch (err) {
            console.log('Fetch courses silent error (expected if table missing):', err);
            // Fallback to local + mock if everything fails
            const localOnly = await getLocalCourses();
            const fallback = [...localOnly];
            MOCK_COURSES.forEach(mock => {
                if (!fallback.find(c => c.code === mock.code)) {
                    fallback.push(mock);
                }
            });
            setCourses(fallback);
        } finally {
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchCourses();
        }, [])
    );

    const filteredCourses = courses.filter(course => {
        const query = (searchQuery || '').toLowerCase();
        return (
            (course.code || '').toLowerCase().includes(query) ||
            (course.name || '').toLowerCase().includes(query) ||
            (course.instructor || '').toLowerCase().includes(query)
        );
    });

    const handleCoursePress = (courseId: string) => {
        router.push(`/courses/${courseId}` as any);
    };

    const handleAddCourse = () => {
        router.push('/courses/add');
    };

    const renderCourseItem = ({ item }: { item: Course }) => (
        <TouchableOpacity
            style={styles.courseCard}
            onPress={() => handleCoursePress(item.id)}
        >
            <View style={styles.courseHeader}>
                <View style={styles.codeContainer}>
                    <Text style={styles.courseCode}>{item.code}</Text>
                </View>
                <View style={styles.ratingContainer}>
                    <Star size={14} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.ratingText}>{(item.rating || 0).toFixed(1)}</Text>
                </View>
            </View>
            <Text style={styles.courseName}>{item.name}</Text>
            <Text style={styles.instructorText}>👨‍🏫 {item.instructor}</Text>
            <View style={styles.cardFooter}>
                <Text style={styles.deptText}>{item.department}</Text>
                <Text style={styles.reviewCount}>{item.reviewCount} 条评价</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <ChevronLeft size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Course Review</Text>
                    <TouchableOpacity style={styles.addButton} onPress={handleAddCourse}>
                        <Plus size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.headerSubtitle}>Find & Review your courses</Text>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Search size={20} color="#9CA3AF" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search course code, name or instructor..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Course List */}
            <FlatList
                data={filteredCourses}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={renderCourseItem}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={fetchCourses}
                        tintColor="#1E3A8A"
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <BookOpen size={48} color="#D1D5DB" />
                        <Text style={styles.emptyText}>No courses found</Text>
                        <TouchableOpacity style={styles.addCourseButton} onPress={handleAddCourse}>
                            <Text style={styles.addCourseText}>Add New Course</Text>
                        </TouchableOpacity>
                    </View>
                }
            />

            {/* Exchange FAB */}
            <TouchableOpacity
                style={styles.exchangeFab}
                onPress={() => router.push('/courses/exchange' as any)}
            >
                <ArrowLeftRight size={24} color="#fff" />
                <View style={styles.fabBadge}>
                    <Text style={styles.fabBadgeText}>换课</Text>
                </View>
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
        paddingBottom: 24,
        paddingHorizontal: 20,
        backgroundColor: '#1E3A8A',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    backButton: {
        padding: 4,
    },
    addButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginTop: -24,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#111827',
        marginLeft: 12,
    },
    listContent: {
        padding: 20,
        paddingTop: 12,
    },
    courseCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    courseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    codeContainer: {
        backgroundColor: '#F3E8FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    courseCode: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1E3A8A',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF9C4',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#F59E0B',
        marginLeft: 4,
    },
    courseName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    instructorText: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 12,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 12,
    },
    deptText: {
        fontSize: 12,
        color: '#6B7280',
    },
    reviewCount: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 12,
        marginBottom: 20,
    },
    addCourseButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#1E3A8A',
        borderRadius: 20,
    },
    addCourseText: {
        color: '#fff',
        fontWeight: '600',
    },
    exchangeFab: {
        position: 'absolute',
        bottom: 140, // High enough to clear any overlap
        right: 20,
        width: 60, // Slightly larger
        height: 60,
        borderRadius: 30,
        backgroundColor: '#8B5CF6',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 15, // Higher elevation for Android
        zIndex: 9999, // Extremely high zIndex for iOS
    },
    fabBadge: {
        position: 'absolute',
        top: -8,
        right: -4,
        backgroundColor: '#EF4444',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff',
    },
    fabBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
