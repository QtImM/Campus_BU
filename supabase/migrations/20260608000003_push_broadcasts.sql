-- Migration: push_broadcasts audit table for admin broadcast push notifications

CREATE TABLE IF NOT EXISTS public.push_broadcasts (
    id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id     TEXT        NOT NULL,
    admin_id    UUID        NOT NULL REFERENCES public.users(id) ON DELETE SET NULL,
    title       TEXT        NOT NULL,
    body        TEXT        NOT NULL,
    sent_count  INTEGER     NOT NULL DEFAULT 0,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_push_broadcasts_post_id    ON public.push_broadcasts(post_id);
CREATE INDEX IF NOT EXISTS idx_push_broadcasts_created_at ON public.push_broadcasts(created_at DESC);

ALTER TABLE public.push_broadcasts ENABLE ROW LEVEL SECURITY;

-- Admins can read (needed for client-side pre-checks and display)
DROP POLICY IF EXISTS "admins_can_read_push_broadcasts" ON public.push_broadcasts;
CREATE POLICY "admins_can_read_push_broadcasts"
    ON public.push_broadcasts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.app_admins
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Only service_role can insert (edge function uses service key, bypasses RLS)
GRANT SELECT ON public.push_broadcasts TO authenticated;
GRANT SELECT, INSERT ON public.push_broadcasts TO service_role;
