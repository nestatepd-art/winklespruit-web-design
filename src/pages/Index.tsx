import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import PainPoints from '@/components/PainPoints';
import WebsitePackages from '@/components/WebsitePackages';
import HowItWorks from '@/components/HowItWorks';
import WhyChooseUs from '@/components/WhyChooseUs';
import CaseStudies from '@/components/CaseStudies';
import LeadAuditForm from '@/components/LeadAuditForm';
import Blog from '@/components/Blog';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <PainPoints />
      <Services />
      <WebsitePackages />
      <HowItWorks />
      <WhyChooseUs />
      <CaseStudies />
      <LeadAuditForm />
      <Blog />
      <FAQ />
      <Footer />
    </main>
  );
};

export default Index;
