import { useFocusEffect, useRouter } from 'expo-router';
import { ArrowLeftRight, BookOpen, GraduationCap, Plus, Search, Star, X } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    FlatList,
    InteractionManager,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Skeleton } from '../../components/common/Skeleton';
import { FavoriteCourseSkeletonStrip } from '../../components/course/FavoriteCourseSkeletonStrip';
import { useLoginPrompt } from '../../hooks/useLoginPrompt';
import { useCourseActivity } from '../../context/CourseActivityContext';
import { getCurrentUser } from '../../services/auth';
import { enrichCoursesWithReviewStats, getLocalCourses } from '../../services/courses';
import {
    loadFavoriteCoursesDetails,
    loadCourseFavorites,
    saveCourseFavoritesLocal,
    setCourseFavoriteRemote
} from '../../services/favorites';
import { supabase } from '../../services/supabase';
import { Course } from '../../types';

const COURSES_PAGE_SIZE = 20;

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

const DEPT_COLORS: Record<string, { bg: string; text: string }> = {
    COMP: { bg: '#DBEAFE', text: '#1D4ED8' },
    ACCT: { bg: '#D1FAE5', text: '#065F46' },
    MATH: { bg: '#FEF3C7', text: '#B45309' },
    FIN:  { bg: '#FCE7F3', text: '#9D174D' },
    ECON: { bg: '#E0E7FF', text: '#3730A3' },
    MGMT: { bg: '#FEE2E2', text: '#991B1B' },
    MARK: { bg: '#FFF7ED', text: '#C2410C' },
    PHYS: { bg: '#ECFDF5', text: '#065F46' },
    CHEM: { bg: '#FDF4FF', text: '#7E22CE' },
    BIOL: { bg: '#F0FDF4', text: '#166534' },
    HIST: { bg: '#FFF1F2', text: '#BE123C' },
    ENGL: { bg: '#F0F9FF', text: '#0369A1' },
    CHIN: { bg: '#FFF8F0', text: '#C2410C' },
    BUSA: { bg: '#F5F3FF', text: '#6D28D9' },
    COMM: { bg: '#EEF2FF', text: '#3B4DB8' },
    SOCL: { bg: '#FFFBEB', text: '#92400E' },
    GEOG: { bg: '#F0FFF4', text: '#276749' },
    RELS: { bg: '#FFF9F0', text: '#B45309' },
    STAT: { bg: '#F0F4FF', text: '#1D4ED8' },
    POLS: { bg: '#FEF2F2', text: '#991B1B' },
    MUSI: { bg: '#FDF4FF', text: '#7E22CE' },
    VISU: { bg: '#F5F3FF', text: '#6D28D9' },
};

const getDeptPrefix = (code: string) => (code || '').toUpperCase().match(/^[A-Z]+/)?.[0] ?? '';
const getDeptColor = (code: string) => DEPT_COLORS[getDeptPrefix(code)] ?? { bg: '#F3E8FF', text: '#6D28D9' };

const mapDbCourse = (d: any): Course => ({
    id: d.id,
    code: d.code,
    name: d.name || '',
    instructor: d.instructor || '',
    department: d.department || '',
    credits: d.credits || 3,
    rating: d.rating || 0,
    reviewCount: d.review_count || 0,
});

