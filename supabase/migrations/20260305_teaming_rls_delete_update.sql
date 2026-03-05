-- Fix RLS for teaming tables so delete/close operations can take effect.

-- course_teaming: keep existing public read/insert model, add update/delete support.
DROP POLICY IF EXISTS "Anyone can update teaming requests." ON public.course_teaming;
DROP POLICY IF EXISTS "Anyone can delete teaming requests." ON public.course_teaming;

CREATE POLICY "Anyone can update teaming requests."
ON public.course_teaming
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Anyone can delete teaming requests."
ON public.course_teaming
FOR DELETE
USING (true);

-- teaming_comments: allow delete so client-side cleanup does not fail under RLS.
DROP POLICY IF EXISTS "Anyone can delete teaming comments." ON public.teaming_comments;

CREATE POLICY "Anyone can delete teaming comments."
ON public.teaming_comments
FOR DELETE
USING (true);
