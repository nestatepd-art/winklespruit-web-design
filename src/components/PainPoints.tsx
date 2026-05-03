import { Ghost, Smartphone, VolumeX, Construction } from 'lucide-react';

const PAIN_POINTS = [
  {
    icon: Ghost,
    title: 'Invisible on Google',
    body: "Your site exists but doesn't rank. When a customer in Amanzimtoti searches for what you do, your competitors appear — not you. Every day that continues, you're losing business.",
  },
  {
    icon: Smartphone,
    title: 'Broken on mobile',
    body: "Over 70% of South African users browse on their phones. If your site isn't fast and usable on mobile, most visitors bounce within 8 seconds — directly to your competitor.",
  },
  {
    icon: VolumeX,
    title: 'No clear call-to-action',
    body: "Visitors land on your site and don't know what to do next. No booking form, no WhatsApp link, no phone number front and centre. They leave without contacting you.",
  },
  {
    icon: Construction,
    title: 'Built to look good, not sell',
    body: "Your site looks like a brochure. It describes what you do — but never gives a compelling reason to choose you over the next result. A website that doesn't convert is a cost, not an asset.",
  },
];

const PainPoints = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-14 animate-fade-up">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Sound familiar?</span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mt-4 mb-5 leading-tight">
            Why most KZN business websites <span className="gradient-text italic">fail their owners</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            These are the four reasons your competitors are winning the Google searches you should be getting.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {PAIN_POINTS.map((p, i) => (
            <div
              key={p.title}
              className="p-8 rounded-2xl card-gradient border border-border hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 animate-fade-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-5">
                <p.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3">{p.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainPoints;
