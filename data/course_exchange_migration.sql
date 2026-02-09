-- -----------------------------------------------------------------------------
-- COURSE EXCHANGE FEATURE MIGRATION
-- This script sets up the tables, policies, and functions for the course exchange feature.
-- -----------------------------------------------------------------------------

-- 1. Create Course Exchanges Table
CREATE TABLE IF NOT EXISTS public.course_exchanges (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id),
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
  status text DEFAULT 'open',
  comment_count int DEFAULT 0,
  likes int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- RLS for Course Exchanges
ALTER TABLE public.course_exchanges ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Exchanges are viewable by everyone.' AND tablename = 'course_exchanges') THEN
    CREATE POLICY "Exchanges are viewable by everyone." ON public.course_exchanges FOR SELECT USING ( true );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can insert exchange requests.' AND tablename = 'course_exchanges') THEN
    CREATE POLICY "Anyone can insert exchange requests." ON public.course_exchanges FOR INSERT WITH CHECK ( true );
  END IF;
END $$;


-- 2. Create Exchange Comments Table
CREATE TABLE IF NOT EXISTS public.exchange_comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  exchange_id uuid REFERENCES public.course_exchanges(id) ON DELETE CASCADE,
  author_id uuid REFERENCES public.users(id),
  author_name text,
  author_avatar text,
  content text,
  created_at timestamptz DEFAULT now()
);

-- RLS for Exchange Comments
ALTER TABLE public.exchange_comments ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Comments are viewable by everyone.' AND tablename = 'exchange_comments') THEN
    CREATE POLICY "Comments are viewable by everyone." ON public.exchange_comments FOR SELECT USING ( true );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can insert exchange comments.' AND tablename = 'exchange_comments') THEN
    CREATE POLICY "Anyone can insert exchange comments." ON public.exchange_comments FOR INSERT WITH CHECK ( true );
  END IF;
END $$;


-- 3. Function to increment comment count (RPC)
CREATE OR REPLACE FUNCTION public.increment_exchange_comment_count(row_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.course_exchanges
  SET comment_count = comment_count + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
