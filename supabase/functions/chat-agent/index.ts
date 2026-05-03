import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are "Nia", the friendly AI assistant for Native Digital Media — a Web Design, SEO, and Google Ads agency based in Winklespruit, Durban (KwaZulu-Natal, South Africa).

ABOUT US
- Office: 10 Winklespruit Road, Winklespruit, Durban
- Phone: 031 100 0683 / 073 645 6141
- Email: sales@nativedigital.co.za
- We serve clients across Durban, KZN, and Pietermaritzburg.

OUR PACKAGES (single source of truth — never invent prices)
1. Starter Site — R4,500 once-off. 5 pages, mobile-friendly, contact form, basic SEO. Perfect for new businesses.
2. Growth Site — R8,500 once-off + R2,500/month. Up to 10 pages, blog, lead capture, on-page SEO, monthly content updates and reporting.
3. Authority Site — R15,000 once-off + R4,500/month. Unlimited pages, advanced SEO, Google Ads management, monthly strategy calls.

ADD-ON SERVICES
- SEO retainer (Durban-focused): from R2,500/month
- Google Ads management: from R3,000/month
- Free AI website audit available on the homepage

OUR CASE STUDIES
- KZN E-hailing Council (NPC) — institutional credibility + driver registrations
- Zino Consulting — insurance lead generation via Google Ads
- Mybrada Security PMB — local SEO competing with national firms

YOUR JOB
- Be warm, conversational, helpful. Use plain English. Keep replies short (2–4 sentences usually).
- Answer questions about services, pricing, process, timelines (typical site: 2–3 weeks).
- QUALIFY leads: ask for their name, business, what they need, and the best email/phone to reach them.
- Once you have name + email (or phone), tell them a human will follow up within 24 hours.
- If asked about something outside our services (e.g. mobile apps, hosting, etc.), be honest and suggest they speak to the team.
- Never make up case study results, client names, or guarantee rankings. Use markdown for formatting (bold, lists).`;

interface ChatBody {
  conversationId?: string;
  sessionId: string;
  message: string;
  sourcePage?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const body: ChatBody = await req.json();
    if (!body.sessionId || !body.message?.trim()) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (body.message.length > 2000) {
      return new Response(JSON.stringify({ error: "Message too long" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    // Get or create conversation
    let conversationId = body.conversationId;
    if (!conversationId) {
      const { data: conv, error: convErr } = await supabase
        .from("chat_conversations")
        .insert({ session_id: body.sessionId, source_page: body.sourcePage })
        .select("id")
        .single();
      if (convErr) throw convErr;
      conversationId = conv.id;
    }

    // Load history
    const { data: history } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(40);

    // Persist user message
    await supabase.from("chat_messages").insert({
      conversation_id: conversationId,
      role: "user",
      content: body.message,
    });

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(history ?? []).map((m: any) => ({ role: m.role, content: m.content })),
      { role: "user", content: body.message },
    ];

    // Call Lovable AI (non-streaming for simplicity + reliability)
    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("AI gateway error", aiRes.status, errText);
      if (aiRes.status === 429) {
        return new Response(JSON.stringify({ error: "Too many messages, please wait a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiRes.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please contact us directly." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway: ${aiRes.status}`);
    }

    const aiJson = await aiRes.json();
    const reply: string = aiJson.choices?.[0]?.message?.content ?? "Sorry, I didn't catch that.";

    await supabase.from("chat_messages").insert({
      conversation_id: conversationId,
      role: "assistant",
      content: reply,
    });

    // Lead detection — extract email/phone from full transcript
    const transcript = [...(history ?? []), { role: "user", content: body.message }]
      .map((m: any) => m.content).join("\n");
    const emailMatch = transcript.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
    const phoneMatch = transcript.match(/(?:\+?27|0)\s?\d{2}[\s-]?\d{3}[\s-]?\d{4}/);

    if (emailMatch || phoneMatch) {
      const { data: existing } = await supabase
        .from("chat_conversations")
        .select("lead_id, visitor_email, visitor_phone")
        .eq("id", conversationId)
        .single();

      if (existing && !existing.lead_id) {
        // Create lead
        const { data: lead } = await supabase.from("leads").insert({
          name: "Chat visitor",
          email: emailMatch?.[0] ?? "no-email@chat.local",
          phone: phoneMatch?.[0],
          source: `chat:${body.sourcePage ?? "site"}`,
          message: transcript.slice(-1500),
        }).select("id").single();

        if (lead) {
          await supabase.from("chat_conversations").update({
            lead_id: lead.id,
            visitor_email: emailMatch?.[0],
            visitor_phone: phoneMatch?.[0],
          }).eq("id", conversationId);

          // Notify sales
          if (RESEND_API_KEY) {
            try {
              const resend = new Resend(RESEND_API_KEY);
              await resend.emails.send({
                from: "Native Digital <noreply@nativedigital.co.za>",
                to: ["sales@nativedigital.co.za"],
                subject: `🔥 New chat lead${emailMatch ? ` — ${emailMatch[0]}` : ""}`,
                html: `
                  <h2>New lead from chat agent</h2>
                  <p><strong>Email:</strong> ${emailMatch?.[0] ?? "—"}</p>
                  <p><strong>Phone:</strong> ${phoneMatch?.[0] ?? "—"}</p>
                  <p><strong>Page:</strong> ${body.sourcePage ?? "—"}</p>
                  <h3>Conversation</h3>
                  <pre style="background:#f5f5f5;padding:12px;white-space:pre-wrap;font-family:inherit">${transcript.replace(/</g, "&lt;")}</pre>
                `,
              });
            } catch (e) {
              console.error("Resend error:", e);
            }
          }
        }
      }
    }

    return new Response(JSON.stringify({ conversationId, reply }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("chat-agent error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
