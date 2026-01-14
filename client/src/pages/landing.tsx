import { Navbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";
import { WhyChoose } from "../components/landing/WhyChoose";
import { Curriculum } from "../components/landing/Curriculum";
import { Subjects } from "../components/landing/Subjects";
import { HowItWorks } from "../components/landing/HowItWorks";
import { PerfectFor } from "../components/landing/PerfectFor";
import { Promise } from "../components/landing/Promise";
import { FinalCTA } from "../components/landing/FinalCTA";
import { Footer } from "../components/landing/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <main>
        <Hero />
        <WhyChoose />
        <Curriculum />
        <Subjects />
        <HowItWorks />
        <PerfectFor />
        <Promise />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
