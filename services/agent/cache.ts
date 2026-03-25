type CacheEntry<T> = {
    value: T;
    expiresAt: number;
};

const cacheStore = new Map<string, CacheEntry<unknown>>();
const cacheStats = {
    hits: 0,
    misses: 0,
    writes: 0,
};

export const getCachedValue = <T>(key: string): T | null => {
    const entry = cacheStore.get(key);
    if (!entry) {
        cacheStats.misses += 1;
        return null;
    }

    if (Date.now() > entry.expiresAt) {
        cacheStore.delete(key);
        cacheStats.misses += 1;
        return null;
    }

    cacheStats.hits += 1;
    return entry.value as T;
};

export const setCachedValue = <T>(key: string, value: T, ttlMs: number): T => {
    cacheStore.set(key, {
        value,
        expiresAt: Date.now() + ttlMs,
    });
    cacheStats.writes += 1;
    return value;
};

export const getOrSetCachedValue = async <T>(
    key: string,
    ttlMs: number,
    loader: () => Promise<T>
): Promise<T> => {
    const hit = getCachedValue<T>(key);
    if (hit !== null) return hit;

    const value = await loader();
    return setCachedValue(key, value, ttlMs);
};

export const clearAgentCache = () => {
    cacheStore.clear();
    cacheStats.hits = 0;
    cacheStats.misses = 0;
    cacheStats.writes = 0;
};

export const getAgentCacheStats = () => ({
    ...cacheStats,
    size: cacheStore.size,
});
