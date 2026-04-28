import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import ClientZoneNav from '@/components/ClientZoneNav';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { FileText, Loader2, FolderKanban, ArrowRight } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

const STAGE_LABELS: Record<string, string> = {
  discovery: 'Discovery',
  design: 'Design',
  build: 'Build',
  qa: 'QA / Review',
  live: 'Live',
  maintenance: 'Maintenance',
};

const STATUS_VARIANT: Record<string, string> = {
  paid: 'bg-green-500/15 text-green-400 border-green-500/30',
  sent: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  overdue: 'bg-red-500/15 text-red-400 border-red-500/30',
  cancelled: 'bg-muted text-muted-foreground',
  draft: 'bg-muted text-muted-foreground',
};

const ClientDashboard = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({ title: 'Client Dashboard | Native Digital Media', description: 'Your invoices and project status.', canonical: '/client' });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: inv }, { data: proj }] = await Promise.all([
        supabase.from('invoices').select('*').order('issued_date', { ascending: false }),
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
      ]);
      setInvoices(inv || []);
      setProjects(proj || []);
      setLoading(false);
    })();
  }, [user]);

  const fmt = (n: number, c = 'ZAR') => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: c }).format(n);

  return (
    <div className="min-h-screen bg-background">
      <ClientZoneNav />
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <h1 className="font-heading text-3xl font-bold mb-2">Welcome back</h1>
        <p className="text-muted-foreground mb-8">Here's an overview of your invoices and project progress.</p>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Projects */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <FolderKanban className="w-5 h-5 text-primary" />
                <h2 className="font-heading text-xl font-semibold">Project Status</h2>
              </div>
              {projects.length === 0 ? (
                <Card className="p-6 card-gradient border-border text-muted-foreground text-sm">
                  No active projects yet.
                </Card>
              ) : (
                <div className="space-y-4">
                  {projects.map((p) => (
                    <Card key={p.id} className="p-5 card-gradient border-border">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{p.name}</h3>
                          {p.description && <p className="text-xs text-muted-foreground mt-1">{p.description}</p>}
                        </div>
                        <Badge variant="secondary">{STAGE_LABELS[p.stage] || p.stage}</Badge>
                      </div>
                      <Progress value={p.progress_percent} className="h-2 mb-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{p.progress_percent}% complete</span>
                        {p.target_date && <span>Target: {new Date(p.target_date).toLocaleDateString('en-ZA')}</span>}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Invoices */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="font-heading text-xl font-semibold">Invoices</h2>
              </div>
              {invoices.length === 0 ? (
                <Card className="p-6 card-gradient border-border text-muted-foreground text-sm">
                  No invoices yet.
                </Card>
              ) : (
                <div className="space-y-3">
                  {invoices.map((inv) => (
                    <Link to={`/client/invoice/${inv.id}`} key={inv.id}>
                      <Card className="p-4 card-gradient border-border hover:border-primary/40 transition-all cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm">{inv.invoice_number}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${STATUS_VARIANT[inv.status] || ''}`}>{inv.status}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{inv.title}</p>
                            {inv.due_date && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Due: {new Date(inv.due_date).toLocaleDateString('en-ZA')}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-heading font-bold gradient-text">{fmt(Number(inv.total), inv.currency)}</p>
                            <ArrowRight className="w-4 h-4 text-muted-foreground inline mt-1" />
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default ClientDashboard;
