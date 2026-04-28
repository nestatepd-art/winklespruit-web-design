export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  author: string;
  date: string; // ISO
  readTime: string;
  category: string;
  image: string;
  content: string; // markdown-ish HTML
}

export const blogPosts: BlogPost[] = [
  {
    slug: "local-seo-tips-south-africa-2026",
    title: "10 Local SEO Tips to Rank Your South African Business in 2026",
    description:
      "Practical, proven local SEO strategies to help South African businesses rank higher on Google in 2026 — from Google Business Profile to local citations.",
    excerpt:
      "If you run a business in KZN, Gauteng or anywhere in South Africa, local SEO is the fastest way to get found by ready-to-buy customers. Here are 10 tactics that actually work in 2026.",
    author: "Native Digital Media",
    date: "2026-04-15",
    readTime: "7 min read",
    category: "SEO",
    image: "/blog/local-seo.jpg",
    content: `
<p>Local SEO is no longer optional for South African businesses. With 87% of consumers using Google to find local businesses, ranking in the local pack can be the difference between a phone ringing and silence.</p>

<h2>1. Optimise Your Google Business Profile</h2>
<p>Your Google Business Profile (GBP) is the single most important local SEO asset. Add accurate NAP (Name, Address, Phone), select the correct primary category, upload high-quality photos weekly, and post updates regularly.</p>

<h2>2. Get Consistent NAP Across Citations</h2>
<p>List your business on local directories — Yellow Pages SA, Brabys, Snupit, Hellopeter — with identical Name, Address and Phone information.</p>

<h2>3. Collect Genuine Google Reviews</h2>
<p>Aim for 5+ new reviews per month. Send a follow-up SMS or WhatsApp with a direct review link after every job.</p>

<h2>4. Target Suburb-Level Keywords</h2>
<p>"Plumber Umhlanga" converts better than "Plumber Durban". Build dedicated landing pages for each suburb you serve.</p>

<h2>5. Add LocalBusiness Schema</h2>
<p>Structured data helps Google understand your business. Add LocalBusiness JSON-LD to every page.</p>

<h2>6. Build Local Backlinks</h2>
<p>Sponsor a local sports team, partner with the chamber of commerce, or guest post on local news sites.</p>

<h2>7. Mobile-First, Always</h2>
<p>Over 70% of local searches happen on mobile. If your site is slow or hard to navigate on a phone, you'll lose rankings.</p>

<h2>8. Create Location-Specific Content</h2>
<p>Blog about local events, neighbourhood guides, and case studies of local clients.</p>

<h2>9. Monitor Your Rankings Weekly</h2>
<p>Use tools like BrightLocal or Local Falcon to track suburb-level rankings.</p>

<h2>10. Don't Ignore Bing & Apple Maps</h2>
<p>Apple Maps powers Siri searches on iPhone — claim your listing.</p>

<h2>Need Help?</h2>
<p>At Native Digital Media we help South African businesses dominate local search. <a href="/#contact">Get in touch</a> for a free SEO audit.</p>
`,
  },
  {
    slug: "why-your-website-needs-redesign-2026",
    title: "5 Signs Your Website Needs a Redesign in 2026",
    description:
      "Is your website costing you customers? Here are the 5 clearest signs it's time for a modern redesign — speed, mobile UX, conversions and more.",
    excerpt:
      "Your website is your hardest-working salesperson — but only if it's built right. Here's how to tell if yours is silently driving leads to your competitors.",
    author: "Native Digital Media",
    date: "2026-04-08",
    readTime: "5 min read",
    category: "Web Development",
    image: "/blog/website-redesign.jpg",
    content: `
<p>Websites age fast. What looked sharp in 2022 can feel clunky and slow today — and Google notices. Here are the 5 biggest signs it's time to redesign.</p>

<h2>1. It Loads Slower Than 3 Seconds</h2>
<p>53% of mobile users abandon a site that takes longer than 3 seconds to load. Run yours through PageSpeed Insights — if you're not in the green, you're losing business.</p>

<h2>2. It's Not Mobile-Friendly</h2>
<p>Google indexes the mobile version of your site first. If it doesn't look great on a phone, you won't rank.</p>

<h2>3. Your Bounce Rate is Above 70%</h2>
<p>High bounce = visitors landing and leaving. Usually a sign of poor design, slow speed, or unclear messaging.</p>

<h2>4. You Can't Update It Yourself</h2>
<p>Modern websites should let you change text, images and pages without calling a developer.</p>

<h2>5. It Doesn't Convert</h2>
<p>If you get traffic but no enquiries, the problem is your design and copy — not your traffic.</p>

<h2>The Fix</h2>
<p>A modern, fast, conversion-focused redesign typically pays for itself within 90 days. <a href="/#pricing">See our pricing</a> — currently 75% off as part of our limited launch special.</p>
`,
  },
  {
    slug: "google-ads-vs-seo-which-is-better",
    title: "Google Ads vs SEO: Which Should Your Business Invest In?",
    description:
      "A no-fluff comparison of Google Ads vs SEO for South African businesses — costs, timelines, ROI and which to choose first.",
    excerpt:
      "Both work. Both can waste your money. Here's how to decide which to invest in first based on your budget, timeline and industry.",
    author: "Native Digital Media",
    date: "2026-03-28",
    readTime: "6 min read",
    category: "Marketing",
    image: "/blog/ads-vs-seo.jpg",
    content: `
<p>Every business owner asks the same question: should I run Google Ads or invest in SEO? The honest answer is — it depends. Here's the framework we use with our clients.</p>

<h2>Google Ads: Pros & Cons</h2>
<p><strong>Pros:</strong> Immediate traffic, precise targeting, easy to measure ROI.<br/>
<strong>Cons:</strong> You stop paying, you stop appearing. Costs rise yearly.</p>

<h2>SEO: Pros & Cons</h2>
<p><strong>Pros:</strong> Compounding traffic, free clicks, builds long-term brand authority.<br/>
<strong>Cons:</strong> Takes 3–6 months to show results.</p>

<h2>The Smart Play: Both</h2>
<p>Use Google Ads for instant leads while SEO builds in the background. After 6 months, you can often reduce ad spend as organic traffic kicks in.</p>

<h2>Budget Guidelines (South Africa)</h2>
<ul>
  <li><strong>Under R5,000/month:</strong> Focus on SEO + Google Business Profile</li>
  <li><strong>R5,000–R15,000:</strong> Split 60% Ads / 40% SEO</li>
  <li><strong>R15,000+:</strong> Full mix — Ads, SEO and social</li>
</ul>

<h2>Get a Free Strategy Call</h2>
<p><a href="/#contact">Book a free 15-minute call</a> and we'll tell you honestly which one your business should start with.</p>
`,
  },
];

export const getPostBySlug = (slug: string) => blogPosts.find((p) => p.slug === slug);
