import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import HowItWorks from '@/components/HowItWorks';
import Pricing from '@/components/Pricing';
import WhyChooseUs from '@/components/WhyChooseUs';
import LeadAuditForm from '@/components/LeadAuditForm';
import Blog from '@/components/Blog';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Services />
      <HowItWorks />
      <Pricing />
      <WhyChooseUs />
      <LeadAuditForm />
      <Blog />
      <FAQ />
      <Footer />
    </main>
  );
};

export default Index;
