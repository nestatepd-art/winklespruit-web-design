import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Phone, Mail, MapPin, Server, Gauge, Shield, Search, Zap, Star, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadAuditForm from "@/components/LeadAuditForm";
import WebsitePackages from "@/components/WebsitePackages";
import CaseStudies from "@/components/CaseStudies";
import FAQ from "@/components/FAQ";
import { useSEO } from "@/hooks/useSEO";

const HOSTING_FEATURES = [
  { icon: Gauge, title: "Sub-2s page loads", body: "Enterprise CDN + image optimisation. Faster site = better Google rank + more conversions." },
  { icon: Shield, title: "Free SSL + daily backups", body: "HTTPS encryption, automatic daily backups, and 99.9% uptime SLA — included on every plan." },
  { icon: Server, title: "South African-friendly", body: "Edge servers near your customers. Pages load fast for visitors in Durban, Joburg & Cape Town." },
  { icon: Search, title: "SEO-ready out the box", body: "Schema markup, sitemap, robots.txt, Google Search Console + Analytics — wired up on day one." },
  { icon: Zap, title: "Lead capture built-in", body: "Forms, WhatsApp click-to-chat, instant email alerts to you, plus lead history in your dashboard." },
  { icon: Clock, title: "Live in 7–14 days", body: "We don't drag projects out for months. Most Starter sites go live within two weeks." },
];

const TRUST = [
  "Built in KZN, for KZN businesses",
  "150+ websites delivered since 2019",
  "5★ rated on Google",
  "No long-term lock-in contracts",
];

const WebsiteDevelopmentHosting = () => {
  useSEO({
    title: "Website Development & Hosting Durban | From R369/mo — Native Digital",
    description:
      "Custom website development & reliable hosting from R369/month. Mobile-first, SEO-ready sites built in KZN. Free SSL, daily backups, lead capture. Get your free AI audit.",
    canonical: `${window.location.origin}/website-development-hosting`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Website Development & Hosting",
      provider: {
        "@type": "LocalBusiness",
        name: "Native Digital Media",
        telephone: "+27311000683",
        email: "sales@nativedigital.co.za",
        address: {
          "@type": "PostalAddress",
          streetAddress: "10 Winklespruit Road",
          addressLocality: "Winklespruit",
          addressRegion: "KwaZulu-Natal",
          addressCountry: "ZA",
        },
      },
      areaServed: "South Africa",
      offers: { "@type": "Offer", price: "369", priceCurrency: "ZAR" },
    },
  });

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 hero-gradient overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-[28rem] h-[28rem] bg-primary/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -right-32 w-[28rem] h-[28rem] bg-secondary/15 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-up">
            <Server className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Website Development & Hosting</span>
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight mb-6 animate-fade-up-delay-1">
            Custom Websites + Reliable Hosting
            <span className="block gradient-text">From R369/month</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-up-delay-2">
            Mobile-first, SEO-ready websites with enterprise-grade hosting baked in. No surprise bills, no slow servers, no jargon — just a site that wins customers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up-delay-3">
            <Button variant="hero" size="xl" asChild>
              <a href="#contact">
                Get My Free AI Audit <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a href="tel:+27311000683">
                <Phone className="w-5 h-5 mr-2" /> Call 031 100 0683
              </a>
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-10 text-sm text-muted-foreground">
            {TRUST.map((t) => (
              <span key={t} className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14 animate-fade-up">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Everything included</span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3">
              Development <span className="gradient-text">and</span> hosting. One partner.
            </h2>
            <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
              Most agencies build the site, then leave you to fight a hosting company when it breaks. We handle both — so when something needs fixing, you call one number.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HOSTING_FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl card-gradient border border-border hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 animate-fade-up"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages — reuse single source of truth */}
      <WebsitePackages />

      {/* What we don't do */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="p-10 rounded-3xl card-gradient border border-primary/30">
            <span className="text-primary text-xs font-semibold uppercase tracking-wider">The fine print, up front</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mt-3 mb-6">
              What you <span className="gradient-text">won't</span> get from us
            </h2>
            <ul className="grid sm:grid-cols-2 gap-4">
              {[
                "No 24-month lock-in contracts",
                "No surprise renewal hikes",
                "No outsourced overseas dev team",
                "No 'we'll get back to you next week'",
                "No template sites dressed up as custom",
                "No hidden hosting fees",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground/90">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CaseStudies />

      {/* Local trust strip */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">
            Local team. <span className="gradient-text">Real accountability.</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Based in Winklespruit on the KZN South Coast. Pop in, call us, or WhatsApp — priority response within 4 hours, weekdays.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 text-sm">
            <div className="flex flex-col items-center gap-2">
              <MapPin className="w-6 h-6 text-primary" />
              <span>10 Winklespruit Road, Winklespruit</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Phone className="w-6 h-6 text-primary" />
              <span>031 100 0683 / 073 165 3988</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Mail className="w-6 h-6 text-primary" />
              <span>sales@nativedigital.co.za</span>
            </div>
          </div>
        </div>
      </section>

      <FAQ />
      <LeadAuditForm />
      <Footer />
    </main>
  );
};

export default WebsiteDevelopmentHosting;
