-- ============================================================================
-- Feed performance indexes
-- ============================================================================
-- The `posts` table (discover feed) had NO indexes beyond its primary key, so
-- every feed query (`order by created_at desc`, optional `eq type`) was a
-- sequential scan + sort of the whole table. These indexes turn that into an
-- index range scan and matter increasingly as the table grows.
--
-- `forum_posts` already has equivalent indexes (see 20260304_forum.sql); this
-- brings the original posts/likes tables up to the same standard.
-- ============================================================================

-- Discover feed: ordered by created_at desc, sometimes filtered by type.
create index if not exists posts_created_at_idx
    on public.posts (created_at desc);

create index if not exists posts_type_created_at_idx
    on public.posts (type, created_at desc);

-- Author profile pages (fetchPostsByAuthor) filter by author_id.
create index if not exists posts_author_id_idx
    on public.posts (author_id);

-- post_likes' primary key is (post_id, user_id). The feed's like-check
-- (`user_id = ? and post_id in (...)`) can use it, but the "liked posts"
-- profile tab (`fetchLikedPosts`, filters by user_id alone) cannot — it needs
-- a user_id-leading index.
create index if not exists post_likes_user_id_idx
    on public.post_likes (user_id);
