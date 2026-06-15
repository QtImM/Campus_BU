import * as Clipboard from 'expo-clipboard';
import {
    Ban,
    Bell,
    Copy,
    EyeOff,
    MessageCircle,
    MoreHorizontal,
    ShieldAlert,
    Trash2,
    User as UserIcon,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    Easing,
    FlatList,
    Modal,
    PanResponder,
    Pressable,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getFollowersList, getFollowingList } from '../../services/follows';
import { fetchDirectConversations } from '../../services/messages';
import { isRemoteImageUrl } from '../../utils/remoteImage';
import { generatePostShareMessageContent, generatePostShareUrl } from '../../utils/shareUtils';
import { CachedRemoteImage } from '../common/CachedRemoteImage';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.38;

interface ShareFriend {
    uid: string;
    displayName: string;
    avatarUrl: string;
    source: 'following' | 'follower' | 'message';
}

interface PostShareSheetProps {
    visible: boolean;
    onClose: () => void;
    currentUserId?: string | null;
    postId: string;
    postContent?: string;
    postImageUrl?: string;
    isOwnPost: boolean;
    isAdmin: boolean;
    isAnonymousPost?: boolean;
    authorId?: string;
    authorName?: string;
    onShareToUser: (receiverId: string, message: string) => Promise<void>;
    onOpenFriendList: () => void;
    onDeletePost?: () => void;
    onAdminDelete?: () => void;
    onBroadcast?: () => void;
    onBlockUser?: () => void;
    onHidePost?: () => void;
    onReport?: () => void;
}

