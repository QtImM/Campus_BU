-- Admin Post/Comment Deletion Permissions
-- Adds policies to allow admins to delete any post/comment for content moderation
-- Uses SECURITY DEFINER functions to avoid infinite recursion

-- Step 1: Create helper function to check admin status (SECURITY DEFINER to avoid recursion)
CREATE OR REPLACE FUNCTION check_user_is_active_admin()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.app_admins
        WHERE app_admins.user_id = auth.uid()
        AND app_admins.is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 1: Drop existing delete policies (to avoid conflicts)
DROP POLICY IF EXISTS "posts_delete_own" ON public.posts;
DROP POLICY IF EXISTS "posts_admin_delete" ON public.posts;

-- Step 2: Enable RLS on posts table (if not already enabled)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Step 3: Create new delete policies
-- Users can delete their own posts
CREATE POLICY "posts_delete_own" ON public.posts FOR DELETE TO authenticated USING (
    author_id = auth.uid()
);

-- Admins can delete any post for content moderation
-- Uses function to avoid infinite recursion
CREATE POLICY "posts_admin_delete" ON public.posts FOR DELETE TO authenticated USING (
    check_user_is_active_admin()
);

-- ============================================
-- REPEAT FOR COMMENTS TABLE
-- ============================================

-- Drop existing delete policies
DROP POLICY IF EXISTS "comments_delete_own" ON public.post_comments;
DROP POLICY IF EXISTS "comments_admin_delete" ON public.post_comments;

-- Enable RLS
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- Users can delete their own comments
CREATE POLICY "comments_delete_own" ON public.post_comments FOR DELETE TO authenticated USING (
    author_id = auth.uid()
);

-- Admins can delete any comment for content moderation
CREATE POLICY "comments_admin_delete" ON public.post_comments FOR DELETE TO authenticated USING (
    check_user_is_active_admin()
);

-- ============================================
-- FORUM POSTS (if using separate table)
-- ============================================

-- Drop existing delete policies
DROP POLICY IF EXISTS "forum_posts_delete_own" ON public.forum_posts;
DROP POLICY IF EXISTS "forum_posts_admin_delete" ON public.forum_posts;

-- Enable RLS
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;

-- Users can delete their own forum posts
CREATE POLICY "forum_posts_delete_own" ON public.forum_posts FOR DELETE TO authenticated USING (
    author_id = auth.uid()
);

-- Admins can delete any forum post for content moderation
CREATE POLICY "forum_posts_admin_delete" ON public.forum_posts FOR DELETE TO authenticated USING (
    check_user_is_active_admin()
);

-- ============================================
-- FORUM COMMENTS
-- ============================================

-- Drop existing delete policies
DROP POLICY IF EXISTS "forum_comments_delete_own" ON public.forum_comments;
DROP POLICY IF EXISTS "forum_comments_admin_delete" ON public.forum_comments;

-- Enable RLS
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;

-- Users can delete their own forum comments
CREATE POLICY "forum_comments_delete_own" ON public.forum_comments FOR DELETE TO authenticated USING (
    author_id = auth.uid()
);

-- Admins can delete any forum comment for content moderation
CREATE POLICY "forum_comments_admin_delete" ON public.forum_comments FOR DELETE TO authenticated USING (
    check_user_is_active_admin()
);

-- Log success
DO $$
BEGIN
    RAISE NOTICE 'Admin deletion policies created successfully!';
    RAISE NOTICE 'Admins can now delete posts and comments for content moderation.';
END $$;
