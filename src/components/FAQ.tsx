import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    q: 'How long does it take to build a website?',
    a: 'Most of our 5-page websites launch within 2–3 weeks from sign-off. Larger e-commerce or custom builds typically take 4–8 weeks depending on scope.',
  },
  {
    q: 'Do you handle hosting and domains?',
    a: 'Yes. We can set up your domain, fast managed hosting and SSL — and we handle all the technical bits so you don\'t have to.',
  },
  {
    q: 'How does the free AI website audit work?',
    a: 'Submit your URL through our form and our AI instantly analyses your site for SEO, performance, design and conversion issues. You get a score out of 100 plus 3–5 specific recommendations on screen, and our team follows up within 24 hours.',
  },
  {
    q: 'How quickly will I see SEO results?',
    a: 'SEO is a long game — most clients see meaningful ranking and traffic improvements within 3–6 months. Google Ads and social ads can drive qualified leads from day one.',
  },
  {
    q: 'Are your prices once-off or monthly?',
    a: 'Web development is once-off. SEO, Google Ads and Social Media Ads are billed monthly so we can continuously optimise. All prices exclude VAT and ad spend.',
  },
  {
    q: 'Do you work with businesses outside Durban?',
    a: 'Absolutely. We\'re based in Winklespruit but serve clients across South Africa and internationally — everything is delivered remotely.',
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24 px-4 bg-secondary/20">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12 animate-fade-up">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mt-4 mb-6">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know before getting started.
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          className="space-y-3 animate-fade-up-delay-1"
        >
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border border-border rounded-2xl px-5 card-gradient"
            >
              <AccordionTrigger className="text-left font-heading font-semibold hover:no-underline hover:text-primary py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
