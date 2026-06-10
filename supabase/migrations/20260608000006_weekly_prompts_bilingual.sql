-- Add bilingual content columns to weekly_prompts.
-- content_zh = Chinese (primary), content_en = English (secondary).
-- Original 'content' column is retained for any legacy reads.

alter table public.weekly_prompts
    add column if not exists content_zh text not null default '',
    add column if not exists content_en text not null default '';

-- Back-fill: use existing content as the Chinese version.
update public.weekly_prompts set content_zh = content where content_zh = '';

-- Back-fill English for the seed row inserted in the previous migration.
update public.weekly_prompts
set content_en = 'What''s the course you regret taking this semester, and why?'
where content_en = '' and content like '%最后悔%';
