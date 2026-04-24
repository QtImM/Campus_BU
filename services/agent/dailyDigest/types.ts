export interface DigestItem {
    title: string;
    url: string;
    lineIndex?: number;
    contextSnippet?: string;
}

export interface DailyDigestPayload {
    digestId: string;
    date: string;
    sourceUrl: string;
    summary: string;
    items: DigestItem[];
    message: string;
    createdAt: string;
}

export interface DigestJobResult {
    ok: boolean;
    payload?: DailyDigestPayload;
    fromCache?: boolean;
    reason?: 'missing_user_id' | 'disabled' | 'no_new_content' | 'job_failed';
}

export interface DailyDigestJobOptions {
    ignoreEnabledCheck?: boolean;
    sendPush?: boolean;
    forceRefresh?: boolean;
}
