import { MapPin, Phone, Mail, Building2, CreditCard } from 'lucide-react';
import logo from '@/assets/native-digital-logo.png';
import { BANKING_DETAILS } from '@/lib/banking';

const Footer = () => {
  return (
    <footer className="py-16 px-4 bg-secondary/50 border-t border-border">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-2">
            <img src={logo} alt="Native Digital" className="h-16 w-auto mb-4" />
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
              Transforming businesses through innovative web development and strategic SEO solutions. Your trusted digital partner in South Africa.
            </p>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="/#services" className="text-muted-foreground hover:text-primary transition-colors">Services</a></li>
              <li><a href="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
              <li><a href="/#about" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/#contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                <span>10 Winklespruit Road, Winklespruit</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span>031 100 0683</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span>073 165 3988</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span>sales@nativedigital.co.za</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 pt-8 border-t border-border mb-8">
          <div className="rounded-lg border border-border bg-background/40 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-primary" />
              <h4 className="font-heading font-semibold">Banking Details (EFT)</h4>
            </div>
            <ul className="space-y-1.5 text-sm">
              <li className="flex justify-between gap-4"><span className="text-muted-foreground">Bank</span><span className="font-medium">{BANKING_DETAILS.bank}</span></li>
              <li className="flex justify-between gap-4"><span className="text-muted-foreground">Account Holder</span><span className="font-medium text-right">{BANKING_DETAILS.accountHolder}</span></li>
              <li className="flex justify-between gap-4"><span className="text-muted-foreground">Account Number</span><span className="font-mono font-medium">{BANKING_DETAILS.accountNumber}</span></li>
              <li className="flex justify-between gap-4"><span className="text-muted-foreground">Branch</span><span className="font-medium">{BANKING_DETAILS.branch}</span></li>
              <li className="flex justify-between gap-4"><span className="text-muted-foreground">Branch Code</span><span className="font-mono font-medium">{BANKING_DETAILS.branchCode}</span></li>
              <li className="flex justify-between gap-4"><span className="text-muted-foreground">Account Type</span><span className="font-medium">{BANKING_DETAILS.accountType}</span></li>
            </ul>
            <p className="text-xs text-muted-foreground mt-3 italic">
              {BANKING_DETAILS.note} Use your invoice number as reference and email POP to sales@nativedigital.co.za.
            </p>
          </div>
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-primary" />
              <h4 className="font-heading font-semibold">Pay Online (Recommended)</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Pay instantly by Card, Instant EFT or Mobile Money via our secure Paystack checkout. Payments reflect immediately — no proof of payment needed.
            </p>
            <a
              href="/client/payments"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <CreditCard className="w-4 h-4" /> Make a Payment
            </a>
          </div>
        </div>
        <div className="pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Native Digital Media. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
