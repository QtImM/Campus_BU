-- ============================================================================
-- HKBU Official Feed — scheduled trigger (pg_cron + pg_net)
-- ============================================================================
-- Runs AFTER 20260609_hkbu_official_feed.sql (which creates public.app_config).
--
-- Design: NO secrets live in this committed migration. The cron job calls a
-- wrapper that reads the Edge Function URL + cron secret from public.app_config
-- at runtime. You populate that ONE row once, after deploying the function:
--
--   insert into public.app_config (key, value) values (
--     'hkbu_crawl_cron',
--     jsonb_build_object(
--       'function_url',     'https://<PROJECT_REF>.supabase.co/functions/v1/crawl_hkbu',
--       'cron_secret',      '<the same value you set as the CRON_SECRET function secret>',
--       'limit_per_source', 8
--     )
--   )
--   on conflict (key) do update set value = excluded.value, updated_at = now();
--
-- Until that row exists, the cron fires but the wrapper no-ops (safe).
-- ============================================================================

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- ──────────────────────────────────────────────────────────────────────────
-- Wrapper: reads config from app_config and POSTs to the Edge Function.
-- SECURITY DEFINER so it can read app_config (which is service_role/owner only).
-- ──────────────────────────────────────────────────────────────────────────
create or replace function public.trigger_hkbu_crawl()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
    cfg jsonb;
begin
    select value into cfg from public.app_config where key = 'hkbu_crawl_cron';

    if cfg is null
       or coalesce(cfg->>'function_url', '') = ''
       or coalesce(cfg->>'cron_secret', '') = '' then
        raise notice '[trigger_hkbu_crawl] app_config.hkbu_crawl_cron not configured; skipping';
        return;
    end if;

    perform net.http_post(
        url := cfg->>'function_url',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'x-cron-secret', cfg->>'cron_secret'
        ),
        body := jsonb_build_object(
            'limitPerSource', coalesce((cfg->>'limit_per_source')::int, 8)
        )
    );
end;
$$;

revoke all on function public.trigger_hkbu_crawl() from public;

-- ──────────────────────────────────────────────────────────────────────────
-- Schedule: hourly. Idempotent — drop any prior job of the same name first.
-- Adjust the cron expression to taste (e.g. '*/30 * * * *' for every 30 min).
-- ──────────────────────────────────────────────────────────────────────────
do $$
begin
    if exists (select 1 from cron.job where jobname = 'crawl-hkbu') then
        perform cron.unschedule('crawl-hkbu');
    end if;
end;
$$;

select cron.schedule(
    'crawl-hkbu',
    '0 * * * *',
    $$ select public.trigger_hkbu_crawl(); $$
);
