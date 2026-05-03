
DROP POLICY IF EXISTS "Anyone can create conversation" ON public.chat_conversations;
DROP POLICY IF EXISTS "Anyone can read conversation" ON public.chat_conversations;
DROP POLICY IF EXISTS "Anyone can update own conversation" ON public.chat_conversations;
DROP POLICY IF EXISTS "Anyone can insert message" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can read messages" ON public.chat_messages;
