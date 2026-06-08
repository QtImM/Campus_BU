-- Weekly prompt: admin inserts one row per week.
-- The app queries for the row whose active window contains today's date.

create table if not exists public.weekly_prompts (
    id          bigserial primary key,
    emoji       text not null default '💬',
    content     text not null,
    active_from date not null,
    active_until date not null,
    created_at  timestamptz not null default now(),
    constraint weekly_prompts_dates_check check (active_until >= active_from)
);

create index if not exists weekly_prompts_active_idx
    on public.weekly_prompts (active_from, active_until);

alter table public.weekly_prompts enable row level security;

-- Anyone (including guests) can read active prompts.
create policy "weekly_prompts_select_all"
on public.weekly_prompts for select
using (true);

grant select on public.weekly_prompts to anon, authenticated, service_role;
-- Only service_role / admin can insert/update/delete (no client-facing write policy).
grant insert, update, delete on public.weekly_prompts to service_role;
grant usage, select on sequence public.weekly_prompts_id_seq to service_role;

-- Seed the first prompt so there's something to see immediately.
insert into public.weekly_prompts (emoji, content, active_from, active_until)
values ('🎓', '这学期你最后悔选的一门课是什么？为什么？', '2026-06-08', '2026-06-14')
on conflict do nothing;
