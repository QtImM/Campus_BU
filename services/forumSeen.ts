import storage from '../lib/storage';

// Tracks the last time the user opened each forum category, so we can show a
// red dot on a section when newer posts exist than what they last saw.
const FORUM_SEEN_STORAGE_KEY = 'forum_category_last_seen';

type SeenMap = Record<string, number>;

const parseSeen = (raw: string | null): SeenMap => {
    if (!raw) return {};
    try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            const out: SeenMap = {};
            for (const [k, v] of Object.entries(parsed)) {
                if (typeof v === 'number' && Number.isFinite(v)) out[k] = v;
            }
            return out;
        }
    } catch {
        // fall through
    }
    return {};
};

export const getCategorySeenMap = async (): Promise<SeenMap> => {
    const raw = await storage.getItem(FORUM_SEEN_STORAGE_KEY);
    return parseSeen(raw);
};

export const markCategorySeen = async (category: string, at: number = Date.now()): Promise<SeenMap> => {
    const current = await getCategorySeenMap();
    const next = { ...current, [category]: at };
    await storage.setItem(FORUM_SEEN_STORAGE_KEY, JSON.stringify(next));
    return next;
};

// Merge several category timestamps in a single read/write (avoids races).
export const mergeCategoriesSeen = async (entries: SeenMap): Promise<SeenMap> => {
    const current = await getCategorySeenMap();
    const next = { ...current, ...entries };
    await storage.setItem(FORUM_SEEN_STORAGE_KEY, JSON.stringify(next));
    return next;
};

// Returns the set of category ids that have posts newer than the last seen time.
export const computeUnseenCategories = (
    latestByCategory: Record<string, number>,
    seen: SeenMap,
): Set<string> => {
    const unseen = new Set<string>();
    for (const [cat, latest] of Object.entries(latestByCategory)) {
        const lastSeen = seen[cat];
        // First time we ever see a category with posts shouldn't flag as "new"
        // for existing users; only flag when we have a baseline and it's older.
        if (lastSeen === undefined) continue;
        if (latest > lastSeen) unseen.add(cat);
    }
    return unseen;
};
