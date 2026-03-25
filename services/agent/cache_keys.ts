const normalizeSegment = (value: string): string => value.trim().toLowerCase().replace(/\s+/g, ' ');

export const buildToolCacheKey = (
    toolName: string,
    payload: Record<string, unknown>,
    options?: { userId?: string; version?: string }
): string => {
    const normalizedPayload = Object.entries(payload)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${normalizeSegment(String(value ?? ''))}`)
        .join('|');

    const suffix = [
        options?.userId ? `user=${options.userId}` : '',
        options?.version ? `ver=${options.version}` : '',
    ].filter(Boolean).join('|');

    return ['tool', toolName, normalizedPayload, suffix].filter(Boolean).join('::');
};

export const buildResponseCacheKey = (
    payload: Record<string, unknown>,
    options?: { model?: string; version?: string }
): string => {
    const normalizedPayload = Object.entries(payload)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${normalizeSegment(String(value ?? ''))}`)
        .join('|');

    const suffix = [
        options?.model ? `model=${options.model}` : '',
        options?.version ? `ver=${options.version}` : '',
    ].filter(Boolean).join('|');

    return ['response', normalizedPayload, suffix].filter(Boolean).join('::');
};
