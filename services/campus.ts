import { Post, PostCategory, PostComment, PostType } from '../types';
import { ensureContentSafety } from './contentFilter';
import { compressImageForUpload } from '../utils/image';
import { IMMUTABLE_STORAGE_CACHE_CONTROL } from '../utils/remoteImage';
import { getFollowingUserIds } from './follows';
import { getBlockedUserIds } from './moderation';
import { supabase } from './supabase';
import storage from '../lib/storage';
import { registerCacheReset } from '../lib/cacheRegistry';

const POSTS_TABLE = 'posts';
const COMMENTS_TABLE = 'post_comments';
const LIKES_TABLE = 'post_likes';

// --------------- Post client-side cache (for instant detail-page render) ---------------
const _postCache = new Map<string, { post: Post; ts: number }>();
const POST_CACHE_TTL = 60_000; // 1 min

export const cachePost = (post: Post) => {
    _postCache.set(post.id, { post, ts: Date.now() });
};

export const getCachedPost = (postId: string): Post | null => {
    const entry = _postCache.get(postId);
    if (!entry || Date.now() - entry.ts > POST_CACHE_TTL) return null;
    return entry.post;
};

// Drop the in-memory post cache on sign-out / account switch so a new account
// never sees the previous user's per-post state (e.g. isLiked).
registerCacheReset(() => _postCache.clear());

// ── Persisted feed cache (stale-while-revalidate for instant cold start) ──────
// The first page of the discover feed is mirrored to disk so a cold start can
// render real content immediately while the network refresh runs in the
// background, instead of staring at skeletons for 5-10s.
const FEED_CACHE_KEY = 'campus_feed_cache_v1';
const FEED_CACHE_MAX = 20;

export const saveFeedCache = async (posts: Post[]): Promise<void> => {
    try {
        await storage.setItem(FEED_CACHE_KEY, JSON.stringify(posts.slice(0, FEED_CACHE_MAX)));
    } catch {
        // Non-fatal: cache is an optimization only.
    }
};

export const loadFeedCache = async (): Promise<Post[]> => {
    try {
        const raw = await storage.getItem(FEED_CACHE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as Post[]) : [];
    } catch {
        return [];
    }
};

export const clearFeedCache = async (): Promise<void> => {
    try {
        await storage.removeItem(FEED_CACHE_KEY);
    } catch {
        // ignore
    }
};

// Also drop the persisted feed on sign-out (async, fire-and-forget).
registerCacheReset(() => { void clearFeedCache(); });

const CATEGORY_TO_TYPE: Record<PostCategory, PostType | 'all'> = {
    'All': 'all',
    'Events': 'event',
    'Reviews': 'review',
    'Guides': 'guide',
    'Lost & Found': 'lost_found'
};

const TYPE_TO_CATEGORY: Record<string, PostCategory> = {
    'event': 'Events',
    'review': 'Reviews',
    'guide': 'Guides',
    'lost_found': 'Lost & Found'
};

const ANONYMOUS_POST_AUTHOR_NAME = '匿名用户';

const COMMENT_LIKES_TABLE = 'post_comment_likes';

const mapCommentRow = (
    row: any,
    anonymousPostAuthorId?: string,
): PostComment => {
    const isAnonymous = !!anonymousPostAuthorId && row.author_id === anonymousPostAuthorId;
    const author = row.author;

    return {
        id: row.id,
        postId: row.post_id,
        authorId: row.author_id,
        authorName: isAnonymous
            ? ANONYMOUS_POST_AUTHOR_NAME
            : (author ? (author.display_name || author.displayName) : row.author_name),
        authorEmail: isAnonymous ? undefined : row.author_email,
        authorAvatar: isAnonymous ? undefined : row.author_avatar,
        isAnonymous,
        content: row.content,
        parentCommentId: row.parent_comment_id,
        replyToName: row.reply_to_name,
        createdAt: new Date(row.created_at),
        likes: 0,
        isLiked: false,
    };
};

