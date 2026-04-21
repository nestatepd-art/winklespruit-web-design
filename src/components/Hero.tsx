import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import heroDashboard from '@/assets/hero-dashboard.jpg';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 px-4 hero-gradient overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-[28rem] h-[28rem] bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-32 w-[28rem] h-[28rem] bg-secondary/15 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — copy */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-up">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">
                Free AI Website Audit — Instant Results
              </span>
            </div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-up-delay-1">
              Websites & SEO That
              <span className="block gradient-text">Actually Convert</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed animate-fade-up-delay-2">
              Native Digital Media builds high-performing websites and runs data-driven
              SEO &amp; ad campaigns for South African businesses. Get a free AI audit
              of your site in under 30 seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 animate-fade-up-delay-3">
              <Button variant="hero" size="xl" asChild>
                <a href="#contact">
                  Get My Free AI Audit
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <a href="#services">View Services</a>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-10 animate-fade-up-delay-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>10+ years experience</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4 text-primary" />
                <span>150+ projects delivered</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>5★ Google reviews</span>
              </div>
            </div>
          </div>

          {/* Right — hero visual */}
          <div className="relative animate-fade-up-delay-2 hidden lg:block">
            <div className="absolute -inset-6 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-[2rem] blur-3xl" />
            <div className="relative rounded-3xl overflow-hidden border border-border shadow-2xl">
              <img
                src={heroDashboard}
                alt="AI-powered analytics dashboard preview showing website performance metrics"
                width={1280}
                height={960}
                className="w-full h-auto animate-float"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 px-5 py-3 rounded-2xl bg-card border border-border shadow-xl backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Audit score</p>
                  <p className="font-heading font-bold text-lg gradient-text">87/100</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
