import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const SESSION_KEY = "ndm_chat_session";
const CONV_KEY = "ndm_chat_conv";

const getSessionId = () => {
  let s = localStorage.getItem(SESSION_KEY);
  if (!s) {
    s = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, s);
  }
  return s;
};

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm Nia from **Native Digital Media** 👋\n\nAsk me anything about our web design, SEO, or Google Ads packages — or tell me about your project and I'll have a human follow up.",
    },
  ]);
  const [convId, setConvId] = useState<string | null>(
    () => localStorage.getItem(CONV_KEY),
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setSending(true);

    try {
      const { data, error } = await supabase.functions.invoke("chat-agent", {
        body: {
          message: text,
          sessionId: getSessionId(),
          conversationId: convId,
          sourcePage: location.pathname,
        },
      });
      if (error) throw error;
      if (data?.conversationId && data.conversationId !== convId) {
        setConvId(data.conversationId);
        localStorage.setItem(CONV_KEY, data.conversationId);
      }
      setMessages((m) => [...m, { role: "assistant", content: data?.reply ?? "..." }]);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Sorry — I couldn't reach our system. Please email **sales@nativedigital.co.za** or call **031 100 0683** and we'll help right away.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Bubble */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat with Nia"}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110",
          "bg-gradient-to-br from-primary to-secondary text-primary-foreground",
        )}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Panel */}
      {open && (
        <div
          className={cn(
            "fixed z-50 bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden",
            "bottom-24 right-6 w-[calc(100vw-3rem)] sm:w-96 h-[32rem] max-h-[calc(100vh-8rem)]",
            "animate-fade-up",
          )}
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-br from-primary/90 to-secondary/90 text-primary-foreground">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="font-heading font-semibold">Nia · Native Digital</div>
                <div className="text-xs opacity-90">Replies in seconds</div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted text-foreground",
                )}
              >
                <div className={cn(
                  "prose prose-sm max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_*]:!text-current [&_a]:underline [&_strong]:!text-current",
                )}>
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {sending && (
              <div className="bg-muted rounded-2xl px-4 py-2.5 max-w-[60%] flex gap-1">
                <span className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="p-3 border-t border-border flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about packages, SEO, ads…"
              maxLength={2000}
              disabled={sending}
            />
            <Button type="submit" size="icon" disabled={sending || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
