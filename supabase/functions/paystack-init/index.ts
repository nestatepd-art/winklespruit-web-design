// Initialize a Paystack transaction for an invoice and return the authorization URL.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claims, error: claimsErr } = await supabase.auth.getClaims(token);
    if (claimsErr || !claims?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const userId = claims.claims.sub as string;
    const userEmail = claims.claims.email as string;

    const body = await req.json().catch(() => ({}));
    const invoiceId = body.invoice_id;
    const callbackUrl = body.callback_url;
    if (!invoiceId || typeof invoiceId !== 'string') {
      return new Response(JSON.stringify({ error: 'invoice_id required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Load invoice (RLS ensures user can only access their own non-draft invoice)
    const { data: invoice, error: invErr } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .maybeSingle();

    if (invErr || !invoice) {
      return new Response(JSON.stringify({ error: 'Invoice not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (invoice.client_user_id !== userId) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (invoice.status === 'paid') {
      return new Response(JSON.stringify({ error: 'Invoice already paid' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const secret = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!secret) {
      return new Response(JSON.stringify({ error: 'Payment gateway not configured' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Paystack expects amount in lowest currency unit (kobo / cents)
    const amountMinor = Math.round(Number(invoice.total) * 100);

    const initRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userEmail,
        amount: amountMinor,
        currency: invoice.currency || 'ZAR',
        reference: `${invoice.invoice_number}-${Date.now()}`,
        callback_url: callbackUrl,
        metadata: {
          invoice_id: invoice.id,
          invoice_number: invoice.invoice_number,
          client_user_id: userId,
        },
      }),
    });

    const initData = await initRes.json();
    if (!initRes.ok || !initData.status) {
      console.error('Paystack init failed', initData);
      return new Response(JSON.stringify({ error: initData.message || 'Failed to initialize payment' }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(
      JSON.stringify({
        authorization_url: initData.data.authorization_url,
        access_code: initData.data.access_code,
        reference: initData.data.reference,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('paystack-init error', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
