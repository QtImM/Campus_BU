-- Add is_anonymous column to course_reviews table
ALTER TABLE public.course_reviews 
ADD COLUMN IF NOT EXISTS is_anonymous boolean DEFAULT false;

-- Add index on is_anonymous for faster queries
CREATE INDEX IF NOT EXISTS idx_course_reviews_is_anonymous 
ON public.course_reviews(is_anonymous);
