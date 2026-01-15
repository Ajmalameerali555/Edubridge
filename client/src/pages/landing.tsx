import { useState } from "react";
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
import { AssessmentModal } from "../components/landing/AssessmentModal";
import { LoginModal } from "../components/landing/LoginModal";

export default function Landing() {
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openAssessment = () => setIsAssessmentOpen(true);
  const closeAssessment = () => setIsAssessmentOpen(false);
  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar onOpenAssessment={openAssessment} onOpenLogin={openLogin} />
      <main>
        <Hero onOpenAssessment={openAssessment} />
        <WhyChoose />
        <Curriculum />
        <Subjects />
        <HowItWorks />
        <PerfectFor />
        <Promise />
        <FinalCTA onOpenAssessment={openAssessment} />
      </main>
      <Footer />
      <AssessmentModal isOpen={isAssessmentOpen} onClose={closeAssessment} />
      <LoginModal isOpen={isLoginOpen} onClose={closeLogin} />
    </div>
  );
}
