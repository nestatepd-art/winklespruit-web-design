import { ArrowRight, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Magnetic, Words } from '@/components/home/motion';

const Hero = () => (
  <section className="relative overflow-hidden grain pt-32 pb-16 md:pt-44 md:pb-24 px-4">
    {/* slow soft wave gradient */}
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="wave-blob absolute -top-40 right-[-20%] w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full bg-secondary/15 blur-3xl" />
      <div className="wave-blob absolute bottom-[-30%] left-[-15%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full bg-primary/10 blur-3xl" style={{ animationDelay: '-9s' }} />
    </div>

    <div className="container relative mx-auto max-w-7xl px-0 md:px-8">
      <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-secondary font-medium mb-8 word" style={{ animationDelay: '0s' }}>
        Web development & SEO · Winklespruit, KZN
      </p>

      <h1 className="font-heading font-normal text-[2.75rem] leading-[1.02] sm:text-6xl md:text-7xl lg:text-[7.25rem] max-w-6xl">
        <Words text="Websites that" start={0.1} />
        <Words text="get found." start={0.26} className="italic text-primary" />
        <br className="hidden md:block" />
        <Words text="Built by people who know" start={0.45} />
        <Words text="this market." start={0.85} className="italic" />
      </h1>

      <div className="mt-10 md:mt-14 grid md:grid-cols-12 gap-8 items-end">
        <p className="md:col-span-6 text-lg md:text-xl text-muted-foreground leading-relaxed word" style={{ animationDelay: '1.1s' }}>
          We design fast, mobile-first websites and do the SEO work that puts South African
          businesses in front of local customers — usually live by the next business day.
        </p>
        <div className="md:col-span-6 flex flex-col sm:flex-row sm:justify-end items-start sm:items-center gap-5 word" style={{ animationDelay: '1.25s' }}>
          <Magnetic>
            <Button variant="hero" size="xl" asChild>
              <a href="#contact">Get a free website & SEO audit <ArrowRight className="ml-2 h-5 w-5" /></a>
            </Button>
          </Magnetic>
          <a href="#work" className="group inline-flex items-center gap-2 font-medium underline-offset-8 hover:underline">
            See our work <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
          </a>
        </div>
      </div>

      <div className="mt-16 md:mt-24 border-t border-foreground/15 pt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground word" style={{ animationDelay: '1.4s' }}>
        <span>Based in Winklespruit</span>
        <span aria-hidden>·</span>
        <span>Serving businesses across South Africa</span>
        <span aria-hidden className="hidden sm:inline">·</span>
        <span className="hidden sm:inline">Reply within one working hour</span>
      </div>
    </div>
  </section>
);

export default Hero;
