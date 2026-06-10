-- Migration: Create Webhook to trigger Edge Function for Push Notifications
-- Note: Replace 'https://[YOUR_PROJECT_ID].supabase.co' with your actual Supabase URL
-- if you are deploying this manually. We use pg_net for local/remote webhook requests.

-- Ensure pg_net is enabled
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create an HTTP Request Trigger function
CREATE OR REPLACE FUNCTION public.handle_new_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  url TEXT;
  service_key TEXT;
  project_url TEXT;
BEGIN
  -- We fetch current config or use a generic approach.
  -- In a real Supabase hosted env, you can get these from current_setting or env
  -- Alternatively, just insert your project URL here:
  
  -- Example hardcoded for development (replace with your prod link when deploying):
  -- project_url := 'https://fcbsekidlijtidqzkddx.supabase.co';
  
  -- A robust way is to make the webhook using the Supabase Dashboard's Webhook UI,
  -- but here is the SQL approach using HTTP extension (pg_net is async):
  
  -- To create a webhook through SQL using pg_net:
  url := current_setting('request.env.supabase_url', true) || '/functions/v1/send_push_notification';
  
  IF url IS NULL OR url = '/functions/v1/send_push_notification' THEN
    -- Fallback for local dev if setting isn't available
    url := 'http://host.docker.internal:54321/functions/v1/send_push_notification';
  END IF;

  service_key := current_setting('request.env.supabase_service_role_key', true);
  
  IF service_key IS NULL THEN
     -- NOTE: You will need to set this securely or use the UI.
     service_key := 'YOUR_ANON_OR_SERVICE_KEY';
  END IF;

  PERFORM net.http_post(
      url := url,
      headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || service_key
      ),
      body := jsonb_build_object(
          'type', 'INSERT',
          'table', 'notifications',
          'schema', 'public',
          'record', row_to_json(NEW)
      )
  );
  
  RETURN NEW;
END;
$$;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_notification_created ON public.notifications;

-- Create the trigger on the notifications table
CREATE TRIGGER on_notification_created
  AFTER INSERT ON public.notifications
  FOR EACH ROW
  -- We don't want to send pushes for all types; you can add a condition here if you like
  -- WHEN (NEW.is_read = false)
  EXECUTE FUNCTION public.handle_new_notification();
