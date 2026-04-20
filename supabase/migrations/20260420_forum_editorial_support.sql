-- ============================================================================
-- Forum Editorial Support
-- ============================================================================
-- Purpose: enable admin-authored "editorial" / "official" posts in forum_posts
--          for curated content such as HKBU freshman orientation guides.
--
-- Adds:
--   - content_type  : distinguishes user posts from editorial/official content
--   - sources       : JSONB array for transparent source attribution
--   - last_verified_at : tracks when editorial content was last confirmed accurate
--   - tags          : fine-grained classification (e.g. orientation / dorm)
--   - is_pinned / pinned_at : surface important guides on top
--   - language      : per-post localization (zh-Hans / zh-Hant / en)
--   - translation_group : groups multi-language versions of the same guide
--   - summary       : TL;DR preview
--   - view_count    : popularity signal
--
-- Hardens RLS:
--   - Fixes the existing "forum_posts_update_counts" policy, which allowed any
--     authenticated user to UPDATE any row of forum_posts (not only counts).
--   - Routes reply/upvote count increments through a SECURITY DEFINER RPC.
--   - Restricts content_type in ('editorial','official') to admins only.
--
-- Adds a trigger that refreshes last_verified_at whenever an editorial post's
-- content or sources are edited.
--
-- Adds a helper view `forum_editorial_posts` with a freshness status tag.
-- ============================================================================


-- ──────────────────────────────────────────────────────────────────────────
-- 1. Schema additions
-- ──────────────────────────────────────────────────────────────────────────

ALTER TABLE public.forum_posts
    ADD COLUMN IF NOT EXISTS content_type TEXT NOT NULL DEFAULT 'user_post'
        CHECK (content_type IN ('user_post', 'editorial', 'official')),

    ADD COLUMN IF NOT EXISTS sources JSONB NOT NULL DEFAULT '[]'::jsonb,

    ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMPTZ,

    ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],

    ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN NOT NULL DEFAULT false,

    ADD COLUMN IF NOT EXISTS pinned_at TIMESTAMPTZ,

    ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'zh-Hans'
        CHECK (language IN ('zh-Hans', 'zh-Hant', 'en')),

    ADD COLUMN IF NOT EXISTS translation_group UUID,

    ADD COLUMN IF NOT EXISTS summary TEXT,

    ADD COLUMN IF NOT EXISTS view_count INTEGER NOT NULL DEFAULT 0;


-- ──────────────────────────────────────────────────────────────────────────
-- 2. Indexes
-- ──────────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS forum_posts_content_type_idx
    ON public.forum_posts (content_type);

CREATE INDEX IF NOT EXISTS forum_posts_pinned_idx
    ON public.forum_posts (is_pinned, pinned_at DESC)
    WHERE is_pinned = true;

CREATE INDEX IF NOT EXISTS forum_posts_tags_gin_idx
    ON public.forum_posts USING GIN (tags);

CREATE INDEX IF NOT EXISTS forum_posts_language_idx
    ON public.forum_posts (language);

CREATE INDEX IF NOT EXISTS forum_posts_translation_group_idx
    ON public.forum_posts (translation_group)
    WHERE translation_group IS NOT NULL;


-- ──────────────────────────────────────────────────────────────────────────
-- 3. RLS hardening
--    3a. Drop the overly-permissive update_counts policy
--    3b. Replace with a SECURITY DEFINER RPC for count deltas
--    3c. Restrict editorial/official content_type to admins
-- ──────────────────────────────────────────────────────────────────────────

-- 3a. Remove the leaky policy
DROP POLICY IF EXISTS "forum_posts_update_counts" ON public.forum_posts;


