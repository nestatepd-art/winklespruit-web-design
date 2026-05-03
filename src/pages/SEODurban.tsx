import LocalLandingPage from "@/components/LocalLandingPage";

const SEODurban = () => (
  <LocalLandingPage
    service="SEO"
    city="Durban"
    slug="seo-durban"
    title="SEO Durban | Rank #1 on Google from R625/mo — Native Digital"
    description="SEO services in Durban that get you ranked. Local SEO, technical audits, and content strategy. From R625/month. Free AI audit included."
    hero={{
      eyebrow: "SEO · Durban & KZN",
      headline: "SEO in Durban That |Puts You on Page One",
      sub: "Stop paying for ads forever. Our data-driven SEO ranks Durban businesses on Google for the searches that bring real customers — month after month.",
    }}
    benefits={[
      "Deep keyword research for the Durban market",
      "On-page + technical SEO fixes done for you",
      "Local SEO + Google Business Profile optimisation",
      "Monthly transparent performance reports",
      "Competitor gap analysis every 90 days",
      "No long-term lock-in contracts",
    ]}
    priceFrom="From R625/mo"
    priceNote="Monthly retainer · Cancel anytime · Reports delivered every 30 days."
  />
);

export default SEODurban;
