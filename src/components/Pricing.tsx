import { Check, Code, Search, Target, Share2, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

const pricingPackages = [
  {
    icon: Code,
    name: "Web Development",
    description: "Custom websites built to convert",
    originalPrice: "From R8,500",
    price: "From R2,125",
    period: "once-off",
    features: [
      "Responsive mobile-first design",
      "Up to 5 pages",
      "Contact form integration",
      "SEO-ready structure",
      "1 month free support",
      "Domain & hosting setup"
    ],
    popular: false
  },
  {
    icon: Search,
    name: "SEO Optimization",
    description: "Boost your organic rankings",
    originalPrice: "R2,500",
    price: "R625",
    period: "/month",
    features: [
      "Keyword research & strategy",
      "On-page optimization",
      "Technical SEO audit",
      "Monthly performance reports",
      "Competitor analysis",
      "Local SEO optimization"
    ],
    popular: true
  },
  {
    icon: Target,
    name: "Google Ads",
    description: "Targeted pay-per-click campaigns",
    originalPrice: "R3,000",
    price: "R750",
    period: "/month",
    features: [
      "Campaign setup & management",
      "Keyword targeting",
      "Ad copywriting",
      "A/B testing",
      "Conversion tracking",
      "Monthly ROI reports"
    ],
    popular: false
  },
  {
    icon: Share2,
    name: "Social Media Ads",
    description: "Reach your audience on social",
    originalPrice: "R2,800",
    price: "R700",
    period: "/month",
    features: [
      "Facebook & Instagram ads",
      "Audience targeting",
      "Creative design",
      "Campaign optimization",
      "Remarketing setup",
      "Performance analytics"
    ],
    popular: false
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-fade-up">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Pricing</span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mt-4 mb-6">
            Transparent <span className="gradient-text">Pricing</span>
          </h2>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-full px-5 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-primary font-semibold">Limited Time Special — 75% OFF</span>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the package that fits your business needs. All prices exclude VAT and ad spend.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingPackages.map((pkg, index) => (
            <div
              key={pkg.name}
              className={`relative p-6 rounded-2xl card-gradient border transition-all duration-500 hover:-translate-y-2 animate-fade-up ${
                pkg.popular 
                  ? 'border-primary shadow-lg shadow-primary/20' 
                  : 'border-border hover:border-primary/30'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center ${pkg.popular ? 'bg-gradient-to-br from-primary to-secondary' : 'bg-gradient-to-br from-primary/20 to-secondary/20'}`}>
                  <pkg.icon className={`w-7 h-7 ${pkg.popular ? 'text-primary-foreground' : 'text-primary'}`} />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2">{pkg.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{pkg.description}</p>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-muted-foreground text-sm line-through">{pkg.originalPrice}</span>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-heading text-3xl font-bold gradient-text">{pkg.price}</span>
                    <span className="text-muted-foreground text-sm">{pkg.period}</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={pkg.popular ? "default" : "outline"} 
                className="w-full"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-muted-foreground text-sm mt-8">
          Need a custom package? <a href="#contact" className="text-primary hover:underline">Contact us</a> for a tailored solution.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
