// Verify a Paystack transaction by reference and mark invoice as paid.
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

    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claims, error: claimsErr } = await userClient.auth.getClaims(token);
    if (claimsErr || !claims?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const userId = claims.claims.sub as string;

    const body = await req.json().catch(() => ({}));
    const reference = body.reference;
    if (!reference || typeof reference !== 'string') {
      return new Response(JSON.stringify({ error: 'reference required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const secret = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!secret) {
      return new Response(JSON.stringify({ error: 'Payment gateway not configured' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const verifyData = await verifyRes.json();

    if (!verifyRes.ok || !verifyData.status) {
      return new Response(JSON.stringify({ error: verifyData.message || 'Verification failed' }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const txn = verifyData.data;
    const meta = txn.metadata || {};
    const invoiceId = meta.invoice_id as string | undefined;
    const isAdhoc = !!meta.adhoc;

    if (txn.status !== 'success') {
      return new Response(JSON.stringify({ status: txn.status, message: 'Payment not successful' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Idempotency: check if payment already recorded
    const { data: existingPayment } = await admin
      .from('payments').select('id').eq('reference', txn.reference).maybeSingle();
    if (existingPayment) {
      return new Response(JSON.stringify({ status: 'success', invoice_id: invoiceId, adhoc: isAdhoc, already_recorded: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (isAdhoc) {
      if (meta.client_user_id && meta.client_user_id !== userId) {
        return new Response(JSON.stringify({ error: 'User mismatch' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      await admin.from('payments').insert({
        client_user_id: userId,
        amount: txn.amount / 100,
        currency: txn.currency || 'ZAR',
        method: 'paystack',
        reference: txn.reference,
        description: meta.description || 'Ad-hoc payment',
        notes: `Paystack ${txn.channel || 'card'} ad-hoc payment`,
      });
      return new Response(JSON.stringify({ status: 'success', adhoc: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!invoiceId) {
      return new Response(JSON.stringify({ error: 'Missing invoice metadata' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { data: invoice } = await admin.from('invoices').select('*').eq('id', invoiceId).maybeSingle();
    if (!invoice || invoice.client_user_id !== userId) {
      return new Response(JSON.stringify({ error: 'Invoice mismatch' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (invoice.status !== 'paid') {
      await admin
        .from('invoices')
        .update({ status: 'paid', paid_at: new Date().toISOString(), payment_method: 'paystack' })
        .eq('id', invoiceId);

      await admin.from('payments').insert({
        invoice_id: invoiceId,
        client_user_id: userId,
        amount: txn.amount / 100,
        currency: txn.currency || invoice.currency,
        method: 'paystack',
        reference: txn.reference,
        description: `Payment for ${invoice.invoice_number}`,
        notes: `Paystack ${txn.channel || 'card'} payment`,
      });
    }

    return new Response(JSON.stringify({ status: 'success', invoice_id: invoiceId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('paystack-verify error', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
