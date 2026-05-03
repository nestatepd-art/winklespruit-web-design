import { Button } from "@/components/ui/button";
import { ArrowRight, Check, MapPin, Phone, Mail, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadAuditForm from "@/components/LeadAuditForm";
import CaseStudies from "@/components/CaseStudies";
import { useSEO } from "@/hooks/useSEO";

export interface LocalLandingPageProps {
  service: string; // e.g. "Web Design"
  city: string; // e.g. "KZN"
  slug: string; // e.g. "web-design-kzn"
  title: string; // SEO title <60 chars
  description: string; // SEO meta <160 chars
  hero: { eyebrow: string; headline: string; sub: string };
  benefits: string[];
  priceFrom: string;
  priceNote: string;
}

const LocalLandingPage = ({
  service,
  city,
  slug,
  title,
  description,
  hero,
  benefits,
  priceFrom,
  priceNote,
}: LocalLandingPageProps) => {
  useSEO({
    title,
    description,
    canonical: `${window.location.origin}/${slug}`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `${service} ${city}`,
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
      areaServed: city,
      description,
      offers: { "@type": "Offer", price: priceFrom, priceCurrency: "ZAR" },
    },
  });

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 hero-gradient overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-[28rem] h-[28rem] bg-primary/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -right-32 w-[28rem] h-[28rem] bg-secondary/15 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-up">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">{hero.eyebrow}</span>
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight mb-6 animate-fade-up-delay-1">
            {hero.headline.split("|").map((part, i) =>
              i === 1 ? (
                <span key={i} className="block gradient-text">{part}</span>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-up-delay-2">
            {hero.sub}
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
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" /> 5★ Google reviews
            </span>
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> 150+ projects delivered
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Proudly KZN-based
            </span>
          </div>
        </div>
      </section>

      {/* Benefits + price */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Why us
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mt-3 mb-6">
              {service} that actually delivers <span className="gradient-text">leads</span>
            </h2>
            <ul className="space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <span className="text-foreground/90">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-8 rounded-3xl card-gradient border border-primary/40 shadow-lg shadow-primary/10 animate-fade-up-delay-2">
            <span className="text-primary text-xs font-semibold uppercase tracking-wider">
              Pricing
            </span>
            <p className="font-heading text-5xl font-bold gradient-text mt-3">
              {priceFrom}
            </p>
            <p className="text-muted-foreground mt-2 mb-6">{priceNote}</p>
            <Button variant="hero" size="lg" className="w-full" asChild>
              <a href="#contact">Get Started</a>
            </Button>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              No long-term contract. Cancel anytime.
            </p>
            <Link
              to="/#pricing"
              className="block text-xs text-primary text-center mt-3 hover:underline"
            >
              See all packages →
            </Link>
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
            We're based in Winklespruit on the KZN South Coast — not an offshore agency.
            Meet us, call us, or pop in. {city} businesses get priority response within 4 hours.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 text-sm">
            <div className="flex flex-col items-center gap-2">
              <MapPin className="w-6 h-6 text-primary" />
              <span>10 Winklespruit Road, Winklespruit</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Phone className="w-6 h-6 text-primary" />
              <span>031 100 0683 / 073 645 6141</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Mail className="w-6 h-6 text-primary" />
              <span>sales@nativedigital.co.za</span>
            </div>
          </div>
        </div>
      </section>

      <LeadAuditForm />
      <Footer />
    </main>
  );
};

export default LocalLandingPage;
