import { CheckCircle } from 'lucide-react';

const features = [
  "10+ years of industry experience",
  "100+ successful projects delivered",
  "Dedicated project managers",
  "24/7 support & maintenance",
  "SEO-first development approach",
  "Mobile-responsive designs"
];

const WhyChooseUs = () => {
  return (
    <section id="about" className="py-24 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-up">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Why Choose Us</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mt-4 mb-6">
              Your Success Is Our <span className="gradient-text">Priority</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              At Native Digital Media, we combine creativity with technical expertise to deliver digital solutions that exceed expectations. Based in Winklespruit, we serve businesses across South Africa and beyond.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div 
                  key={feature}
                  className="flex items-center gap-3"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground/90">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative animate-fade-up-delay-2">
            <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-3xl" />
            <div className="relative p-8 rounded-3xl card-gradient border border-border">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <span className="text-3xl font-heading font-bold gradient-text">98%</span>
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold">Client Satisfaction</h4>
                    <p className="text-muted-foreground text-sm">Based on client feedback</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <span className="text-3xl font-heading font-bold gradient-text">150+</span>
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold">Projects Completed</h4>
                    <p className="text-muted-foreground text-sm">Across various industries</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <span className="text-3xl font-heading font-bold gradient-text">5★</span>
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold">Average Rating</h4>
                    <p className="text-muted-foreground text-sm">On Google Reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
