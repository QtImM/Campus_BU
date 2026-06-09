-- ============================================================================
-- Seed: runtime configuration for HKBU official feed crawler
-- ============================================================================
-- This row is NOT created by any migration (secrets must not live in migrations).
-- After every fresh deployment, run this file once in the Supabase SQL Editor
-- (or via `supabase db query --file supabase/seed.sql`) and replace the
-- CRON_SECRET placeholder with the actual value you set in:
--   Dashboard → Edge Functions → crawl_hkbu → Secrets → CRON_SECRET
-- ============================================================================

insert into public.app_config (key, value)
values (
    'hkbu_crawl_cron',
    jsonb_build_object(
        'function_url',     'https://fcbsekidlijtidqzkddx.supabase.co/functions/v1/crawl_hkbu',
        'cron_secret',      'REPLACE_WITH_CRON_SECRET',
        'limit_per_source', 8
    )
)
on conflict (key) do update
    set value      = excluded.value,
        updated_at = now();
