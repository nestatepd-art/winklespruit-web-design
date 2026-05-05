import { Globe, Code, Search, TrendingUp, Zap, Shield, Target, Share2, ArrowRight, Check, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import teamCollab from '@/assets/team-collab.webp';

const services = [
  {
    icon: Code,
    title: "Web Development",
    description: "Custom, responsive websites built with modern technologies that drive conversions and engage your audience."
  },
  {
    icon: Search,
    title: "SEO Optimization",
    description: "Data-driven SEO strategies that boost your rankings, increase organic traffic, and grow your online presence."
  },
  {
    icon: Target,
    title: "Google Ads",
    description: "Strategic Google Ads campaigns that maximize ROI, drive qualified traffic, and generate high-converting leads."
  },
  {
    icon: Share2,
    title: "Social Media Ads",
    description: "Targeted social media advertising on Facebook, Instagram, and LinkedIn to reach and engage your ideal audience."
  },
  {
    icon: TrendingUp,
    title: "Digital Marketing",
    description: "Comprehensive campaigns that connect your brand with your target audience.",
    bullets: [
      "Email marketing & automation",
      "Content marketing & copywriting",
      "Brand strategy & positioning",
      "Analytics, reporting & ROI tracking",
      "Conversion rate optimization (CRO)"
    ]
  },
  {
    icon: Globe,
    title: "E-Commerce Solutions",
    description: "Powerful online stores that turn visitors into paying customers.",
    bullets: [
      "Shopify & WooCommerce builds",
      "Product catalog & inventory setup",
      "Secure payment gateway integration",
      "Abandoned cart recovery flows",
      "Mobile-optimized checkout experience"
    ]
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    description: "Lightning-fast websites that deliver exceptional user experiences and better search rankings."
  },
  {
    icon: Shield,
    title: "Website Maintenance",
    description: "Ongoing support and maintenance to keep your website secure, updated, and running smoothly."
  },
  {
    icon: Server,
    title: "Web Hosting",
    description: "Fast, secure South African hosting with everything you need to keep your site online and protected.",
    bullets: [
      "99.9% uptime SLA on SSD infrastructure",
      "Free SSL certificate & daily backups",
      "Business email hosting (yourname@yourdomain)",
      "Domain registration & DNS management",
      "Managed updates, security & malware scans"
    ]
  }
];

const Services = () => {
  return (
    <section id="services" className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Featured banner */}
        <div className="relative mb-20 rounded-3xl overflow-hidden border border-border animate-fade-up">
          <img
            src={teamCollab}
            alt="Native Digital Media team collaborating on a client analytics dashboard"
            loading="lazy"
            width={1280}
            height={960}
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20" />
          <div className="absolute inset-0 flex items-center px-8 md:px-12">
            <div className="max-w-md">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                A partner, not just a vendor
              </span>
              <h3 className="font-heading text-2xl md:text-3xl font-bold mt-3 mb-4">
                One team for design, dev, SEO &amp; ads
              </h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Stop juggling agencies. We handle the full digital growth stack under one roof.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mb-16 animate-fade-up">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Our Services</span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mt-4 mb-6">
            What We <span className="gradient-text">Deliver</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From concept to launch, we provide end-to-end digital solutions that help businesses thrive online.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group p-8 rounded-2xl card-gradient border border-border hover:border-primary/40 hover:shadow-[0_8px_40px_hsl(217,91%,60%,0.15)] transition-all duration-500 hover:-translate-y-2 animate-fade-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              {service.bullets && (
                <ul className="mt-4 space-y-2">
                  {service.bullets.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12 animate-fade-up">
          <Button variant="hero" size="lg" asChild>
            <a href="#contact">
              Discuss Your Project
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
