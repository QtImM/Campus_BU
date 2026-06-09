import { ForumCategory, ForumComment, ForumContentType, ForumLanguage, ForumPost, ForumSort, ForumSourceRef } from '../types';
import { ensureContentSafety } from './contentFilter';
import { compressImageForUpload } from '../utils/image';
import { IMMUTABLE_STORAGE_CACHE_CONTROL } from '../utils/remoteImage';
import { getFollowingUserIds } from './follows';
import { getBlockedUserIds } from './moderation';
import { supabase } from './supabase';

const FORUM_POSTS = 'forum_posts';
const FORUM_COMMENTS = 'forum_comments';
const FORUM_UPVOTES = 'forum_upvotes';

// ── Client-side cache (instant detail-page render) ────────────────────────────
const _forumPostCache = new Map<string, { post: ForumPost; ts: number }>();
const FORUM_POST_CACHE_TTL = 60_000; // 1 min

export const cacheForumPost = (post: ForumPost) => {
    _forumPostCache.set(post.id, { post, ts: Date.now() });
};

export const getCachedForumPost = (postId: string): ForumPost | null => {
    const entry = _forumPostCache.get(postId);
    if (!entry || Date.now() - entry.ts > FORUM_POST_CACHE_TTL) return null;
    return entry.post;
};

// ── Helper: 原子地调整帖子的 reply_count / upvote_count ─────────────────────────
// 对应 supabase migration 20260420_forum_editorial_support.sql 中的 RPC
const incrementForumPostCounts = async (
    postId: string,
    opts: { replyDelta?: number; upvoteDelta?: number },
) => {
    const { error } = await supabase.rpc('forum_posts_increment_counts', {
        p_post_id: postId,
        p_reply_delta: opts.replyDelta ?? 0,
        p_upvote_delta: opts.upvoteDelta ?? 0,
    });
    if (error) throw error;
};

// ── Mapper ────────────────────────────────────────────────────────────────────
const mapRow = (row: any): ForumPost => {
    let images: string[] = [];
    if (Array.isArray(row.images)) images = row.images;
    else if (typeof row.images === 'string') {
        try { images = JSON.parse(row.images); } catch { }
    }

    let sources: ForumSourceRef[] | undefined;
    if (Array.isArray(row.sources)) sources = row.sources;
    else if (typeof row.sources === 'string') {
        try { sources = JSON.parse(row.sources); } catch { }
    }

    const tags: string[] | undefined = Array.isArray(row.tags) ? row.tags : undefined;

    return {
        id: row.id,
        title: row.title,
        content: row.content || '',
        authorId: row.author_id,
        authorName: row.author_name,
        authorEmail: row.author_email,
        authorAvatar: row.author_avatar,
        category: row.category as ForumCategory,
        images,
        replyCount: row.reply_count || 0,
        upvoteCount: row.upvote_count || 0,
        isUpvoted: false,
        isFollowingAuthor: false,
        lastReplyAt: new Date(row.last_reply_at),
        createdAt: new Date(row.created_at),

        // ── 编辑部攻略字段（20260420 新增）──────────────────────────────────
        contentType: (row.content_type as ForumContentType) || 'user_post',
        sources,
        lastVerifiedAt: row.last_verified_at ? new Date(row.last_verified_at) : undefined,
        tags,
        isPinned: row.is_pinned ?? false,
        pinnedAt: row.pinned_at ? new Date(row.pinned_at) : undefined,
        language: (row.language as ForumLanguage) || undefined,
        translationGroup: row.translation_group || undefined,
        summary: row.summary || undefined,
        viewCount: row.view_count ?? 0,
    };
};

// ── Helper: Mark following authors ────────────────────────────────────────────
const markFollowingAuthors = async (posts: ForumPost[], currentUserId?: string) => {
    if (!currentUserId || posts.length === 0) return;

    const followingIds = await getFollowingUserIds(currentUserId);
    if (followingIds.length === 0) return;

    const followingSet = new Set(followingIds);
    posts.forEach(p => {
        p.isFollowingAuthor = followingSet.has(p.authorId);
    });
};

