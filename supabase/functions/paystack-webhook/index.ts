// Paystack webhook handler. Validates HMAC SHA512 signature and marks invoice paid.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { createHmac } from 'node:crypto';

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const secret = Deno.env.get('PAYSTACK_SECRET_KEY');
  if (!secret) return new Response('Not configured', { status: 500 });

  const rawBody = await req.text();
  const signature = req.headers.get('x-paystack-signature') || '';
  const expected = createHmac('sha512', secret).update(rawBody).digest('hex');

  if (signature !== expected) {
    console.warn('Invalid Paystack signature');
    return new Response('Invalid signature', { status: 401 });
  }

  let event: any;
  try { event = JSON.parse(rawBody); } catch { return new Response('Bad JSON', { status: 400 }); }

  if (event.event !== 'charge.success') {
    return new Response('ok', { status: 200 });
  }

  const txn = event.data;
  const invoiceId = txn?.metadata?.invoice_id as string | undefined;
  const userId = txn?.metadata?.client_user_id as string | undefined;
  if (!invoiceId || !userId) {
    return new Response('Missing metadata', { status: 200 });
  }

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data: invoice } = await admin.from('invoices').select('*').eq('id', invoiceId).maybeSingle();
  if (!invoice) return new Response('Invoice not found', { status: 200 });

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
      notes: `Paystack webhook (${txn.channel || 'card'})`,
    });
  }

  return new Response('ok', { status: 200 });
});
