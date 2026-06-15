-- ============================================================================
-- HKBU Official Feed — auto-crawl + auto-publish infrastructure
-- ============================================================================
-- Purpose: support the `crawl_hkbu` Edge Function, which periodically pulls
--          HKBU official content (press releases / campus digest / research
--          news / announcements) from the university's AEM QueryBuilder API,
--          translates it to bilingual Chinese, and publishes it into the
--          community forum as content_type = 'official' posts.
--
-- Adds:
--   - public.app_config       : generic key/value store (service_role only).
--                               Holds the auto-provisioned "HKBU 官方" bot
--                               user id and runtime toggles.
--   - public.hkbu_feed_items  : dedup + provenance ledger. The UNIQUE
--                               (source_key, external_id) constraint is what
--                               guarantees the same article is never published
--                               twice, no matter how often the crawler runs.
--
-- Security model: both tables enable RLS with NO policies, so only the
-- service_role (which bypasses RLS) — i.e. the Edge Function — can touch them.
-- No anon / authenticated access is granted; this is internal plumbing.
--
-- NOTE: forum_posts.content_type IN ('editorial','official') is gated to admins
-- by RLS (see 20260420_forum_editorial_support.sql). That gate does NOT apply
-- to the crawler, which writes via the service_role and bypasses RLS. The bot
-- account therefore does not need admin rights to author official posts.
-- ============================================================================


-- ──────────────────────────────────────────────────────────────────────────
-- 1. Generic key/value config (service_role only)
-- ──────────────────────────────────────────────────────────────────────────
create table if not exists public.app_config (
    key        text primary key,
    value      jsonb not null,
    updated_at timestamptz not null default now()
);

alter table public.app_config enable row level security;
-- (no policies → only service_role can read/write)

create or replace function public.app_config_set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists trg_app_config_updated_at on public.app_config;
create trigger trg_app_config_updated_at
before update on public.app_config
for each row
execute function public.app_config_set_updated_at();


-- ──────────────────────────────────────────────────────────────────────────
-- 2. Crawl dedup / provenance ledger
-- ──────────────────────────────────────────────────────────────────────────
create table if not exists public.hkbu_feed_items (
    id            uuid primary key default gen_random_uuid(),

    -- which configured source produced this item (e.g. 'press_release')
    source_key    text not null,

    -- stable external identity used for dedup; we use the AEM jcr:path,
    -- which never changes for a given article
    external_id   text not null,

    url           text not null,
    title         text,
    published_at  timestamptz,

    -- the forum post we created from this item (null on dry-run / skip / error)
    forum_post_id uuid references public.forum_posts(id) on delete set null,

    -- whether a push broadcast was sent for this item
    pushed        boolean not null default false,

    status        text not null default 'published'
                      check (status in ('published','dry_run','skipped','error')),
    error_detail  text,

    created_at    timestamptz not null default now(),

    -- ⭐ the dedup guarantee: one row per (source, article)
    unique (source_key, external_id)
);

alter table public.hkbu_feed_items enable row level security;
-- (no policies → only service_role can read/write)

create index if not exists hkbu_feed_items_created_idx
    on public.hkbu_feed_items (created_at desc);

create index if not exists hkbu_feed_items_source_idx
    on public.hkbu_feed_items (source_key, published_at desc);


-- ──────────────────────────────────────────────────────────────────────────
-- 3. Self-documentation (Supabase Studio)
-- ──────────────────────────────────────────────────────────────────────────
comment on table public.app_config is
    'Internal key/value config for server-side jobs. service_role only.';
comment on table public.hkbu_feed_items is
    'Dedup + provenance ledger for the HKBU official-content crawler. '
    'UNIQUE(source_key, external_id) prevents duplicate auto-published posts.';
comment on column public.hkbu_feed_items.external_id is
    'Stable article identity (AEM jcr:path).';
comment on column public.hkbu_feed_items.status is
    'published | dry_run | skipped | error';
