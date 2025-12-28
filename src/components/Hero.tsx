import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Search } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 px-4 hero-gradient overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">Web Development & SEO Experts</span>
          </div>
          
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-up-delay-1">
            We Build Websites That
            <span className="block gradient-text">Drive Results</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up-delay-2">
            Transform your online presence with stunning websites and powerful SEO strategies. 
            Native Digital Media helps South African businesses dominate the digital landscape.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up-delay-3">
            <Button variant="hero" size="xl" asChild>
              <a href="#contact">
                Start Your Project
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a href="#services">
                View Services
              </a>
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-8 mt-16 animate-fade-up-delay-3">
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-secondary/50 border border-border">
              <Code className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Custom Development</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-secondary/50 border border-border">
              <Search className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">SEO Optimization</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