export const PostShareSheet: React.FC<PostShareSheetProps> = ({
    visible,
    onClose,
    currentUserId,
    postId,
    postContent,
    postImageUrl,
    isOwnPost,
    isAdmin,
    isAnonymousPost,
    authorId,
    authorName,
    onShareToUser,
    onOpenFriendList,
    onDeletePost,
    onAdminDelete,
    onBroadcast,
    onBlockUser,
    onHidePost,
    onReport,
}) => {
    const { t } = useTranslation();
    const [friends, setFriends] = useState<ShareFriend[]>([]);
    const [loadingFriends, setLoadingFriends] = useState(false);
    const [sendingToUid, setSendingToUid] = useState<string | null>(null);

    const slideAnim = React.useRef(new Animated.Value(SHEET_HEIGHT)).current;
    const backdropOpacity = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.cubic),
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 0.5,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
            if (currentUserId) {
                void loadFriends();
            }
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: SHEET_HEIGHT,
                    duration: 250,
                    useNativeDriver: true,
                    easing: Easing.in(Easing.cubic),
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
            setSendingToUid(null);
        }
    }, [visible]);

    const loadFriends = async () => {
        if (!currentUserId || friends.length > 0) return;
        setLoadingFriends(true);
        try {
            const [followingList, followersList, conversations] = await Promise.all([
                getFollowingList(currentUserId),
                getFollowersList(currentUserId),
                fetchDirectConversations(currentUserId),
            ]);

            const userMap = new Map<string, ShareFriend>();
            followingList.forEach((u) => {
                userMap.set(u.uid, { uid: u.uid, displayName: u.displayName, avatarUrl: u.avatarUrl, source: 'following' });
            });
            followersList.forEach((u) => {
                if (!userMap.has(u.uid)) {
                    userMap.set(u.uid, { uid: u.uid, displayName: u.displayName, avatarUrl: u.avatarUrl, source: 'follower' });
                }
            });
            conversations.forEach((c) => {
                if (!userMap.has(c.user.id)) {
                    userMap.set(c.user.id, { uid: c.user.id, displayName: c.user.name, avatarUrl: c.user.avatar, source: 'message' });
                }
            });
            setFriends(Array.from(userMap.values()).slice(0, 20));
        } catch (e) {
            console.error('[PostShareSheet] loadFriends error:', e);
        } finally {
            setLoadingFriends(false);
        }
    };

    const panResponder = React.useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 10,
            onPanResponderGrant: () => { slideAnim.stopAnimation(); },
            onPanResponderMove: (_, g) => { if (g.dy > 0) slideAnim.setValue(g.dy); },
            onPanResponderRelease: (_, g) => {
                if (g.dy > SHEET_HEIGHT / 4 || g.vy > 0.5) {
                    onClose();
                } else {
                    Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start();
                }
            },
        })
    ).current;

    const handleDirectShare = (friend: ShareFriend) => {
        if (sendingToUid) return;
        Alert.alert(
            t('profile.share.confirm_share_title', '确认分享'),
            t('profile.share.confirm_share_desc', { defaultValue: '将这条帖子分享给 {{name}}？', name: friend.displayName }),
            [
                { text: t('common.cancel', '取消'), style: 'cancel' },
                {
                    text: t('profile.share.send', '发送'),
                    onPress: async () => {
                        setSendingToUid(friend.uid);
                        try {
                            const msg = generatePostShareMessageContent(postId, { postContent, postImageUrl });
                            await onShareToUser(friend.uid, msg);
                            onClose();
                        } catch {
                            Alert.alert(t('common.error', 'Error'), t('profile.share.failed', '分享失败'));
                        } finally {
                            setSendingToUid(null);
                        }
                    },
                },
            ],
        );
    };

    const handleSystemShare = async () => {
        try {
            const url = generatePostShareUrl(postId);
            await Share.share({
                message: postContent ? `${postContent.slice(0, 100)}\n\n${url}` : url,
                url,
            });
        } catch { /* user cancelled */ }
    };

    const handleCopyLink = async () => {
        try {
            const url = generatePostShareUrl(postId);
            const excerpt = postContent ? postContent.slice(0, 50).replace(/\n/g, ' ') : '';
            const clipText = `复制打开HKCampus，看看这条校园动态${excerpt ? `「${excerpt}」` : ''} ${url}`;
            await Clipboard.setStringAsync(clipText);
            onClose();
            Alert.alert(t('post_share.copied_title', '已复制'), t('post_share.copied_msg', '分享口令已复制，粘贴给好友打开即可跳转'));
        } catch { /* ignore */ }
    };

    const canBlock = !!authorId && !isAnonymousPost && authorId !== currentUserId;

    const renderFriendItem = ({ item }: { item: ShareFriend }) => {
        const isSending = sendingToUid === item.uid;
        return (
            <TouchableOpacity
                style={styles.friendItem}
                onPress={() => handleDirectShare(item)}
                activeOpacity={0.7}
                disabled={!!sendingToUid}
            >
                {isRemoteImageUrl(item.avatarUrl) ? (
                    <CachedRemoteImage uri={item.avatarUrl} style={styles.friendAvatar} />
                ) : (
                    <View style={[styles.friendAvatar, styles.friendAvatarPlaceholder]}>
                        <UserIcon size={18} color="#fff" />
                    </View>
                )}
                {isSending && (
                    <View style={styles.sendingOverlay}>
                        <ActivityIndicator size="small" color="#fff" />
                    </View>
                )}
                <Text style={styles.friendName} numberOfLines={1}>{item.displayName}</Text>
            </TouchableOpacity>
        );
    };

    const actionItems: Array<{
        key: string;
        icon: React.ReactNode;
        label: string;
        onPress: () => void;
        color?: string;
    }> = [];

    if (currentUserId) {
        actionItems.push({
            key: 'dm',
            icon: <MessageCircle size={26} color="#1E3A8A" />,
            label: t('post_share.dm_friend', '私信好友'),
            onPress: () => { onClose(); onOpenFriendList(); },
        });
    }

    // TODO: 微信 SDK 接入后启用
    // actionItems.push({
    //     key: 'wechat',
    //     icon: <WeChatIcon />,
    //     label: t('post_share.wechat', '微信'),
    //     onPress: handleSystemShare,
    // });

    actionItems.push({
        key: 'copy_link',
        icon: <Copy size={24} color="#0F766E" />,
        label: t('post_share.copy_link', '复制链接'),
        onPress: handleCopyLink,
    });

    actionItems.push({
        key: 'more',
        icon: <MoreHorizontal size={26} color="#6B7280" />,
        label: t('post_share.more', '更多'),
        onPress: handleSystemShare,
    });

    if (!isOwnPost && currentUserId) {
        actionItems.push({
            key: 'report',
            icon: <ShieldAlert size={24} color="#DC2626" />,
            label: t('moderation.ugc_action_report', '举报'),
            onPress: () => { onClose(); onReport?.(); },
            color: '#DC2626',
        });
        if (canBlock) {
            actionItems.push({
                key: 'block',
                icon: <Ban size={24} color="#7C2D12" />,
                label: t('moderation.ugc_action_block', '屏蔽'),
                onPress: () => { onClose(); onBlockUser?.(); },
            });
        }
        if (onHidePost) {
            actionItems.push({
                key: 'hide',
                icon: <EyeOff size={24} color="#6D28D9" />,
                label: t('moderation.ugc_action_hide_post', '不看'),
                onPress: () => { onClose(); onHidePost?.(); },
            });
        }
    }

    if (isOwnPost && onDeletePost) {
        actionItems.push({
            key: 'delete',
            icon: <Trash2 size={24} color="#111827" />,
            label: t('campus_detail.delete_post_title', '删除'),
            onPress: () => { onClose(); onDeletePost(); },
        });
    }

    if (isAdmin && onBroadcast) {
        actionItems.push({
            key: 'broadcast',
            icon: <Bell size={24} color="#1E3A8A" />,
            label: t('campus_detail.broadcast_push', '推送'),
            onPress: () => { onClose(); onBroadcast(); },
        });
    }

    if (isAdmin && !isOwnPost && onAdminDelete) {
        actionItems.push({
            key: 'admin_delete',
            icon: <Trash2 size={24} color="#DC2626" />,
            label: t('campus_detail.admin_delete', '管理删除'),
            onPress: () => { onClose(); onAdminDelete(); },
            color: '#DC2626',
        });
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
            </Pressable>
            <Animated.View
                style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
                {...panResponder.panHandlers}
            >
                <View style={styles.handleWrapper}>
                    <View style={styles.handle} />
                </View>

                <Text style={styles.title}>{t('post_share.title', '分享至')}</Text>

                {/* Row 1: Friend avatars */}
                {currentUserId && (
                    <View style={styles.friendsRow}>
                        {loadingFriends ? (
                            <View style={styles.friendsLoading}>
                                <ActivityIndicator size="small" color="#94A3B8" />
                            </View>
                        ) : friends.length > 0 ? (
                            <FlatList
                                data={friends}
                                keyExtractor={(item) => item.uid}
                                renderItem={renderFriendItem}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.friendsList}
                            />
                        ) : (
                            <View style={styles.friendsLoading}>
                                <Text style={styles.noFriendsText}>
                                    {t('post_share.no_friends', '关注好友后可快速分享')}
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Row 2: Action icons grid */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.actionsRow}
                >
                    {actionItems.map((item) => (
                        <TouchableOpacity
                            key={item.key}
                            style={styles.actionItem}
                            onPress={item.onPress}
                            activeOpacity={0.7}
                        >
                            <View style={styles.actionIconWrap}>
                                {item.icon}
                            </View>
                            <Text style={[styles.actionLabel, item.color ? { color: item.color } : null]} numberOfLines={1}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </Animated.View>
        </Modal>
    );
};

const WeChatIcon: React.FC = () => {
    const Svg = require('react-native-svg').default;
    const Path = require('react-native-svg').Path;
    return (
        <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
            <Path
                d="M9.5 4C5.91 4 3 6.462 3 9.5c0 1.694.896 3.2 2.3 4.184l-.576 1.727 2.022-1.012A7.8 7.8 0 0 0 9.5 15c.171 0 .34-.007.508-.02A5.44 5.44 0 0 1 9.75 13.5c0-3.038 2.712-5.5 6.05-5.5.34 0 .674.027 1 .078C16.076 5.783 13.06 4 9.5 4Zm-2.7 3a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Zm4.4 0a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Z"
                fill="#07C160"
            />
            <Path
                d="M15.75 9C12.85 9 10.5 11.015 10.5 13.5S12.85 18 15.75 18c.72 0 1.41-.132 2.046-.373l1.654.827-.47-1.413C20.2 16.145 21 14.895 21 13.5c0-2.485-2.35-4.5-5.25-4.5Zm-1.85 2.75a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5Zm3.2 0a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5Z"
                fill="#07C160"
            />
        </Svg>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
    },
    sheet: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        paddingBottom: 20,
    },
    handleWrapper: {
        width: '100%',
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 4,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#D1D5DB',
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        textAlign: 'center',
        marginTop: 4,
        marginBottom: 12,
    },
    friendsRow: {
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingBottom: 12,
        marginBottom: 10,
    },
    friendsLoading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
    },
    noFriendsText: {
        fontSize: 13,
        color: '#9CA3AF',
    },
    friendsList: {
        paddingHorizontal: 16,
        gap: 16,
    },
    friendItem: {
        alignItems: 'center',
        width: 66,
    },
    friendAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#E5E7EB',
    },
    friendAvatarPlaceholder: {
        backgroundColor: '#1E3A8A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendingOverlay: {
        ...StyleSheet.absoluteFillObject,
        top: 0,
        left: 5,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    friendName: {
        fontSize: 11,
        color: '#374151',
        marginTop: 6,
        textAlign: 'center',
        width: 60,
    },
    actionsRow: {
        paddingHorizontal: 16,
        gap: 20,
        paddingBottom: 8,
    },
    actionItem: {
        alignItems: 'center',
        width: 62,
    },
    actionIconWrap: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    actionLabel: {
        fontSize: 11,
        color: '#374151',
        textAlign: 'center',
    },
});
