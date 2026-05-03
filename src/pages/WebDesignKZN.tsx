import LocalLandingPage from "@/components/LocalLandingPage";

const WebDesignKZN = () => (
  <LocalLandingPage
    service="Web Design"
    city="KZN"
    slug="web-design-kzn"
    title="Web Design KZN | Custom Websites from R2,125 — Native Digital"
    description="Award-winning web design in KZN. Mobile-first, SEO-ready websites built to convert. From R2,125 once-off. Free AI audit included."
    hero={{
      eyebrow: "Web Design · KwaZulu-Natal",
      headline: "Web Design in KZN That |Wins You Customers",
      sub: "Beautiful, lightning-fast websites built for South African businesses. Mobile-first, SEO-ready, and engineered to convert visitors into paying clients.",
    }}
    benefits={[
      "Custom design — no cookie-cutter templates",
      "Mobile-first, loads in under 2 seconds",
      "Built-in SEO foundations + Google Analytics",
      "Lead capture forms + WhatsApp click-to-chat",
      "1 month of free post-launch support",
      "Hosted on enterprise-grade infrastructure",
    ]}
    priceFrom="From R2,125"
    priceNote="Once-off · 5-page custom website · Includes domain & hosting setup."
  />
);

export default WebDesignKZN;
