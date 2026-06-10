-- 评论点赞表，镜像 post_likes 结构。
-- 每行代表一个用户对一条评论的点赞，主键防止重复点赞。
-- comment 被删时级联清理（ON DELETE CASCADE）。

create table if not exists public.post_comment_likes (
    comment_id uuid not null references public.post_comments(id) on delete cascade,
    user_id    uuid not null references auth.users(id) on delete cascade,
    created_at timestamptz not null default now(),
    primary key (comment_id, user_id)
);

create index if not exists post_comment_likes_comment_idx
    on public.post_comment_likes (comment_id);

create index if not exists post_comment_likes_user_idx
    on public.post_comment_likes (user_id);

alter table public.post_comment_likes enable row level security;

-- 任何登录用户可查看赞（用于聚合计数）
create policy "comment_likes_select"
on public.post_comment_likes
for select
using (auth.role() = 'authenticated');

-- 只能给自己的点赞行操作
create policy "comment_likes_insert_own"
on public.post_comment_likes
for insert
with check (auth.uid() = user_id);

create policy "comment_likes_delete_own"
on public.post_comment_likes
for delete
using (auth.uid() = user_id);

grant select, insert, delete on public.post_comment_likes to authenticated;
grant select, insert, delete on public.post_comment_likes to service_role;
