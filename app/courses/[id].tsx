import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CalendarCheck, Check, ChevronLeft, Info, MessageCircle, MessageSquare, Plus, Send, Share2, Star, ThumbsUp, Trash2, UserPlus, Users, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Animated,
    Alert,
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { CachedRemoteImage } from '../../components/common/CachedRemoteImage';
import { EduBadge } from '../../components/common/EduBadge';
import { SafetyNotice } from '../../components/common/SafetyNotice';
import { StarRating } from '../../components/common/StarRating';
import { TranslatableText } from '../../components/common/TranslatableText';
import { useCourseActivity } from '../../context/CourseActivityContext';
import { useLoginPrompt } from '../../hooks/useLoginPrompt';
import { useScheduleReviewPrompts } from '../../hooks/useScheduleReviewPrompts';
import { useUgcEntryActions } from '../../hooks/useUgcEntryActions';
import { ReviewSuccessOverlay } from '../../components/course/ReviewSuccessOverlay';
import { ShareCardSheet } from '../../components/share/ShareCardSheet';
import type { ShareCardPayload } from '../../components/share/ShareCard';
import storage from '../../lib/storage';
import { getCurrentUser } from '../../services/auth';
import { ensureContentSafety } from '../../services/contentFilter';
import { addReview, deleteReview, getCachedCourseDetail, getCourseById, getReviewsAndHasReviewed, likeReview, summarizeCourseReviews } from '../../services/courses';
import { blockUser, getBlockedUserIds, reportContent, ReportReason } from '../../services/moderation';
import { supabase } from '../../services/supabase';
import { deleteTeamingRequest, fetchTeamingComments, fetchTeamingRequests, postTeamingComment, postTeamingRequest, toggleTeamingLike } from '../../services/teaming';
import { ContactMethod, Course, CourseTeaming, Review, TeamingComment } from '../../types';
import { isRemoteImageUrl } from '../../utils/remoteImage';
import { isHKBUEmail } from '../../utils/userUtils';

const normalizeChatUser = (userData?: { display_name?: string; avatar_url?: string; email?: string } | null) => ({
    ...userData,
    avatar_url: userData?.avatar_url || '',
});

// Mock Data
const MOCK_REVIEWS: Review[] = [
    {
        id: 'r1',
        courseId: '1',
        authorId: 'u1',
        authorName: '匿名同学',
        authorAvatar: '🐸',
        rating: 5,
        difficulty: 3,
        content: 'Jean 教得很好，只要认真听课，考试不难。Project 也不算太重，推荐！',
        tags: ['给分好', '内容实用'],
        likes: 12,
        createdAt: new Date('2025-01-15'),
        semester: '2024 Fall'
    }
];

