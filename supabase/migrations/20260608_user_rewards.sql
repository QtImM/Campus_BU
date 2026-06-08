-- 新手奖励系统：记录每位用户已完成的新手任务，按行存储以保证幂等且便于后台聚合统计。
-- 积分总额由各已完成任务的 points 求和得到（SUM），无需单独维护可变的总分字段。

create table if not exists public.user_reward_tasks (
    user_id uuid not null references auth.users(id) on delete cascade,
    task_id text not null,
    points integer not null default 0,
    created_at timestamptz not null default now(),
    primary key (user_id, task_id)
);

-- 便于后台按用户聚合积分排行
create index if not exists user_reward_tasks_user_idx
    on public.user_reward_tasks (user_id);

alter table public.user_reward_tasks enable row level security;

-- Policies: 用户只能读写自己的奖励记录
create policy "user_reward_tasks_select_own"
on public.user_reward_tasks
for select
using (auth.uid() = user_id);

create policy "user_reward_tasks_insert_own"
on public.user_reward_tasks
for insert
with check (auth.uid() = user_id);

create policy "user_reward_tasks_delete_own"
on public.user_reward_tasks
for delete
using (auth.uid() = user_id);
-- 注意：不开放 update。任务完成记录一旦写入即不可变（积分只增不改），
-- 重复完成由主键冲突 (on conflict do nothing) 自然忽略。

-- Data API GRANT（私有用户数据，不给 anon）
grant select, insert, delete on public.user_reward_tasks to authenticated;
grant select, insert, delete on public.user_reward_tasks to service_role;
