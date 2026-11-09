import { lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import StickyCta from '@/components/StickyCta';
import { Positioning, ServicePanels, SelectedWork, Process, WhyNative, Testimonials } from '@/components/home/Sections';
import { useRevealAll } from '@/components/home/motion';

const WebsitePackages = lazy(() => import('@/components/WebsitePackages'));
const LeadAuditForm = lazy(() => import('@/components/LeadAuditForm'));
const FAQ = lazy(() => import('@/components/FAQ'));

const SectionFallback = () => <div className="min-h-[400px]" aria-hidden />;

const Index = () => {
  useRevealAll();
  return (
    <main className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      <Hero />
      <Positioning />
      <ServicePanels />
      <SelectedWork />
      <Process />
      <WhyNative />
      <Testimonials />
      <Suspense fallback={<SectionFallback />}>
        <WebsitePackages />
        <FAQ />
        <LeadAuditForm />
      </Suspense>
      <Footer />
      <StickyCta />
    </main>
  );
};

export default Index;
