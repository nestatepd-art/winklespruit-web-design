import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import ClientZoneNav from '@/components/ClientZoneNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useSEO } from '@/hooks/useSEO';
import { CreditCard, Wallet, Receipt, Loader2, ArrowRight, Building2, CheckCircle2, Plus } from 'lucide-react';
import { BANKING_DETAILS } from '@/lib/banking';

const fmt = (n: number, c = 'ZAR') => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: c }).format(n);

const Payments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [adhocAmount, setAdhocAmount] = useState('');
  const [adhocDesc, setAdhocDesc] = useState('');
  const [adhocPaying, setAdhocPaying] = useState(false);

  useSEO({ title: 'Payments | Native Digital Media', description: 'Pay invoices, view payment history, and make payments.', canonical: '/client/payments' });

  const load = async () => {
    const [{ data: inv }, { data: pay }] = await Promise.all([
      supabase.from('invoices').select('*').order('issued_date', { ascending: false }),
      supabase.from('payments').select('*').order('paid_at', { ascending: false }),
    ]);
    setInvoices(inv || []);
    setPayments(pay || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  // Handle Paystack callback
  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref');
    if (!reference) return;
    setVerifying(true);
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke('paystack-verify', { body: { reference } });
        if (error) throw error;
        if (data?.status === 'success') {
          toast({ title: 'Payment successful', description: 'Your payment has been recorded.' });
          await load();
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
  }, []);

  const unpaid = useMemo(() => invoices.filter((i) => i.status !== 'paid' && i.status !== 'draft' && i.status !== 'cancelled'), [invoices]);
  const outstanding = useMemo(() => unpaid.reduce((s, i) => s + Number(i.total || 0), 0), [unpaid]);
  const totalPaid = useMemo(() => payments.reduce((s, p) => s + Number(p.amount || 0), 0), [payments]);

  const payInvoice = async (inv: any) => {
    setPaying(inv.id);
    try {
      const callbackUrl = `${window.location.origin}/client/payments`;
      const { data, error } = await supabase.functions.invoke('paystack-init', {
        body: { invoice_id: inv.id, callback_url: callbackUrl },
      });
      if (error) throw error;
      if (data?.authorization_url) window.location.href = data.authorization_url;
      else throw new Error('No payment URL returned');
    } catch (e: any) {
      toast({ title: 'Could not start payment', description: e.message || 'Try again.', variant: 'destructive' });
      setPaying(null);
    }
  };

  const payAdhoc = async () => {
    const amt = Number(adhocAmount);
    if (!amt || amt < 10) {
      toast({ title: 'Invalid amount', description: 'Minimum R10.', variant: 'destructive' });
      return;
    }
    if (!adhocDesc.trim()) {
      toast({ title: 'Description required', description: 'Tell us what this payment is for.', variant: 'destructive' });
      return;
    }
    setAdhocPaying(true);
    try {
      const callbackUrl = `${window.location.origin}/client/payments`;
      const { data, error } = await supabase.functions.invoke('paystack-adhoc-init', {
        body: { amount: amt, description: adhocDesc.trim(), callback_url: callbackUrl },
      });
      if (error) throw error;
      if (data?.authorization_url) window.location.href = data.authorization_url;
      else throw new Error('No payment URL returned');
    } catch (e: any) {
      toast({ title: 'Could not start payment', description: e.message || 'Try again.', variant: 'destructive' });
      setAdhocPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ClientZoneNav />
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold mb-2">Payments</h1>
          <p className="text-muted-foreground">Pay invoices, make payments, and view your full payment history.</p>
        </div>

        {verifying && (
          <Card className="p-4 mb-6 card-gradient border-primary/30 bg-primary/5">
            <div className="flex items-center gap-3 text-sm">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              Verifying your payment…
            </div>
          </Card>
        )}

        {/* Summary */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card className="p-5 card-gradient border-border">
            <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide mb-2">
              <Wallet className="w-4 h-4" /> Outstanding Balance
            </div>
            <p className="font-heading text-2xl font-bold gradient-text">{fmt(outstanding)}</p>
            <p className="text-xs text-muted-foreground mt-1">{unpaid.length} unpaid invoice{unpaid.length === 1 ? '' : 's'}</p>
          </Card>
          <Card className="p-5 card-gradient border-border">
            <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide mb-2">
              <CheckCircle2 className="w-4 h-4" /> Total Paid
            </div>
            <p className="font-heading text-2xl font-bold">{fmt(totalPaid)}</p>
            <p className="text-xs text-muted-foreground mt-1">{payments.length} payment{payments.length === 1 ? '' : 's'} on record</p>
          </Card>
          <Card className="p-5 card-gradient border-primary/40">
            <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide mb-2">
              <CreditCard className="w-4 h-4" /> Quick Pay
            </div>
            <p className="text-sm mb-3">Card, EFT, or mobile money — instantly.</p>
            <a href="#make-payment" className="text-primary text-sm hover:underline inline-flex items-center">
              Make a payment <ArrowRight className="w-3 h-3 ml-1" />
            </a>
          </Card>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left col: unpaid invoices + history */}
            <div className="lg:col-span-2 space-y-6">
              <section>
                <h2 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-primary" /> Unpaid Invoices
                </h2>
                {unpaid.length === 0 ? (
                  <Card className="p-6 card-gradient border-border text-sm text-muted-foreground">
                    🎉 All caught up — no outstanding invoices.
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {unpaid.map((inv) => (
                      <Card key={inv.id} className="p-4 card-gradient border-border">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm">{inv.invoice_number}</span>
                              <Badge variant="secondary" className="capitalize text-xs">{inv.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{inv.title}</p>
                            {inv.due_date && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Due: {new Date(inv.due_date).toLocaleDateString('en-ZA')}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-heading font-bold gradient-text mb-2">{fmt(Number(inv.total), inv.currency)}</p>
                            <div className="flex gap-2 justify-end">
                              <Link to={`/client/invoice/${inv.id}`}>
                                <Button variant="outline" size="sm">View</Button>
                              </Link>
                              <Button size="sm" onClick={() => payInvoice(inv)} disabled={paying === inv.id}>
                                {paying === inv.id ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <CreditCard className="w-3 h-3 mr-1" />}
                                Pay Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h2 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> Payment History
                </h2>
                {payments.length === 0 ? (
                  <Card className="p-6 card-gradient border-border text-sm text-muted-foreground">
                    No payments recorded yet.
                  </Card>
                ) : (
                  <Card className="card-gradient border-border overflow-hidden">
                    <div className="divide-y divide-border">
                      {payments.map((p) => (
                        <div key={p.id} className="p-4 flex items-center justify-between gap-3 text-sm">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium truncate">
                              {p.description || (p.invoice_id ? 'Invoice payment' : 'Ad-hoc payment')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(p.paid_at).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' })}
                              {' · '}{p.method}
                              {p.reference && <> · <span className="font-mono">{p.reference}</span></>}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{fmt(Number(p.amount), p.currency)}</p>
                            <Badge variant="outline" className="text-xs mt-1 border-green-500/30 text-green-400">Paid</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </section>
            </div>

            {/* Right col: make a payment + EFT */}
            <div className="space-y-6">
              <Card id="make-payment" className="p-6 card-gradient border-primary/40">
                <div className="flex items-center gap-2 mb-2">
                  <Plus className="w-5 h-5 text-primary" />
                  <h2 className="font-heading text-lg font-semibold">Make a Payment</h2>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Pay any amount — for retainers, top-ups, or services not yet invoiced.
                </p>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="amt" className="text-xs">Amount (ZAR)</Label>
                    <Input
                      id="amt"
                      type="number"
                      min={10}
                      step="0.01"
                      placeholder="0.00"
                      value={adhocAmount}
                      onChange={(e) => setAdhocAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="desc" className="text-xs">What is this payment for?</Label>
                    <Textarea
                      id="desc"
                      placeholder="e.g. SEO retainer December, website deposit"
                      value={adhocDesc}
                      maxLength={200}
                      onChange={(e) => setAdhocDesc(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <Button onClick={payAdhoc} disabled={adhocPaying} className="w-full">
                    {adhocPaying ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
                    Pay {adhocAmount ? fmt(Number(adhocAmount) || 0) : 'Now'}
                  </Button>
                  <p className="text-[10px] text-muted-foreground text-center">
                    Secure checkout via Paystack · Card, Instant EFT, Mobile Money
                  </p>
                </div>
              </Card>

              <Card className="p-6 card-gradient border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-5 h-5 text-primary" />
                  <h2 className="font-heading text-base font-semibold">Prefer EFT?</h2>
                </div>
                <p className="text-xs text-muted-foreground">
                  For security, we no longer publish bank details online. Email <a href="mailto:sales@nativedigital.co.za" className="text-primary hover:underline">sales@nativedigital.co.za</a> with your invoice number and we'll send our banking details directly.
                </p>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Payments;
