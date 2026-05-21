import { supabase, SUPABASE_KEY, SUPABASE_URL } from './supabase';

export type SupabaseDiagnosticItem = {
    label: string;
    ok: boolean;
    detail: string;
};

const formatError = (error: unknown): string => {
    if (error instanceof Error) {
        return `${error.name}: ${error.message}`;
    }

    if (typeof error === 'object' && error) {
        try {
            return JSON.stringify(error);
        } catch {
            return String(error);
        }
    }

    return String(error);
};

const runCheck = async (label: string, fn: () => Promise<string>): Promise<SupabaseDiagnosticItem> => {
    try {
        const detail = await fn();
        return { label, ok: true, detail };
    } catch (error) {
        return { label, ok: false, detail: formatError(error) };
    }
};

export const runSupabaseDiagnostics = async (): Promise<SupabaseDiagnosticItem[]> => {
    const headers = {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
    };

    return Promise.all([
        runCheck('generic https', async () => {
            const response = await fetch('https://example.com');
            return `HTTP ${response.status}`;
        }),
        runCheck('supabase root', async () => {
            const response = await fetch(`${SUPABASE_URL}/`);
            return `HTTP ${response.status}`;
        }),
        runCheck('auth settings', async () => {
            const response = await fetch(`${SUPABASE_URL}/auth/v1/settings`, { headers });
            const text = await response.text();
            return `HTTP ${response.status} ${text.slice(0, 180)}`;
        }),
        runCheck('rest posts', async () => {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/posts?select=id&limit=1`, {
                headers,
            });
            const text = await response.text();
            return `HTTP ${response.status} ${text.slice(0, 180)}`;
        }),
        runCheck('supabase session', async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                throw error;
            }
            return data.session?.user?.id
                ? `session user ${data.session.user.id}`
                : 'no active session';
        }),
        runCheck('supabase posts query', async () => {
            const { data, error } = await supabase
                .from('posts')
                .select('id')
                .limit(1);

            if (error) {
                throw error;
            }

            return `rows ${data?.length ?? 0}`;
        }),
    ]);
};
