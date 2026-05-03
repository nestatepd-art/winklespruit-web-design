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
    client: "Coastal Plumbing Co.",
    industry: "Local Services",
    location: "Amanzimtoti, KZN",
    challenge:
      "Brand-new website with zero organic traffic and no leads from Google. Relied entirely on word-of-mouth.",
    solution:
      "Rebuilt their site for speed + local SEO, set up a Google Business Profile, ran targeted 'plumber near me' ads on a R3,000/month budget.",
    metrics: [
      { label: "Organic traffic", value: "+412%", icon: TrendingUp },
      { label: "Local rank (top-3)", value: "9 keywords", icon: Search },
      { label: "Booked jobs/month", value: "27", icon: MousePointerClick },
    ],
    quote:
      "Within 90 days the phone wouldn't stop ringing. We had to hire a second team to keep up.",
    author: "Owner, Coastal Plumbing Co.",
  },
  {
    client: "Sapphire Skin Studio",
    industry: "Health & Wellness",
    location: "Umhlanga, Durban",
    challenge:
      "Beautiful Instagram presence but a slow, broken website that lost 78% of mobile visitors before they even saw the booking form.",
    solution:
      "Custom mobile-first redesign, integrated online booking, and an SEO-rich blog targeting 'skin care Umhlanga' search terms.",
    metrics: [
      { label: "Page-load time", value: "0.9s", icon: TrendingUp },
      { label: "Online bookings", value: "+260%", icon: MousePointerClick },
      { label: "Mobile bounce", value: "−54%", icon: Search },
    ],
    quote:
      "Native rebuilt our site in two weeks and our bookings doubled the month it launched.",
    author: "Founder, Sapphire Skin Studio",
  },
  {
    client: "Drakensberg Adventure Co.",
    industry: "Tourism",
    location: "KZN Midlands",
    challenge:
      "Heavy seasonal dips, no way to capture leads outside of peak months, and no tracking on their R8k/month ad spend.",
    solution:
      "Conversion-focused landing pages per package, full Google Ads + Meta Pixel setup, and an automated email follow-up funnel.",
    metrics: [
      { label: "Cost per lead", value: "−68%", icon: TrendingUp },
      { label: "Off-season bookings", value: "+183%", icon: Search },
      { label: "Return on ad spend", value: "6.4×", icon: MousePointerClick },
    ],
    quote:
      "We finally know which ads make money. ROAS went from guessing to 6× in three months.",
    author: "MD, Drakensberg Adventure Co.",
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
