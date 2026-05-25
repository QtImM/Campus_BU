create table if not exists public.daily_digests (
  digest_date date primary key,
  source_url text not null,
  summary text not null,
  message text not null,
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_daily_digest_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.daily_digest_push_runs (
  user_id uuid not null references auth.users(id) on delete cascade,
  digest_date date not null,
  sent_at timestamptz not null default now(),
  primary key (user_id, digest_date)
);

create or replace function public.daily_digest_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_daily_digests_updated_at on public.daily_digests;
create trigger trg_daily_digests_updated_at
before update on public.daily_digests
for each row
execute function public.daily_digest_set_updated_at();

drop trigger if exists trg_user_daily_digest_preferences_updated_at on public.user_daily_digest_preferences;
create trigger trg_user_daily_digest_preferences_updated_at
before update on public.user_daily_digest_preferences
for each row
execute function public.daily_digest_set_updated_at();

alter table public.daily_digests enable row level security;
alter table public.user_daily_digest_preferences enable row level security;
alter table public.daily_digest_push_runs enable row level security;

grant select, insert, update on public.daily_digests to authenticated;
grant select, insert, update on public.user_daily_digest_preferences to authenticated;
grant select, insert on public.daily_digest_push_runs to authenticated;

drop policy if exists "daily_digests_authenticated_read" on public.daily_digests;
create policy "daily_digests_authenticated_read"
on public.daily_digests
for select
to authenticated
using (true);

drop policy if exists "daily_digests_authenticated_write" on public.daily_digests;
create policy "daily_digests_authenticated_write"
on public.daily_digests
for insert
to authenticated
with check (true);

drop policy if exists "daily_digests_authenticated_update" on public.daily_digests;
create policy "daily_digests_authenticated_update"
on public.daily_digests
for update
to authenticated
using (true)
with check (true);

drop policy if exists "daily_digest_preferences_select_own" on public.user_daily_digest_preferences;
create policy "daily_digest_preferences_select_own"
on public.user_daily_digest_preferences
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "daily_digest_preferences_insert_own" on public.user_daily_digest_preferences;
create policy "daily_digest_preferences_insert_own"
on public.user_daily_digest_preferences
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "daily_digest_preferences_update_own" on public.user_daily_digest_preferences;
create policy "daily_digest_preferences_update_own"
on public.user_daily_digest_preferences
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "daily_digest_push_runs_select_own" on public.daily_digest_push_runs;
create policy "daily_digest_push_runs_select_own"
on public.daily_digest_push_runs
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "daily_digest_push_runs_insert_own" on public.daily_digest_push_runs;
create policy "daily_digest_push_runs_insert_own"
on public.daily_digest_push_runs
for insert
to authenticated
with check (auth.uid() = user_id);
