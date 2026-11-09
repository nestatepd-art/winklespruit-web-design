import { MessageCircle } from 'lucide-react';
import { WHATSAPP_URL } from '@/components/home/motion';

/** Always-visible WhatsApp + audit access on mobile. */
const StickyCta = () => (
  <div className="md:hidden fixed bottom-0 inset-x-0 z-40 flex gap-2 p-3 bg-background/95 backdrop-blur border-t border-border">
    <a href="#contact" className="flex-1 rounded-full bg-primary text-primary-foreground text-center font-semibold py-3 text-sm">
      Free audit
    </a>
    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-full bg-secondary text-secondary-foreground text-center font-semibold py-3 text-sm inline-flex items-center justify-center gap-2">
      <MessageCircle className="h-4 w-4" /> WhatsApp
    </a>
  </div>
);

export default StickyCta;