/**
 * Map Supabase row to Post type
 */
const mapSupabaseToPost = (row: any): Post => {
    // Robust parsing of images array
    let images: string[] = [];
    if (Array.isArray(row.images)) {
        images = row.images;
    } else if (typeof row.images === 'string') {
        try {
            images = JSON.parse(row.images);
        } catch (e) {
            console.error('Failed to parse images string:', row.images);
        }
    }

    const author = row.author; // Joined data from 'users' table

    return {
        id: row.id,
        authorId: row.author_id,
        authorName: (row.is_anonymous || !author) ? row.author_name : (author.display_name || author.displayName),
        authorEmail: row.author_email || (row.is_anonymous || !author ? undefined : author.email),
        authorMajor: (row.is_anonymous || !author) ? row.author_major : author.major,
        authorAvatar: (row.is_anonymous || !author) ? row.author_avatar : author.avatar_url,
        content: row.content,
        category: TYPE_TO_CATEGORY[row.type] || 'All',
        type: row.type as PostType,
        imageUrl: images && images.length > 0 ? images[0] : undefined,
        images: images,
        likes: row.likes || 0,
        comments: row.comments_count || 0,
        isAnonymous: row.is_anonymous || false,
        createdAt: new Date(row.created_at),
        location: row.lat && row.lng ? {
            lat: row.lat,
            lng: row.lng,
            name: row.location_tag || 'Pin Location'
        } : undefined,
        promptId: row.prompt_id ?? undefined,
        topicTitleZh: row.topic_title_zh ?? undefined,
        topicTitleEn: row.topic_title_en ?? undefined,
    };
};

/**
 * Mark which posts have authors that the current user is following
 */
const markFollowingAuthors = async (posts: Post[], currentUserId?: string) => {
    if (!currentUserId || posts.length === 0) return;

    const followingIds = await getFollowingUserIds(currentUserId);
    if (followingIds.length === 0) return;

    const followingSet = new Set(followingIds);
    posts.forEach(p => {
        p.isFollowingAuthor = followingSet.has(p.authorId);
    });
};

export const POSTS_PAGE_SIZE = 20;

// Columns the feed/list/detail views actually consume (everything
// mapSupabaseToPost reads). Replaces `select('*, author:users!author_id(*)')`,
// which pulled every post column plus every joined user column
// (social_tags, bio, created_at, …) the UI never looks at.
const POST_LIST_SELECT =
    'id, content, type, author_id, author_name, author_avatar, author_major, author_email, '
    + 'images, location_tag, lat, lng, likes, comments_count, is_anonymous, created_at, '
    + 'prompt_id, topic_title_zh, topic_title_en, '
    + 'author:users!author_id(id, display_name, avatar_url, major, email)';

export interface FetchPostsOptions {
    /** Keyset cursor: return only posts strictly older than this ISO timestamp. */
    beforeCreatedAt?: string;
    /** Page size for paginated (feed) loads. Defaults to POSTS_PAGE_SIZE. */
    limit?: number;
}

