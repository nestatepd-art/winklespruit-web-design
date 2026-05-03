import { TrendingUp, Search, MousePointerClick, Quote } from "lucide-react";

interface CaseStudy {
  client: string;
  industry: string;
  location: string;
  challenge: string;
  solution: string;
  metrics: { label: string; value: string; icon: typeof TrendingUp }[];
  quote: string;
  author: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    client: "KZN E-hailing Council",
    industry: "Non-Profit Company",
    location: "KwaZulu-Natal",
    challenge:
      "Newly formed NPC representing e-hailing drivers across KZN with no digital presence, no member sign-up channel, and no way to communicate policy updates at scale.",
    solution:
      "Built a credible institutional website with a member registration portal, news/updates section, and SEO targeting 'e-hailing KZN' and driver-rights search terms.",
    metrics: [
      { label: "Driver sign-ups", value: "1,200+", icon: MousePointerClick },
      { label: "Organic reach", value: "+340%", icon: TrendingUp },
      { label: "Media mentions", value: "14", icon: Search },
    ],
    quote:
      "Native gave the Council a professional digital home. Drivers can now register and stay informed in one place.",
    author: "SR Khanyezi, Secretary General",
  },
  {
    client: "Zino Consulting",
    industry: "Insurance & Policy Sales",
    location: "KwaZulu-Natal",
    challenge:
      "Strong offline referral network but no online lead pipeline. Prospective clients had no way to compare policies or request quotes outside of phone calls.",
    solution:
      "Conversion-focused website with a quote-request form, policy comparison pages, and a Google Ads campaign targeting 'life cover' and 'funeral policy' searches in KZN.",
    metrics: [
      { label: "Quote requests/mo", value: "+185%", icon: MousePointerClick },
      { label: "Cost per lead", value: "−47%", icon: TrendingUp },
      { label: "Top-3 keywords", value: "11", icon: Search },
    ],
    quote:
      "I went from chasing leads to choosing leads. The website does the qualifying for me.",
    author: "Zinhle M, Founder",
  },
  {
    client: "Mybrada Security",
    industry: "Security Services",
    location: "Pietermaritzburg, KZN",
    challenge:
      "Competing against large national security firms with zero search visibility in PMB and no way to capture after-hours enquiries.",
    solution:
      "Local SEO-optimised site, Google Business Profile setup, 24/7 enquiry form with WhatsApp routing, and geo-targeted ads across PMB suburbs.",
    metrics: [
      { label: "Local rank (top-3)", value: "8 keywords", icon: Search },
      { label: "Monthly enquiries", value: "+220%", icon: MousePointerClick },
      { label: "New contracts", value: "19", icon: TrendingUp },
    ],
    quote:
      "We're now competing head-to-head with the big names in PMB — and winning contracts we never would have seen before.",
    author: "S Ngcobo, Founder",
  },
];

const CaseStudies = () => {
  return (
    <section id="case-studies" className="py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-fade-up">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Real Results
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mt-4 mb-6">
            Case <span className="gradient-text">Studies</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Measurable wins from South African businesses we've worked with — not
            vanity metrics, just leads, bookings, and revenue.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {CASE_STUDIES.map((cs, idx) => (
            <article
              key={cs.client}
              className="p-6 rounded-2xl card-gradient border border-border hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 animate-fade-up flex flex-col"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="mb-4">
                <h3 className="font-heading text-xl font-bold">{cs.client}</h3>
                <p className="text-sm text-muted-foreground">
                  {cs.industry} · {cs.location}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5 py-4 border-y border-border">
                {cs.metrics.map((m) => (
                  <div key={m.label} className="text-center">
                    <m.icon className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="font-heading font-bold text-base gradient-text leading-tight">
                      {m.value}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-1">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-5 text-sm">
                <div>
                  <p className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Challenge
                  </p>
                  <p className="text-foreground/85 leading-relaxed">{cs.challenge}</p>
                </div>
                <div>
                  <p className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    What we did
                  </p>
                  <p className="text-foreground/85 leading-relaxed">{cs.solution}</p>
                </div>
              </div>

              <blockquote className="mt-auto pt-4 border-t border-border">
                <Quote className="w-5 h-5 text-primary mb-2" />
                <p className="text-sm italic text-foreground/90 leading-relaxed">
                  "{cs.quote}"
                </p>
                <footer className="text-xs text-muted-foreground mt-2">
                  — {cs.author}
                </footer>
              </blockquote>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