export default function CoursesScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [courses, setCourses] = useState<Course[]>([]);
    const [deptTabs, setDeptTabs] = useState<string[]>([]);
    const [selectedDept, setSelectedDept] = useState<string | null>(null);
    const selectedDeptRef = useRef<string | null>(null);
    const [searchResults, setSearchResults] = useState<Course[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [favoriteCourseIds, setFavoriteCourseIds] = useState<string[]>([]);
    const [favoriteCourses, setFavoriteCourses] = useState<Course[]>([]);
    const [favoriteCoursesLoading, setFavoriteCoursesLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [allowRemoteFavorites, setAllowRemoteFavorites] = useState(false);
    const [coursePage, setCoursePage] = useState(0);
    const [hasMoreCourses, setHasMoreCourses] = useState(true);
    const [loadingMoreCourses, setLoadingMoreCourses] = useState(false);
    const [deptLoading, setDeptLoading] = useState(false);
    const { checkLogin } = useLoginPrompt();
    const { unreadByCourse, refresh: refreshCourseActivity } = useCourseActivity();

    const CourseSkeleton = () => (
        <View style={styles.skeletonCard}>
            <View style={{ flex: 1 }}>
                <Skeleton width="70%" height={18} style={{ marginBottom: 8 }} />
                <Skeleton width="40%" height={12} style={{ marginBottom: 12 }} />
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Skeleton width={60} height={20} borderRadius={10} />
                    <Skeleton width={60} height={20} borderRadius={10} />
                </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <Skeleton width={40} height={40} borderRadius={8} />
            </View>
        </View>
    );

    const normalizeCode = (value?: string) => (value || '').toUpperCase().replace(/\s+/g, '');
    const keyOf = (c: Course) => normalizeCode(c.code) || c.id;

    const mergeCourses = (base: Map<string, Course>, dbCourses: Course[]) => {
        dbCourses.forEach(c => {
            const key = keyOf(c);
            const existing = base.get(key);
            if (!existing) {
                base.set(key, c);
                return;
            }
            const merged: Course = {
                ...existing,
                ...c,
                id: c.id || existing.id,
                code: existing.code || c.code,
                name: existing.name || c.name,
                instructor: existing.instructor || c.instructor,
                department: existing.department || c.department,
                credits: existing.credits || c.credits,
                reviewCount: Math.max(existing.reviewCount || 0, c.reviewCount || 0),
                rating: (c.reviewCount || 0) > 0 ? c.rating : existing.rating,
            };
            base.set(key, merged);
        });
        return base;
    };

    const loadDeptTabs = useCallback(async () => {
        try {
            const { data } = await supabase.from('courses').select('code').order('code');
            if (data) {
                const prefixes = Array.from(new Set(
                    (data as any[]).map(d => getDeptPrefix(d.code || '')).filter(Boolean)
                )).sort() as string[];
                setDeptTabs(prefixes);
            }
        } catch { /* silent */ }
    }, []);

    const fetchCourses = async (isSilent = false, pageToLoad = 0, dept: string | null = null) => {
        if (!isSilent && courses.length === 0) setLoading(true);
        try {
            let query = supabase.from('courses').select('*');
            if (dept) {
                query = query.ilike('code', `${dept}%`).order('code');
            } else {
                const from = pageToLoad * COURSES_PAGE_SIZE;
                query = query.order('created_at', { ascending: false }).range(from, from + COURSES_PAGE_SIZE - 1);
            }

            const { data: dbData, error: dbError } = await query;
            let dbCourses: Course[] = [];
            if (dbData && !dbError) dbCourses = dbData.map(mapDbCourse);

            if (!dept) {
                setHasMoreCourses((dbData?.length || 0) >= COURSES_PAGE_SIZE);
                setCoursePage(pageToLoad);
            } else {
                setHasMoreCourses(false);
            }

            if (dept || pageToLoad === 0) {
                const localCourses = dept ? [] : await getLocalCourses();
                const courseMap = new Map<string, Course>();
                localCourses.forEach(c => courseMap.set(keyOf(c), c));
                mergeCourses(courseMap, dbCourses);
                if (!dept) {
                    MOCK_COURSES.forEach(mock => {
                        const key = keyOf(mock);
                        if (!courseMap.has(key)) courseMap.set(key, mock);
                    });
                }
                const merged = Array.from(courseMap.values());
                setCourses(await enrichCoursesWithReviewStats(merged));
            } else {
                const withStats = await enrichCoursesWithReviewStats(dbCourses);
                setCourses(prev => {
                    const existing = new Set(prev.map(c => keyOf(c)));
                    return [...prev, ...withStats.filter(c => !existing.has(keyOf(c)))];
                });
            }
        } catch (err) {
            console.log('Fetch courses error:', err);
            if (pageToLoad === 0 && !dept) {
                const localOnly = await getLocalCourses();
                const fallbackMap = new Map<string, Course>();
                localOnly.forEach(c => fallbackMap.set(normalizeCode(c.code) || c.id, c));
                MOCK_COURSES.forEach(mock => {
                    const key = normalizeCode(mock.code) || mock.id;
                    if (!fallbackMap.has(key)) fallbackMap.set(key, mock);
                });
                setCourses(await enrichCoursesWithReviewStats(Array.from(fallbackMap.values())));
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Debounced DB search
    useEffect(() => {
        if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
        const q = searchQuery.trim();
        if (q.length < 2) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }
        setIsSearching(true);
        searchTimerRef.current = setTimeout(async () => {
            try {
                const { data } = await supabase
                    .from('courses')
                    .select('*')
                    .or(`code.ilike.%${q}%,name.ilike.%${q}%,instructor.ilike.%${q}%`)
                    .order('code')
                    .limit(30);
                const dbResults = (data ?? []).map(mapDbCourse);
                const localFiltered = courses.filter(c =>
                    normalizeCode(c.code).includes(normalizeCode(q)) ||
                    (c.name || '').toLowerCase().includes(q.toLowerCase()) ||
                    (c.instructor || '').toLowerCase().includes(q.toLowerCase())
                );
                const map = new Map<string, Course>();
                [...localFiltered, ...dbResults].forEach(c => map.set(keyOf(c), c));
                setSearchResults(await enrichCoursesWithReviewStats(Array.from(map.values())));
            } catch {
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);
        return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); };
    }, [searchQuery]);

    const handleDeptSelect = (dept: string | null) => {
        setSelectedDept(dept);
        selectedDeptRef.current = dept;
        setSearchQuery('');
        setSearchResults([]);
        setCoursePage(0);
        setHasMoreCourses(dept === null);
        setDeptLoading(true);
        fetchCourses(true, 0, dept).finally(() => setDeptLoading(false));
    };

    const loadMoreCourses = useCallback(() => {
        if (loadingMoreCourses || !hasMoreCourses || selectedDept) return;
        setLoadingMoreCourses(true);
        fetchCourses(true, coursePage + 1, null).finally(() => setLoadingMoreCourses(false));
    }, [coursePage, hasMoreCourses, loadingMoreCourses, selectedDept]);

    useFocusEffect(
        useCallback(() => {
            const task = InteractionManager.runAfterInteractions(() => {
                fetchCourses(true, 0, selectedDeptRef.current);
                loadFavorites();
                void refreshCourseActivity();
                void loadDeptTabs();
            });
            return () => task.cancel();
        }, [refreshCourseActivity, loadDeptTabs])
    );

    const loadFavorites = async () => {
        try {
            const user = await getCurrentUser();
            const canRemote = !!user?.uid;
            setCurrentUserId(canRemote ? user.uid : null);
            setAllowRemoteFavorites(canRemote);
            const ids = await loadCourseFavorites(canRemote ? user.uid : null, canRemote);
            setFavoriteCourseIds(ids);
        } catch (e) {
            console.error('Error loading favorite courses:', e);
        }
    };

    useEffect(() => {
        let cancelled = false;
        const syncFavoriteCourses = async () => {
            if (favoriteCourseIds.length === 0) {
                if (!cancelled) { setFavoriteCourses([]); setFavoriteCoursesLoading(false); }
                return;
            }
            if (!cancelled) setFavoriteCoursesLoading(true);
            const resolvedFavorites = await loadFavoriteCoursesDetails(favoriteCourseIds, courses);
            if (!cancelled) { setFavoriteCourses(resolvedFavorites); setFavoriteCoursesLoading(false); }
        };
        syncFavoriteCourses().catch(err => {
            console.error('Error loading favorite course details:', err);
            if (!cancelled) { setFavoriteCourses([]); setFavoriteCoursesLoading(false); }
        });
        return () => { cancelled = true; };
    }, [favoriteCourseIds, courses]);

    const toggleFavorite = async (courseId: string) => {
        if (!checkLogin(currentUserId)) return;
        const isFavorite = favoriteCourseIds.includes(courseId);
        const nextFavorites = isFavorite
            ? favoriteCourseIds.filter(id => id !== courseId)
            : [...favoriteCourseIds, courseId];
        setFavoriteCourseIds(nextFavorites);
        try {
            await saveCourseFavoritesLocal(nextFavorites);
            if (allowRemoteFavorites && currentUserId) {
                await setCourseFavoriteRemote(currentUserId, courseId, !isFavorite);
            }
            await refreshCourseActivity();
        } catch (e) {
            console.error('Error saving favorite courses:', e);
        }
    };

    const handleCoursePress = (courseId: string) => {
        if (!checkLogin(currentUserId)) return;
        router.push(`/courses/${courseId}` as any);
    };

    const handleAddCourse = () => {
        if (checkLogin(currentUserId)) {
            router.push('/courses/add');
        }
    };

    const isSearchMode = searchQuery.trim().length >= 2;
    const displayedCourses = isSearchMode ? searchResults : courses;

    const sectionTitle = isSearchMode
        ? `搜索结果${searchResults.length > 0 ? ` (${searchResults.length})` : ''}`
        : selectedDept
            ? `${selectedDept} · ${courses.length} 门课程`
            : t('courses.all_courses');

    const renderCourseItem = ({ item }: { item: Course }) => {
        const hasUnread = !!unreadByCourse[item.id]?.hasAnyUnread;
        const deptColor = getDeptColor(item.code);
        return (
            <TouchableOpacity
                style={styles.courseCard}
                onPress={() => handleCoursePress(item.id)}
            >
                {hasUnread && <View style={styles.courseUnreadDot} />}
                <View style={styles.courseRow}>
                    <View style={styles.courseMain}>
                        <View style={styles.courseHeader}>
                            <View style={[styles.codeContainer, { backgroundColor: deptColor.bg }]}>
                                <Text style={[styles.courseCode, { color: deptColor.text }]}>{item.code}</Text>
                            </View>
                        </View>
                        <Text style={styles.courseName}>{item.name}</Text>
                        <Text style={styles.deptText}>{item.department}</Text>
                    </View>
                    <View style={styles.courseStatsColumn}>
                        <View style={styles.ratingContainer}>
                            <Star size={14} color="#FFD700" fill="#FFD700" />
                            <Text style={styles.ratingText}>{(item.rating || 0).toFixed(1)}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.favoriteButton}
                            onPress={(e: any) => {
                                e?.stopPropagation?.();
                                toggleFavorite(item.id);
                            }}
                        >
                            <Star
                                size={18}
                                color={favoriteCourseIds.includes(item.id) ? '#FFD700' : '#D1D5DB'}
                                fill={favoriteCourseIds.includes(item.id) ? '#FFD700' : 'transparent'}
                            />
                        </TouchableOpacity>
                        <Text style={styles.reviewCount}>{t('teachers.reviews_count', { count: item.reviewCount })}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <Text style={styles.headerTitle}>{t('courses.title')}</Text>
                    <View style={styles.headerRightActions}>
                        <TouchableOpacity style={styles.headerActionButton} onPress={handleAddCourse}>
                            <Plus size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Search size={20} color="#9CA3AF" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={t('courses.search_placeholder')}
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {isSearching && <ActivityIndicator size="small" color="#9CA3AF" style={{ marginRight: 4 }} />}
                    {searchQuery.length > 0 && !isSearching && (
                        <TouchableOpacity onPress={() => { setSearchQuery(''); setSearchResults([]); }}>
                            <X size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Department filter tabs */}
            {!isSearchMode && deptTabs.length > 0 && (
                <View style={styles.deptTabsWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.deptTabsContent}
                >
                    <TouchableOpacity
                        style={[styles.deptTab, selectedDept === null && styles.deptTabAllActive]}
                        onPress={() => handleDeptSelect(null)}
                    >
                        <Text style={[styles.deptTabText, selectedDept === null && styles.deptTabAllActiveText]}>
                            全部
                        </Text>
                    </TouchableOpacity>
                    {deptTabs.map(dept => {
                        const isActive = selectedDept === dept;
                        const color = DEPT_COLORS[dept] ?? { bg: '#F3E8FF', text: '#6D28D9' };
                        return (
                            <TouchableOpacity
                                key={dept}
                                style={[
                                    styles.deptTab,
                                    isActive && { backgroundColor: color.bg, borderColor: color.text + '50' },
                                ]}
                                onPress={() => handleDeptSelect(dept)}
                            >
                                <Text style={[
                                    styles.deptTabText,
                                    isActive && { color: color.text, fontWeight: '700' },
                                ]}>
                                    {dept}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
                </View>
            )}

            {/* Favorites strip — only when not searching and no dept selected */}
            {(favoriteCoursesLoading || favoriteCourses.length > 0) && !isSearchMode && !selectedDept && (
                <View style={styles.favoritesSection}>
                    <Text style={styles.favoritesTitle}>⭐ {t('courses.favorites')}</Text>
                    {favoriteCoursesLoading ? (
                        <FavoriteCourseSkeletonStrip />
                    ) : (
                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={favoriteCourses}
                            keyExtractor={(item) => `fav-${item.id}`}
                            contentContainerStyle={styles.favoritesList}
                            renderItem={({ item }) => {
                                const dc = getDeptColor(item.code);
                                return (
                                    <TouchableOpacity
                                        style={[styles.favoriteCard, { backgroundColor: dc.bg, borderColor: dc.text + '30' }]}
                                        onPress={() => handleCoursePress(item.id)}
                                    >
                                        {!!unreadByCourse[item.id]?.hasAnyUnread && <View style={styles.favoriteUnreadDot} />}
                                        <Text style={[styles.favoriteCode, { color: dc.text }]}>{(item.code || '').toUpperCase()}</Text>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    )}
                </View>
            )}

            {/* Section title */}
            <View style={styles.sectionTitleRow}>
                <Text style={styles.allCoursesTitle}>{sectionTitle}</Text>
                {deptLoading && <ActivityIndicator size="small" color="#1E3A8A" style={{ marginLeft: 8 }} />}
            </View>

            {/* Course List */}
            <FlatList
                data={displayedCourses}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={renderCourseItem}
                onEndReached={loadMoreCourses}
                onEndReachedThreshold={0.3}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setCoursePage(0);
                            setHasMoreCourses(true);
                            setRefreshing(true);
                            fetchCourses(true, 0, selectedDeptRef.current);
                        }}
                        tintColor="#1E3A8A"
                    />
                }
                ListFooterComponent={loadingMoreCourses ? (
                    <View style={styles.loadingMore}>
                        <ActivityIndicator size="small" color="#1E3A8A" />
                    </View>
                ) : null}
                initialNumToRender={8}
                maxToRenderPerBatch={5}
                windowSize={5}
                removeClippedSubviews={true}
                ListEmptyComponent={
                    loading || isSearching ? (
                        <View style={{ paddingTop: 10 }}>
                            <CourseSkeleton />
                            <CourseSkeleton />
                            <CourseSkeleton />
                            <CourseSkeleton />
                            <CourseSkeleton />
                        </View>
                    ) : (
                        <View style={styles.emptyState}>
                            <BookOpen size={48} color="#D1D5DB" />
                            <Text style={styles.emptyText}>{t('courses.no_courses_found')}</Text>
                            {!isSearchMode && (
                                <TouchableOpacity style={styles.addCourseButton} onPress={handleAddCourse}>
                                    <Text style={styles.addCourseText}>{t('courses.add_new_course')}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )
                }
            />

            {/* Teacher Review FAB */}
            <TouchableOpacity
                testID="rate-fab"
                style={styles.teacherFab}
                onPress={() => router.push('/teachers' as any)}
            >
                <GraduationCap size={24} color="#fff" />
                <View style={[styles.fabBadge, { backgroundColor: '#1E3A8A' }]}>
                    <Text style={styles.fabBadgeText}>{t('teachers.rate')}</Text>
                </View>
            </TouchableOpacity>

            {/* Exchange FAB */}
            <TouchableOpacity
                style={styles.exchangeFab}
                onPress={() => router.push('/courses/exchange' as any)}
            >
                <ArrowLeftRight size={24} color="#fff" />
                <View style={styles.fabBadge}>
                    <Text style={styles.fabBadgeText}>{t('teachers.swap')}</Text>
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
    skeletonCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
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
    headerRightActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerActionButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
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
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#111827',
        lineHeight: 20,
        paddingVertical: 0,
    },
    // Department tabs
    deptTabsWrapper: {
        marginTop: 16,
        backgroundColor: '#F9FAFB',
        paddingVertical: 4,
    },
    deptTabsContent: {
        paddingHorizontal: 16,
        gap: 8,
        paddingVertical: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    deptTab: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    deptTabAllActive: {
        backgroundColor: '#EFF6FF',
        borderColor: '#BFDBFE',
    },
    deptTabText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
    },
    deptTabAllActiveText: {
        color: '#1D4ED8',
        fontWeight: '700',
    },
    // Favorites
    listContent: {
        padding: 20,
        paddingTop: 12,
        paddingBottom: 180,
    },
    loadingMore: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    favoritesSection: { paddingTop: 12, paddingBottom: 8 },
    favoritesTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    favoritesList: { paddingHorizontal: 20 },
    favoriteCard: {
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginRight: 10,
        maxWidth: 180,
        borderWidth: 1,
        position: 'relative',
    },
    favoriteCode: {
        fontSize: 13,
        fontWeight: '700',
    },
    favoriteUnreadDot: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 8,
        height: 8,
        borderRadius: 999,
        backgroundColor: '#EF4444',
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 8,
    },
    allCoursesTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    // Course card
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
        position: 'relative',
    },
    courseUnreadDot: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 10,
        height: 10,
        borderRadius: 999,
        backgroundColor: '#EF4444',
        zIndex: 2,
    },
    courseRow: {
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    courseMain: {
        flex: 1,
        paddingRight: 12,
    },
    courseHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 8,
    },
    codeContainer: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    courseCode: {
        fontSize: 13,
        fontWeight: '700',
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
    courseStatsColumn: {
        width: 90,
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    favoriteButton: {
        padding: 8,
    },
    courseName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    deptText: {
        fontSize: 12,
        color: '#6B7280',
    },
    reviewCount: {
        fontSize: 11,
        color: '#9CA3AF',
        textAlign: 'right',
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
        bottom: 110,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#8B5CF6',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
        zIndex: 9999,
    },
    teacherFab: {
        position: 'absolute',
        bottom: 180,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#1E3A8A',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
        zIndex: 9999,
    },
    fabBadge: {
        position: 'absolute',
        top: -10,
        right: -6,
        backgroundColor: '#EF4444',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#fff',
        minWidth: 40,
        alignItems: 'center',
    },
    fabBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
});