// Map a get_discover_feed() RPC row (flat author_* + u_* columns + computed
// is_liked/is_following) to a Post.
const mapFeedRpcRow = (row: any): Post => {
    let images: string[] = [];
    if (Array.isArray(row.images)) images = row.images;
    else if (typeof row.images === 'string') {
        try { images = JSON.parse(row.images); } catch { /* ignore */ }
    }

    const useInline = row.is_anonymous || !row.u_display_name;

    return {
        id: row.id,
        authorId: row.author_id,
        authorName: useInline ? row.author_name : row.u_display_name,
        authorEmail: row.is_anonymous ? undefined : (row.author_email || row.u_email || undefined),
        authorMajor: useInline ? row.author_major : row.u_major,
        authorAvatar: useInline ? row.author_avatar : row.u_avatar_url,
        content: row.content,
        category: TYPE_TO_CATEGORY[row.type] || 'All',
        type: row.type as PostType,
        imageUrl: images.length > 0 ? images[0] : undefined,
        images,
        likes: row.likes || 0,
        comments: row.comments_count || 0,
        isAnonymous: row.is_anonymous || false,
        createdAt: new Date(row.created_at),
        location: row.lat && row.lng ? {
            lat: row.lat,
            lng: row.lng,
            name: row.location_tag || 'Pin Location',
        } : undefined,
        promptId: row.prompt_id ?? undefined,
        topicTitleZh: row.topic_title_zh ?? undefined,
        topicTitleEn: row.topic_title_en ?? undefined,
        isLiked: !!row.is_liked,
        isFollowingAuthor: !!row.is_following,
    };
};

// Once we learn the RPC isn't deployed, stop paying a failing round-trip on
// every load and use the PostgREST fallback directly.
let _feedRpcUnavailable = false;

const fetchFeedViaRpc = async (
    type: PostType | 'all',
    currentUserId: string | undefined,
    before: string | undefined,
    limit: number,
): Promise<Post[] | null> => {
    if (_feedRpcUnavailable) return null;

    const { data, error } = await supabase.rpc('get_discover_feed', {
        p_user_id: currentUserId ?? null,
        p_type: type === 'all' ? null : type,
        p_before: before ?? null,
        p_limit: limit,
    });

    if (error) {
        // PGRST202 = function not found in schema cache → not deployed; stop
        // trying. Anything else (transient) → fall back just for this call.
        if (error.code === 'PGRST202' || /could not find the function|does not exist/i.test(error.message || '')) {
            _feedRpcUnavailable = true;
        }
        return null;
    }

    return (data || []).map(mapFeedRpcRow);
};

// PostgREST path: column-projected query + parallel user-specific enrichment.
// Used unbounded (no opts → e.g. map pins) and as the fallback when the RPC is
// unavailable. `before` enables keyset pagination; `limit` caps the page.
const fetchPostsViaRest = async (
    type: PostType | 'all',
    currentUserId: string | undefined,
    before: string | undefined,
    limit: number | undefined,
): Promise<Post[]> => {
    let query = supabase.from(POSTS_TABLE).select(POST_LIST_SELECT);

    if (type !== 'all') {
        query = query.eq('type', type);
    }

    query = query.order('created_at', { ascending: false });

    if (before) query = query.lt('created_at', before);
    if (limit !== undefined) query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }

    let posts = (data || []).map(mapSupabaseToPost);

    if (currentUserId && posts.length > 0) {
        const postIds = posts.map(p => p.id);

        // Run all three user-specific lookups in parallel (all benefit from caching)
        const [blockedIds, likesResult, followingIds] = await Promise.all([
            getBlockedUserIds(currentUserId),
            supabase.from(LIKES_TABLE).select('post_id').eq('user_id', currentUserId).in('post_id', postIds),
            getFollowingUserIds(currentUserId),
        ]);

        if (blockedIds.length > 0) {
            const blockedSet = new Set(blockedIds);
            posts = posts.filter(p => !blockedSet.has(p.authorId));
        }

        if (likesResult.data) {
            const likedSet = new Set(likesResult.data.map((l: any) => l.post_id));
            posts.forEach(p => { p.isLiked = likedSet.has(p.id); });
        }

        if (followingIds.length > 0) {
            const followingSet = new Set(followingIds);
            posts.forEach(p => { p.isFollowingAuthor = followingSet.has(p.authorId); });
        }
    }

    // Cache each post for instant detail-page render
    posts.forEach(cachePost);

    return posts;
};

