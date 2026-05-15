import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface AuditRequest {
  name: string;
  email: string;
  phone?: string;
  website?: string;
  businessType?: string;
  message?: string;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitize(s: string | undefined, max = 1000) {
  if (!s) return "";
  return String(s).trim().slice(0, max);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as AuditRequest;

    // Validate
    const name = sanitize(body.name, 100);
    const email = sanitize(body.email, 255);
    const phone = sanitize(body.phone, 20);
    const website = sanitize(body.website, 255);
    const businessType = sanitize(body.businessType, 100);
    const message = sanitize(body.message, 1000);

    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: "Name and email are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    // 1) Run AI audit (if a website was provided & AI key available)
    let auditResult: { summary: string; score?: number; recommendations?: string[] } | null = null;
    let auditError: string | null = null;

    if (website && LOVABLE_API_KEY) {
      try {
        const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "system",
                content:
                  "You are a senior web & SEO auditor for Native Digital Media. Given a website URL and business context, produce a concise, friendly mini-audit. Be specific, actionable, and encouraging. Avoid generic fluff.",
              },
              {
                role: "user",
                content: `Audit this site:\nWebsite: ${website}\nBusiness type: ${businessType || "unknown"}\nNotes from owner: ${message || "(none)"}\n\nReturn a short audit.`,
              },
            ],
            tools: [
              {
                type: "function",
                function: {
                  name: "return_audit",
                  description: "Return a structured website/SEO audit.",
                  parameters: {
                    type: "object",
                    properties: {
                      score: { type: "number", description: "Overall score 0-100" },
                      summary: { type: "string", description: "2-3 sentence overall summary" },
                      recommendations: {
                        type: "array",
                        items: { type: "string" },
                        description: "3-5 specific, actionable recommendations",
                      },
                    },
                    required: ["score", "summary", "recommendations"],
                    additionalProperties: false,
                  },
                },
              },
            ],
            tool_choice: { type: "function", function: { name: "return_audit" } },
          }),
        });

        if (aiResp.status === 429) {
          auditError = "AI is busy right now — try again in a moment.";
        } else if (aiResp.status === 402) {
          auditError = "AI credits exhausted. Please contact us directly.";
        } else if (!aiResp.ok) {
          const t = await aiResp.text();
          console.error("AI gateway error:", aiResp.status, t);
          auditError = "Could not generate the audit right now.";
        } else {
          const data = await aiResp.json();
          const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
          if (toolCall?.function?.arguments) {
            try {
              auditResult = JSON.parse(toolCall.function.arguments);
            } catch (e) {
              console.error("Failed to parse audit JSON:", e);
              auditError = "Audit result could not be parsed.";
            }
          }
        }
      } catch (e) {
        console.error("AI call failed:", e);
        auditError = "Audit service unavailable.";
      }
    }

    // 2) Save lead
    const { data: leadRow, error: insertError } = await supabase
      .from("leads")
      .insert({
        name,
        email,
        phone: phone || null,
        website: website || null,
        business_type: businessType || null,
        message: message || null,
        audit_result: auditResult,
        source: "homepage",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Lead insert failed:", insertError);
    }

    // 3) Email notification — call send-transactional-email via direct fetch
    // (supabase.functions.invoke from one edge function to another can drop
    // auth headers depending on client version; explicit fetch is reliable).
    try {
      const emailResp = await fetch(`${SUPABASE_URL}/functions/v1/send-transactional-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SERVICE_ROLE}`,
          'apikey': SERVICE_ROLE,
        },
        body: JSON.stringify({
          templateName: 'new-lead-notification',
          recipientEmail: 'sales@nativedigital.co.za',
          idempotencyKey: `lead-notify-${leadRow?.id ?? crypto.randomUUID()}`,
          templateData: {
            name,
            email,
            phone: phone || undefined,
            website: website || undefined,
            businessType: businessType || undefined,
            message: message || undefined,
            source: 'homepage',
            auditScore: auditResult?.score,
            auditSummary: auditResult?.summary,
            auditRecommendations: auditResult?.recommendations,
            auditError: auditError || undefined,
          },
        }),
      });
      if (!emailResp.ok) {
        const txt = await emailResp.text();
        console.error('Lead notification email failed:', emailResp.status, txt);
      } else {
        console.log('Lead notification email enqueued for', leadRow?.id);
      }
    } catch (e) {
      console.error('Lead notification email exception:', e);
    }

    return new Response(
      JSON.stringify({
        success: true,
        leadId: leadRow?.id ?? null,
        audit: auditResult,
        auditError,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("run-ai-audit fatal:", e);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
