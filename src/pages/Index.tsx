import { motion } from "framer-motion";
import { ArrowRight, Shield, Users, TrendingUp, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/landing/HeroSection";
import TrustedByTraders from "@/components/landing/TrustedByTraders";
import TutorialVideo from "@/components/landing/TutorialVideo";
import InvestmentPlans from "@/components/landing/InvestmentPlans";
import HowItWorks from "@/components/landing/HowItWorks";
import ReferralProgram from "@/components/landing/ReferralProgram";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import FAQPreview from "@/components/landing/FAQPreview";
import ChatbotWidget from "@/components/landing/ChatbotWidget";
import TestimonialsSection from "@/components/TestimonialsSection";
import InvestmentCalculator from "@/components/landing/InvestmentCalculator";
import ScrollToTop from "@/components/landing/ScrollToTop";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Global container with mobile-specific centering */}
      <div className="mx-auto w-full max-w-[100vw] sm:max-w-none">
        <Navigation />
        
        {/* Content container with proper mobile centering */}
        <div className="flex flex-col items-center w-full">
          {/* Hero Section */}
          <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[100vw]">
            <HeroSection />
          </div>

          {/* All sections with consistent mobile padding */}
          <div className="w-full flex flex-col items-center">
            <div className="w-full px-4 sm:px-6 lg:px-8">
              <TrustedByTraders />
            </div>

            <div className="w-full px-4 sm:px-6 lg:px-8">
              <TutorialVideo />
            </div>

            <div className="w-full px-4 sm:px-6 lg:px-8">
              <InvestmentPlans />
            </div>

            <div className="w-full px-4 sm:px-6 lg:px-8">
              <InvestmentCalculator />
            </div>

            <div className="w-full px-4 sm:px-6 lg:px-8">
              <HowItWorks />
            </div>

            <div className="w-full px-4 sm:px-6 lg:px-8">
              <WhyChooseUs />
            </div>

            <div className="w-full px-4 sm:px-6 lg:px-8">
              <TestimonialsSection />
            </div>

            <div className="w-full px-4 sm:px-6 lg:px-8">
              <ReferralProgram />
            </div>

            <div className="w-full px-4 sm:px-6 lg:px-8">
              <FAQPreview />
            </div>
          </div>
        </div>

        <ChatbotWidget />
        <ScrollToTop />

        <div className="w-full px-4 sm:px-6 lg:px-8">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Index;