/**
 * Fetch posts by category.
 *
 * - Without `opts`: returns ALL matching posts in one query (used by the map
 *   for pins). Unchanged behaviour.
 * - With `opts`: paginated feed mode. Tries the single-round-trip
 *   get_discover_feed RPC first (joins author + computes like/follow state +
 *   excludes blocked authors server-side), falling back to the PostgREST query
 *   with keyset pagination if the RPC isn't available.
 */
export const fetchPosts = async (
    category?: PostCategory,
    currentUserId?: string,
    opts?: FetchPostsOptions,
): Promise<Post[]> => {
    const type = CATEGORY_TO_TYPE[category || 'All'];

    if (opts) {
        const limit = opts.limit ?? POSTS_PAGE_SIZE;
        const rpcPosts = await fetchFeedViaRpc(type, currentUserId, opts.beforeCreatedAt, limit);
        if (rpcPosts) {
            rpcPosts.forEach(cachePost);
            return rpcPosts;
        }
        return fetchPostsViaRest(type, currentUserId, opts.beforeCreatedAt, limit);
    }

    // Unbounded mode (e.g. map pins): every matching post, no pagination.
    return fetchPostsViaRest(type, currentUserId, undefined, undefined);
};

/**
 * Fetch posts created by a specific author.
 */
export const fetchPostsByAuthor = async (authorId: string, currentUserId?: string): Promise<Post[]> => {
    const { data, error } = await supabase
        .from(POSTS_TABLE)
        .select(POST_LIST_SELECT)
        .eq('author_id', authorId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching posts by author:', error);
        throw error;
    }

    let posts = (data || [])
        .map(mapSupabaseToPost)
        .filter(post => !post.isAnonymous);

    // Filter out posts from blocked users
    if (currentUserId) {
        const blockedIds = await getBlockedUserIds(currentUserId);
        if (blockedIds.length > 0) {
            const blockedSet = new Set(blockedIds);
            posts = posts.filter(p => !blockedSet.has(p.authorId));
        }
    }

    // Mark current user's like state on these posts
    if (currentUserId && posts.length > 0) {
        const postIds = posts.map(p => p.id);
        const { data: likes } = await supabase
            .from(LIKES_TABLE)
            .select('post_id')
            .eq('user_id', currentUserId)
            .in('post_id', postIds);

        if (likes) {
            const likedPostIds = new Set(likes.map(l => l.post_id));
            posts.forEach(p => {
                p.isLiked = likedPostIds.has(p.id);
            });
        }
    }

    await markFollowingAuthors(posts, currentUserId);
    return posts;
};

/**
 * Fetch anonymous posts created by the current author for private self view.
 */
export const fetchAnonymousPostsByAuthor = async (authorId: string, currentUserId?: string): Promise<Post[]> => {
    if (!currentUserId || currentUserId !== authorId) {
        return [];
    }

    const { data, error } = await supabase
        .from(POSTS_TABLE)
        .select(POST_LIST_SELECT)
        .eq('author_id', authorId)
        .eq('is_anonymous', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching anonymous posts by author:', error);
        throw error;
    }

    let posts = (data || []).map(mapSupabaseToPost);

    const blockedIds = await getBlockedUserIds(currentUserId);
    if (blockedIds.length > 0) {
        const blockedSet = new Set(blockedIds);
        posts = posts.filter(p => !blockedSet.has(p.authorId));
    }

    if (posts.length > 0) {
        const postIds = posts.map(p => p.id);
        const { data: likes } = await supabase
            .from(LIKES_TABLE)
            .select('post_id')
            .eq('user_id', currentUserId)
            .in('post_id', postIds);

        if (likes) {
            const likedPostIds = new Set(likes.map(l => l.post_id));
            posts.forEach(p => {
                p.isLiked = likedPostIds.has(p.id);
            });
        }
    }

    await markFollowingAuthors(posts, currentUserId);
    return posts;
};

/**
 * Fetch posts liked by a specific user.
 */
