import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

const escapeHtml = (s: string) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const isValidEmail = (e: string) =>
  typeof e === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 255;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, message }: ContactEmailRequest = await req.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: name, email, and message are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Length caps
    const safeName = String(name).slice(0, 100);
    const safePhone = phone ? String(phone).slice(0, 30) : "";
    const safeMessage = String(message).slice(0, 5000);

    // HTML-escape every user-supplied field before interpolation
    const eName = escapeHtml(safeName);
    const eEmail = escapeHtml(email);
    const ePhone = safePhone ? escapeHtml(safePhone) : "Not provided";
    const eMessage = escapeHtml(safeMessage).replace(/\n/g, "<br>");

    const emailResponse = await resend.emails.send({
      from: "Native Digital <noreply@nativedigital.co.za>",
      to: ["sales@nativedigital.co.za"],
      subject: `New Contact Form Submission from ${safeName}`.slice(0, 150),
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${eName}</p>
        <p><strong>Email:</strong> ${eEmail}</p>
        <p><strong>Phone:</strong> ${ePhone}</p>
        <h3>Message:</h3>
        <p>${eMessage}</p>
      `,
      reply_to: email,
    });

    const confirmationResponse = await resend.emails.send({
      from: "Native Digital <noreply@nativedigital.co.za>",
      to: [email],
      subject: "We received your message!",
      html: `
        <h2>Thank you for contacting Native Digital, ${eName}!</h2>
        <p>We have received your message and will get back to you within 24 hours.</p>
        <p>Here's a copy of your message:</p>
        <blockquote style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #4f46e5;">
          ${eMessage}
        </blockquote>
        <p>Best regards,<br>The Native Digital Team</p>
      `,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully",
        salesEmail: emailResponse,
        confirmationEmail: confirmationResponse,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
