-- Fix for "new row violates row-level security policy" on user_push_tokens
-- The frontend uses .upsert() which requires both INSERT and UPDATE policies.

-- Policy: Users can update their own tokens (required for upsert)
CREATE POLICY "Users can update their own push tokens" 
    ON public.user_push_tokens 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
