import { ClipboardList, Sparkles, Rocket, LineChart } from 'lucide-react';
import processVisual from '@/assets/process-visual.jpg';

const steps = [
  {
    icon: ClipboardList,
    title: 'Discovery & Audit',
    description:
      'We start with a deep dive into your business goals, audience and competitors — plus an AI-powered audit of your current site.',
  },
  {
    icon: Sparkles,
    title: 'Strategy & Design',
    description:
      'A tailored growth plan and conversion-focused designs, signed off before a single line of code is written.',
  },
  {
    icon: Rocket,
    title: 'Build & Launch',
    description:
      'Fast, mobile-first development with SEO baked in from day one — launched on a stack built to scale.',
  },
  {
    icon: LineChart,
    title: 'Grow & Optimise',
    description:
      'Ongoing SEO, paid ads and conversion tweaks — measured monthly so you always see ROI.',
  },
];

const HowItWorks = () => {
  return (
    <section id="process" className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-up">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Our Process
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mt-4 mb-6">
            How We <span className="gradient-text">Deliver Results</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A proven 4-step process that turns visitors into paying customers — with
            no surprises along the way.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative animate-fade-up order-2 lg:order-1">
            <div className="absolute -inset-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
            <div className="relative rounded-3xl overflow-hidden border border-border">
              <img
                src={processVisual}
                alt="Laptop displaying analytics dashboard with floating performance metrics"
                loading="lazy"
                width={1280}
                height={960}
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="space-y-6 order-1 lg:order-2">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="flex gap-5 p-5 rounded-2xl border border-border bg-card/50 hover:border-primary/30 transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold mb-1">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
