import LocalLandingPage from "@/components/LocalLandingPage";

const GoogleAdsDurban = () => (
  <LocalLandingPage
    service="Google Ads"
    city="Durban"
    slug="google-ads-durban"
    title="Google Ads Durban | Profitable PPC from R750/mo — Native Digital"
    description="Google Ads management in Durban that delivers ROI. Campaign setup, A/B testing, conversion tracking. From R750/month. Free AI audit included."
    hero={{
      eyebrow: "Google Ads · Durban",
      headline: "Google Ads in Durban That |Print Money, Not Burn It",
      sub: "Most agencies spend your ad budget and hope for the best. We track every cent, A/B test relentlessly, and only scale what's profitable.",
    }}
    benefits={[
      "Full campaign setup + conversion tracking",
      "Search, Display & Performance Max campaigns",
      "Expert ad copy that earns the click",
      "Weekly bid + keyword optimisation",
      "Transparent monthly ROAS reporting",
      "We don't profit from your ad spend — flat fee",
    ]}
    priceFrom="From R750/mo"
    priceNote="Management fee only · Ad spend billed separately by Google."
  />
);

export default GoogleAdsDurban;
