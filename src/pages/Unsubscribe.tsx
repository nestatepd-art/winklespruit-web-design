import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

type State = 'loading' | 'valid' | 'already' | 'invalid' | 'success' | 'error';

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [state, setState] = useState<State>('loading');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setState('invalid');
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_KEY } },
        );
        const data = await res.json();
        if (!res.ok) return setState('invalid');
        if (data.valid === false && data.reason === 'already_unsubscribed') return setState('already');
        if (data.valid === true) return setState('valid');
        setState('invalid');
      } catch {
        setState('error');
      }
    })();
  }, [token]);

  const handleConfirm = async () => {
    if (!token) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('handle-email-unsubscribe', {
        body: { token },
      });
      if (error) return setState('error');
      if (data?.success) return setState('success');
      if (data?.reason === 'already_unsubscribed') return setState('already');
      setState('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-md w-full p-8 rounded-2xl border border-border card-gradient text-center">
        <h1 className="font-heading text-2xl font-bold mb-4">Email preferences</h1>
        {state === 'loading' && <p className="text-muted-foreground">Checking your link…</p>}
        {state === 'valid' && (
          <>
            <p className="text-muted-foreground mb-6">
              Click below to unsubscribe from these emails.
            </p>
            <Button onClick={handleConfirm} disabled={submitting} variant="hero" size="lg">
              {submitting ? 'Unsubscribing…' : 'Confirm unsubscribe'}
            </Button>
          </>
        )}
        {state === 'success' && (
          <p className="text-muted-foreground">You've been unsubscribed. Sorry to see you go.</p>
        )}
        {state === 'already' && (
          <p className="text-muted-foreground">You're already unsubscribed.</p>
        )}
        {state === 'invalid' && (
          <p className="text-muted-foreground">This unsubscribe link is invalid or expired.</p>
        )}
        {state === 'error' && (
          <p className="text-muted-foreground">Something went wrong. Please try again.</p>
        )}
      </div>
    </main>
  );
};

export default Unsubscribe;
