// lib/cacheRegistry.ts
//
// A tiny registry so any module holding an in-memory cache can have it cleared
// on sign-out / account switch, without auth.ts having to import every screen
// or service (which would create circular dependencies).
//
// Modules call `registerCacheReset(fn)` at module-eval time; auth.ts calls
// `resetAllCaches()` inside signOut()/signIn(). Only modules that have actually
// been loaded register a reset — and an unloaded module has no stale cache to
// clear, so the set of resets always matches the set of live caches.

type ResetFn = () => void;

const resets = new Set<ResetFn>();

export const registerCacheReset = (fn: ResetFn): void => {
    resets.add(fn);
};

export const resetAllCaches = (): void => {
    resets.forEach((fn) => {
        try {
            fn();
        } catch (e) {
            console.warn('[cacheRegistry] reset failed:', e);
        }
    });
};
