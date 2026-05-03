// Initialize an ad-hoc Paystack transaction (custom amount, no invoice).
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
    const amount = Number(body.amount);
    const description = String(body.description || '').slice(0, 200);
    const callbackUrl = body.callback_url;

    if (!amount || isNaN(amount) || amount < 10 || amount > 1000000) {
      return new Response(JSON.stringify({ error: 'Amount must be between R10 and R1,000,000' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (!description.trim()) {
      return new Response(JSON.stringify({ error: 'Description required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const secret = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!secret) {
      return new Response(JSON.stringify({ error: 'Payment gateway not configured' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const amountMinor = Math.round(amount * 100);
    const ref = `ADHOC-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const initRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userEmail,
        amount: amountMinor,
        currency: 'ZAR',
        reference: ref,
        callback_url: callbackUrl,
        metadata: {
          adhoc: true,
          description,
          client_user_id: userId,
        },
      }),
    });

    const initData = await initRes.json();
    if (!initRes.ok || !initData.status) {
      console.error('Paystack adhoc init failed', initData);
      return new Response(JSON.stringify({ error: initData.message || 'Failed to initialize payment' }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(
      JSON.stringify({
        authorization_url: initData.data.authorization_url,
        reference: initData.data.reference,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('paystack-adhoc-init error', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