export const FORUM_PAGE_SIZE = 20;

// ── Category list cache (instant category page render, first page only) ───────
const _categoryListCache = new Map<string, { posts: ForumPost[]; ts: number }>();
const CATEGORY_LIST_CACHE_TTL = 60_000;

export const getCachedCategoryList = (category: string, sort: string): ForumPost[] | null => {
    const key = `${category}:${sort}`;
    const entry = _categoryListCache.get(key);
    if (!entry || Date.now() - entry.ts > CATEGORY_LIST_CACHE_TTL) return null;
    return entry.posts;
};

const cacheCategoryList = (category: string, sort: string, posts: ForumPost[]) => {
    _categoryListCache.set(`${category}:${sort}`, { posts, ts: Date.now() });
};

// ── Fetch list ────────────────────────────────────────────────────────────────
export const fetchForumPosts = async (
    category: ForumCategory | 'all' = 'all',
    sort: ForumSort = 'latest_reply',
    currentUserId?: string,
    page?: number,
    pageSize: number = FORUM_PAGE_SIZE,
): Promise<ForumPost[]> => {
    let query = supabase.from(FORUM_POSTS).select('*').eq('status', 'published');

    if (category !== 'all') {
        query = query.eq('category', category);
    }

    if (sort === 'recommended') {
        // Recommended logic: Priority to pinned posts, then most recent activity
        query = query
            .order('is_pinned', { ascending: false })
            .order('last_reply_at', { ascending: false });
    } else if (sort === 'hot') {
        // Hot logic: Priority to pinned, then engagement (upvotes)
        query = query
            .order('is_pinned', { ascending: false })
            .order('upvote_count', { ascending: false })
            .order('reply_count', { ascending: false });
    } else {
        const orderCol = sort === 'latest_reply' ? 'last_reply_at' : 'created_at';
        query = query.order(orderCol, { ascending: false });
    }

    if (page !== undefined) {
        const from = page * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);
    }

    const { data, error } = await query;
    if (error) throw error;

    let posts = (data || []).map(mapRow);

    if (currentUserId) {
        const blockedIds = await getBlockedUserIds(currentUserId);
        if (blockedIds.length > 0) {
            const blockedSet = new Set(blockedIds);
            posts = posts.filter((post) => !blockedSet.has(post.authorId));
        }
    }

    if (currentUserId && posts.length > 0) {
        const ids = posts.map(p => p.id);
        const { data: upvotes } = await supabase
            .from(FORUM_UPVOTES)
            .select('post_id')
            .eq('user_id', currentUserId)
            .in('post_id', ids);

        if (upvotes) {
            const set = new Set(upvotes.map((u: any) => u.post_id));
            posts.forEach(p => { p.isUpvoted = set.has(p.id); });
        }
    }

    await markFollowingAuthors(posts, currentUserId);

    posts.forEach(cacheForumPost);
    if (page === undefined || page === 0) cacheCategoryList(category, sort, posts);

    return posts;
};

