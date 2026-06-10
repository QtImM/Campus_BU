-- ============================================================================
-- Initial schema pulled from remote Supabase (2026-06-11)
-- All core tables that were created on remote but never tracked locally.
-- This must run BEFORE all other migrations.
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS vector;

-- ─────────────────────────────────────────────────────────────────────────────
-- public.users
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
    id uuid NOT NULL PRIMARY KEY,
    display_name text,
    major text,
    avatar_url text,
    social_tags jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    email text,
    bio text,
    pioneer_badge boolean NOT NULL DEFAULT false
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────────────────────
-- public.courses
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.courses (
    id text NOT NULL DEFAULT (gen_random_uuid())::text PRIMARY KEY,
    code text NOT NULL,
    name text,
    instructor text,
    department text,
    credits integer DEFAULT 3,
    rating double precision DEFAULT 0,
    review_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- public.buildings
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.buildings (
    id text NOT NULL PRIMARY KEY,
    name text NOT NULL,
    category text,
    description text,
    image_url text,
    lat double precision,
    lng double precision,
    is_deleted boolean DEFAULT false,
    updated_at timestamp with time zone DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- public.teachers
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.teachers (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    faculty text,
    department text,
    name text NOT NULL,
    title text,
    image_url text,
    email text,
    source_url text,
    rating_avg double precision DEFAULT 0,
    review_count integer DEFAULT 0,
    tags jsonb DEFAULT '[]'::jsonb,
    embedding vector(1536),
    created_at timestamp with time zone DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- public.posts
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.posts (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    content text,
    type text,
    author_id uuid,
    author_name text,
    author_avatar text,
    author_major text,
    author_tags jsonb,
    images jsonb,
    location_tag text,
    lat double precision,
    lng double precision,
    likes integer DEFAULT 0,
    comments_count integer DEFAULT 0,
    is_anonymous boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    author_email text,
    is_hidden boolean NOT NULL DEFAULT false,
    prompt_id bigint,
    topic_title_zh text,
    topic_title_en text
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────────────────────
-- public.post_likes
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.post_likes (
    post_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (post_id, user_id)
);

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────────────────────
-- public.post_comments
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.post_comments (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id uuid,
    author_id uuid,
    author_name text NOT NULL,
    author_avatar text,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    author_email text,
    parent_comment_id uuid,
    reply_to_name text
);

ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────────────────────
-- public.post_comment_likes
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.post_comment_likes (
    comment_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (comment_id, user_id)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- public.post_favorites
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.post_favorites (
    post_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (post_id, user_id)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- public.notifications
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    related_id uuid,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- public.course_reviews
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.course_reviews (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id text,
    author_id uuid,
    author_name text,
    author_avatar text,
    rating integer,
    difficulty integer,
    content text,
    semester text,
    likes integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    is_anonymous boolean DEFAULT false,
    workload integer,
    grading integer,
    tags jsonb DEFAULT '[]'::jsonb
);

-- ─────────────────────────────────────────────────────────────────────────────
-- public.teacher_reviews
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.teacher_reviews (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_id uuid,
    author_id uuid,
    author_name text NOT NULL,
    author_avatar text,
    rating integer,
    difficulty integer,
    clarity integer,
    workload integer,
    content text NOT NULL,
    tags jsonb DEFAULT '[]'::jsonb,
    likes integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- public.teacher_review_likes
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.teacher_review_likes (
    review_id uuid NOT NULL,
    user_id uuid NOT NULL,
    PRIMARY KEY (review_id, user_id)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- public.course_exchanges
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.course_exchanges (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text,
    user_name text,
    user_avatar text,
    user_major text,
    have_course text,
    have_section text,
    have_teacher text,
    have_time text,
    want_courses jsonb,
    reason text,
    contacts jsonb,
    status text DEFAULT 'open'::text,
    comment_count integer DEFAULT 0,
    likes integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- public.exchange_comments
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.exchange_comments (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    exchange_id uuid,
    author_id text,
    author_name text,
    author_avatar text,
    content text,
    created_at timestamp with time zone DEFAULT now(),
    parent_comment_id uuid,
    reply_to_name text
);

-- ─────────────────────────────────────────────────────────────────────────────
-- public.course_teaming
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.course_teaming (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id text,
    user_id uuid,
    user_name text,
    user_avatar text,
    user_major text,
    section text,
    self_intro text,
    target_teammate text,
    contacts jsonb,
    status text DEFAULT 'open'::text,
    likes integer DEFAULT 0,
    comment_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- public.teaming_comments
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.teaming_comments (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    teaming_id uuid,
    author_id uuid,
    author_name text,
    author_avatar text,
    content text,
    created_at timestamp with time zone DEFAULT now(),
    parent_comment_id uuid,
    reply_to_name text
);

-- ─────────────────────────────────────────────────────────────────────────────
-- public.food_reviews
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.food_reviews (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    outlet_id text NOT NULL,
    author_id uuid,
    author_name text NOT NULL,
    author_avatar text,
    rating integer,
    content text NOT NULL,
    images jsonb DEFAULT '[]'::jsonb,
    likes integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    author_email text
);

-- ─────────────────────────────────────────────────────────────────────────────
-- public.food_review_likes
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.food_review_likes (
    review_id uuid NOT NULL,
    user_id uuid NOT NULL,
    PRIMARY KEY (review_id, user_id)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- public.food_review_comments
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.food_review_comments (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    review_id uuid,
    author_id uuid,
    author_name text NOT NULL,
    author_avatar text,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- public.course_submissions
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.course_submissions (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    code text NOT NULL,
    name text,
    instructor text,
    department text,
    credits integer DEFAULT 3,
    submitted_by uuid,
    submitter_name text,
    submitter_email text,
    status text DEFAULT 'pending'::text,
    reviewed_by uuid,
    reviewed_at timestamp with time zone,
    review_notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- public.interactions
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.interactions (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    from_user_id uuid,
    to_user_id uuid,
    type text,
    message text,
    created_at timestamp with time zone DEFAULT now(),
    read boolean DEFAULT false
);

-- ─────────────────────────────────────────────────────────────────────────────
-- public.messages (course chat)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.messages (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id uuid,
    content text,
    created_at timestamp with time zone DEFAULT now(),
    course_id text
);

-- ─────────────────────────────────────────────────────────────────────────────
-- public.user_schedules
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_schedules (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid,
    course_name text,
    course_code text,
    room text,
    time_slot text,
    raw_ocr_data jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- public.schedule_import_jobs
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.schedule_import_jobs (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    screenshot_path text NOT NULL,
    screenshot_url text,
    image_hash text,
    template_key text NOT NULL DEFAULT 'hkbu_standard_v1'::text,
    semester_label text,
    academic_year text,
    status text NOT NULL DEFAULT 'uploaded'::text,
    ocr_engine text,
    error_message text,
    recognized_count integer NOT NULL DEFAULT 0,
    unresolved_count integer NOT NULL DEFAULT 0,
    raw_ocr_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    screenshot_meta jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- public.schedule_import_items
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.schedule_import_items (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    import_job_id uuid NOT NULL,
    user_id uuid NOT NULL,
    row_index integer,
    source_block text,
    extracted_course_name text,
    extracted_course_code text,
    extracted_teacher text,
    extracted_room text,
    extracted_day_of_week smallint,
    extracted_start_time time without time zone,
    extracted_end_time time without time zone,
    extracted_start_period smallint,
    extracted_end_period smallint,
    extracted_week_text text,
    matched_course_id text,
    match_method text,
    confidence numeric(5,4),
    status text NOT NULL DEFAULT 'pending_review'::text,
    reviewer_note text,
    raw_item jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- public.user_schedule_entries
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_schedule_entries (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    import_job_id uuid,
    import_item_id uuid,
    matched_course_id text,
    source text NOT NULL DEFAULT 'manual_custom'::text,
    title text NOT NULL,
    course_code text,
    teacher_name text,
    room text,
    day_of_week smallint NOT NULL,
    start_time time without time zone,
    end_time time without time zone,
    start_period smallint,
    end_period smallint,
    week_text text,
    week_pattern jsonb NOT NULL DEFAULT '[]'::jsonb,
    section_label text,
    note text,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- public.user_daily_digest_preferences
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_daily_digest_preferences (
    user_id uuid NOT NULL PRIMARY KEY,
    enabled boolean NOT NULL DEFAULT false,
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- public.daily_digest_push_runs
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.daily_digest_push_runs (
    user_id uuid NOT NULL,
    digest_date date NOT NULL,
    sent_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, digest_date)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- public.forum_editorial_posts (tracks editorial-sourced content)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.forum_editorial_posts (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY
);
