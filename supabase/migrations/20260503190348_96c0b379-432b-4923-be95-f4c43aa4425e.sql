
CREATE TABLE public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  visitor_name TEXT,
  visitor_email TEXT,
  visitor_phone TEXT,
  source_page TEXT,
  lead_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_chat_messages_conv ON public.chat_messages(conversation_id, created_at);
CREATE INDEX idx_chat_conversations_session ON public.chat_conversations(session_id);

ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can create + read conversations (read needed so widget can poll/restore by id)
CREATE POLICY "Anyone can create conversation"
  ON public.chat_conversations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read conversation"
  ON public.chat_conversations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can update own conversation"
  ON public.chat_conversations FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins manage conversations"
  ON public.chat_conversations FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Messages
CREATE POLICY "Anyone can insert message"
  ON public.chat_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read messages"
  ON public.chat_messages FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins manage messages"
  ON public.chat_messages FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_chat_conversations_updated
  BEFORE UPDATE ON public.chat_conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
