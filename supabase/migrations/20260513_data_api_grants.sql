-- ============================================================================
-- Supabase Data API GRANT 补丁
-- 原因：2026-05-30 起，新建项目的 public 表不再默认暴露给 Data API；
--       2026-10-30 起，所有现有项目强制执行。
-- 本迁移为所有已存在的 public 表补上显式 GRANT，确保 supabase-js / PostgREST
-- 继续正常工作。RLS 策略不变，GRANT 仅控制"角色能否碰到表"。
--
-- 注意：部分表（courses, buildings, teachers 等）由外部脚本创建，本地首次
-- supabase start 时可能尚不存在。使用 to_regclass 检查，不存在则跳过。
-- ============================================================================

DO $$
DECLARE
    -- (table_name, anon_privs, auth_privs)
    -- anon_privs = NULL 表示不授权给 anon
    rec RECORD;
BEGIN
    FOR rec IN VALUES
        -- 公开数据表：anon SELECT + authenticated CRUD
        ('courses',               'SELECT', 'SELECT,INSERT,UPDATE,DELETE'),
        ('buildings',             'SELECT', 'SELECT,INSERT,UPDATE,DELETE'),
        ('teachers',              'SELECT', 'SELECT,INSERT,UPDATE,DELETE'),
        ('course_reviews',        'SELECT', 'SELECT,INSERT,UPDATE,DELETE'),
        ('teacher_reviews',       'SELECT', 'SELECT,INSERT,UPDATE,DELETE'),
        ('teacher_review_likes',  'SELECT', 'SELECT,INSERT,UPDATE,DELETE'),
        ('posts',                 'SELECT', 'SELECT,INSERT,UPDATE,DELETE'),
        ('post_comments',         'SELECT', 'SELECT,INSERT,UPDATE,DELETE'),
        ('post_likes',            'SELECT', 'SELECT,INSERT,UPDATE,DELETE'),
        ('forum_posts',           'SELECT', 'SELECT,INSERT,UPDATE,DELETE'),
        ('forum_comments',        'SELECT', 'SELECT,INSERT,UPDATE,DELETE'),
        ('forum_upvotes',         'SELECT', 'SELECT,INSERT,UPDATE,DELETE'),
        ('course_exchanges',      'SELECT', 'SELECT,INSERT,UPDATE,DELETE'),
        ('exchange_comments',     'SELECT', 'SELECT,INSERT,UPDATE,DELETE'),
        ('course_teaming',        'SELECT', 'SELECT,INSERT,UPDATE,DELETE'),
        ('teaming_comments',      'SELECT', 'SELECT,INSERT,UPDATE,DELETE'),
        ('food_reviews',          'SELECT', 'SELECT,INSERT,UPDATE,DELETE'),
        ('food_review_likes',     'SELECT', 'SELECT,INSERT,UPDATE,DELETE'),
        ('food_review_comments',  'SELECT', 'SELECT,INSERT,UPDATE,DELETE'),
        ('course_submissions',    'SELECT', 'SELECT,INSERT,UPDATE,DELETE'),
        ('user_follows',          'SELECT', 'SELECT,INSERT,UPDATE,DELETE'),
        ('weekly_prompts',        'SELECT', 'SELECT,INSERT,UPDATE,DELETE'),
        ('agent_knowledge_base',  'SELECT', 'SELECT,INSERT,UPDATE,DELETE'),
        -- 私有用户数据：仅 authenticated + service_role
        ('notifications',         NULL, 'SELECT,INSERT,UPDATE,DELETE'),
        ('interactions',          NULL, 'SELECT,INSERT,UPDATE,DELETE'),
        ('messages',              NULL, 'SELECT,INSERT,UPDATE,DELETE'),
        ('agent_memory',          NULL, 'SELECT,INSERT,UPDATE,DELETE'),
        ('course_favorites',      NULL, 'SELECT,INSERT,UPDATE,DELETE'),
        ('building_favorites',    NULL, 'SELECT,INSERT,UPDATE,DELETE'),
        ('user_schedules',        NULL, 'SELECT,INSERT,UPDATE,DELETE'),
        ('schedule_import_jobs',  NULL, 'SELECT,INSERT,UPDATE,DELETE'),
        ('schedule_import_items', NULL, 'SELECT,INSERT,UPDATE,DELETE'),
        ('user_schedule_entries', NULL, 'SELECT,INSERT,UPDATE,DELETE'),
        ('user_calendar_events',  NULL, 'SELECT,INSERT,UPDATE,DELETE'),
        ('user_push_tokens',      NULL, 'SELECT,INSERT,UPDATE,DELETE'),
        ('direct_conversations',  NULL, 'SELECT,INSERT,UPDATE,DELETE'),
        ('direct_messages',       NULL, 'SELECT,INSERT,UPDATE,DELETE'),
        ('user_eula_consents',    NULL, 'SELECT,INSERT,UPDATE,DELETE'),
        ('user_blocks',           NULL, 'SELECT,INSERT,UPDATE,DELETE'),
        ('reports',               NULL, 'SELECT,INSERT,UPDATE,DELETE'),
        ('users',                 NULL, 'SELECT,INSERT,UPDATE,DELETE'),
        -- 管理员 / 审计表
        ('app_admins',            NULL, 'SELECT,INSERT,UPDATE,DELETE'),
        ('moderation_actions',    NULL, 'SELECT,INSERT,UPDATE,DELETE'),
        ('user_bans',             NULL, 'SELECT,INSERT,UPDATE,DELETE'),
        ('post_comment_likes',    NULL, 'SELECT,INSERT,DELETE'),
        ('user_reward_tasks',     NULL, 'SELECT,INSERT,DELETE'),
        ('push_broadcasts',       NULL, 'SELECT,INSERT,UPDATE,DELETE'),
        ('app_config',            NULL, 'SELECT,INSERT,UPDATE,DELETE')
    LOOP
        -- Skip tables that don't exist in this environment yet
        IF to_regclass('public.' || rec.column1) IS NULL THEN
            RAISE NOTICE 'Skipping GRANT: table public.% does not exist', rec.column1;
            CONTINUE;
        END IF;

        IF rec.column2 IS NOT NULL THEN
            EXECUTE format('GRANT %s ON public.%I TO anon', rec.column2, rec.column1);
        END IF;
        EXECUTE format('GRANT %s ON public.%I TO authenticated', rec.column3, rec.column1);
        EXECUTE format('GRANT %s ON public.%I TO service_role',  rec.column3, rec.column1);
    END LOOP;
END;
$$;

-- weekly_prompts sequence (bigserial)
DO $$
BEGIN
    IF to_regclass('public.weekly_prompts') IS NOT NULL THEN
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE public.weekly_prompts_id_seq TO service_role';
    END IF;
END;
$$;
