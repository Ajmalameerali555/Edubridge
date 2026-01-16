import { motion } from "framer-motion";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Users, ArrowRight } from "lucide-react";
import { Footer } from "@/components/landing/Footer";

export default function CareersHub() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-bg/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-brand-blue flex items-center justify-center shadow-lg shadow-brand-blue/20">
                <span className="text-white font-black text-lg">E</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-extrabold text-brand-ink tracking-tight leading-none">
                  EduBridge
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-brand-muted tracking-[0.2em] leading-none">
                  LEARNING
                </span>
              </div>
            </Link>
            <Link
              href="/"
              className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white border-2 border-brand-blue text-brand-blue font-semibold text-sm sm:text-base hover:bg-brand-blue/5 transition-colors"
              data-testid="link-back-home"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-16"
          >
            <motion.p
              variants={itemVariants}
              className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand-muted uppercase mb-4"
              data-testid="text-careers-kicker"
            >
              JOIN OUR MISSION
            </motion.p>
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-ink leading-tight tracking-tight mb-6"
              data-testid="text-careers-headline"
            >
              BUILD THE FUTURE OF{" "}
              <span className="text-brand-blue">EDUCATION</span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-brand-muted max-w-2xl mx-auto"
              data-testid="text-careers-description"
            >
              Whether you want to inspire students as a tutor or help us grow as part of our team, 
              there's a place for you at EduBridge.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-6 sm:gap-8"
          >
            <motion.div variants={itemVariants}>
              <Link href="/careers/tutors" data-testid="card-become-tutor">
                <Card className="group cursor-pointer h-full bg-white border-2 border-transparent hover:border-brand-blue/20 transition-all duration-300">
                  <CardContent className="p-8 sm:p-10 flex flex-col h-full">
                    <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center mb-6">
                      <GraduationCap className="w-7 h-7 text-brand-blue" />
                    </div>
                    <h2
                      className="text-xl sm:text-2xl font-bold text-brand-ink mb-3"
                      data-testid="text-tutor-card-title"
                    >
                      Become a Tutor
                    </h2>
                    <p className="text-brand-muted text-sm sm:text-base leading-relaxed flex-1 mb-6">
                      Share your expertise and make a difference in students' lives. 
                      Flexible hours, competitive pay, and the joy of teaching.
                    </p>
                    <div className="flex items-center gap-2 text-brand-blue font-semibold text-sm sm:text-base group-hover:gap-3 transition-all">
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link href="/careers/team" data-testid="card-join-team">
                <Card className="group cursor-pointer h-full bg-white border-2 border-transparent hover:border-brand-navy/20 transition-all duration-300">
                  <CardContent className="p-8 sm:p-10 flex flex-col h-full">
                    <div className="w-14 h-14 rounded-2xl bg-brand-navy/10 flex items-center justify-center mb-6">
                      <Users className="w-7 h-7 text-brand-navy" />
                    </div>
                    <h2
                      className="text-xl sm:text-2xl font-bold text-brand-ink mb-3"
                      data-testid="text-team-card-title"
                    >
                      Join EduBridge Team
                    </h2>
                    <p className="text-brand-muted text-sm sm:text-base leading-relaxed flex-1 mb-6">
                      Help us build the future of education. We're looking for passionate 
                      people to join our growing team.
                    </p>
                    <div className="flex items-center gap-2 text-brand-navy font-semibold text-sm sm:text-base group-hover:gap-3 transition-all">
                      <span>Explore Roles</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