export const fetchLikedPosts = async (userId: string, currentUserId?: string): Promise<Post[]> => {
    const { data: likes, error: likesError } = await supabase
        .from(LIKES_TABLE)
        .select('post_id')
        .eq('user_id', userId);

    if (likesError) {
        console.error('Error fetching liked posts:', likesError);
        throw likesError;
    }

    const likedPostIds = Array.from(new Set((likes || []).map(l => l.post_id)));
    if (likedPostIds.length === 0) {
        return [];
    }

    const { data, error } = await supabase
        .from(POSTS_TABLE)
        .select(POST_LIST_SELECT)
        .in('id', likedPostIds);

    if (error) {
        console.error('Error fetching liked post records:', error);
        throw error;
    }

    let posts = (data || []).map(mapSupabaseToPost);

    // Keep list order aligned with likes list order
    const idOrder = new Map<string, number>();
    likedPostIds.forEach((postId, index) => idOrder.set(postId, index));
    posts.sort((a, b) => (idOrder.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (idOrder.get(b.id) ?? Number.MAX_SAFE_INTEGER));

    if (currentUserId) {
        const blockedIds = await getBlockedUserIds(currentUserId);
        if (blockedIds.length > 0) {
            const blockedSet = new Set(blockedIds);
            posts = posts.filter(p => !blockedSet.has(p.authorId));
        }

        const postIds = posts.map(p => p.id);
        if (postIds.length > 0) {
            const { data: currentUserLikes } = await supabase
                .from(LIKES_TABLE)
                .select('post_id')
                .eq('user_id', currentUserId)
                .in('post_id', postIds);

            const currentLikedSet = new Set((currentUserLikes || []).map(l => l.post_id));
            posts.forEach(p => {
                p.isLiked = currentLikedSet.has(p.id);
            });
        }
    } else {
        const likedSet = new Set(likedPostIds);
        posts.forEach(p => {
            p.isLiked = likedSet.has(p.id);
        });
    }

    await markFollowingAuthors(posts, currentUserId);
    return posts;
};

/**
 * Search posts by query
 */
export const searchPosts = async (queryText: string, currentUserId?: string): Promise<Post[]> => {
    // using user-defined ilike search here. To make it more robust we can search by content or author name
    let query = supabase.from(POSTS_TABLE).select(POST_LIST_SELECT);

    if (queryText && queryText.trim().length > 0) {
        query = query.or(`content.ilike.%${queryText}%,author_name.ilike.%${queryText}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false }).limit(20);

    if (error) {
        console.error('Error searching posts:', error);
        throw error;
    }

    let posts = (data || []).map(mapSupabaseToPost);

    // Filter out posts from blocked users
    if (currentUserId) {
        const blockedIds = await getBlockedUserIds(currentUserId);
        if (blockedIds.length > 0) {
            const blockedSet = new Set(blockedIds);
            posts = posts.filter(p => !blockedSet.has(p.authorId));
        }
    }

    // If userId is provided, check which posts the user has liked
    if (currentUserId && posts.length > 0) {
        const postIds = posts.map(p => p.id);
        const { data: likes } = await supabase
            .from(LIKES_TABLE)
            .select('post_id')
            .eq('user_id', currentUserId)
            .in('post_id', postIds);

        if (likes) {
            const likedPostIds = new Set(likes.map(l => l.post_id));
            posts.forEach(p => {
                p.isLiked = likedPostIds.has(p.id);
            });
        }
    }

    await markFollowingAuthors(posts, currentUserId);
    return posts;
};

/**
 * Fetch a single post by ID
 */
export const fetchPostById = async (postId: string, currentUserId?: string): Promise<Post | null> => {
    const { data, error } = await supabase
        .from(POSTS_TABLE)
        .select(POST_LIST_SELECT)
        .eq('id', postId)
        .single();

    if (error) {
        console.error('Error fetching post by id:', error);
        return null;
    }

    if (!data) return null;

    const post = mapSupabaseToPost(data);

    if (currentUserId) {
        // blocked + following in parallel (both are now cached after first call)
        const [blockedIds, followingIds] = await Promise.all([
            getBlockedUserIds(currentUserId),
            getFollowingUserIds(currentUserId),
        ]);

        if (blockedIds.includes(post.authorId)) return null;

        post.isFollowingAuthor = followingIds.includes(post.authorId);
    }

    // Keep post cache warm
    cachePost(post);

    return post;
};

/**
 * Create a new post
 */
export const fetchPostsByPromptId = async (
    promptId: number,
    currentUserId?: string,
): Promise<Post[]> => {
    const { data, error } = await supabase
        .from(POSTS_TABLE)
        .select(POST_LIST_SELECT)
        .eq('prompt_id', promptId)
        .order('created_at', { ascending: false })
        .limit(100);

    if (error) throw error;
    const posts = (data || []).map(mapSupabaseToPost);
    if (currentUserId) await markFollowingAuthors(posts, currentUserId);
    return posts;
};

export const createPost = async (postData: {
    authorId: string;
    authorName: string;
    authorEmail?: string;
    authorMajor?: string;
    authorAvatar?: string;
    content: string;
    category: PostCategory;
    images?: string[];
    isAnonymous: boolean;
    location?: { lat: number; lng: number; name?: string };
    promptId?: number;
    topicTitleZh?: string;
    topicTitleEn?: string;
}) => {
    ensureContentSafety(postData.content, '帖子包含不符合社区规范的内容，请修改后再发布。');

    const insertData = {
        author_id: postData.authorId,
        author_name: postData.isAnonymous ? '匿名用户' : postData.authorName,
        author_email: postData.isAnonymous ? null : postData.authorEmail,
        author_major: postData.isAnonymous ? 'Anonymous' : postData.authorMajor,
        author_avatar: postData.isAnonymous ? null : postData.authorAvatar,
        content: postData.content,
        type: CATEGORY_TO_TYPE[postData.category],
        images: postData.images || [],
        is_anonymous: postData.isAnonymous,
        likes: 0,
        comments_count: 0,
        lat: postData.location?.lat,
        lng: postData.location?.lng,
        location_tag: postData.location?.name || null,
        prompt_id: postData.promptId ?? null,
        topic_title_zh: postData.topicTitleZh ?? null,
        topic_title_en: postData.topicTitleEn ?? null,
    };

    console.log('Inserting post data:', insertData);

    const { data, error } = await supabase
        .from(POSTS_TABLE)
        .insert([insertData])
        .select()
        .single();

    if (error) {
        console.error('Supabase error in createPost:', error);
        throw error;
    }

    // Map to post, but include the email from the input data
    const post = mapSupabaseToPost(data);
    if (!post.isAnonymous) {
        post.authorEmail = postData.authorEmail;
    }
    return post;
};

/**
 * Upload an image to Supabase Storage
 */
export const uploadPostImage = async (uri: string): Promise<string> => {
    try {
        const compressedUri = await compressImageForUpload(uri, 'feed');
        console.log('Starting image upload for URI:', compressedUri);

        // Use ArrayBuffer for more reliable binary handling in some RN environments
        const arrayBuffer: ArrayBuffer = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.error('XHR Error:', e);
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'arraybuffer';
            xhr.open('GET', compressedUri, true);
            xhr.send(null);
        });

        console.log('Generated ArrayBuffer size:', arrayBuffer.byteLength);

        if (arrayBuffer.byteLength === 0) {
            throw new Error('生成的图片文件为空，请尝试重新选择图片');
        }

        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
        const filePath = `posts/${fileName}`;

        const { data, error } = await supabase.storage
            .from('campus')
            .upload(filePath, arrayBuffer, {
                contentType: 'image/jpeg',
                cacheControl: IMMUTABLE_STORAGE_CACHE_CONTROL,
                upsert: true
            });

        if (error) {
            console.error('Supabase storage upload error:', error);
            throw error;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('campus')
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (e: any) {
        console.error('Network or upload error in uploadPostImage:', e);
        if (e.message === 'Network request failed') {
            throw new Error('网络请求失败，请检查网络连接或尝试更小的图片');
        }
        throw e;
    }
};

/**
 * Toggle like for a post
 */
export const togglePostLike = async (postId: string, userId: string) => {
    try {
        // Check if already liked
        const { data: existingLike } = await supabase
            .from(LIKES_TABLE)
            .select('*')
            .eq('post_id', postId)
            .eq('user_id', userId)
            .single();

        if (existingLike) {
            // Unlike
            await supabase.from(LIKES_TABLE).delete().eq('post_id', postId).eq('user_id', userId);
            return { liked: false };
        } else {
            // Like
            await supabase.from(LIKES_TABLE).insert([{ post_id: postId, user_id: userId }]);

            // Trigger notification
            const { createNotification } = await import('./notifications');
            const { data: postData } = await supabase.from(POSTS_TABLE).select('author_id, content').eq('id', postId).single();
            if (postData && postData.author_id !== userId) {
                await createNotification({
                    user_id: postData.author_id,
                    type: 'like',
                    title: 'notifications.title_like',
                    content: JSON.stringify({
                        key: 'notifications.post_like',
                        params: { content: postData.content.substring(0, 20) }
                    }),
                    related_id: postId,
                });
            }

            // Reward: mark the "first like" task complete (idempotent, non-blocking).
            void import('./rewards').then(({ completeTask }) => completeTask(userId, 'first_like')).catch(() => { });

            return { liked: true };
        }
    } catch (e) {
        console.error('Error toggling like:', e);
        throw e;
    }
};

/**
 * Toggle like on a comment (optimistic-update friendly — returns new liked state)
 */
export const toggleCommentLike = async (commentId: string, userId: string): Promise<{ liked: boolean }> => {
    const { data: existing } = await supabase
        .from(COMMENT_LIKES_TABLE)
        .select('comment_id')
        .eq('comment_id', commentId)
        .eq('user_id', userId)
        .maybeSingle();

    if (existing) {
        await supabase.from(COMMENT_LIKES_TABLE).delete().eq('comment_id', commentId).eq('user_id', userId);
        return { liked: false };
    } else {
        await supabase.from(COMMENT_LIKES_TABLE).insert([{ comment_id: commentId, user_id: userId }]);
        return { liked: true };
    }
};

/**
 * Fetch comments for a post
 */
export const fetchPostComments = async (postId: string, currentUserId?: string): Promise<PostComment[]> => {
    const [{ data, error }, { data: postMeta, error: postError }] = await Promise.all([
        supabase
            .from(COMMENTS_TABLE)
            .select('*, author:users!author_id(*)')
            .eq('post_id', postId)
            .order('created_at', { ascending: true }),
        supabase
            .from(POSTS_TABLE)
            .select('author_id, is_anonymous')
            .eq('id', postId)
            .maybeSingle(),
    ]);

    if (error) throw error;
    if (postError) throw postError;

    const anonymousPostAuthorId = postMeta?.is_anonymous ? postMeta.author_id : undefined;
    let rows = data || [];

    if (currentUserId) {
        const blockedIds = await getBlockedUserIds(currentUserId);
        if (blockedIds.length > 0) {
            const blockedSet = new Set(blockedIds);
            rows = rows.filter((row: any) => !blockedSet.has(row.author_id));
        }
    }

    const comments = rows.map(row => mapCommentRow(row, anonymousPostAuthorId));

    if (comments.length > 0) {
        const commentIds = comments.map(c => c.id);
        // Fetch like counts + current user's likes in parallel
        const [likesCountResult, userLikesResult] = await Promise.all([
            supabase.from(COMMENT_LIKES_TABLE).select('comment_id').in('comment_id', commentIds),
            currentUserId
                ? supabase.from(COMMENT_LIKES_TABLE).select('comment_id').eq('user_id', currentUserId).in('comment_id', commentIds)
                : Promise.resolve({ data: [] }),
        ]);

        if (likesCountResult.data) {
            const likeCountMap = new Map<string, number>();
            for (const row of likesCountResult.data) {
                likeCountMap.set(row.comment_id, (likeCountMap.get(row.comment_id) ?? 0) + 1);
            }
            const likedSet = new Set((userLikesResult.data || []).map((r: any) => r.comment_id));
            comments.forEach(c => {
                c.likes = likeCountMap.get(c.id) ?? 0;
                c.isLiked = likedSet.has(c.id);
            });
        }
    }

    return comments;
};

/**
 * Add a comment to a post
 */
export const addPostComment = async (commentData: {
    postId: string;
    authorId: string;
    authorName: string;
    authorEmail?: string;
    authorAvatar?: string;
    content: string;
    parentCommentId?: string;
    replyToName?: string;
}): Promise<PostComment> => {
    ensureContentSafety(commentData.content, '评论包含不符合社区规范的内容，请修改后再发布。');

    const { data: post, error: postError } = await supabase
        .from(POSTS_TABLE)
        .select('author_id, content, is_anonymous')
        .eq('id', commentData.postId)
        .single();

    if (postError) throw postError;

    const isAnonymous = !!post?.is_anonymous && post.author_id === commentData.authorId;

    const { data, error } = await supabase
        .from(COMMENTS_TABLE)
        .insert([{
            post_id: commentData.postId,
            author_id: commentData.authorId,
            author_name: isAnonymous ? ANONYMOUS_POST_AUTHOR_NAME : commentData.authorName,
            author_email: isAnonymous ? null : commentData.authorEmail,
            author_avatar: isAnonymous ? null : commentData.authorAvatar,
            content: commentData.content,
            parent_comment_id: commentData.parentCommentId,
            reply_to_name: commentData.replyToName,
        }])
        .select()
        .single();

    if (error) throw error;

    // Fire-and-forget notification — don't block comment return on it
    if (post && post.author_id !== commentData.authorId) {
        const isReply = !!commentData.parentCommentId;
        void import('./notifications').then(({ createNotification }) =>
            createNotification({
                user_id: post.author_id,
                type: 'comment',
                title: isReply ? 'notifications.title_reply' : 'notifications.title_comment',
                content: JSON.stringify({
                    key: isReply ? 'notifications.post_reply' : 'notifications.post_comment',
                    params: { name: commentData.authorName }
                }),
                related_id: commentData.postId,
            })
        ).catch(() => {});
    }

    // Reward: mark the "first comment" task complete (idempotent, non-blocking).
    void import('./rewards').then(({ completeTask }) => completeTask(commentData.authorId, 'first_comment')).catch(() => { });

    return {
        ...mapCommentRow(data, isAnonymous ? commentData.authorId : undefined),
        isAnonymous,
    };
};

/**
 * Delete a post
 */
export const deletePost = async (postId: string) => {
    const { error } = await supabase
        .from(POSTS_TABLE)
        .delete()
        .eq('id', postId);

    if (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
    return true;
};

/**
 * Delete a comment
 */
export const deleteComment = async (commentId: string) => {
    const { error } = await supabase
        .from(COMMENTS_TABLE)
        .delete()
        .eq('id', commentId);

    if (error) {
        console.error('Error deleting comment:', error);
        throw error;
    }
    return true;
};

/**
 * Subscribe to posts (All or by category)
 */
export const subscribeToPosts = (callback: (payload: any) => void) => {
    const channelName = `public:posts:${Date.now()}`;
    const channel = supabase
        .channel(channelName)
        .on('postgres_changes', { event: '*', schema: 'public', table: POSTS_TABLE }, callback)
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};
