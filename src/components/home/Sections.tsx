import { ArrowUpRight } from 'lucide-react';
import { Counter } from './motion';

const Eyebrow = ({ n, children }: { n: string; children: string }) => (
  <p className="flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-10">
    <span className="text-primary font-semibold">{n}</span>
    <span className="h-px w-10 bg-foreground/25" />
    {children}
  </p>
);

export const Positioning = () => (
  <section className="px-4 py-20 md:py-32 border-t border-foreground/10">
    <div className="container mx-auto max-w-6xl px-0 md:px-8">
      <p className="reveal font-heading text-3xl md:text-5xl lg:text-6xl leading-[1.12] max-w-5xl">
        We’re a small studio on the KZN south coast. We build websites for South African
        businesses and make sure the <em className="text-secondary">right people</em> can find them —
        on Google, on their phones, in their own suburb.
      </p>
    </div>
  </section>
);

export const ServicePanels = () => {
  return (
    <section id="services" className="px-4 pb-20 md:pb-32">
      <div className="container mx-auto max-w-7xl px-0 md:px-8">
        <Eyebrow n="01">What we do</Eyebrow>
        <div className="grid lg:grid-cols-2 gap-5">
          <article className="reveal relative overflow-hidden rounded-2xl bg-card border border-border p-8 md:p-12 min-h-[480px] flex flex-col">
            <p className="text-sm text-muted-foreground">Web Development</p>
            <h3 className="font-heading text-4xl md:text-5xl mt-4 leading-tight">
              A site that loads in under two seconds and <em className="text-primary">turns visits into enquiries.</em>
            </h3>
            <ul className="mt-8 space-y-3 text-muted-foreground">
              <li>— Mobile-first design, built for South African data costs</li>
              <li>— Enquiry forms that land straight in your inbox</li>
              <li>— Hosting, SSL and updates handled for you</li>
            </ul>
            <div className="mt-auto pt-12 grid grid-cols-3 gap-4 border-t border-border">
              {[['2', 'seconds or less to load'], ['1', 'business day to go live'], ['0', 'upfront on the retainer']].map(([v, l]) => (
                <div key={l} className="pt-5">
                  <p className="font-heading text-3xl md:text-4xl text-primary"><Counter value={v} /></p>
                  <p className="text-xs text-muted-foreground mt-1">{l}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="reveal theme-ink relative overflow-hidden rounded-2xl p-8 md:p-12 min-h-[480px] flex flex-col" style={{ transitionDelay: '.12s' }}>
            <p className="text-sm text-muted-foreground">Search Engine Optimisation</p>
            <h3 className="font-heading text-4xl md:text-5xl mt-4 leading-tight">
              Rank on page one for the searches <em className="text-primary">your customers actually make.</em>
            </h3>
            <ul className="mt-8 space-y-3 text-muted-foreground">
              <li>— Keyword research based on how locals really search</li>
              <li>— Google Business Profile set up and optimised</li>
              <li>— A plain-English report every month</li>
            </ul>
            <div className="mt-auto pt-12 grid grid-cols-3 gap-4 border-t border-border">
              {[['8', 'top-3 local keywords'], ['+220%', 'monthly enquiries'], ['11', 'page-one terms']].map(([v, l]) => (
                <div key={l} className="pt-5">
                  <p className="font-heading text-3xl md:text-4xl text-secondary"><Counter value={v} /></p>
                  <p className="text-xs text-muted-foreground mt-1">{l}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
        <p className="reveal mt-6 text-sm text-muted-foreground">
          Also: Google Ads management and web hosting from R150/month. <a href="#pricing" className="underline underline-offset-4 hover:text-foreground">See pricing</a>
        </p>
      </div>
    </section>
  );
};

const WORK = [
  { client: 'KZN E-hailing Council', type: 'Non-profit · KwaZulu-Natal', what: 'Institutional site with member registration and news, ranking for e-hailing driver searches across KZN.', stats: [['1,200+', 'driver sign-ups'], ['+340%', 'organic reach']] },
  { client: 'Zino Consulting', type: 'Policy sales · Durban', what: 'Lead-focused site with quote forms and local SEO, replacing word-of-mouth with a steady flow of requests.', stats: [['+185%', 'quote requests a month'], ['11', 'top-3 keywords']] },
  { client: 'Mybrada Security', type: 'Security · Pietermaritzburg', what: 'Service-area pages and Google Business Profile work so PMB residents find them first.', stats: [['+220%', 'monthly enquiries'], ['19', 'new contracts']] },
];

export const SelectedWork = () => (
  <section id="work" className="px-4 py-20 md:py-32 border-t border-foreground/10">
    <div className="container mx-auto max-w-7xl px-0 md:px-8">
      <Eyebrow n="02">Selected work</Eyebrow>
      <div className="space-y-5">
        {WORK.map((w, i) => (
          <article key={w.client} className="reveal group relative overflow-hidden rounded-2xl border border-border bg-card p-8 md:p-12 transition-colors duration-500 hover:bg-foreground hover:text-background" style={{ transitionDelay: `${i * 0.08}s` }}>
            <div className="grid md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-7">
                <p className="text-sm opacity-60">{w.type}</p>
                <h3 className="font-heading text-4xl md:text-6xl mt-2 leading-none">{w.client}</h3>
                <p className="mt-6 max-w-xl opacity-80 md:max-h-0 md:opacity-0 md:group-hover:max-h-40 md:group-hover:opacity-80 transition-all duration-500 overflow-hidden">{w.what}</p>
              </div>
              <div className="md:col-span-5 grid grid-cols-2 gap-6">
                {w.stats.map(([v, l]) => (
                  <div key={l}>
                    <p className="font-heading text-4xl md:text-5xl text-primary"><Counter value={v} /></p>
                    <p className="text-sm opacity-60 mt-1">{l}</p>
                  </div>
                ))}
              </div>
            </div>
            <ArrowUpRight className="absolute top-8 right-8 h-6 w-6 opacity-40 transition-transform duration-500 group-hover:rotate-45 group-hover:opacity-100" />
          </article>
        ))}
      </div>
    </div>
  </section>
);

const STEPS = [
  ['Free audit', 'We look at your current site (or your competitors’) and tell you plainly what’s costing you customers.'],
  ['Plan & quote', 'A fixed price and a clear scope. No surprises on the invoice.'],
  ['Build', 'We design, write and build. Starter sites are usually live by the next business day.'],
  ['Grow', 'SEO, Google Business Profile and monthly reports so you can see what’s working.'],
];

export const Process = () => (
  <section id="process" className="px-4 py-20 md:py-32 border-t border-foreground/10">
    <div className="container mx-auto max-w-7xl px-0 md:px-8">
      <Eyebrow n="03">How we work</Eyebrow>
      <div className="grid md:grid-cols-4 border-t border-foreground/20">
        {STEPS.map(([t, d], i) => (
          <div key={t} className="reveal py-8 md:pr-8 md:pl-6 border-b md:border-b-0 md:border-l first:md:border-l-0 first:md:pl-0 border-foreground/20" style={{ transitionDelay: `${i * 0.1}s` }}>
            <p className="font-heading text-5xl text-primary italic">0{i + 1}</p>
            <h3 className="font-heading text-2xl mt-6">{t}</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">{d}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const WHY = [
  ['We know this market.', 'We’re from here. We know load-shedding, data costs, and how people in Umlazi and Umhlanga search differently.'],
  ['SEO from day one.', 'Every site is built with clean structure, fast loading and local keywords — not bolted on later.'],
  ['You talk to the builders.', 'No account managers. The people doing the work answer your calls and WhatsApps.'],
];

export const WhyNative = () => (
  <section id="about" className="theme-ink px-4 py-20 md:py-32">
    <div className="container mx-auto max-w-7xl px-0 md:px-8">
      <Eyebrow n="04">Why Native</Eyebrow>
      <div className="grid md:grid-cols-3 gap-12">
        {WHY.map(([t, d], i) => (
          <div key={t} className="reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
            <h3 className="font-heading text-3xl md:text-4xl leading-tight">{t}</h3>
            <p className="mt-4 text-muted-foreground leading-relaxed">{d}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const QUOTES = [
  ['Our drivers finally have one place to register and get updates. Membership grew faster than we planned for.', 'SR Khanyezi', 'Secretary General, KZN E-hailing Council'],
  ['We used to rely on referrals. Now quote requests come in every week from people who found us on Google.', 'Zinhle M', 'Founder, Zino Consulting'],
  ['When someone in PMB searches for security, we show up. That’s brought us real contracts.', 'S Ngcobo', 'Founder, Mybrada Security'],
];

export const Testimonials = () => (
  <section id="testimonials" className="px-4 py-20 md:py-32">
    <div className="container mx-auto max-w-6xl px-0 md:px-8">
      <Eyebrow n="05">In their words</Eyebrow>
      <div className="space-y-20 md:space-y-28">
        {QUOTES.map(([q, n, r], i) => (
          <figure key={n} className={`reveal max-w-4xl ${i % 2 ? 'md:ml-auto md:text-right' : ''}`}>
            <blockquote className="font-heading text-3xl md:text-5xl leading-[1.15]">
              <span className="text-primary">“</span>{q}<span className="text-primary">”</span>
            </blockquote>
            <figcaption className="mt-6 text-sm">
              <span className="font-semibold">{n}</span> <span className="text-muted-foreground">— {r}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);
