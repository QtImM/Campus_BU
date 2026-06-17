-- ============================================================================
-- get_discover_feed RPC
-- ============================================================================
-- Collapses the discover feed's 2 sequential round trips (posts, then a second
-- wave of blocked/likes/following lookups) into ONE. The function joins the
-- author, computes is_liked / is_following for the caller, and excludes posts
-- from blocked authors — all server-side.
--
-- Keyset pagination: pass p_before = the created_at of the last row you have to
-- get the next page (NULL for the first page). Limit is clamped to [1, 50].
--
-- SECURITY INVOKER (default): runs with the caller's privileges so existing RLS
-- on posts/users/post_likes/user_follows/user_blocks still applies. The client
-- already reads all of these tables directly, so permissions are unchanged.
--
-- The client (services/campus.ts) calls this first and silently falls back to
-- the direct PostgREST query if the function is absent, so this migration is
-- safe to ship before/independent of deployment.
-- ============================================================================

create or replace function public.get_discover_feed(
    p_user_id uuid default null,
    p_type text default null,
    p_before timestamptz default null,
    p_limit int default 20
)
returns table (
    id uuid,
    content text,
    type text,
    author_id uuid,
    author_name text,
    author_avatar text,
    author_major text,
    author_email text,
    images jsonb,
    location_tag text,
    lat double precision,
    lng double precision,
    likes integer,
    comments_count integer,
    is_anonymous boolean,
    created_at timestamptz,
    prompt_id bigint,
    topic_title_zh text,
    topic_title_en text,
    u_display_name text,
    u_avatar_url text,
    u_major text,
    u_email text,
    is_liked boolean,
    is_following boolean
)
language sql
stable
security invoker
as $$
    select
        p.id,
        p.content,
        p.type,
        p.author_id,
        p.author_name,
        p.author_avatar,
        p.author_major,
        p.author_email,
        p.images,
        p.location_tag,
        p.lat,
        p.lng,
        p.likes,
        p.comments_count,
        p.is_anonymous,
        p.created_at,
        p.prompt_id,
        p.topic_title_zh,
        p.topic_title_en,
        u.display_name as u_display_name,
        u.avatar_url   as u_avatar_url,
        u.major        as u_major,
        u.email        as u_email,
        (pl.user_id is not null) as is_liked,
        (uf.following_id is not null) as is_following
    from public.posts p
    left join public.users u
        on u.id = p.author_id
    left join public.post_likes pl
        on pl.post_id = p.id and pl.user_id = p_user_id
    left join public.user_follows uf
        on uf.following_id = p.author_id and uf.follower_id = p_user_id
    where (p_type is null or p.type = p_type)
      and (p_before is null or p.created_at < p_before)
      and (
          p_user_id is null
          or not exists (
              select 1 from public.user_blocks b
              where b.blocker_id = p_user_id and b.blocked_id = p.author_id
          )
      )
    order by p.created_at desc
    limit greatest(1, least(coalesce(p_limit, 20), 50));
$$;

grant execute on function public.get_discover_feed(uuid, text, timestamptz, int) to anon;
grant execute on function public.get_discover_feed(uuid, text, timestamptz, int) to authenticated;
grant execute on function public.get_discover_feed(uuid, text, timestamptz, int) to service_role;
