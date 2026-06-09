-- Add workload, grading, and tags columns to course_reviews table
-- workload: 1=轻松, 5=很重
ALTER TABLE public.course_reviews
ADD COLUMN IF NOT EXISTS workload int CHECK (workload >= 1 AND workload <= 5);

-- grading: 1=严格, 5=慷慨
ALTER TABLE public.course_reviews
ADD COLUMN IF NOT EXISTS grading int CHECK (grading >= 1 AND grading <= 5);

-- tags: array of user-selected tag strings
ALTER TABLE public.course_reviews
ADD COLUMN IF NOT EXISTS tags jsonb DEFAULT '[]';
