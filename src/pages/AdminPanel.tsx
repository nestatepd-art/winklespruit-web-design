import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ClientZoneNav from '@/components/ClientZoneNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, CheckCircle, Loader2, Users, FileText, FolderKanban } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

const STAGES = ['discovery', 'design', 'build', 'qa', 'live', 'maintenance'] as const;
const STATUSES = ['draft', 'sent', 'paid', 'overdue', 'cancelled'] as const;

const AdminPanel = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({ title: 'Admin | Native Digital Media', description: 'Admin control panel.', canonical: '/admin' });

  const refresh = async () => {
    const [{ data: c }, { data: i }, { data: p }] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('invoices').select('*').order('issued_date', { ascending: false }),
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
    ]);
    setClients(c || []);
    setInvoices(i || []);
    setProjects(p || []);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const fmt = (n: number, c = 'ZAR') => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: c }).format(n);

  // ----- Invoice creation -----
  const [invForm, setInvForm] = useState({
    client_user_id: '',
    title: '',
    description: '',
    subtotal: '',
    vat_pct: '15',
    due_date: '',
    status: 'sent' as typeof STATUSES[number],
  });
  const [invOpen, setInvOpen] = useState(false);

  const createInvoice = async () => {
    if (!invForm.client_user_id || !invForm.title || !invForm.subtotal) {
      toast({ title: 'Missing fields', variant: 'destructive' });
      return;
    }
    const subtotal = Number(invForm.subtotal);
    const vat = +(subtotal * (Number(invForm.vat_pct) / 100)).toFixed(2);
    const total = +(subtotal + vat).toFixed(2);
    const invoice_number = `INV-${Date.now().toString().slice(-8)}`;

    const { error } = await supabase.from('invoices').insert({
      client_user_id: invForm.client_user_id,
      invoice_number,
      title: invForm.title,
      description: invForm.description || null,
      subtotal,
      vat,
      total,
      due_date: invForm.due_date || null,
      status: invForm.status,
      line_items: [{ description: invForm.title, quantity: 1, unit_price: subtotal, amount: subtotal }],
    });
    if (error) {
      toast({ title: 'Failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Invoice created', description: invoice_number });
      setInvOpen(false);
      setInvForm({ ...invForm, title: '', description: '', subtotal: '', due_date: '' });
      refresh();
    }
  };

  const markPaid = async (inv: any) => {
    const { error } = await supabase.from('invoices').update({
      status: 'paid',
      paid_at: new Date().toISOString(),
      payment_method: 'eft',
    }).eq('id', inv.id);
    if (!error) {
      await supabase.from('payments').insert({
        invoice_id: inv.id,
        client_user_id: inv.client_user_id,
        amount: inv.total,
        currency: inv.currency,
        method: 'eft',
        reference: inv.invoice_number,
      });
      toast({ title: 'Marked as paid' });
      refresh();
    } else toast({ title: 'Error', description: error.message, variant: 'destructive' });
  };

  const deleteInvoice = async (id: string) => {
    if (!confirm('Delete this invoice?')) return;
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (!error) { toast({ title: 'Deleted' }); refresh(); }
  };

  // ----- Project creation -----
  const [projForm, setProjForm] = useState({
    client_user_id: '',
    name: '',
    description: '',
    stage: 'discovery' as typeof STAGES[number],
    progress_percent: 0,
    target_date: '',
  });
  const [projOpen, setProjOpen] = useState(false);

  const createProject = async () => {
    if (!projForm.client_user_id || !projForm.name) {
      toast({ title: 'Missing fields', variant: 'destructive' });
      return;
    }
    const { error } = await supabase.from('projects').insert({
      client_user_id: projForm.client_user_id,
      name: projForm.name,
      description: projForm.description || null,
      stage: projForm.stage,
      progress_percent: Number(projForm.progress_percent),
      target_date: projForm.target_date || null,
    });
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else {
      toast({ title: 'Project created' });
      setProjOpen(false);
      setProjForm({ ...projForm, name: '', description: '', target_date: '' });
      refresh();
    }
  };

  const updateProject = async (id: string, updates: any) => {
    const { error } = await supabase.from('projects').update(updates).eq('id', id);
    if (!error) refresh();
    else toast({ title: 'Error', description: error.message, variant: 'destructive' });
  };

  const clientName = (uid: string) => {
    const c = clients.find((x) => x.user_id === uid);
    return c ? (c.full_name || c.email || uid.slice(0, 8)) : uid.slice(0, 8);
  };

  if (loading) return <div className="min-h-screen bg-background"><ClientZoneNav /><div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></div>;

  return (
    <div className="min-h-screen bg-background">
      <ClientZoneNav />
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <h1 className="font-heading text-3xl font-bold mb-6">Admin Panel</h1>

        <Tabs defaultValue="invoices">
          <TabsList className="mb-6">
            <TabsTrigger value="invoices"><FileText className="w-4 h-4 mr-2" />Invoices</TabsTrigger>
            <TabsTrigger value="projects"><FolderKanban className="w-4 h-4 mr-2" />Projects</TabsTrigger>
            <TabsTrigger value="clients"><Users className="w-4 h-4 mr-2" />Clients</TabsTrigger>
          </TabsList>

          {/* INVOICES */}
          <TabsContent value="invoices" className="space-y-4">
            <Dialog open={invOpen} onOpenChange={setInvOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-2" />New Invoice</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>Create Invoice</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>Client</Label>
                    <Select value={invForm.client_user_id} onValueChange={(v) => setInvForm({ ...invForm, client_user_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                      <SelectContent>
                        {clients.map((c) => (
                          <SelectItem key={c.user_id} value={c.user_id}>{c.full_name || c.email}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Title</Label><Input value={invForm.title} onChange={(e) => setInvForm({ ...invForm, title: e.target.value })} /></div>
                  <div><Label>Description</Label><Textarea value={invForm.description} onChange={(e) => setInvForm({ ...invForm, description: e.target.value })} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Subtotal (ZAR)</Label><Input type="number" step="0.01" value={invForm.subtotal} onChange={(e) => setInvForm({ ...invForm, subtotal: e.target.value })} /></div>
                    <div><Label>VAT %</Label><Input type="number" value={invForm.vat_pct} onChange={(e) => setInvForm({ ...invForm, vat_pct: e.target.value })} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Due date</Label><Input type="date" value={invForm.due_date} onChange={(e) => setInvForm({ ...invForm, due_date: e.target.value })} /></div>
                    <div>
                      <Label>Status</Label>
                      <Select value={invForm.status} onValueChange={(v: any) => setInvForm({ ...invForm, status: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={createInvoice} className="w-full">Create</Button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="space-y-2">
              {invoices.map((inv) => (
                <Card key={inv.id} className="p-4 card-gradient border-border">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{inv.invoice_number}</span>
                        <Badge variant="secondary" className="capitalize">{inv.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{inv.title} — {clientName(inv.client_user_id)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold gradient-text">{fmt(Number(inv.total), inv.currency)}</span>
                      {inv.status !== 'paid' && (
                        <Button size="sm" variant="outline" onClick={() => markPaid(inv)}>
                          <CheckCircle className="w-4 h-4 mr-1" />Mark Paid
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => deleteInvoice(inv.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              {invoices.length === 0 && <p className="text-muted-foreground text-sm">No invoices yet.</p>}
            </div>
          </TabsContent>

          {/* PROJECTS */}
          <TabsContent value="projects" className="space-y-4">
            <Dialog open={projOpen} onOpenChange={setProjOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-2" />New Project</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>Create Project</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>Client</Label>
                    <Select value={projForm.client_user_id} onValueChange={(v) => setProjForm({ ...projForm, client_user_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                      <SelectContent>
                        {clients.map((c) => <SelectItem key={c.user_id} value={c.user_id}>{c.full_name || c.email}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Name</Label><Input value={projForm.name} onChange={(e) => setProjForm({ ...projForm, name: e.target.value })} /></div>
                  <div><Label>Description</Label><Textarea value={projForm.description} onChange={(e) => setProjForm({ ...projForm, description: e.target.value })} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Stage</Label>
                      <Select value={projForm.stage} onValueChange={(v: any) => setProjForm({ ...projForm, stage: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{STAGES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div><Label>Target date</Label><Input type="date" value={projForm.target_date} onChange={(e) => setProjForm({ ...projForm, target_date: e.target.value })} /></div>
                  </div>
                  <div><Label>Progress %</Label><Input type="number" min="0" max="100" value={projForm.progress_percent} onChange={(e) => setProjForm({ ...projForm, progress_percent: Number(e.target.value) })} /></div>
                  <Button onClick={createProject} className="w-full">Create</Button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="space-y-3">
              {projects.map((p) => (
                <Card key={p.id} className="p-4 card-gradient border-border">
                  <div className="flex justify-between items-start mb-3 flex-wrap gap-3">
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{clientName(p.client_user_id)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Select value={p.stage} onValueChange={(v) => updateProject(p.id, { stage: v })}>
                        <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                        <SelectContent>{STAGES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                      </Select>
                      <Input
                        type="number" min="0" max="100"
                        defaultValue={p.progress_percent}
                        className="w-20"
                        onBlur={(e) => {
                          const v = Number(e.target.value);
                          if (v !== p.progress_percent) updateProject(p.id, { progress_percent: v });
                        }}
                      />
                    </div>
                  </div>
                  <Progress value={p.progress_percent} className="h-2" />
                </Card>
              ))}
              {projects.length === 0 && <p className="text-muted-foreground text-sm">No projects yet.</p>}
            </div>
          </TabsContent>

          {/* CLIENTS */}
          <TabsContent value="clients">
            <Card className="card-gradient border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 text-left">
                  <tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">User ID</th><th className="p-3">Joined</th></tr>
                </thead>
                <tbody>
                  {clients.map((c) => (
                    <tr key={c.id} className="border-t border-border">
                      <td className="p-3">{c.full_name || '—'}</td>
                      <td className="p-3">{c.email}</td>
                      <td className="p-3 font-mono text-xs text-muted-foreground">{c.user_id}</td>
                      <td className="p-3 text-muted-foreground">{new Date(c.created_at).toLocaleDateString('en-ZA')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {clients.length === 0 && <p className="p-4 text-muted-foreground">No clients yet.</p>}
            </Card>
            <p className="text-xs text-muted-foreground mt-3">
              💡 To promote yourself to admin: sign up first, then ask me to grant your account admin role.
            </p>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
