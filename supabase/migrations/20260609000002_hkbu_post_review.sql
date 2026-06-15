-- ============================================================================
-- HKBU Official Post Review Workflow
-- ============================================================================
-- Adds a `status` column to forum_posts so the crawler can insert posts as
-- `pending_review`. Admins approve/reject from the moderation workbench.
-- Regular users only see `published` posts; admins see pending ones too.
-- ============================================================================

alter table public.forum_posts
    add column if not exists status text not null default 'published'
        check (status in ('published', 'pending_review', 'rejected'));

create index if not exists forum_posts_status_idx
    on public.forum_posts (status);

-- Replace the open SELECT policy with one that hides non-published posts
-- from regular users. Admins can still see pending_review posts.
drop policy if exists "forum_posts_select_all" on public.forum_posts;
create policy "forum_posts_select_published"
    on public.forum_posts for select
    using (
        status = 'published'
        or public.is_user_admin(auth.uid())
    );

comment on column public.forum_posts.status is
    'published | pending_review | rejected. Crawler inserts as pending_review; admin approves to publish.';
