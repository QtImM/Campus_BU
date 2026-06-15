-- Pioneer badge: granted permanently when a user completes all 6 starter tasks.
-- Stored on the users table so any query that fetches user data picks it up for free.

alter table public.users add column if not exists pioneer_badge boolean not null default false;

-- Trigger function: flip the flag once all 6 tasks are present for that user.
create or replace function public.grant_pioneer_badge()
returns trigger
language plpgsql
security definer
as $$
begin
    if (
        select count(distinct task_id)
        from public.user_reward_tasks
        where user_id = new.user_id
    ) >= 6 then
        update public.users set pioneer_badge = true where id = new.user_id;
    end if;
    return new;
end;
$$;

-- Trigger created in 20260608_user_rewards.sql (runs after this file alphabetically).
