import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import FAQ from "./FAQ";
import CTASection from "./CTASection";
import Price from "./Price";
import Testimonials from "./Testimonials";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <Price />
      <Testimonials />
      <FAQ />
      <CTASection />
      <Footer />
    </div>
  );
}
