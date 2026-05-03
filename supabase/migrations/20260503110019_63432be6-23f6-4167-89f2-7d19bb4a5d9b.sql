ALTER TABLE public.payments ALTER COLUMN invoice_id DROP NOT NULL;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS description TEXT;