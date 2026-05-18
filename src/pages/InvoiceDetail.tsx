import { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ClientZoneNav from '@/components/ClientZoneNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Building2, CheckCircle2, CreditCard } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

const InvoiceDetail = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useSEO({ title: 'Invoice | Native Digital Media', description: 'View and pay your invoice.', canonical: `/client/invoice/${id}` });

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase.from('invoices').select('*').eq('id', id).maybeSingle();
      setInvoice(data);
      setLoading(false);
    })();
  }, [id]);

  // Handle Paystack callback (?reference=...)
  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref');
    if (!reference || !id) return;
    setVerifying(true);
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke('paystack-verify', { body: { reference } });
        if (error) throw error;
        if (data?.status === 'success') {
          toast({ title: 'Payment successful', description: 'Your invoice has been marked as paid.' });
          const { data: refreshed } = await supabase.from('invoices').select('*').eq('id', id).maybeSingle();
          setInvoice(refreshed);
        } else {
          toast({ title: 'Payment not completed', description: data?.message || 'Please try again.', variant: 'destructive' });
        }
      } catch (e: any) {
        toast({ title: 'Verification error', description: e.message || 'Could not verify payment.', variant: 'destructive' });
      } finally {
        setVerifying(false);
        searchParams.delete('reference');
        searchParams.delete('trxref');
        setSearchParams(searchParams, { replace: true });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fmt = (n: number, c = 'ZAR') => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: c }).format(n);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied', description: `${label} copied to clipboard` });
  };

  const handlePayOnline = async () => {
    if (!invoice) return;
    setPaying(true);
    try {
      const callbackUrl = `${window.location.origin}/client/invoice/${invoice.id}`;
      const { data, error } = await supabase.functions.invoke('paystack-init', {
        body: { invoice_id: invoice.id, callback_url: callbackUrl },
      });
      if (error) throw error;
      if (data?.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error('No authorization URL returned');
      }
    } catch (e: any) {
      toast({ title: 'Could not start payment', description: e.message || 'Try again later.', variant: 'destructive' });
      setPaying(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-background"><ClientZoneNav /><div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></div>;
  if (!invoice) return <div className="min-h-screen bg-background"><ClientZoneNav /><div className="container mx-auto px-4 py-12 text-center"><p>Invoice not found.</p><Link to="/client" className="text-primary hover:underline">← Back to dashboard</Link></div></div>;

  const items = Array.isArray(invoice.line_items) ? invoice.line_items : [];
  const isPaid = invoice.status === 'paid';
  const reference = invoice.invoice_number;

  return (
    <div className="min-h-screen bg-background">
      <ClientZoneNav />
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <Link to="/client" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to dashboard
        </Link>

        <Card className="p-8 card-gradient border-border mb-6">
          <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
            <div>
              <h1 className="font-heading text-2xl font-bold mb-1">{invoice.invoice_number}</h1>
              <p className="text-muted-foreground">{invoice.title}</p>
              {invoice.description && <p className="text-sm text-muted-foreground mt-2">{invoice.description}</p>}
            </div>
            <Badge variant={isPaid ? 'default' : 'secondary'} className="capitalize">{invoice.status}</Badge>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-6 text-sm">
            <div><span className="text-muted-foreground">Issued: </span>{new Date(invoice.issued_date).toLocaleDateString('en-ZA')}</div>
            {invoice.due_date && <div><span className="text-muted-foreground">Due: </span>{new Date(invoice.due_date).toLocaleDateString('en-ZA')}</div>}
          </div>

          {items.length > 0 && (
            <div className="border-t border-border pt-4 mb-4">
              <h2 className="font-semibold mb-3 text-sm">Line Items</h2>
              <div className="space-y-2">
                {items.map((it: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm py-2 border-b border-border/50">
                    <div>
                      <p>{it.description}</p>
                      {it.quantity && <p className="text-xs text-muted-foreground">{it.quantity} × {fmt(Number(it.unit_price || 0), invoice.currency)}</p>}
                    </div>
                    <p className="font-medium">{fmt(Number(it.amount || (it.quantity * it.unit_price) || 0), invoice.currency)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2 text-sm border-t border-border pt-4">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{fmt(Number(invoice.subtotal), invoice.currency)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">VAT</span><span>{fmt(Number(invoice.vat), invoice.currency)}</span></div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
              <span>Total</span><span className="gradient-text">{fmt(Number(invoice.total), invoice.currency)}</span>
            </div>
          </div>
        </Card>

        {isPaid ? (
          <Card className="p-6 card-gradient border-green-500/30 bg-green-500/5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              <div>
                <h2 className="font-semibold">Payment received</h2>
                <p className="text-sm text-muted-foreground">Thank you! Paid on {invoice.paid_at ? new Date(invoice.paid_at).toLocaleDateString('en-ZA') : '—'}.</p>
              </div>
            </div>
          </Card>
        ) : (
          <>
            {verifying && (
              <Card className="p-4 mb-6 card-gradient border-primary/30 bg-primary/5">
                <div className="flex items-center gap-3 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  Verifying your payment with Paystack…
                </div>
              </Card>
            )}

            <Card className="p-6 card-gradient border-primary/40 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <h2 className="font-heading text-lg font-semibold">Pay instantly online</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Pay with card, instant EFT, or mobile money via Paystack — secure & fast. Your invoice updates automatically.
              </p>
              <Button onClick={handlePayOnline} disabled={paying} size="lg" className="w-full sm:w-auto">
                {paying ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
                Pay {fmt(Number(invoice.total), invoice.currency)} now
              </Button>
            </Card>

          <Card className="p-6 card-gradient border-border">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-5 h-5 text-primary" />
              <h2 className="font-heading text-lg font-semibold">Need to pay by EFT?</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              For your security, we no longer publish banking details on the website. If you'd prefer EFT instead of online payment, email <a href="mailto:sales@nativedigital.co.za" className="text-primary hover:underline">sales@nativedigital.co.za</a> with your invoice reference <code className="bg-muted px-1.5 py-0.5 rounded text-primary">{reference}</code> and we'll send you our banking details directly.
            </p>
          </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default InvoiceDetail;
