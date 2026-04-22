-- Add reply references for direct messages so private chats can quote earlier messages
ALTER TABLE public.direct_messages
    ADD COLUMN IF NOT EXISTS reply_to_message_id uuid
    REFERENCES public.direct_messages(id)
    ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS direct_messages_reply_to_message_idx
    ON public.direct_messages (reply_to_message_id);

COMMENT ON COLUMN public.direct_messages.reply_to_message_id IS 'Optional quoted direct message id within the same conversation';
