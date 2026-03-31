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
