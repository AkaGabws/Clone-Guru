import React from "react";
import { Header } from "../components/sections/Header";
import { Hero } from "../components/sections/Hero";
import { Hero2} from "../components/sections/Hero2"
import { AboutSection } from "../components/sections/AboutSection";
import { HowItWorks } from "../components/sections/HowItWorks";
import { TestimonialsCarousel } from "../components/sections/TestimonialsCarousel";
import { ImpactSection } from "../components/sections/ImpactSection";
import { HistorySection } from "../components/sections/HistorySection";
import { ParticiparSection } from "../components/sections/ParticiparSection";
import { Footer } from "../components/sections/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Hero2/>
      <AboutSection />
      <HowItWorks />
      <TestimonialsCarousel />
      <ImpactSection />
      <ParticiparSection />
      <HistorySection />
      <Footer />
    </div>
  );
}
