export const IMMUTABLE_STORAGE_CACHE_CONTROL = '31536000';

export const normalizeRemoteImageUrl = (value?: string | null): string | null => {
    const trimmed = value?.trim();

    if (!trimmed) {
        return null;
    }

    return trimmed.startsWith('http://') || trimmed.startsWith('https://')
        ? trimmed
        : null;
};

export const isRemoteImageUrl = (value?: string | null): value is string =>
    normalizeRemoteImageUrl(value) !== null;

// ── Supabase Storage on-the-fly image transformation ────────────────────────
// Serving a feed-card-sized thumbnail (~400px) instead of the full uploaded
// image (~1080px) cuts network transfer ~5-8x — the biggest "time to fully
// painted" win on image-heavy lists.
//
// IMPORTANT: the /render/image/ endpoint requires the **Image Transformation**
// feature to be turned ON for the project (Pro plan alone is NOT enough — it
// must be enabled under Storage settings). When it is off, the endpoint returns
// 403 {"error":"FeatureNotEnabled"} and every thumbnail goes blank.
//
// Verified 2026-06-18: this project's render endpoint returns
//   403 FeatureNotEnabled
// so the feature is not active yet. Keep this OFF until it's enabled in the
// Supabase dashboard, then flip to true — no other code changes needed.
// (CachedRemoteImage also falls back to the original URL on load error, so a
// stale "true" here degrades to full-size images instead of blanks.)
export const ENABLE_STORAGE_IMAGE_TRANSFORM = false;

const STORAGE_OBJECT_MARKER = '/storage/v1/object/public/';

/**
 * Rewrite a Supabase Storage public object URL to a width-constrained,
 * re-compressed render URL. Returns the original (normalized) URL unchanged
 * when the flag is off, the URL isn't a Supabase storage object, or it's not a
 * remote URL — so it's always safe to call.
 */
export const buildStorageThumbUrl = (
    value: string | null | undefined,
    width: number,
    quality: number = 70,
): string | null => {
    const normalized = normalizeRemoteImageUrl(value);
    if (!normalized) return null;
    if (!ENABLE_STORAGE_IMAGE_TRANSFORM) return normalized;

    const idx = normalized.indexOf(STORAGE_OBJECT_MARKER);
    if (idx === -1) return normalized; // not a Supabase storage object URL

    const base = normalized.slice(0, idx);
    const objectPath = normalized.slice(idx + STORAGE_OBJECT_MARKER.length);
    return `${base}/storage/v1/render/image/public/${objectPath}`
        + `?width=${Math.round(width)}&quality=${quality}&resize=cover`;
};
