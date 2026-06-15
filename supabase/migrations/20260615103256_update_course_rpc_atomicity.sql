-- 更新 approve/reject 函数，加入 FOR UPDATE SKIP LOCKED 防止多管理员并发操作同一条记录

CREATE OR REPLACE FUNCTION approve_course_submission(submission_id uuid, reviewer_id uuid, notes text DEFAULT NULL)
RETURNS json AS $$
DECLARE
  submission RECORD;
  new_course_id text;
BEGIN
  -- FOR UPDATE SKIP LOCKED: 锁住行防并发，若已被锁则跳过
  SELECT * INTO submission FROM public.course_submissions
  WHERE id = submission_id AND status = 'pending'
  FOR UPDATE SKIP LOCKED;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Submission not found or already processed');
  END IF;

  IF EXISTS (SELECT 1 FROM public.courses WHERE code = upper(submission.code)) THEN
    UPDATE public.course_submissions
    SET status = 'rejected',
        reviewed_by = reviewer_id,
        reviewed_at = now(),
        review_notes = COALESCE(notes, 'Duplicate course code')
    WHERE id = submission_id;

    RETURN json_build_object('success', false, 'error', 'Course code already exists');
  END IF;

  INSERT INTO public.courses (code, name, instructor, department, credits)
  VALUES (upper(submission.code), submission.name, submission.instructor, submission.department, submission.credits)
  RETURNING id INTO new_course_id;

  UPDATE public.course_submissions
  SET status = 'approved',
      reviewed_by = reviewer_id,
      reviewed_at = now(),
      review_notes = notes
  WHERE id = submission_id;

  RETURN json_build_object('success', true, 'course_id', new_course_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION reject_course_submission(submission_id uuid, reviewer_id uuid, notes text)
RETURNS json AS $$
DECLARE
  submission RECORD;
BEGIN
  SELECT * INTO submission FROM public.course_submissions
  WHERE id = submission_id AND status = 'pending'
  FOR UPDATE SKIP LOCKED;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Submission not found or already processed');
  END IF;

  UPDATE public.course_submissions
  SET status = 'rejected',
      reviewed_by = reviewer_id,
      reviewed_at = now(),
      review_notes = notes
  WHERE id = submission_id;

  RETURN json_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
