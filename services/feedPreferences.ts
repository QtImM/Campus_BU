import storage from '../lib/storage';

export const FEED_HIDDEN_POSTS_STORAGE_KEY = 'feed_hidden_post_ids';

const parseStoredIds = (rawValue: string | null): string[] => {
    if (!rawValue) {
        return [];
    }

    try {
        const parsed = JSON.parse(rawValue);
        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.filter((value): value is string => typeof value === 'string' && value.trim().length > 0);
    } catch {
        return [];
    }
};

export const getHiddenPostIds = async (): Promise<string[]> => {
    const rawValue = await storage.getItem(FEED_HIDDEN_POSTS_STORAGE_KEY);
    return parseStoredIds(rawValue);
};

export const addHiddenPostId = async (postId: string): Promise<string[]> => {
    const currentIds = await getHiddenPostIds();
    const nextIds = Array.from(new Set([...currentIds, postId]));
    await storage.setItem(FEED_HIDDEN_POSTS_STORAGE_KEY, JSON.stringify(nextIds));
    return nextIds;
};

export const removeHiddenPostId = async (postId: string): Promise<string[]> => {
    const currentIds = await getHiddenPostIds();
    const nextIds = currentIds.filter((id) => id !== postId);

    if (nextIds.length === 0) {
        await storage.removeItem(FEED_HIDDEN_POSTS_STORAGE_KEY);
        return [];
    }

    await storage.setItem(FEED_HIDDEN_POSTS_STORAGE_KEY, JSON.stringify(nextIds));
    return nextIds;
};

export const filterHiddenPosts = <T extends { id: string }>(posts: T[], hiddenPostIds: string[]): T[] => {
    if (hiddenPostIds.length === 0) {
        return posts;
    }

    const hiddenIds = new Set(hiddenPostIds);
    return posts.filter((post) => !hiddenIds.has(post.id));
};
