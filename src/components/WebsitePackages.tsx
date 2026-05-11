import { Check } from 'lucide-react';
import { Button } from './ui/button';

const PACKAGES = [
  {
    name: 'Starter Site',
    price: 'From R4,500 once-off',
    blurb: 'For businesses with no website or an embarrassingly outdated one. Clean, fast, and optimised to rank locally.',
    features: [
      '5 professional pages',
      'Mobile-first design',
      'Google Business Profile setup',
      'Basic local SEO',
      'WhatsApp & contact integration',
      '1 month free support',
    ],
    popular: false,
  },
  {
    name: 'Starter Retainer',
    price: 'R369/month — no upfront fees',
    blurb: 'All the benefits of our Starter Site with zero upfront cost. Spread the build across an affordable monthly retainer.',
    features: [
      '5 professional pages',
      'Mobile-first design',
      'Google Business Profile setup',
      'Basic local SEO',
      'WhatsApp & contact integration',
      '1 month free support',
    ],
    popular: false,
  },
  {
    name: 'Growth Site',
    price: 'From R8,500 once-off + R2,500/mo',
    blurb: 'For businesses ready to use their website as a lead-generation machine. Built to rank, capture leads, and convert.',
    features: [
      'Up to 12 pages incl. service pages',
      'Advanced local SEO',
      'Lead capture + email automation',
      'Google Analytics + conversion tracking',
      'Monthly content + ranking reports',
      'Priority 4-hour support',
    ],
    popular: true,
  },
  {
    name: 'Authority Site',
    price: 'From R15,000 once-off + R4,500/mo',
    blurb: 'For established businesses dominating their category in KZN. Full digital growth engine with ads, SEO, and content.',
    features: [
      'Unlimited pages + custom features',
      'Full SEO + Google Ads management',
      'Booking system / e-commerce ready',
      'Bespoke design + brand strategy',
      'Dedicated account manager',
      'Quarterly strategy reviews',
    ],
    popular: false,
  },
];

const WebsitePackages = () => {
  return (
    <section id="pricing" className="py-24 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-14 animate-fade-up">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">What we build</span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mt-4 mb-5 leading-tight">
            Websites that <span className="gradient-text italic">work as hard</span> as you do
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Three packages built for KZN businesses at different stages. All include local SEO setup, mobile optimisation, and Google Business Profile configuration.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PACKAGES.map((pkg, i) => (
            <div
              key={pkg.name}
              className={`relative p-8 rounded-2xl card-gradient border transition-all duration-500 hover:-translate-y-2 animate-fade-up ${
                pkg.popular ? 'border-primary shadow-lg shadow-primary/20' : 'border-border hover:border-primary/40'
              }`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {pkg.popular && (
                <span className="absolute top-5 right-5 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                  Most Popular
                </span>
              )}
              <h3 className="font-heading text-2xl font-bold mb-2">{pkg.name}</h3>
              <p className="text-primary font-semibold mb-4">{pkg.price}</p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">{pkg.blurb}</p>
              <ul className="space-y-3 mb-8">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={pkg.popular ? 'hero' : 'outline'}
                className="w-full"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WebsitePackages;
