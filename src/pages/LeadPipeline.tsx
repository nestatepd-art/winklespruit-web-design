import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ClientZoneNav from '@/components/ClientZoneNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useSEO } from '@/hooks/useSEO';
import { Loader2, Mail, Phone, Globe, Calendar, Trash2, AlertCircle, ExternalLink } from 'lucide-react';

const STAGES = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'] as const;
type Stage = typeof STAGES[number];

const STAGE_META: Record<Stage, { label: string; color: string }> = {
  new: { label: 'New', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
  contacted: { label: 'Contacted', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
  qualified: { label: 'Qualified', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' },
  proposal: { label: 'Proposal Sent', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  won: { label: 'Won', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  lost: { label: 'Lost', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
};

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  website: string | null;
  business_type: string | null;
  message: string | null;
  source: string | null;
  stage: Stage;
  admin_notes: string | null;
  next_follow_up_at: string | null;
  last_contacted_at: string | null;
  estimated_value: number | null;
  created_at: string;
}

const LeadPipeline = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Lead | null>(null);

  useSEO({ title: 'Lead Pipeline | Native Digital Media', description: 'Track and convert leads.', canonical: '/admin/leads' });

  const refresh = async () => {
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    setLeads((data as Lead[]) || []);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const byStage = useMemo(() => {
    const m: Record<Stage, Lead[]> = { new: [], contacted: [], qualified: [], proposal: [], won: [], lost: [] };
    leads.forEach(l => m[l.stage]?.push(l));
    return m;
  }, [leads]);

  const overdue = leads.filter(l =>
    l.next_follow_up_at && new Date(l.next_follow_up_at) < new Date() && !['won', 'lost'].includes(l.stage)
  );

  const updateStage = async (id: string, stage: Stage) => {
    const patch: any = { stage };
    if (stage === 'contacted') patch.last_contacted_at = new Date().toISOString();
    const { error } = await supabase.from('leads').update(patch).eq('id', id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: `Moved to ${STAGE_META[stage].label}` }); refresh(); }
  };

  const saveEdit = async () => {
    if (!editing) return;
    const { error } = await supabase.from('leads').update({
      stage: editing.stage,
      admin_notes: editing.admin_notes,
      next_follow_up_at: editing.next_follow_up_at || null,
      estimated_value: editing.estimated_value || null,
    }).eq('id', editing.id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Lead updated' }); setEditing(null); refresh(); }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (!error) { toast({ title: 'Deleted' }); refresh(); }
  };

  const fmtDate = (s: string | null) => s ? new Date(s).toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

  if (loading) return (
    <div className="min-h-screen bg-background"><ClientZoneNav />
      <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <ClientZoneNav />
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="font-heading text-3xl font-bold">Lead Pipeline</h1>
            <p className="text-muted-foreground text-sm">{leads.length} total leads · {byStage.new.length} new · {byStage.won.length} won</p>
          </div>
          {overdue.length > 0 && (
            <Badge variant="destructive" className="text-sm py-1.5 px-3">
              <AlertCircle className="w-4 h-4 mr-1.5" />{overdue.length} follow-up{overdue.length > 1 ? 's' : ''} overdue
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {STAGES.map(stage => (
            <div key={stage} className="space-y-3">
              <div className="flex items-center justify-between sticky top-16 bg-background/95 backdrop-blur py-2 z-10">
                <Badge variant="outline" className={`${STAGE_META[stage].color} capitalize`}>{STAGE_META[stage].label}</Badge>
                <span className="text-xs text-muted-foreground">{byStage[stage].length}</span>
              </div>
              <div className="space-y-2">
                {byStage[stage].map(lead => {
                  const isOverdue = lead.next_follow_up_at && new Date(lead.next_follow_up_at) < new Date();
                  return (
                    <Card
                      key={lead.id}
                      className={`p-3 card-gradient border-border cursor-pointer hover:border-primary/50 transition-colors ${isOverdue && !['won', 'lost'].includes(stage) ? 'ring-1 ring-destructive/50' : ''}`}
                      onClick={() => setEditing(lead)}
                    >
                      <div className="font-medium text-sm mb-1 truncate">{lead.name}</div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex items-center gap-1 truncate"><Mail className="w-3 h-3 shrink-0" />{lead.email}</div>
                        {lead.phone && <div className="flex items-center gap-1"><Phone className="w-3 h-3 shrink-0" />{lead.phone}</div>}
                        {lead.next_follow_up_at && (
                          <div className={`flex items-center gap-1 ${isOverdue ? 'text-destructive font-medium' : ''}`}>
                            <Calendar className="w-3 h-3 shrink-0" />{fmtDate(lead.next_follow_up_at)}
                          </div>
                        )}
                      </div>
                      <div className="text-[10px] text-muted-foreground/70 mt-2">{new Date(lead.created_at).toLocaleDateString('en-ZA')}</div>
                    </Card>
                  );
                })}
                {byStage[stage].length === 0 && <p className="text-xs text-muted-foreground/60 italic px-1">Empty</p>}
              </div>
            </div>
          ))}
        </div>

        <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            {editing && (
              <>
                <DialogHeader><DialogTitle>{editing.name}</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <a href={`mailto:${editing.email}`} className="flex items-center gap-2 hover:text-primary">
                      <Mail className="w-4 h-4" />{editing.email}
                    </a>
                    {editing.phone && (
                      <a href={`https://wa.me/${editing.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary">
                        <Phone className="w-4 h-4" />{editing.phone} <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {editing.website && (
                      <a href={editing.website.startsWith('http') ? editing.website : `https://${editing.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary">
                        <Globe className="w-4 h-4" />{editing.website} <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {editing.business_type && <div className="text-muted-foreground">Type: {editing.business_type}</div>}
                    {editing.source && <div className="text-muted-foreground">Source: {editing.source}</div>}
                    {editing.message && (
                      <div className="bg-muted/30 p-3 rounded text-sm whitespace-pre-wrap">{editing.message}</div>
                    )}
                  </div>

                  <div>
                    <Label>Stage</Label>
                    <Select value={editing.stage} onValueChange={(v: Stage) => setEditing({ ...editing, stage: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STAGES.map(s => <SelectItem key={s} value={s}>{STAGE_META[s].label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Next follow-up</Label>
                      <Input
                        type="datetime-local"
                        value={editing.next_follow_up_at ? editing.next_follow_up_at.slice(0, 16) : ''}
                        onChange={e => setEditing({ ...editing, next_follow_up_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
                      />
                    </div>
                    <div>
                      <Label>Est. value (ZAR)</Label>
                      <Input
                        type="number"
                        value={editing.estimated_value ?? ''}
                        onChange={e => setEditing({ ...editing, estimated_value: e.target.value ? Number(e.target.value) : null })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      rows={5}
                      placeholder="Call summary, next steps, objections..."
                      value={editing.admin_notes ?? ''}
                      onChange={e => setEditing({ ...editing, admin_notes: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={saveEdit} className="flex-1">Save</Button>
                    <Button variant="outline" onClick={() => remove(editing.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border">
                    {STAGES.map(s => (
                      <Button
                        key={s}
                        size="sm"
                        variant={editing.stage === s ? 'default' : 'outline'}
                        onClick={() => { updateStage(editing.id, s); setEditing({ ...editing, stage: s }); }}
                      >
                        {STAGE_META[s].label}
                      </Button>
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Created {fmtDate(editing.created_at)}
                    {editing.last_contacted_at && ` · Last contacted ${fmtDate(editing.last_contacted_at)}`}
                  </p>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default LeadPipeline;
