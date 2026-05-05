import { lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PainPoints from '@/components/PainPoints';
import Services from '@/components/Services';
import WebsitePackages from '@/components/WebsitePackages';
import Footer from '@/components/Footer';

// Below-the-fold sections — lazy load to shrink initial bundle
const HowItWorks = lazy(() => import('@/components/HowItWorks'));
const WhyChooseUs = lazy(() => import('@/components/WhyChooseUs'));
const CaseStudies = lazy(() => import('@/components/CaseStudies'));
const LeadAuditForm = lazy(() => import('@/components/LeadAuditForm'));
const Blog = lazy(() => import('@/components/Blog'));
const FAQ = lazy(() => import('@/components/FAQ'));

const SectionFallback = () => <div className="min-h-[400px]" aria-hidden />;

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <PainPoints />
      <Services />
      <WebsitePackages />
      <Suspense fallback={<SectionFallback />}>
        <HowItWorks />
        <WhyChooseUs />
        <CaseStudies />
        <LeadAuditForm />
        <Blog />
        <FAQ />
      </Suspense>
      <Footer />
    </main>
  );
};

export default Index;
