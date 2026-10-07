-- Restore only the server-side chat handler's required privileges.
-- Public anon/authenticated access and existing RLS policies remain unchanged.
GRANT SELECT, INSERT, UPDATE ON TABLE public.av_chat_threads TO service_role;
GRANT SELECT, INSERT ON TABLE public.av_chat_messages TO service_role;
GRANT USAGE ON SEQUENCE public.av_chat_messages_id_seq TO service_role;
