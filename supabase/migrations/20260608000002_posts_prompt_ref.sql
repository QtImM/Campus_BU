-- Link posts back to the weekly prompt they were written in response to.
-- prompt_id: FK for grouping / analytics (nullable, null = normal post).
-- topic_title_zh / _en: snapshot of the prompt text at time of posting
--   so old posts stay self-describing even after the prompt expires.

-- Add columns first (without FK so this runs before weekly_prompts.sql alphabetically).
-- The FK constraint is added by 20260608_weekly_prompts.sql after the table exists.
alter table public.posts
    add column if not exists prompt_id       bigint,
    add column if not exists topic_title_zh  text,
    add column if not exists topic_title_en  text;

create index if not exists posts_prompt_id_idx on public.posts (prompt_id)
    where prompt_id is not null;
