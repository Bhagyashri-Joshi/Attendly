import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { Cta } from "@/components/landing/Cta";
import { Footer } from "@/components/landing/Footer";
import { MainLayout } from "@/layouts/MainLayout";

export function LandingPage() {
  return (
    <MainLayout>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <DashboardPreview />
        <Cta />
      </main>
      <Footer />
    </MainLayout>
  );
}
