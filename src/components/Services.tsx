import { Globe, Code, Search, TrendingUp, Zap, Shield, Target, Share2 } from 'lucide-react';

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
    description: "Comprehensive digital marketing campaigns that connect your brand with your target audience."
  },
  {
    icon: Globe,
    title: "E-Commerce Solutions",
    description: "Powerful online stores that convert visitors into customers with seamless shopping experiences."
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
  }
];

const Services = () => {
  return (
    <section id="services" className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
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
              className={`group p-8 rounded-2xl card-gradient border border-border hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 animate-fade-up-delay-${Math.min(index, 3)}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <service.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