// ── Search list ────────────────────────────────────────────────────────────────
export const searchForumPosts = async (
    queryText: string,
    currentUserId?: string,
): Promise<ForumPost[]> => {
    let query = supabase.from(FORUM_POSTS).select('*').eq('status', 'published');

    if (queryText && queryText.trim().length > 0) {
        query = query.or(`title.ilike.%${queryText}%,content.ilike.%${queryText}%,author_name.ilike.%${queryText}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false }).limit(20);
    if (error) throw error;

    let posts = (data || []).map(mapRow);

    if (currentUserId) {
        const blockedIds = await getBlockedUserIds(currentUserId);
        if (blockedIds.length > 0) {
            const blockedSet = new Set(blockedIds);
            posts = posts.filter((post) => !blockedSet.has(post.authorId));
        }
    }

    if (currentUserId && posts.length > 0) {
        const ids = posts.map(p => p.id);
        const { data: upvotes } = await supabase
            .from(FORUM_UPVOTES)
            .select('post_id')
            .eq('user_id', currentUserId)
            .in('post_id', ids);

        if (upvotes) {
            const set = new Set(upvotes.map((u: any) => u.post_id));
            posts.forEach(p => { p.isUpvoted = set.has(p.id); });
        }
    }

    await markFollowingAuthors(posts, currentUserId);

    posts.forEach(cacheForumPost);

    return posts;
};

// ── Fetch single post ─────────────────────────────────────────────────────────
export const fetchForumPostById = async (
    postId: string,
    currentUserId?: string,
): Promise<ForumPost | null> => {
    const { data, error } = await supabase
        .from(FORUM_POSTS)
        .select('*')
        .eq('id', postId)
        .single();

    if (error || !data) return null;

    const post = mapRow(data);

    if (currentUserId) {
        const blockedIds = await getBlockedUserIds(currentUserId);
        if (blockedIds.includes(post.authorId)) {
            return null;
        }

        const { data: upvote } = await supabase
            .from(FORUM_UPVOTES)
            .select('post_id')
            .eq('post_id', postId)
            .eq('user_id', currentUserId)
            .maybeSingle();
        post.isUpvoted = !!upvote;

        // Mark following status
        const followingIds = await getFollowingUserIds(currentUserId);
        post.isFollowingAuthor = followingIds.includes(post.authorId);
    }

    cacheForumPost(post);
    return post;
};

// ── Create post ───────────────────────────────────────────────────────────────
export const createForumPost = async (data: {
    authorId: string;
    authorName: string;
    authorEmail?: string;
    authorAvatar?: string;
    title: string;
    content?: string;
    category: ForumCategory;
    images?: string[];
}): Promise<ForumPost> => {
    ensureContentSafety(data.title, '帖子标题包含不符合社区规范的内容，请修改后再发布。');
    ensureContentSafety(data.content || '', '帖子内容包含不符合社区规范的内容，请修改后再发布。');

    const { data: row, error } = await supabase
        .from(FORUM_POSTS)
        .insert([{
            author_id: data.authorId,
            author_name: data.authorName,
            author_email: data.authorEmail,
            author_avatar: data.authorAvatar,
            title: data.title,
            content: data.content || '',
            category: data.category,
            images: data.images || [],
        }])
        .select()
        .single();

    if (error) throw error;
    return mapRow(row);
};

// ── Add comment ───────────────────────────────────────────────────────────────
export const addForumComment = async (data: {
    postId: string;
    authorId: string;
    authorName: string;
    authorEmail?: string;
    authorAvatar?: string;
    content: string;
    parentCommentId?: string;
    replyToName?: string;
}): Promise<ForumComment> => {
    ensureContentSafety(data.content, '评论包含不符合社区规范的内容，请修改后再发布。');

    const { data: row, error } = await supabase
        .from(FORUM_COMMENTS)
        .insert([{
            post_id: data.postId,
            author_id: data.authorId,
            author_name: data.authorName,
            author_email: data.authorEmail,
            author_avatar: data.authorAvatar,
            content: data.content,
            parent_comment_id: data.parentCommentId,
            reply_to_name: data.replyToName,
        }])
        .select()
        .single();

    if (error) throw error;

    // 原子地把 reply_count + 1 并刷新 last_reply_at（RPC 会处理）
    try {
        await incrementForumPostCounts(data.postId, { replyDelta: 1 });
    } catch { /* non-blocking */ }

    return {
        id: row.id,
        postId: row.post_id,
        authorId: row.author_id,
        authorName: row.author_name,
        authorEmail: row.author_email,
        authorAvatar: row.author_avatar,
        content: row.content,
        parentCommentId: row.parent_comment_id,
        replyToName: row.reply_to_name,
        createdAt: new Date(row.created_at),
    };
};

// ── Fetch comments ────────────────────────────────────────────────────────────
export const fetchForumComments = async (postId: string, currentUserId?: string): Promise<ForumComment[]> => {
    const { data, error } = await supabase
        .from(FORUM_COMMENTS)
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

    if (error) throw error;

    let rows = data || [];

    if (currentUserId) {
        const blockedIds = await getBlockedUserIds(currentUserId);
        if (blockedIds.length > 0) {
            const blockedSet = new Set(blockedIds);
            rows = rows.filter((row: any) => !blockedSet.has(row.author_id));
        }
    }

    return rows.map(row => ({
        id: row.id,
        postId: row.post_id,
        authorId: row.author_id,
        authorName: row.author_name,
        authorEmail: row.author_email,
        authorAvatar: row.author_avatar,
        content: row.content,
        parentCommentId: row.parent_comment_id,
        replyToName: row.reply_to_name,
        createdAt: new Date(row.created_at),
    }));
};

// ── Toggle upvote ─────────────────────────────────────────────────────────────
export const toggleForumUpvote = async (postId: string, userId: string) => {
    const { data: existing } = await supabase
        .from(FORUM_UPVOTES)
        .select('post_id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle();

    if (existing) {
        await supabase.from(FORUM_UPVOTES).delete().eq('post_id', postId).eq('user_id', userId);
        try {
            await incrementForumPostCounts(postId, { upvoteDelta: -1 });
        } catch { /* non-blocking */ }
        return { upvoted: false };
    } else {
        await supabase.from(FORUM_UPVOTES).insert([{ post_id: postId, user_id: userId }]);
        try {
            await incrementForumPostCounts(postId, { upvoteDelta: 1 });
        } catch { /* non-blocking */ }
        return { upvoted: true };
    }
};

// ── Delete post ───────────────────────────────────────────────────────────────
export const deleteForumPost = async (postId: string) => {
    const { error } = await supabase.from(FORUM_POSTS).delete().eq('id', postId);
    if (error) throw error;
};

// ── Delete comment ────────────────────────────────────────────────────────────
export const deleteForumComment = async (commentId: string, postId: string) => {
    const { error } = await supabase.from(FORUM_COMMENTS).delete().eq('id', commentId);
    if (error) throw error;
    try {
        await incrementForumPostCounts(postId, { replyDelta: -1 });
    } catch { /* non-blocking */ }
};

// ── Upload image (reuses campus Storage bucket under forum/ prefix) ────────────
export const uploadForumImage = async (uri: string): Promise<string> => {
    const compressedUri = await compressImageForUpload(uri, 'feed');

    const arrayBuffer: ArrayBuffer = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = () => reject(new TypeError('Network request failed'));
        xhr.responseType = 'arraybuffer';
        xhr.open('GET', compressedUri, true);
        xhr.send(null);
    });

    if (arrayBuffer.byteLength === 0) throw new Error('Image file is empty');

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
    const filePath = `forum/${fileName}`;

    const { error } = await supabase.storage
        .from('campus')
        .upload(filePath, arrayBuffer, {
            contentType: 'image/jpeg',
            cacheControl: IMMUTABLE_STORAGE_CACHE_CONTROL,
            upsert: true,
        });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage.from('campus').getPublicUrl(filePath);
    return publicUrl;
}

// ── Official post review (admin only) ─────────────────────────────────────────

export interface PendingOfficialPost {
    id: string;
    title: string;
    summary: string | null;
    url: string | null;
    imageUrl: string | null;
    createdAt: Date;
}

export const fetchPendingOfficialPosts = async (): Promise<PendingOfficialPost[]> => {
    const { data, error } = await supabase
        .from(FORUM_POSTS)
        .select('id, title, summary, sources, images, created_at')
        .eq('content_type', 'official')
        .eq('status', 'pending_review')
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) throw error;

    return (data ?? []).map((row: any) => {
        const sources = Array.isArray(row.sources) ? row.sources : [];
        const images = Array.isArray(row.images) ? row.images : [];
        const sourceUrl = sources[0]?.url ?? null;
        return {
            id: row.id,
            title: row.title ?? '',
            summary: row.summary ?? null,
            url: sourceUrl,
            imageUrl: images[0] ?? null,
            createdAt: new Date(row.created_at),
        };
    });
};

export const reviewOfficialPost = async (
    postId: string,
    action: 'publish' | 'reject',
): Promise<void> => {
    const { error } = await supabase
        .from(FORUM_POSTS)
        .update({ status: action === 'publish' ? 'published' : 'rejected' })
        .eq('id', postId);
    if (error) throw error;
};