export default function CourseDetailScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { checkLogin } = useLoginPrompt();
    const { unreadByCourse, markCourseSeen, refresh: refreshCourseActivity } = useCourseActivity();
    const { id } = useLocalSearchParams();
    const courseUnread = typeof id === 'string' ? unreadByCourse[id] : undefined;
    const [activeTab, setActiveTab] = useState<'reviews' | 'chat' | 'teaming'>('reviews');
    const [course, setCourse] = useState<Course | null>(() => getCachedCourseDetail(id as string));
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [sortBy, setSortBy] = useState<'newest' | 'likes'>('newest');
    const [filterTag, setFilterTag] = useState<string | null>(null);
    const [likedReviewIds, setLikedReviewIds] = useState<string[]>([]);
    const [teamingRequests, setTeamingRequests] = useState<CourseTeaming[]>([]);
    const [isTeamingModalVisible, setIsTeamingModalVisible] = useState(false);
    const [teamingLoading, setTeamingLoading] = useState(false);

    // Chat State
    const [messages, setMessages] = useState<any[]>([]);
    const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [user, setUser] = useState<any>(null);
    const flatListRef = useRef<FlatList>(null);
    const blockedUserIdsRef = useRef<string[]>([]);

    const [hasReviewed, setHasReviewed] = useState(false);
    const [aiSummary, setAiSummary] = useState<string>('');

    // Review-guidance: does the logged-in user have THIS course in their
    // timetable? If so they actually took it — the highest-value review source —
    // so we surface a stronger, personalized nudge.
    const { isInSchedule, refresh: refreshScheduleReviewPrompts } = useScheduleReviewPrompts(user?.uid);
    const courseInSchedule = isInSchedule(course?.code);

    // Post-submit celebratory feedback (replaces a plain Alert).
    const [successOverlay, setSuccessOverlay] = useState<{ visible: boolean; isFirst: boolean; helpedCount: number }>(
        { visible: false, isFirst: false, helpedCount: 0 }
    );

    // Shareable-card sheet (course-level or single-review). null = closed.
    const [shareTarget, setShareTarget] = useState<ShareCardPayload | null>(null);

    // Form State
    const [rating, setRating] = useState(0);
    const [difficulty, setDifficulty] = useState(0);
    const [workload, setWorkload] = useState(0);
    const [grading, setGrading] = useState(0);
    const [reviewTags, setReviewTags] = useState<string[]>([]);
    const [reviewContent, setReviewContent] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);

    // Teaming Form State
    const [teamingSection, setTeamingSection] = useState('');
    const [teamingSelfIntro, setTeamingSelfIntro] = useState('');
    const [teamingTarget, setTeamingTarget] = useState('');
    const [selectedTeamingMethods, setSelectedTeamingMethods] = useState<ContactMethod['platform'][]>([]);
    const [teamingContactValues, setTeamingContactValues] = useState<Record<string, string>>({});
    const [teamingOtherPlatformName, setTeamingOtherPlatformName] = useState('');
    const [teamingSubmitting, setTeamingSubmitting] = useState(false);
    const [selectedTeamingContact, setSelectedTeamingContact] = useState<CourseTeaming | null>(null);

    // Teaming Social State
    const [likedTeamingIds, setLikedTeamingIds] = useState<string[]>([]);
    const [isTeamingCommentModalVisible, setIsTeamingCommentModalVisible] = useState(false);
    const [selectedTeamingForComments, setSelectedTeamingForComments] = useState<CourseTeaming | null>(null);
    const [teamingComments, setTeamingComments] = useState<TeamingComment[]>([]);
    const [teamingCommentLoading, setTeamingCommentLoading] = useState(false);
    const [newTeamingComment, setNewTeamingComment] = useState('');
    const [teamingReplyTarget, setTeamingReplyTarget] = useState<TeamingComment | null>(null);
    const teamingCommentInputRef = useRef<TextInput>(null);
    const ugcActions = useUgcEntryActions({
        currentUserId: user?.uid,
        ensureLoggedIn: () => !!checkLogin(user),
        onBlockedUser: (blockedUserId) => {
            setBlockedUserIds((prev) => {
                if (prev.includes(blockedUserId)) return prev;
                return [...prev, blockedUserId];
            });
            setMessages((prev) => prev.filter((msg) => msg.sender_id !== blockedUserId));
            setReviews((prev) => prev.filter((review) => review.authorId !== blockedUserId));
            setTeamingRequests((prev) => prev.filter((request) => request.userId !== blockedUserId));
            setTeamingComments((prev) => prev.filter((comment) => comment.authorId !== blockedUserId));
        },
    });

    const roomId = `course_${id}`;
    const REPORT_REASONS: Array<{ label: string; value: ReportReason }> = [
        { label: '垃圾内容', value: 'spam' },
        { label: '骚扰辱骂', value: 'harassment' },
        { label: '仇恨/歧视', value: 'hate_speech' },
        { label: '色情低俗', value: 'sexual_content' },
        { label: '暴力威胁', value: 'violence' },
        { label: '诈骗引流', value: 'scam' },
        { label: '其他', value: 'other' },
    ];

    useEffect(() => {
        blockedUserIdsRef.current = blockedUserIds;
    }, [blockedUserIds]);

    useEffect(() => {
        loadData();
        setupRealtime();
        if (typeof id === 'string') {
            void markCourseSeen(id);
        }
        return () => {
            supabase.channel(roomId).unsubscribe();
        };
    }, [id, markCourseSeen]);

    const loadData = async () => {
        // ── Phase 1: get user + liked reviews from local cache (instant) ──
        const [currentUser, likedStr] = await Promise.all([
            getCurrentUser(),
            storage.getItem('hkcampus_liked_reviews').catch(() => null),
        ]);
        setUser(currentUser);
        let blockedForCurrentUser: string[] = [];
        if (currentUser?.uid) {
            const blocked = await getBlockedUserIds(currentUser.uid);
            setBlockedUserIds(blocked);
            blockedForCurrentUser = blocked;
        } else {
            setBlockedUserIds([]);
        }
        if (likedStr) {
            try { setLikedReviewIds(JSON.parse(likedStr)); } catch { }
        }

        // ── Phase 2: fetch course + chat messages in parallel ──
        const isMockId = id === '1';
        const [courseData, messagesResult] = await Promise.all([
            getCourseById(id as string),
            supabase
                .from('messages')
                .select('*, users(display_name, avatar_url, email)')
                .eq('course_id', id as string)
                .order('created_at', { ascending: true }),
        ]);

        if (courseData) setCourse(courseData);
        else console.warn('Course not found for ID:', id);

        if (messagesResult.data) {
            const blockedSet = new Set(blockedForCurrentUser);
            setMessages(messagesResult.data
                .filter((message: any) => !blockedSet.has(message.sender_id))
                .map((message: any) => ({
                    ...message,
                    users: normalizeChatUser(message.users),
                })));
        }

        // ── Phase 3: reviews + hasReviewed in one round-trip ──
        if (isMockId) {
            setReviews(MOCK_REVIEWS);
            setReviewsLoading(false);
        } else {
            const { reviews, hasReviewed } = await getReviewsAndHasReviewed(
                id as string,
                currentUser?.uid ?? null,
                courseData?.code,
            );
            setReviews(reviews);
            setHasReviewed(hasReviewed);
            setAiSummary(summarizeCourseReviews(reviews, courseData?.name));
            setReviewsLoading(false);
        }

        // Teaming can load in background (not blocking the main view)
        loadTeaming(currentUser?.uid);
    };

    const loadTeaming = async (currentUserId?: string) => {
        setTeamingLoading(true);
        const data = await fetchTeamingRequests(id as string, currentUserId);
        setTeamingRequests(data);
        setTeamingLoading(false);
    };

    const organizedTeamingComments = React.useMemo(() => {
        const rootComments = teamingComments.filter(c => !c.parentCommentId);
        const replyMap: Record<string, TeamingComment[]> = {};

        teamingComments.forEach(c => {
            if (c.parentCommentId) {
                if (!replyMap[c.parentCommentId]) replyMap[c.parentCommentId] = [];
                replyMap[c.parentCommentId].push(c);
            }
        });

        return rootComments.map(root => ({
            ...root,
            replies: replyMap[root.id] || []
        }));
    }, [teamingComments]);

    const setupRealtime = () => {
        const channel = supabase
            .channel(roomId)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `course_id=eq.${id}`
            }, async (payload) => {
                // Fetch user info for the new message
                const { data: userData } = await supabase
                    .from('users')
                    .select('display_name, avatar_url, email')
                    .eq('id', payload.new.sender_id)
                    .single();

                const messageWithUser = {
                    ...payload.new,
                    users: normalizeChatUser(userData),
                };

                setMessages(prev => {
                    if (blockedUserIdsRef.current.includes(payload.new.sender_id)) {
                        return prev;
                    }
                    // Prevent duplicates if optimistic update already added it
                    if (prev.find(m => m.id === payload.new.id)) return prev;
                    return [...prev, messageWithUser];
                });
            })
            .on('postgres_changes', {
                event: 'DELETE',
                schema: 'public',
                table: 'messages',
                filter: `course_id=eq.${id}`
            }, (payload) => {
                setMessages(prev => prev.filter(message => message.id !== payload.old.id));
            })
            .subscribe();
    };

    const handleSendMessage = async () => {
        if (!checkLogin(user)) return;
        if (!newMessage.trim()) return;
        try {
            ensureContentSafety(newMessage.trim(), '消息包含不符合社区规范的内容，请修改后再发送。');
        } catch (error: any) {
            Alert.alert('发送失败', error?.message || '消息内容不符合社区规范。');
            return;
        }

        const { error } = await supabase
            .from('messages')
            .insert({
                course_id: id as string,
                sender_id: user.uid,
                content: newMessage.trim()
            });

        if (error) {
            Alert.alert('Error', 'Failed to send message');
        } else {
            // Clear input immediately; the realtime subscription will add the message
            setNewMessage('');
            void refreshCourseActivity();
        }
    };

    const handleDeleteChatMessage = async (messageId: string) => {
        if (!user?.uid) return;

        const previousMessages = messages;
        setMessages(prev => prev.filter(msg => msg.id !== messageId));

        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', messageId)
            .eq('sender_id', user.uid);

        if (error) {
            console.error('Error deleting course chat message:', error);
            setMessages(previousMessages);
            Alert.alert(
                t('messages.recall_failed_title', '撤回失败'),
                t('messages.recall_failed_msg', '请稍后再试。'),
            );
        }
    };

    const handleReportCourseMessage = async (messageId: string, targetAuthorId: string, reason: ReportReason) => {
        if (!user?.uid) return;

        try {
            await reportContent({
                reporterId: user.uid,
                targetId: messageId,
                targetType: 'course_message',
                targetAuthorId,
                reason,
            });
            Alert.alert(
                t('moderation.ugc_reported_title', '已举报'),
                t('moderation.ugc_reported_msg', '感谢你帮助维护社区安全。我们将核实此内容。'),
            );
        } catch (error) {
            console.error('Error reporting course chat message:', error);
            Alert.alert(
                t('common.error', '错误'),
                t('moderation.ugc_report_failed', '举报失败，请稍后再试。'),
            );
        }
    };

    const openCourseChatMessageActions = (msg: any) => {
        const copyText = String(msg.content || '').trim();
        const isOwnMessage = msg.sender_id === user?.uid;

        const actions: Array<{ text: string; onPress?: () => void; style?: 'default' | 'cancel' | 'destructive' }> = [
            {
                text: t('messages.action_copy', '复制'),
                onPress: () => {
                    Clipboard.setStringAsync(copyText).then(() => {
                        Alert.alert(
                            t('moderation.ugc_copied_title', '已复制'),
                            t('moderation.ugc_copied_msg', '内容已复制到剪贴板。'),
                        );
                    }).catch((error) => {
                        console.error('Error copying course chat message:', error);
                        Alert.alert(
                            t('moderation.ugc_copy_failed_title', '复制失败'),
                            t('moderation.ugc_copy_failed_msg', '请稍后再试。'),
                        );
                    });
                },
            },
            {
                text: t('messages.action_report', '举报'),
                onPress: () => {
                    Alert.alert(
                        t('moderation.ugc_report_title', '举报内容'),
                        t('moderation.ugc_report_desc', '你为什么要举报这个内容？'),
                        [
                            ...REPORT_REASONS.map((reason) => ({
                                text: reason.label,
                                onPress: () => { void handleReportCourseMessage(msg.id, msg.sender_id, reason.value); },
                            })),
                            { text: t('common.cancel', '取消'), style: 'cancel' as const },
                        ],
                    );
                },
            },
        ];

        if (!isOwnMessage && msg.sender_id && user?.uid) {
            actions.push({
                text: t('moderation.block_user', '屏蔽用户'),
                style: 'destructive',
                onPress: () => {
                    Alert.alert(
                        t('moderation.block_title', '屏蔽用户'),
                        t('courses.course_chat_block_msg', '屏蔽后你将不再看到该用户在本课程聊天室中的消息。'),
                        [
                            { text: t('common.cancel', '取消'), style: 'cancel' },
                            {
                                text: t('moderation.block_confirm', '屏蔽'),
                                style: 'destructive',
                                onPress: async () => {
                                    try {
                                        await blockUser(user.uid, msg.sender_id, {
                                            source: 'course_chat',
                                            reason: 'abusive_user',
                                        });
                                        setBlockedUserIds((prev) => prev.includes(msg.sender_id) ? prev : [...prev, msg.sender_id]);
                                        setMessages((prev) => prev.filter((message) => message.sender_id !== msg.sender_id));
                                        Alert.alert(
                                            t('common.success', '成功'),
                                            t('courses.course_chat_blocked_msg', '该用户消息已从当前列表隐藏。'),
                                        );
                                    } catch (error) {
                                        console.error('Error blocking course chat user:', error);
                                        Alert.alert(
                                            t('common.error', '错误'),
                                            t('moderation.ugc_block_failed', '屏蔽失败，请稍后再试。'),
                                        );
                                    }
                                },
                            },
                        ],
                    );
                },
            });
        }

        if (isOwnMessage) {
            actions.push({
                text: t('messages.action_recall', '撤回'),
                style: 'destructive',
                onPress: () => {
                    Alert.alert(
                        t('messages.recall_title', '撤回消息'),
                        t('messages.recall_confirm', '确定撤回这条消息吗？撤回即删除消息。'),
                        [
                            { text: t('common.cancel', '取消'), style: 'cancel' },
                            {
                                text: t('messages.recall_action', '撤回'),
                                style: 'destructive',
                                onPress: () => { void handleDeleteChatMessage(msg.id); },
                            },
                        ],
                    );
                },
            });
        }

        actions.push({ text: t('common.cancel', '取消'), style: 'cancel' });
        Alert.alert(
            t('messages.action_sheet_title', '消息操作'),
            t('messages.action_sheet_desc', '请选择操作'),
            actions,
        );
    };

    const handleAddReview = async () => {
        if (!checkLogin(user)) return;

        if (!hasReviewed && rating === 0) {
            Alert.alert('Error', 'Please provide a star rating for your first evaluation of this course.');
            return;
        }

        if (!reviewContent.trim()) {
            Alert.alert('Error', 'Please provide some comments about the course.');
            return;
        }

        const isPlaceholderCourse = id === '1';

        if (isPlaceholderCourse) {
            Alert.alert('Unavailable', 'Reviews are not available for this course yet. Please add the course from the "Add Course" menu first.');
            return;
        }

        const reviewData: Partial<Review> = {
            courseId: id as string,
            authorId: user.uid,
            authorName: isAnonymous ? '匿名同学' : (user.displayName || 'Anonymous'),
            authorAvatar: isAnonymous ? '👤' : (user.avatarUrl || '👤'),
            rating: rating > 0 ? rating : undefined,
            difficulty: difficulty > 0 ? difficulty : 3,
            workload: workload > 0 ? workload : undefined,
            grading: grading > 0 ? grading : undefined,
            tags: reviewTags,
            content: reviewContent.trim(),
            semester: '2025 Spring',
            isAnonymous: isAnonymous
        };

        const { error } = await addReview(reviewData);

        if (error) {
            Alert.alert('Error', `Failed to post review: ${error.message || 'Unknown error'}`);
            console.error('Add review UI error:', error);
        } else {
            // Optimistic update — show review immediately without waiting for a full reload
            const newReviewObj: Review = {
                id: `temp_${Date.now()}`,
                courseId: id as string,
                authorId: user.uid,
                authorName: user.displayName || 'Me',
                authorAvatar: user.avatarUrl || '👤',
                rating: rating > 0 ? rating : undefined,
                difficulty: difficulty > 0 ? difficulty : 3,
                workload: workload > 0 ? workload : undefined,
                grading: grading > 0 ? grading : undefined,
                content: reviewContent.trim(),
                tags: reviewTags,
                likes: 0,
                createdAt: new Date(),
                semester: '2025 Spring'
            };
            setReviews(prev => [newReviewObj, ...prev]);
            if (rating > 0) setHasReviewed(true);

            const wasFirstReview = !hasReviewed;
            setModalVisible(false);
            setRating(0);
            setDifficulty(0);
            setWorkload(0);
            setGrading(0);
            setReviewTags([]);
            setReviewContent('');
            setIsAnonymous(false);

            // Celebratory feedback instead of a flat system alert.
            setSuccessOverlay({
                visible: true,
                isFirst: wasFirstReview,
                helpedCount: reviews.length + 1,
            });

            // This course is now reviewed — drop it from the user's pending nudges.
            void refreshScheduleReviewPrompts();

            // Silent background refresh to replace temp entry with real DB row
            getReviewsAndHasReviewed(id as string, user.uid, course?.code).then(({ reviews, hasReviewed }) => {
                setReviews(reviews);
                setHasReviewed(hasReviewed);
                setAiSummary(summarizeCourseReviews(reviews, course?.name));
                void refreshCourseActivity();
            }).catch(() => { });
        }
    };

    const handleLike = async (reviewId: string) => {
        if (!checkLogin(user)) return;

        const isCurrentlyLiked = likedReviewIds.includes(reviewId);

        // Optimistic update
        setReviews(prev => prev.map(r =>
            r.id === reviewId ? { ...r, likes: isCurrentlyLiked ? Math.max(0, (r.likes || 0) - 1) : (r.likes || 0) + 1 } : r
        ));

        let newLikedIds;
        if (isCurrentlyLiked) {
            newLikedIds = likedReviewIds.filter(id => id !== reviewId);
        } else {
            newLikedIds = [...likedReviewIds, reviewId];
        }

        setLikedReviewIds(newLikedIds);

        try {
            await storage.setItem('hkcampus_liked_reviews', JSON.stringify(newLikedIds));
        } catch (e) {
            console.error('Error saving like status:', e);
        }

        const { error } = await likeReview(reviewId, id as string, isCurrentlyLiked);
        if (error) {
            console.error('Like error:', error);
        }
    };

    const handleDeleteReview = (review: Review) => {
        if (!user || review.authorId !== user.uid) return;

        Alert.alert('Delete Review', 'Are you sure you want to delete this review?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    const { error } = await deleteReview(review.id, user.uid, id as string);
                    if (error) {
                        Alert.alert('Error', `Failed to delete review: ${error.message || 'Unknown error'}`);
                        return;
                    }

                    setReviews(prev => prev.filter(r => r.id !== review.id));
                    setHasReviewed(false);
                    loadData();
                    void refreshCourseActivity();
                }
            }
        ]);
    };

    const handleDeleteTeaming = (teaming: CourseTeaming) => {
        if (!user) {
            // This should technically never happen for a guest seeing their own post
            // but for safety:
            if (!checkLogin(user)) return;
        }
        if (teaming.userId !== user.uid) return;

        Alert.alert('Delete Teaming Post', 'Are you sure you want to delete this teaming post?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    const { success, error } = await deleteTeamingRequest(teaming.id, user.uid);
                    if (!success) {
                        Alert.alert('Error', error || 'Failed to delete teaming post.');
                        return;
                    }

                    setTeamingRequests(prev => prev.filter(item => item.id !== teaming.id));
                    await loadTeaming(user?.uid);
                }
            }
        ]);
    };

    const handlePostTeaming = async () => {
        if (!checkLogin(user)) return;
        if (!teamingSection || selectedTeamingMethods.length === 0) {
            Alert.alert('Missing Info', 'Section and at least one contact method are required.');
            return;
        }

        setTeamingSubmitting(true);
        try {
            const contacts: ContactMethod[] = selectedTeamingMethods.map(p => ({
                platform: p,
                otherPlatformName: p === 'Other' ? teamingOtherPlatformName : undefined,
                value: teamingContactValues[p] || ''
            }));

            const { success, data, error } = await postTeamingRequest({
                courseId: id as string,
                userId: user.uid,
                userName: user.displayName || 'Anonymous',
                userAvatar: user.avatarUrl || '👤',
                userMajor: user.major || 'Student',
                section: teamingSection,
                selfIntro: teamingSelfIntro,
                targetTeammate: teamingTarget,
                contacts: contacts,
            });

            if (success && data) {
                setTeamingRequests(prev => [data, ...prev]);
                setIsTeamingModalVisible(false);
                resetTeamingForm();
                Alert.alert('Success', 'Teaming request posted!');
                void refreshCourseActivity();
            } else {
                Alert.alert('Error', error || 'Failed to post teaming request');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to post teaming request');
        } finally {
            setTeamingSubmitting(false);
        }
    };

    const resetTeamingForm = () => {
        setTeamingSection('');
        setTeamingSelfIntro('');
        setTeamingTarget('');
        setSelectedTeamingMethods([]);
        setTeamingContactValues({});
        setTeamingOtherPlatformName('');
    };

    const toggleTeamingMethod = (platform: ContactMethod['platform']) => {
        if (selectedTeamingMethods.includes(platform)) {
            setSelectedTeamingMethods(selectedTeamingMethods.filter(m => m !== platform));
        } else {
            setSelectedTeamingMethods([...selectedTeamingMethods, platform]);
        }
    };

    const handleLikeTeaming = async (teamingId: string) => {
        if (!checkLogin(user)) return;

        const isLiked = likedTeamingIds.includes(teamingId);
        setLikedTeamingIds(prev =>
            isLiked ? prev.filter(id => id !== teamingId) : [...prev, teamingId]
        );

        setTeamingRequests(prev => prev.map(req => {
            if (req.id === teamingId) {
                return { ...req, likes: isLiked ? req.likes - 1 : req.likes + 1 };
            }
            return req;
        }));

        const { success } = await toggleTeamingLike(teamingId, user.uid);
        if (!success) {
            setLikedTeamingIds(prev =>
                isLiked ? [...prev, teamingId] : prev.filter(id => id !== teamingId)
            );
            setTeamingRequests(prev => prev.map(req => {
                if (req.id === teamingId) {
                    return { ...req, likes: isLiked ? req.likes + 1 : req.likes - 1 };
                }
                return req;
            }));
        }
    };

    const handleOpenTeamingComments = async (teaming: CourseTeaming) => {
        setSelectedTeamingForComments(teaming);
        setIsTeamingCommentModalVisible(true);
        setTeamingCommentLoading(true);
        const comments = await fetchTeamingComments(teaming.id, user?.uid);
        setTeamingComments(comments);
        setTeamingCommentLoading(false);
    };

    const handleSendTeamingComment = async () => {
        if (!checkLogin(user)) return;
        if (!selectedTeamingForComments || !newTeamingComment.trim()) return;

        const { success, error } = await postTeamingComment(
            selectedTeamingForComments.id,
            user,
            newTeamingComment.trim(),
            teamingReplyTarget?.parentCommentId || teamingReplyTarget?.id,
            teamingReplyTarget?.authorName
        );
        if (success) {
            setNewTeamingComment('');
            setTeamingReplyTarget(null);
            const comments = await fetchTeamingComments(selectedTeamingForComments.id, user?.uid);
            setTeamingComments(comments);

            setTeamingRequests(prev => prev.map(req => {
                if (req.id === selectedTeamingForComments.id) {
                    return { ...req, commentCount: req.commentCount + 1 };
                }
                return req;
            }));
        } else {
            Alert.alert('Error', error || 'Failed to post comment.');
        }
    };

    const sortedReviews = [...reviews]
        .filter(r => filterTag == null || r.tags.includes(filterTag))
        .sort((a, b) => {
            if (sortBy === 'likes') {
                return (b.likes || 0) - (a.likes || 0);
            }
            return b.createdAt.getTime() - a.createdAt.getTime();
        });

    const topLikedId = reviews.length > 0
        ? [...reviews].sort((a, b) => (b.likes || 0) - (a.likes || 0))[0]?.id
        : null;

    const allReviewTags = Array.from(new Set(reviews.flatMap(r => r.tags))).filter(Boolean);

    // ── Build payloads for the shareable card ────────────────────────────
    const buildCoursePayload = (): ShareCardPayload | null => {
        if (!course) return null;
        const rated = reviews.filter(r => r.rating);
        const avg = rated.length > 0 ? rated.reduce((s, r) => s + r.rating!, 0) / rated.length : 0;
        const diffReviews = reviews.filter(r => r.difficulty > 0);
        const avgDiff = diffReviews.length > 0
            ? diffReviews.reduce((s, r) => s + r.difficulty, 0) / diffReviews.length
            : 0;
        // Feature the most-liked review, falling back to the first with content.
        const featured = reviews.find(r => r.id === topLikedId && r.content?.trim())
            || reviews.find(r => r.content?.trim())
            || null;
        return {
            variant: 'course',
            course: { code: course.code, name: course.name, department: course.department, credits: course.credits },
            avgRating: avg,
            reviewCount: reviews.length,
            avgDifficulty: avgDiff,
            tags: allReviewTags.slice(0, 3),
            quote: featured
                ? { text: featured.content, author: featured.isAnonymous ? t('courses.live_reviews_anon') : featured.authorName }
                : null,
        };
    };

    const buildReviewPayload = (item: Review): ShareCardPayload | null => {
        if (!course) return null;
        return {
            variant: 'review',
            course: { code: course.code, name: course.name, department: course.department },
            review: {
                content: item.content,
                rating: item.rating,
                author: item.isAnonymous ? t('courses.live_reviews_anon') : item.authorName,
            },
        };
    };

    // Helper: rating → left-bar color
    const ratingBarColor = (rating?: number) => {
        if (!rating) return '#D1D5DB';
        if (rating >= 4) return '#2563EB';
        if (rating === 3) return '#2563EB';
        return '#F59E0B';
    };

    const renderReviewItem = ({ item }: { item: Review }) => (
        <Animated.View
            style={[
                styles.reviewCard,
                ugcActions.getHighlightStyle(item.id),
            ]}
        >
            <TouchableOpacity
                activeOpacity={0.96}
                onLongPress={() => ugcActions.openActions({
                    id: item.id,
                    targetId: item.id,
                    targetType: 'course_review',
                    content: item.content,
                    authorId: item.isAnonymous ? undefined : item.authorId,
                    authorName: item.authorName,
                    isAnonymous: item.isAnonymous,
                })}
            >
            {item.id === topLikedId && item.likes > 0 && (
                <View style={styles.topBadge}>
                    <Text style={styles.topBadgeText}>🏆 最有用</Text>
                </View>
            )}
            <View style={styles.reviewHeader}>
                <View style={styles.authorInfo}>
                    <View style={styles.avatarContainer}>
                        {isRemoteImageUrl(item.authorAvatar) ? (
                            <CachedRemoteImage uri={item.authorAvatar} style={styles.avatarImage} />
                        ) : (
                            <Text style={styles.avatarFallbackText}>{item.authorAvatar || '👤'}</Text>
                        )}
                    </View>
                    <View>
                        <View style={styles.nameRow}>
                            <Text style={styles.authorName}>{item.authorName}</Text>
                            <EduBadge shouldShow={isHKBUEmail(item.authorEmail)} size="small" />
                        </View>
                        <Text style={styles.semester}>{item.semester}</Text>
                    </View>
                </View>
                {item.rating ? (
                    <StarRating rating={item.rating} size={12} gap={2} />
                ) : null}
            </View>

            <TranslatableText style={styles.reviewContent} text={item.content} />

            <View style={styles.tagsContainer}>
                {item.difficulty > 0 && (
                    <View style={[styles.tag, styles.difficultyTag]}>
                        <Text style={styles.tagText}>难度 {item.difficulty}/5</Text>
                    </View>
                )}
                {item.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.reviewFooter}>
                <Text style={styles.date}>{item.createdAt.toLocaleDateString()}</Text>
                <View style={styles.reviewActions}>
                    <TouchableOpacity
                        style={styles.likeButton}
                        onPress={() => handleLike(item.id)}
                    >
                        <ThumbsUp
                            size={14}
                            color={likedReviewIds.includes(item.id) ? "#2563EB" : "#6B7280"}
                            fill={likedReviewIds.includes(item.id) ? "#2563EB" : "transparent"}
                        />
                        <Text style={[
                            styles.likeCount,
                            likedReviewIds.includes(item.id) && { color: '#2563EB', fontWeight: 'bold' }
                        ]}>
                            {item.likes}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.shareReviewBtn}
                        onPress={() => setShareTarget(buildReviewPayload(item))}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Share2 size={14} color="#6B7280" />
                    </TouchableOpacity>
                    {user && item.authorId === user.uid && (
                        <TouchableOpacity style={styles.deleteTag} onPress={() => handleDeleteReview(item)}>
                            <Trash2 size={14} color="#EF4444" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            </TouchableOpacity>
        </Animated.View>
    );

    const renderTeamingItem = ({ item }: { item: CourseTeaming }) => (
        <Animated.View style={[styles.teamingCard, ugcActions.getHighlightStyle(item.id)]}>
            <TouchableOpacity
                activeOpacity={0.97}
                onLongPress={() => ugcActions.openActions({
                    id: item.id,
                    targetId: item.id,
                    targetType: 'teaming_post',
                    content: [item.selfIntro, item.targetTeammate].filter(Boolean).join('\n'),
                    authorId: item.userId,
                    authorName: item.userName,
                })}
            >
            <View style={styles.teamingHeader}>
                <View style={styles.authorInfo}>
                    <View style={styles.avatarContainer}>
                        {isRemoteImageUrl(item.userAvatar) ? (
                            <CachedRemoteImage uri={item.userAvatar} style={styles.avatarImage} />
                        ) : (
                            <Text style={styles.avatarFallbackText}>{item.userAvatar || '👤'}</Text>
                        )}
                    </View>
                    <View>
                        <View style={styles.nameRow}>
                            <Text style={styles.authorName}>{item.userName}</Text>
                            <EduBadge shouldShow={isHKBUEmail(item.userEmail)} size="small" />
                        </View>
                        <Text style={styles.userMajor}>{item.userMajor || 'Student'}</Text>
                    </View>
                </View>
                <View style={[styles.sectionBadge, { backgroundColor: '#EFF6FF' }]}>
                    <Users size={12} color="#2563EB" />
                    <Text style={styles.sectionBadgeText}>{item.section}</Text>
                </View>
            </View>

            {item.selfIntro && (
                <View style={styles.teamingDetailBox}>
                    <Text style={styles.detailTitle}>About Me:</Text>
                    <TranslatableText style={styles.detailBody} text={item.selfIntro} />
                </View>
            )}

            {item.targetTeammate && (
                <View style={[styles.teamingDetailBox, { backgroundColor: '#F0FDF4' }]}>
                    <Text style={[styles.detailTitle, { color: '#374151' }]}>Looking for:</Text>
                    <TranslatableText style={[styles.detailBody, { color: '#374151' }]} text={item.targetTeammate} />
                </View>
            )}

            <View style={styles.teamingFooter}>
                <View style={styles.teamingStats}>
                    <TouchableOpacity
                        style={styles.teamingStatItem}
                        onPress={() => handleLikeTeaming(item.id)}
                    >
                        <ThumbsUp
                            size={14}
                            color={likedTeamingIds.includes(item.id) ? "#2563EB" : "#6B7280"}
                            fill={likedTeamingIds.includes(item.id) ? "#2563EB" : "transparent"}
                        />
                        <Text style={[
                            styles.teamingStatText,
                            likedTeamingIds.includes(item.id) && { color: '#2563EB', fontWeight: '600' }
                        ]}>{item.likes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.teamingStatItem}
                        onPress={() => handleOpenTeamingComments(item)}
                    >
                        <MessageSquare size={14} color="#6B7280" />
                        <Text style={styles.teamingStatText}>{item.commentCount}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.teamingRightActions}>
                    {item.userId === user?.uid && (
                        <TouchableOpacity style={styles.deleteTag} onPress={() => handleDeleteTeaming(item)}>
                            <Trash2 size={12} color="#B91C1C" />
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={styles.contactIconBtn}
                        onPress={() => {
                            if (checkLogin(user)) {
                                setSelectedTeamingContact(item);
                            }
                        }}
                    >
                        <Send size={14} color="#fff" />
                        <Text style={styles.contactIconBtnText}>Contact</Text>
                    </TouchableOpacity>
                </View>
            </View>
            </TouchableOpacity>
        </Animated.View>
    );

    if (!course) return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <ChevronLeft size={24} color="#fff" />
                </TouchableOpacity>
                <View style={[styles.skeletonLine, { width: 100, height: 14, backgroundColor: 'rgba(255,255,255,0.3)' }]} />
                <View style={{ width: 32 }} />
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.courseInfoFlat, { gap: 10 }]}>
                    <View style={[styles.skeletonLine, { width: '30%', height: 12 }]} />
                    <View style={[styles.skeletonLine, { width: '85%', height: 22 }]} />
                    <View style={[styles.skeletonLine, { width: '50%', height: 12 }]} />
                </View>
                <View style={[styles.tabBar, { paddingHorizontal: 20, gap: 24 }]}>
                    {[80, 80, 80].map((w, i) => (
                        <View key={i} style={[styles.skeletonLine, { width: w, height: 12, marginVertical: 16 }]} />
                    ))}
                </View>
                <View style={styles.reviewsSkeletonWrap}>
                    {[0, 1, 2, 3].map(i => (
                        <View key={i} style={styles.reviewSkeleton}>
                            <View style={styles.skeletonAvatar} />
                            <View style={styles.skeletonLines}>
                                <View style={[styles.skeletonLine, { width: '40%' }]} />
                                <View style={[styles.skeletonLine, { width: '80%', marginTop: 8 }]} />
                                <View style={[styles.skeletonLine, { width: '60%', marginTop: 6 }]} />
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
        </TouchableWithoutFeedback>
    );

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => {
                    if (router.canGoBack()) {
                        router.back();
                    } else {
                        router.replace('/(tabs)/course');
                    }
                }}>
                    <ChevronLeft size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{course.code}</Text>
                <TouchableOpacity
                    style={styles.headerShareButton}
                    onPress={() => setShareTarget(buildCoursePayload())}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Share2 size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Course Info Flat */}
                    <View style={styles.courseInfoFlat}>
                        {!!course.department && (
                            <Text style={styles.courseDeptText} numberOfLines={1}>{course.department}</Text>
                        )}
                        <Text style={styles.courseNameLarge}>{course.name}</Text>
                        <View style={styles.courseMetaRow}>
                            {(() => {
                                const ratedReviews = reviews.filter(r => r.rating);
                                const avg = ratedReviews.length > 0
                                    ? ratedReviews.reduce((s, r) => s + r.rating!, 0) / ratedReviews.length
                                    : 0;
                                if (avg === 0) return null;
                                return (
                                    <>
                                        <StarRating rating={avg} size={13} gap={2} />
                                        <Text style={styles.courseMetaText}>{avg.toFixed(1)}</Text>
                                        <Text style={styles.courseMetaDot}>·</Text>
                                    </>
                                );
                            })()}
                            <Text style={styles.courseMetaText}>{reviews.length} 条评价</Text>
                            <Text style={styles.courseMetaDot}>·</Text>
                            <Text style={styles.courseMetaText}>{course.credits} 学分</Text>
                        </View>
                    </View>

                    {/* Tabs */}
                    <View style={styles.tabBar}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
                            onPress={() => setActiveTab('reviews')}
                        >
                            {!!courseUnread?.reviews && <View style={styles.tabUnreadDot} />}
                            <MessageSquare size={18} color={activeTab === 'reviews' ? '#0F172A' : '#6B7280'} />
                            <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>Reviews</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'chat' && styles.activeTab]}
                            onPress={() => setActiveTab('chat')}
                        >
                            {!!courseUnread?.chat && <View style={styles.tabUnreadDot} />}
                            <MessageCircle size={18} color={activeTab === 'chat' ? '#0F172A' : '#6B7280'} />
                            <Text style={[styles.tabText, activeTab === 'chat' && styles.activeTabText]}>Chatroom</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'teaming' && styles.activeTab]}
                            onPress={() => setActiveTab('teaming')}
                        >
                            {!!courseUnread?.teaming && <View style={styles.tabUnreadDot} />}
                            <UserPlus size={18} color={activeTab === 'teaming' ? '#0F172A' : '#6B7280'} />
                            <Text style={[styles.tabText, activeTab === 'teaming' && styles.activeTabText]}>Teaming</Text>
                        </TouchableOpacity>
                    </View>

                    {activeTab === 'reviews' ? (
                        <>
                            {/* Reviews top bar: stat text + write button */}
                            {(() => {
                                const ratedReviews = reviews.filter(r => r.rating);
                                const avgRating = ratedReviews.length > 0
                                    ? ratedReviews.reduce((s, r) => s + r.rating!, 0) / ratedReviews.length
                                    : 0;
                                const diffReviews = reviews.filter(r => r.difficulty > 0);
                                const avgDiff = diffReviews.length > 0
                                    ? diffReviews.reduce((s, r) => s + r.difficulty, 0) / diffReviews.length
                                    : 0;
                                const statParts: string[] = [];
                                statParts.push(`${reviews.length} 条评价`);
                                if (avgRating > 0) statParts.push(`★ ${avgRating.toFixed(1)}`);
                                if (avgDiff > 0) statParts.push(`难度 ${avgDiff.toFixed(1)}`);
                                return (
                                    <View style={styles.reviewsTopBar}>
                                        <Text style={styles.reviewsStatLine}>{statParts.join(' · ')}</Text>
                                        <TouchableOpacity style={styles.writeButton} onPress={() => setModalVisible(true)}>
                                            <Plus size={14} color="#fff" />
                                            <Text style={styles.writeButtonText}>写评价</Text>
                                            {!hasReviewed && (
                                                <View style={styles.pointsBadge}>
                                                    <Text style={styles.pointsBadgeText}>+15</Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                );
                            })()}

                            {/* AI Summary as blockquote */}
                            {!!aiSummary && (
                                <View style={styles.aiSummaryBlock}>
                                    <Text style={styles.aiSummaryQuote}>{aiSummary}</Text>
                                </View>
                            )}

                            {/* Schedule-aware nudge: this course is in the user's
                                timetable but they haven't reviewed it yet. The
                                empty state below already prompts when there are
                                no reviews, so only show this when reviews exist. */}
                            {courseInSchedule && !hasReviewed && !reviewsLoading && reviews.length > 0 && (
                                <TouchableOpacity
                                    style={styles.scheduleNudge}
                                    activeOpacity={0.9}
                                    onPress={() => setModalVisible(true)}
                                >
                                    <CalendarCheck size={20} color="#1D4ED8" />
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.scheduleNudgeTitle}>
                                            {t('courses.schedule_nudge_title', { code: course.code, defaultValue: '你这学期在上 {{code}}' })}
                                        </Text>
                                        <Text style={styles.scheduleNudgeDesc}>
                                            {t('courses.schedule_nudge_desc', '你的亲身体验最有参考价值，写两句帮学弟学妹避坑吧')}
                                        </Text>
                                    </View>
                                    <View style={styles.scheduleNudgeBtn}>
                                        <Text style={styles.scheduleNudgeBtnText}>{t('courses.schedule_nudge_action', '写评价')}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}

                            {/* Combined filter row: sort chips + separator + tag chips */}
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.filterRow}
                                contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingVertical: 10, alignItems: 'center' }}
                            >
                                <TouchableOpacity
                                    onPress={() => setSortBy('newest')}
                                    style={styles.sortChip}
                                >
                                    <Text style={[styles.sortChipText, sortBy === 'newest' && styles.sortChipTextActive]}>最新</Text>
                                    {sortBy === 'newest' && <View style={styles.sortChipUnderline} />}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setSortBy('likes')}
                                    style={styles.sortChip}
                                >
                                    <Text style={[styles.sortChipText, sortBy === 'likes' && styles.sortChipTextActive]}>最热</Text>
                                    {sortBy === 'likes' && <View style={styles.sortChipUnderline} />}
                                </TouchableOpacity>
                                <View style={styles.filterSep} />
                                <TouchableOpacity
                                    onPress={() => setFilterTag(null)}
                                    style={[styles.filterChip, filterTag == null && styles.filterChipActive]}
                                >
                                    <Text style={[styles.filterChipText, filterTag == null && styles.filterChipTextActive]}>全部</Text>
                                </TouchableOpacity>
                                {allReviewTags.map(tag => (
                                    <TouchableOpacity
                                        key={tag}
                                        onPress={() => setFilterTag(filterTag === tag ? null : tag)}
                                        style={[styles.filterChip, filterTag === tag && styles.filterChipActive]}
                                    >
                                        <Text style={[styles.filterChipText, filterTag === tag && styles.filterChipTextActive]}>{tag}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {reviewsLoading ? (
                                <View style={styles.reviewsSkeletonWrap}>
                                    {[0, 1, 2].map(i => (
                                        <View key={i} style={styles.reviewSkeleton}>
                                            <View style={styles.skeletonAvatar} />
                                            <View style={styles.skeletonLines}>
                                                <View style={[styles.skeletonLine, { width: '40%' }]} />
                                                <View style={[styles.skeletonLine, { width: '80%', marginTop: 8 }]} />
                                                <View style={[styles.skeletonLine, { width: '60%', marginTop: 6 }]} />
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            ) : sortedReviews.length === 0 ? (
                                <View style={styles.emptyCtaCard}>
                                    <Text style={styles.emptyCtaEmoji}>{courseInSchedule ? '📅' : '📝'}</Text>
                                    <Text style={styles.emptyCtaTitle}>
                                        {courseInSchedule
                                            ? t('courses.empty_cta_title_schedule', '你这学期在上这门课')
                                            : t('courses.empty_cta_title', '成为第一个点评的人')}
                                    </Text>
                                    <Text style={styles.emptyCtaDesc}>
                                        {courseInSchedule
                                            ? t('courses.empty_cta_desc_schedule', '你的亲身体验最有参考价值，花 30 秒点评一下，还能领 +15 积分')
                                            : t('courses.empty_cta_desc', '分享你的上课体验，帮助学弟学妹做决定')}
                                    </Text>
                                    <TouchableOpacity style={styles.emptyCtaButton} onPress={() => setModalVisible(true)}>
                                        <Text style={styles.emptyCtaButtonText}>{t('courses.empty_cta_button', '写评价 · 领 +15 积分')}</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                sortedReviews.map(review => (
                                    <View key={review.id}>
                                        {renderReviewItem({ item: review })}
                                    </View>
                                ))
                            )}
                        </>
                    ) : activeTab === 'chat' ? (
                        <View style={styles.chatContainer}>
                            {messages.length === 0 ? (
                                <View style={styles.emptyContainer}>
                                    <MessageCircle size={48} color="#D1D5DB" />
                                    <Text style={styles.emptyText}>No messages yet. Be the first!</Text>
                                </View>
                            ) : (
                                messages.map((msg, index) => (
                                    <View key={msg.id || index} style={[
                                        styles.messageRow,
                                        msg.sender_id === user?.uid ? styles.myMessageRow : styles.otherMessageRow
                                    ]}>
                                        {msg.sender_id !== user?.uid && (
                                            isRemoteImageUrl(msg.users?.avatar_url) ? (
                                                <CachedRemoteImage uri={msg.users.avatar_url} style={styles.chatAvatarImage} />
                                            ) : (
                                                <View style={styles.chatAvatarFallback}>
                                                    <Text style={styles.chatAvatarFallbackText}>👤</Text>
                                                </View>
                                            )
                                        )}
                                        <TouchableOpacity
                                            activeOpacity={0.9}
                                            onLongPress={() => openCourseChatMessageActions(msg)}
                                            style={[
                                                styles.messageBubble,
                                                msg.sender_id === user?.uid ? styles.myBubble : styles.otherBubble
                                            ]}
                                        >
                                            <View style={styles.messageAuthorRow}>
                                                <Text style={msg.sender_id === user?.uid ? styles.myMessageAuthor : styles.messageAuthor}>
                                                    {msg.users?.display_name || 'Student'}
                                                </Text>
                                                {isHKBUEmail(msg.users?.email) && (
                                                    <View style={styles.chatEduStarBadge}>
                                                        <Text style={styles.chatEduStarText}>Edu</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <Text style={msg.sender_id === user?.uid ? styles.myMessageText : styles.messageText}>
                                                {msg.content}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                ))
                            )}
                        </View>
                    ) : (
                        <View style={styles.teamingContainer}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Partners Wanted</Text>
                                <TouchableOpacity
                                    style={styles.writeButton}
                                    onPress={() => setIsTeamingModalVisible(true)}
                                >
                                    <Plus size={16} color="#fff" />
                                    <Text style={styles.writeButtonText}>New Post</Text>
                                </TouchableOpacity>
                            </View>

                            {teamingLoading ? (
                                <ActivityIndicator style={{ marginTop: 20 }} color="#2563EB" />
                            ) : teamingRequests.length === 0 ? (
                                <View style={styles.emptyContainer}>
                                    <Users size={48} color="#D1D5DB" />
                                    <Text style={styles.emptyText}>No teaming posts yet. Be the first!</Text>
                                </View>
                            ) : (
                                teamingRequests.map(item => (
                                    <View key={item.id} style={{ marginBottom: 16 }}>
                                        {renderTeamingItem({ item })}
                                    </View>
                                ))
                            )}
                        </View>
                    )}
                </ScrollView>

                {
                    activeTab === 'chat' && (
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
                        >
                            <View style={styles.inputBar}>
                                <TextInput
                                    style={styles.chatInput}
                                    placeholder="Group chat with classmates..."
                                    value={newMessage}
                                    onChangeText={setNewMessage}
                                    multiline
                                />
                                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                                    <Send size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    )
                }
            </View >

            {/* Write Review Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={{ flex: 1 }}>
                    <Pressable
                        style={[styles.modalOverlay, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }]}
                        onPress={() => setModalVisible(false)}
                    />
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1, justifyContent: 'flex-end' }}
                        pointerEvents="box-none"
                    >
                        <View style={[styles.modalContent, { maxHeight: '90%' }]}>
                            <ScrollView
                                bounces={false}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 100 }}
                                keyboardDismissMode="on-drag"
                                keyboardShouldPersistTaps="handled"
                            >
                                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                                <View>
                                    <View style={styles.modalHeader}>
                                        <View>
                                            <Text style={styles.modalTitle}>{hasReviewed ? '更新评价' : '写课程评价'}</Text>
                                            {!hasReviewed && (
                                                <Text style={{ fontSize: 12, color: '#2563EB', fontWeight: '600', marginTop: 2 }}>填完即得 +15 积分</Text>
                                            )}
                                        </View>
                                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                                            <X size={24} color="#6B7280" />
                                        </TouchableOpacity>
                                    </View>

                                    {hasReviewed && (
                                        <View style={styles.hintBox}>
                                            <MessageCircle size={16} color="#2563EB" />
                                            <Text style={styles.hintText}>
                                                更新评价？星级可不填。闲聊请去 <Text style={{ fontWeight: 'bold' }}>Chatroom</Text> 频道！
                                            </Text>
                                        </View>
                                    )}

                                    {/* Rating Stars */}
                                    <Text style={styles.label}>综合评分{hasReviewed ? ' (可选)' : ''}</Text>
                                    <View style={styles.starsContainer}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                                <Star
                                                    size={32}
                                                    color={rating >= star ? "#F59E0B" : "#E5E7EB"}
                                                    fill={rating >= star ? "#F59E0B" : "transparent"}
                                                />
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    {/* Difficulty */}
                                    <Text style={styles.label}>难度 <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '400' }}>(1=轻松  5=困难)</Text></Text>
                                    <View style={styles.starsContainer}>
                                        {[1, 2, 3, 4, 5].map((level) => (
                                            <TouchableOpacity
                                                key={level}
                                                style={[
                                                    styles.diffButton,
                                                    difficulty === level && styles.diffButtonActive
                                                ]}
                                                onPress={() => setDifficulty(level)}
                                            >
                                                <Text style={[
                                                    styles.diffText,
                                                    difficulty === level && styles.diffTextActive
                                                ]}>{level}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    {/* Tags */}
                                    <Text style={styles.label}>标签 <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '400' }}>(最多选 3 个)</Text></Text>
                                    <View style={styles.reviewTagsContainer}>
                                        {(['Chill课', '给分高', '点名严', '作业多', '要小组', '干货多', '水课', '考试难', '实用', '讲解清晰'] as const).map((tag) => (
                                            <TouchableOpacity
                                                key={tag}
                                                onPress={() => setReviewTags(prev =>
                                                    prev.includes(tag)
                                                        ? prev.filter(t => t !== tag)
                                                        : prev.length < 3 ? [...prev, tag] : prev
                                                )}
                                                style={[
                                                    styles.reviewTagItem,
                                                    reviewTags.includes(tag) && styles.reviewTagItemActive,
                                                ]}
                                            >
                                                <Text style={[
                                                    styles.reviewTagText,
                                                    reviewTags.includes(tag) && styles.reviewTagTextActive,
                                                ]}>{tag}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    {/* Comment */}
                                    <Text style={styles.label}>{hasReviewed ? '补充内容' : '评价内容'}</Text>
                                    <TextInput
                                        style={styles.input}
                                        multiline
                                        numberOfLines={4}
                                        placeholder={hasReviewed ? "继续分享你的上课体验..." : "分享你的上课体验，帮帮学弟学妹..."}
                                        value={reviewContent}
                                        onChangeText={setReviewContent}
                                        textAlignVertical="top"
                                    />

                                    {/* Anonymous Option */}
                                    <TouchableOpacity 
                                        style={styles.anonymousToggle}
                                        onPress={() => setIsAnonymous(!isAnonymous)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[
                                            styles.checkbox,
                                            isAnonymous && styles.checkboxActive
                                        ]}>
                                            {isAnonymous && (
                                                <Check size={16} color="#fff" />
                                            )}
                                        </View>
                                        <Text style={styles.anonymousText}>匿名发布</Text>
                                    </TouchableOpacity>

                                    <SafetyNotice variant="compact" showAnonymousWarning={isAnonymous} />

                                    <TouchableOpacity style={styles.submitButton} onPress={handleAddReview}>
                                        <Text style={styles.submitText}>{hasReviewed ? '发布更新' : '发布评价'}</Text>
                                    </TouchableOpacity>
                                </View>
                                </TouchableWithoutFeedback>
                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

            {/* Shareable card sheet (course or single review) */}
            <ShareCardSheet
                visible={!!shareTarget}
                payload={shareTarget}
                onClose={() => setShareTarget(null)}
            />

            {/* Post Teaming Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isTeamingModalVisible}
                onRequestClose={() => setIsTeamingModalVisible(false)}
            >
                <View style={{ flex: 1 }}>
                    <Pressable
                        style={[styles.modalOverlay, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }]}
                        onPress={() => setIsTeamingModalVisible(false)}
                    />
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                        style={{ flex: 1, justifyContent: 'flex-end' }}
                        pointerEvents="box-none"
                    >
                        <View style={[styles.modalContent, { maxHeight: '95%' }]}>
                            <ScrollView
                                bounces={false}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 100 }}
                                keyboardDismissMode="interactive"
                                keyboardShouldPersistTaps="handled"
                            >
                                <TouchableOpacity activeOpacity={1}>
                                    <View style={styles.modalHeader}>
                                        <View>
                                            <Text style={styles.modalTitle}>Find Partners</Text>
                                            <Text style={styles.modalSubtitle}>{course?.code}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => setIsTeamingModalVisible(false)}>
                                            <X size={24} color="#000" />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.hintBox}>
                                        <Info size={16} color="#2563EB" />
                                        <Text style={styles.hintText}>
                                            Finding group mates for projects? Share your info here!
                                        </Text>
                                    </View>

                                    <Text style={styles.label}>Which Section? (Required)</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="e.g. Sec1, Sec2..."
                                        value={teamingSection}
                                        onChangeText={setTeamingSection}
                                    />

                                    <Text style={styles.label}>Self Introduction (Optional)</Text>
                                    <TextInput
                                        style={[styles.input, { height: 80 }]}
                                        multiline
                                        placeholder="Proficient in Python? Good at UX?"
                                        value={teamingSelfIntro}
                                        onChangeText={setTeamingSelfIntro}
                                        textAlignVertical="top"
                                    />

                                    <Text style={styles.label}>Looking for? (Optional)</Text>
                                    <TextInput
                                        style={[styles.input, { height: 80 }]}
                                        multiline
                                        placeholder="A frontend dev? A team leader?"
                                        value={teamingTarget}
                                        onChangeText={setTeamingTarget}
                                        textAlignVertical="top"
                                    />

                                    <Text style={styles.label}>Contact Methods (Required)</Text>
                                    <View style={styles.chipContainer}>
                                        {CONTACT_PLATFORMS.map((platform) => (
                                            <TouchableOpacity
                                                key={platform.value}
                                                style={[
                                                    styles.chip,
                                                    selectedTeamingMethods.includes(platform.value) && styles.chipActive
                                                ]}
                                                onPress={() => toggleTeamingMethod(platform.value)}
                                            >
                                                <Text style={[
                                                    styles.chipText,
                                                    selectedTeamingMethods.includes(platform.value) && styles.chipTextActive
                                                ]}>
                                                    {platform.icon} {platform.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    {selectedTeamingMethods.map(platform => (
                                        <View key={platform} style={styles.dynamicInputContainer}>
                                            <Text style={styles.dynamicLabel}>
                                                {platform === 'Other' ? (teamingOtherPlatformName || 'Platform') : platform} ID
                                            </Text>

                                            {platform === 'Other' && (
                                                <TextInput
                                                    style={[styles.input, { marginBottom: 12 }]}
                                                    placeholder="Platform Name (e.g. Discord)"
                                                    value={teamingOtherPlatformName}
                                                    onChangeText={setTeamingOtherPlatformName}
                                                />
                                            )}

                                            <TextInput
                                                style={styles.input}
                                                placeholder={`Enter ID`}
                                                value={teamingContactValues[platform] || ''}
                                                onChangeText={(text) => setTeamingContactValues(prev => ({ ...prev, [platform]: text }))}
                                            />
                                        </View>
                                    ))}

                                    <SafetyNotice variant="compact" />

                                    <TouchableOpacity
                                        style={[styles.submitButton, teamingSubmitting && { opacity: 0.7 }]}
                                        onPress={handlePostTeaming}
                                        disabled={teamingSubmitting}
                                    >
                                        {teamingSubmitting ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <Text style={styles.submitText}>Post Request</Text>
                                        )}
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

            {/* Teaming Contact Detail Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={!!selectedTeamingContact}
                onRequestClose={() => setSelectedTeamingContact(null)}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Pressable
                        style={[styles.modalOverlay, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }]}
                        onPress={() => setSelectedTeamingContact(null)}
                    />
                    <View style={[styles.modalContent, {
                        width: '85%',
                        maxHeight: '70%',
                        borderRadius: 24,
                        paddingBottom: 20
                    }]}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalTitle}>Contact Teammate</Text>
                                <Text style={styles.modalSubtitle}>{selectedTeamingContact?.userName}</Text>
                            </View>
                            <TouchableOpacity onPress={() => setSelectedTeamingContact(null)}>
                                <X size={24} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
                            <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 16 }}>Click to copy the ID</Text>
                            {selectedTeamingContact?.contacts.map((contact, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: '#F3F4F6',
                                        padding: 16,
                                        borderRadius: 16,
                                        marginBottom: 12
                                    }}
                                    onPress={() => {
                                        Clipboard.setStringAsync(contact.value);
                                        const platform = contact.platform === 'Other' && contact.otherPlatformName
                                            ? contact.otherPlatformName
                                            : contact.platform;
                                        Alert.alert('Copied', `${platform} ID copied!`);
                                    }}
                                >
                                    <View style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 20,
                                        backgroundColor: '#fff',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: 12
                                    }}>
                                        <Text style={{ fontSize: 18 }}>
                                            {CONTACT_PLATFORMS.find(p => p.value === contact.platform)?.icon || '🔗'}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 11, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase' }}>
                                            {contact.platform === 'Other' && contact.otherPlatformName ? contact.otherPlatformName : contact.platform}
                                        </Text>
                                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>{contact.value}</Text>
                                    </View>
                                    <View style={{ backgroundColor: '#EFF6FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                                        <Text style={{ color: '#2563EB', fontSize: 12, fontWeight: '600' }}>Copy</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Teaming Comment Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isTeamingCommentModalVisible}
                onRequestClose={() => setIsTeamingCommentModalVisible(false)}
            >
                <View style={{ flex: 1 }}>
                    <Pressable
                        style={[styles.modalOverlay, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }]}
                        onPress={() => setIsTeamingCommentModalVisible(false)}
                    />
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        style={{ flex: 1, justifyContent: 'flex-end' }}
                        pointerEvents="box-none"
                    >
                        <View style={[styles.modalContent, { maxHeight: '80%' }]}>
                            <View style={styles.modalHeader}>
                                <View>
                                    <Text style={styles.modalTitle}>Comments</Text>
                                    <Text style={styles.modalSubtitle}>Teaming Request</Text>
                                </View>
                                <TouchableOpacity onPress={() => setIsTeamingCommentModalVisible(false)}>
                                    <X size={24} color="#000" />
                                </TouchableOpacity>
                            </View>

                            {teamingCommentLoading ? (
                                <ActivityIndicator style={{ padding: 40 }} color="#2563EB" />
                            ) : (
                                <FlatList
                                    data={organizedTeamingComments}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => (
                                        <Animated.View style={[styles.teamingCommentContainer, ugcActions.getHighlightStyle(item.id)]}>
                                            <View style={styles.teamingCommentRow}>
                                                {isRemoteImageUrl(item.authorAvatar) ? (
                                                    <CachedRemoteImage uri={item.authorAvatar} style={styles.teamingCommentAvatar} />
                                                ) : (
                                                    <Text style={styles.teamingCommentAvatarEmoji}>{item.authorAvatar || '👤'}</Text>
                                                )}
                                                <TouchableOpacity
                                                    style={styles.teamingCommentInfo}
                                                    activeOpacity={0.95}
                                                    onLongPress={() => ugcActions.openActions({
                                                        id: item.id,
                                                        targetId: item.id,
                                                        targetType: 'teaming_comment',
                                                        content: item.content,
                                                        authorId: item.authorId,
                                                        authorName: item.authorName,
                                                    })}
                                                >
                                                    <View style={styles.teamingCommentHeader}>
                                                        <View style={styles.commentAuthorRow}>
                                                            <Text style={styles.commentAuthorName}>{item.authorName}</Text>
                                                            <EduBadge shouldShow={isHKBUEmail(item.authorEmail)} size="small" />
                                                        </View>
                                                        <TouchableOpacity onPress={() => {
                                                            setTeamingReplyTarget(item);
                                                            setTimeout(() => teamingCommentInputRef.current?.focus(), 100);
                                                        }}>
                                                            <Text style={styles.teamingReplyBtn}>{t('forum.row.replies')}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <TranslatableText style={styles.teamingCommentText} text={item.content} />
                                                    <Text style={styles.teamingCommentTime}>
                                                        {new Date(item.createdAt).toLocaleString()}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>

                                            {/* Replies */}
                                            {item.replies && item.replies.length > 0 && (
                                                <View style={styles.teamingNestedReplies}>
                                                    {item.replies.map((reply: TeamingComment) => (
                                                        <Animated.View key={reply.id} style={[styles.teamingCommentRowSmall, ugcActions.getHighlightStyle(reply.id)]}>
                                                            {isRemoteImageUrl(reply.authorAvatar) ? (
                                                                <CachedRemoteImage uri={reply.authorAvatar} style={styles.teamingCommentAvatarSmall} />
                                                            ) : (
                                                                <Text style={styles.teamingCommentAvatarEmojiSmall}>{reply.authorAvatar || '👤'}</Text>
                                                            )}
                                                            <TouchableOpacity
                                                                style={styles.teamingCommentInfoSmall}
                                                                activeOpacity={0.95}
                                                                onLongPress={() => ugcActions.openActions({
                                                                    id: reply.id,
                                                                    targetId: reply.id,
                                                                    targetType: 'teaming_comment',
                                                                    content: reply.content,
                                                                    authorId: reply.authorId,
                                                                    authorName: reply.authorName,
                                                                })}
                                                            >
                                                                <View style={styles.teamingCommentHeader}>
                                                                    <View style={styles.commentAuthorRow}>
                                                                        <Text style={styles.commentAuthorName}>{reply.authorName}</Text>
                                                                        {reply.replyToName && (
                                                                            <Text style={styles.replyIndicator}> ▶ {reply.replyToName}</Text>
                                                                        )}
                                                                    </View>
                                                                    <TouchableOpacity onPress={() => {
                                                                        setTeamingReplyTarget(reply);
                                                                        setTimeout(() => teamingCommentInputRef.current?.focus(), 100);
                                                                    }}>
                                                                        <Text style={styles.teamingReplyBtnSmall}>{t('forum.row.replies')}</Text>
                                                                    </TouchableOpacity>
                                                                </View>
                                                                <TranslatableText style={styles.teamingCommentTextSmall} text={reply.content} />
                                                                <Text style={styles.teamingCommentTimeSmall}>
                                                                    {new Date(reply.createdAt).toLocaleString()}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        </Animated.View>
                                                    ))}
                                                </View>
                                            )}
                                        </Animated.View>
                                    )}
                                    contentContainerStyle={{ paddingBottom: 20 }}
                                    ListEmptyComponent={
                                        <View style={{ alignItems: 'center', padding: 40 }}>
                                            <MessageSquare size={48} color="#E5E7EB" />
                                            <Text style={{ color: '#9CA3AF', marginTop: 12 }}>No comments yet. Start the conversation!</Text>
                                        </View>
                                    }
                                />
                            )}

                            {teamingReplyTarget && (
                                <View style={styles.teamingReplyBar}>
                                    <Text style={styles.teamingReplyBarText} numberOfLines={1}>
                                        {t('forum.detail.replying_to', { name: teamingReplyTarget.authorName })}: {teamingReplyTarget.content}
                                    </Text>
                                    <TouchableOpacity onPress={() => setTeamingReplyTarget(null)}>
                                        <X size={16} color="#2563EB" />
                                    </TouchableOpacity>
                                </View>
                            )}
                            <View style={{
                                flexDirection: 'row',
                                padding: 16,
                                borderTopWidth: 1,
                                borderTopColor: '#F3F4F6',
                                backgroundColor: '#fff',
                                alignItems: 'center',
                                paddingBottom: Platform.OS === 'ios' ? 32 : 16
                            }}>
                                <TextInput
                                    ref={teamingCommentInputRef}
                                    style={{
                                        flex: 1,
                                        backgroundColor: '#F3F4F6',
                                        borderRadius: 20,
                                        paddingHorizontal: 16,
                                        paddingVertical: 8,
                                        marginRight: 12,
                                        maxHeight: 100
                                    }}
                                    placeholder={teamingReplyTarget ? t('forum.detail.replying_to', { name: teamingReplyTarget.authorName }) : "Add a comment..."}
                                    placeholderTextColor="#9CA3AF"
                                    value={newTeamingComment}
                                    onChangeText={setNewTeamingComment}
                                    multiline
                                />
                                <TouchableOpacity
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 20,
                                        backgroundColor: newTeamingComment.trim() ? '#2563EB' : '#E5E7EB',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onPress={handleSendTeamingComment}
                                    disabled={!newTeamingComment.trim()}
                                >
                                    <Send size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
            {ugcActions.ActionSheet}

            <ReviewSuccessOverlay
                visible={successOverlay.visible}
                isFirst={successOverlay.isFirst}
                helpedCount={successOverlay.helpedCount}
                onClose={() => setSuccessOverlay(prev => ({ ...prev, visible: false }))}
            />
        </View>
        </TouchableWithoutFeedback>
    );
}

const CONTACT_PLATFORMS = [
    { label: 'WeChat', value: 'WeChat', icon: '💬' },
    { label: 'WhatsApp', value: 'WhatsApp', icon: '📱' },
    { label: 'Email', value: 'Email', icon: '📧' },
    { label: 'TG', value: 'Telegram', icon: '✈️' },
    { label: 'Other', value: 'Other', icon: '🔗' },
] as const;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F7',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 56,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#2563EB',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    backButton: { padding: 4 },
    headerShareButton: { padding: 4, width: 24, alignItems: 'flex-end' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
    scrollContent: { paddingTop: 0, paddingBottom: 40 },
    courseInfoCard: {
        backgroundColor: '#fff',
        margin: 20,
        marginTop: 10,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 14,
        elevation: 7,
    },
    // ⑨ Gradient header inside card
    courseInfoGradient: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 20,
        alignItems: 'center',
    },
    codeBadgeWhite: {
        backgroundColor: 'rgba(255,255,255,0.22)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.35)',
    },
    codeTextWhite: { color: '#fff', fontWeight: '800', fontSize: 14, letterSpacing: 0.5 },
    courseNameWhite: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        lineHeight: 26,
    },
    // Keep old codeBadge for backward-compat (unused but safe)
    codeBadge: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginBottom: 12,
    },
    codeText: { color: '#2563EB', fontWeight: 'bold', fontSize: 14 },
    courseName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 8,
    },
    instructor: { fontSize: 14, color: '#6B7280', marginBottom: 24 },
    statsRowPadded: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-around',
        paddingVertical: 16,
        paddingHorizontal: 8,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-around',
    },
    statItem: { alignItems: 'center' },
    statValue: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginTop: 4 },
    statLabel: { fontSize: 12, color: '#6B7280' },
    divider: { width: 1, height: 30, backgroundColor: '#E5E7EB' },

    // Tabs
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingHorizontal: 0,
        marginBottom: 0,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 13,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
        marginBottom: -1,
        position: 'relative',
    },
    activeTab: {
        borderBottomColor: '#2563EB',
    },
    tabText: {
        marginLeft: 6,
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    activeTabText: { color: '#0F172A' },
    tabUnreadDot: {
        position: 'absolute',
        top: 8,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 999,
        backgroundColor: '#EF4444',
    },

    // Reviews
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
    writeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2563EB',
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 20,
        gap: 4,
    },
    writeButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
    reviewCard: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        marginHorizontal: 0,
        marginBottom: 0,
        borderRadius: 0,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    authorInfo: { flexDirection: 'row', alignItems: 'center' },
    avatarContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarFallbackText: {
        fontSize: 18,
    },
    authorName: { fontSize: 14, fontWeight: '600', color: '#111827', marginRight: 6 },
    nameRow: { flexDirection: 'row', alignItems: 'center' },
    semester: { fontSize: 11, color: '#9CA3AF' },
    reviewRating: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBEB',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    ratingValue: { color: '#D97706', fontWeight: 'bold', marginLeft: 4, fontSize: 12 },
    tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10, gap: 6 },
    tag: { backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    difficultyTag: { backgroundColor: '#FEF2F2' },
    workloadTag: { backgroundColor: '#EFF6FF' },
    gradingTag: { backgroundColor: '#F0FDF4' },
    tagText: { fontSize: 11, color: '#4B5563' },
    overviewCard: {
        marginHorizontal: 16,
        marginBottom: 8,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#F0F2F8',
    },
    overviewTopRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    overviewRatingBlock: {
        alignItems: 'center',
        width: 64,
        paddingTop: 4,
    },
    overviewBigRating: {
        fontSize: 32,
        fontWeight: '800',
        color: '#111827',
        lineHeight: 36,
    },
    overviewReviewCount: {
        fontSize: 10,
        color: '#9CA3AF',
        marginTop: 4,
    },
    overviewDiffRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    overviewDiffLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    overviewDiffValue: {
        fontSize: 12,
        fontWeight: '700',
        color: '#374151',
    },
    overviewTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 10,
    },
    distRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        gap: 6,
    },
    distStar: {
        fontSize: 11,
        color: '#6B7280',
        width: 22,
    },
    distBarBg: {
        flex: 1,
        height: 6,
        backgroundColor: '#F3F4F6',
        borderRadius: 3,
        overflow: 'hidden',
    },
    distBarFill: {
        height: 6,
        backgroundColor: '#F59E0B',
        borderRadius: 3,
    },
    distCount: {
        fontSize: 11,
        color: '#9CA3AF',
        width: 16,
        textAlign: 'right',
    },
    dimensionRow: {
        flexDirection: 'row',
        marginTop: 12,
        gap: 12,
    },
    dimensionItem: {
        alignItems: 'center',
        flex: 1,
    },
    dimensionValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
    },
    dimensionLabel: {
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 2,
    },
    topBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#FEF3C7',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
        marginBottom: 6,
        borderWidth: 1,
        borderColor: '#F59E0B',
    },
    topBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#D97706',
    },
    tagFilterRow: {
        marginBottom: 10,
        paddingVertical: 4,
    },
    tagFilterChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    tagFilterChipActive: {
        backgroundColor: '#EFF6FF',
        borderColor: '#2563EB',
    },
    tagFilterText: {
        fontSize: 12,
        color: '#6B7280',
    },
    tagFilterTextActive: {
        color: '#2563EB',
        fontWeight: '600',
    },
    emptyCtaCard: {
        margin: 16,
        backgroundColor: '#EFF6FF',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    scheduleNudge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginHorizontal: 16,
        marginTop: 4,
        marginBottom: 4,
        padding: 14,
        backgroundColor: '#EFF6FF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    scheduleNudgeTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E3A8A',
    },
    scheduleNudgeDesc: {
        marginTop: 2,
        fontSize: 12,
        lineHeight: 17,
        color: '#475569',
    },
    scheduleNudgeBtn: {
        backgroundColor: '#1D4ED8',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    scheduleNudgeBtnText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#fff',
    },
    emptyCtaEmoji: {
        fontSize: 40,
        marginBottom: 12,
    },
    emptyCtaTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 6,
    },
    emptyCtaDesc: {
        fontSize: 13,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 18,
    },
    emptyCtaButton: {
        backgroundColor: '#0F172A',
        borderRadius: 12,
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    emptyCtaButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
    },
    pointsBadge: {
        backgroundColor: '#2563EB',
        borderRadius: 8,
        paddingHorizontal: 5,
        paddingVertical: 2,
        marginLeft: 6,
    },
    pointsBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#fff',
    },
    aiSummaryCard: {
        marginHorizontal: 16,
        marginBottom: 12,
        backgroundColor: '#EFF6FF',
        borderRadius: 12,
        padding: 14,
        borderLeftWidth: 3,
        borderLeftColor: '#2563EB',
    },
    aiSummaryLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 6,
    },
    aiSummaryText: {
        fontSize: 13,
        color: '#374151',
        lineHeight: 20,
    },
    reviewContent: { fontSize: 14, color: '#374151', lineHeight: 20, marginBottom: 8 },
    reviewFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 8,
    },
    date: { fontSize: 11, color: '#9CA3AF' },
    reviewActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    likeButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    likeCount: { fontSize: 12, color: '#6B7280' },
    shareReviewBtn: { alignItems: 'center', justifyContent: 'center', padding: 4, opacity: 0.7 },
    deleteTag: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        opacity: 0.45,
    },

    // Sorting
    sortContainer: { flexDirection: 'row', gap: 12, marginBottom: 16, paddingHorizontal: 20 },
    sortButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#F3F4F6' },
    sortButtonActive: { backgroundColor: '#2563EB' },
    sortText: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
    sortTextActive: { color: '#fff' },

    // Chat
    chatContainer: { paddingHorizontal: 20, paddingBottom: 20 },
    messageRow: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-end' },
    myMessageRow: { justifyContent: 'flex-end' },
    otherMessageRow: { justifyContent: 'flex-start' },
    chatAvatarImage: {
        width: 28,
        height: 28,
        borderRadius: 14,
        marginRight: 8,
        marginBottom: 4,
        backgroundColor: '#E5E7EB',
    },
    chatAvatarFallback: {
        width: 28,
        height: 28,
        borderRadius: 14,
        marginRight: 8,
        marginBottom: 4,
        backgroundColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    chatAvatarFallbackText: {
        fontSize: 14,
    },
    messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 16 },
    myBubble: { backgroundColor: '#0F172A', borderBottomRightRadius: 4 },
    otherBubble: { backgroundColor: '#fff', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#E5E7EB' },
    messageAuthor: { fontSize: 10, color: '#9CA3AF', marginBottom: 4, marginRight: 6 },
    myMessageAuthor: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginBottom: 4, marginRight: 6 },
    messageAuthorRow: { flexDirection: 'row', alignItems: 'center' },
    chatEduStarBadge: {
        height: 13,
        paddingHorizontal: 4,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245,158,11,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    chatEduStarText: {
        fontSize: 9,
        color: '#F59E0B',
        fontWeight: '700',
        lineHeight: 10,
    },
    messageText: { fontSize: 14, color: '#374151' },
    myMessageText: { fontSize: 14, color: '#fff' },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 32 : 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    chatInput: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 12,
        maxHeight: 100,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#0F172A',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
    label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 12 },
    starsContainer: { flexDirection: 'row', gap: 16, marginBottom: 24 },
    diffButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    diffButtonActive: { backgroundColor: '#2563EB' },
    diffText: { color: '#6B7280', fontWeight: '600' },
    diffTextActive: { color: '#fff' },
    reviewTagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    reviewTagItem: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    reviewTagItemActive: {
        backgroundColor: '#EFF6FF',
        borderColor: '#2563EB',
    },
    reviewTagText: {
        fontSize: 13,
        color: '#6B7280',
    },
    reviewTagTextActive: {
        color: '#2563EB',
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        minHeight: 120,
        marginBottom: 24,
        fontSize: 15,
    },
    submitButton: {
        backgroundColor: '#0F172A',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
    },
    submitText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

    // Anonymous Option
    anonymousToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        paddingVertical: 8,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    checkboxActive: {
        backgroundColor: '#2563EB',
        borderColor: '#2563EB',
    },
    anonymousText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#374151',
    },

    // Teaming Styles
    teamingCard: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginBottom: 16,
        borderRadius: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    teamingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    userMajor: {
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 2,
    },
    sectionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        gap: 6,
    },
    sectionBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#2563EB',
    },
    teamingDetailBox: {
        backgroundColor: '#F8FAFC',
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
    },
    detailTitle: {
        fontSize: 11,
        fontWeight: '800',
        color: '#64748B',
        textTransform: 'uppercase',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    detailBody: {
        fontSize: 13,
        color: '#334155',
        lineHeight: 18,
    },
    teamingFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6,
        borderTopWidth: 1,
        borderTopColor: '#F8FAFC',
        paddingTop: 12,
    },
    teamingStats: {
        flexDirection: 'row',
        gap: 16,
    },
    teamingStatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    teamingStatText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
    },
    contactIconBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2563EB',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        gap: 6,
    },
    contactIconBtnText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    teamingRightActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    teamingContainer: {
        flex: 1,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: 12,
    },
    emptyText: {
        fontSize: 14,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    modalSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    commentAuthorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 8,
    },
    commentAuthorName: {
        fontWeight: '700',
        color: '#111827',
        marginRight: 6,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    chipActive: {
        backgroundColor: '#EFF6FF',
        borderColor: '#2563EB',
    },
    chipText: {
        fontSize: 12,
        color: '#6B7280',
    },
    chipTextActive: {
        color: '#2563EB',
        fontWeight: '600',
    },
    dynamicInputContainer: {
        marginBottom: 16,
    },
    dynamicLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 8,
    },
    hintBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        padding: 12,
        borderRadius: 12,
        marginBottom: 20,
        gap: 10,
    },
    hintText: {
        flex: 1,
        fontSize: 12,
        color: '#2563EB',
        lineHeight: 18,
    },
    teamingCommentContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingVertical: 12,
    },
    teamingCommentRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
    },
    teamingCommentRowSmall: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    teamingCommentAvatar: {
        width: 36, height: 36, borderRadius: 18, marginRight: 12
    },
    teamingCommentAvatarEmoji: {
        fontSize: 24, marginRight: 12
    },
    teamingCommentAvatarSmall: {
        width: 28, height: 28, borderRadius: 14, marginRight: 10
    },
    teamingCommentAvatarEmojiSmall: {
        fontSize: 20, marginRight: 10
    },
    teamingCommentInfo: {
        flex: 1,
    },
    teamingCommentInfoSmall: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        padding: 10,
        borderRadius: 14,
    },
    teamingCommentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    teamingCommentText: {
        color: '#374151', fontSize: 14, lineHeight: 20
    },
    teamingCommentTextSmall: {
        color: '#4B5563', fontSize: 13, lineHeight: 18
    },
    teamingCommentTime: {
        fontSize: 11, color: '#9CA3AF', marginTop: 4
    },
    teamingCommentTimeSmall: {
        fontSize: 10, color: '#9CA3AF', marginTop: 2
    },
    teamingReplyBtn: {
        fontSize: 12, color: '#2563EB', fontWeight: '700'
    },
    teamingReplyBtnSmall: {
        fontSize: 11, color: '#2563EB', fontWeight: '700'
    },
    teamingNestedReplies: {
        marginLeft: 64,
        marginTop: 12,
        paddingHorizontal: 0,
    },
    teamingReplyBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#BFDBFE',
    },
    teamingReplyBarText: {
        fontSize: 12, color: '#2563EB', flex: 1, marginRight: 10
    },
    replyIndicator: {
        fontSize: 12, color: '#9CA3AF', marginLeft: 4
    },

    // Course info flat section
    courseInfoFlat: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    courseNameLarge: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 10,
        lineHeight: 28,
    },
    courseMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        flexWrap: 'wrap',
    },
    courseMetaText: {
        fontSize: 13,
        color: '#6B7280',
    },
    courseMetaDot: {
        fontSize: 13,
        color: '#D1D5DB',
    },
    courseBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    courseCodeBadge: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    courseCodeBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#1E40AF',
        letterSpacing: 0.5,
    },
    courseDeptText: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 6,
        flexShrink: 1,
    },
    semesterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 10,
    },
    semesterLabel: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    semesterChip: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    semesterChipText: {
        fontSize: 11,
        color: '#1E40AF',
        fontWeight: '500',
    },

    // Reviews top bar
    reviewsTopBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        backgroundColor: '#fff',
    },
    reviewsStatLine: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },

    // AI Summary blockquote
    aiSummaryBlock: {
        marginHorizontal: 16,
        marginVertical: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderLeftWidth: 3,
        borderLeftColor: '#2563EB',
        backgroundColor: '#EFF6FF',
        borderRadius: 8,
    },
    aiSummaryQuote: {
        fontSize: 13,
        color: '#1E40AF',
        fontStyle: 'italic',
        lineHeight: 20,
    },

    // Combined filter row
    filterRow: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    filterChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#F5F5F5',
    },
    filterChipActive: {
        backgroundColor: '#2563EB',
    },
    filterChipText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    filterChipTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    filterSep: {
        width: 1,
        height: 14,
        backgroundColor: '#E5E7EB',
        alignSelf: 'center',
    },
    reviewsSkeletonWrap: {
        paddingTop: 8,
    },
    reviewSkeleton: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        gap: 12,
    },
    skeletonAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
    },
    skeletonLines: {
        flex: 1,
        justifyContent: 'center',
    },
    skeletonLine: {
        height: 12,
        borderRadius: 6,
        backgroundColor: '#F3F4F6',
    },
    sortChip: {
        paddingHorizontal: 4,
        paddingVertical: 6,
        alignItems: 'center',
    },
    sortChipText: {
        fontSize: 13,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    sortChipTextActive: {
        color: '#0F172A',
        fontWeight: '700',
    },
    sortChipUnderline: {
        height: 2,
        width: '100%',
        backgroundColor: '#2563EB',
        borderRadius: 1,
        marginTop: 3,
    },
});
