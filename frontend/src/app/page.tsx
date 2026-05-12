import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "./_components/Hero";
import { StatsBar } from "./_components/StatsBar";
import { RecentDonations } from "./_components/RecentDonations";
import { SuccessStory } from "./_components/SuccessStory";
import { CategoriesSection } from "./_components/CategoriesSection";
import { FeaturedCampaigns } from "./_components/FeaturedCampaigns";
import { HowItWorks } from "./_components/HowItWorks";
import { TestimonialsSection } from "./_components/TestimonialsSection";
import { FAQ } from "./_components/FAQ";
import { CTASection } from "./_components/CTASection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <StatsBar />
        <RecentDonations />
        <SuccessStory />
        <FeaturedCampaigns />
        <CategoriesSection />
        <HowItWorks />
        <TestimonialsSection />
        <FAQ />
        <CTASection />
      </main>
      <Footer />                                                                
    </>
  );
}