-- 3b. Atomic count-increment RPC (replaces the broad UPDATE permission)
CREATE OR REPLACE FUNCTION public.forum_posts_increment_counts(
    p_post_id      UUID,
    p_reply_delta  INTEGER DEFAULT 0,
    p_upvote_delta INTEGER DEFAULT 0
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Must be authenticated to update forum post counts';
    END IF;

    UPDATE public.forum_posts
        SET reply_count   = GREATEST(0, reply_count  + p_reply_delta),
            upvote_count  = GREATEST(0, upvote_count + p_upvote_delta),
            last_reply_at = CASE WHEN p_reply_delta > 0 THEN NOW()
                                 ELSE last_reply_at
                            END
        WHERE id = p_post_id;
END;
$$;

REVOKE ALL ON FUNCTION public.forum_posts_increment_counts(UUID, INTEGER, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.forum_posts_increment_counts(UUID, INTEGER, INTEGER) TO authenticated;


-- 3c. Re-create insert/update policies with content_type gating

DROP POLICY IF EXISTS "forum_posts_insert_auth" ON public.forum_posts;
CREATE POLICY "forum_posts_insert_auth"
    ON public.forum_posts FOR INSERT
    WITH CHECK (
        auth.uid() = author_id
        AND (
            content_type = 'user_post'
            OR public.is_user_admin(auth.uid())
        )
    );

DROP POLICY IF EXISTS "forum_posts_update_own" ON public.forum_posts;
CREATE POLICY "forum_posts_update_own"
    ON public.forum_posts FOR UPDATE
    USING (auth.uid() = author_id)
    WITH CHECK (
        auth.uid() = author_id
        AND (
            content_type = 'user_post'
            OR public.is_user_admin(auth.uid())
        )
    );

-- Admins can update any post (pin, re-tag, correct content)
DROP POLICY IF EXISTS "forum_posts_admin_update" ON public.forum_posts;
CREATE POLICY "forum_posts_admin_update"
    ON public.forum_posts FOR UPDATE
    USING (public.is_user_admin(auth.uid()))
    WITH CHECK (public.is_user_admin(auth.uid()));


-- ──────────────────────────────────────────────────────────────────────────
-- 4. Trigger: refresh last_verified_at on content edits to editorial posts
-- ──────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.forum_posts_touch_verified_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.content_type IN ('editorial', 'official')
       AND (OLD.content IS DISTINCT FROM NEW.content
            OR OLD.sources IS DISTINCT FROM NEW.sources) THEN
        NEW.last_verified_at = NOW();
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS forum_posts_touch_verified_at_trg ON public.forum_posts;
CREATE TRIGGER forum_posts_touch_verified_at_trg
    BEFORE UPDATE ON public.forum_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.forum_posts_touch_verified_at();


-- ──────────────────────────────────────────────────────────────────────────
-- 5. Helper view: editorial feed with freshness annotation
-- ──────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW public.forum_editorial_posts AS
SELECT
    fp.*,
    CASE
        WHEN fp.last_verified_at IS NULL                            THEN 'unverified'
        WHEN fp.last_verified_at > NOW() - INTERVAL '90 days'       THEN 'fresh'
        WHEN fp.last_verified_at > NOW() - INTERVAL '180 days'      THEN 'aging'
        ELSE 'stale'
    END AS freshness_status
FROM public.forum_posts fp
WHERE fp.content_type IN ('editorial', 'official')
ORDER BY
    fp.is_pinned DESC,
    fp.pinned_at DESC NULLS LAST,
    fp.created_at DESC;

GRANT SELECT ON public.forum_editorial_posts TO anon, authenticated;


-- ──────────────────────────────────────────────────────────────────────────
-- 6. Comments (self-documentation for Supabase Studio)
-- ──────────────────────────────────────────────────────────────────────────

COMMENT ON COLUMN public.forum_posts.content_type      IS 'user_post | editorial | official. Non-user types require admin role.';
COMMENT ON COLUMN public.forum_posts.sources           IS 'JSONB array of source references, e.g. [{"type":"official_website","url":"...","accessed_at":"..."}]';
COMMENT ON COLUMN public.forum_posts.last_verified_at  IS 'Timestamp when editorial content was last confirmed accurate.';
COMMENT ON COLUMN public.forum_posts.tags              IS 'Fine-grained topic tags (orientation/dorm/course_selection/...).';
COMMENT ON COLUMN public.forum_posts.translation_group IS 'UUID linking zh-Hans / zh-Hant / en versions of the same guide.';
COMMENT ON COLUMN public.forum_posts.language          IS 'Content language: zh-Hans | zh-Hant | en.';
COMMENT ON COLUMN public.forum_posts.summary           IS 'TL;DR preview (<=200 chars recommended).';

COMMENT ON FUNCTION public.forum_posts_increment_counts(UUID, INTEGER, INTEGER)
    IS 'Atomically adjust reply_count/upvote_count on a forum post. Requires authenticated user.';

COMMENT ON VIEW public.forum_editorial_posts
    IS 'Editorial/official posts ordered by pin + recency, with freshness_status (fresh/aging/stale/unverified).';


-- ============================================================================
-- FUTURE WORK (not included in this migration)
-- ============================================================================
-- 1. Agent knowledge base auto-sync trigger
--    The agent_knowledge_base table needs a (source_type, source_id) unique
--    constraint and an updated_at column before we can ON CONFLICT-upsert into
--    it. Embedding generation also must happen in the app layer (Xenova /
--    server-side), so a DB-only trigger cannot populate the vector column.
--    Add a dedicated migration once that contract is designed.
--
-- 2. Materialized counters
--    If view_count and reply_count become hot, migrate to an append-only
--    event log + materialized view refreshed on a schedule.
-- ============================================================================
