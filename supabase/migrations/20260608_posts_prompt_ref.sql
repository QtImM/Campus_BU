-- Link posts back to the weekly prompt they were written in response to.
-- prompt_id: FK for grouping / analytics (nullable, null = normal post).
-- topic_title_zh / _en: snapshot of the prompt text at time of posting
--   so old posts stay self-describing even after the prompt expires.

alter table public.posts
    add column if not exists prompt_id       bigint references public.weekly_prompts(id) on delete set null,
    add column if not exists topic_title_zh  text,
    add column if not exists topic_title_en  text;

create index if not exists posts_prompt_id_idx on public.posts (prompt_id)
    where prompt_id is not null;
