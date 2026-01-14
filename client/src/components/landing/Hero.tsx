import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useEffect, useRef } from "react";
import heroVideo from "@assets/gemini_generated_video_1E4A2E5D_1768386171250.mp4";

interface HeroProps {
  onOpenAssessment: () => void;
}

export function Hero({ onOpenAssessment }: HeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.12,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0.2 : 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="relative max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
              <p
                className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand-muted uppercase"
                data-testid="text-hero-kicker-1"
              >
                CONFIDENCE BUILDING, ONE-ON-ONE
              </p>
              <p
                className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand-muted uppercase mt-1"
                data-testid="text-hero-kicker-2"
              >
                ONLINE TUTORING FOR GRADES 1 TO 10.
              </p>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-brand-ink leading-[1.1] tracking-tight mb-6 sm:mb-8"
              data-testid="text-hero-headline"
            >
              BRIDGING KNOWLEDGE,{" "}
              <span className="text-brand-blue">BUILDING FUTURES</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-[15px] sm:text-base md:text-lg text-brand-muted leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 sm:mb-10"
              data-testid="text-hero-description"
            >
              EduBridge Learning connects students with expert tutors for personalized online learning, helping every child achieve their full potential.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenAssessment}
                className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-full bg-brand-blue text-white font-bold text-sm sm:text-base shadow-lg shadow-brand-blue/20 transition-all hover:shadow-xl hover:shadow-brand-blue/25"
                data-testid="button-hero-cta"
              >
                GET YOUR FREE LEARNING SNAPSHOT
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="order-1 lg:order-2"
          >
            <motion.div
              variants={itemVariants}
              className="relative aspect-video w-full max-w-lg mx-auto lg:max-w-none"
            >
              <div className="relative rounded-[24px] overflow-hidden shadow-2xl shadow-brand-ink/[0.08]">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover"
                  data-testid="video-hero"
                >
                  <source src={heroVideo} type="video/mp4" />
                </video>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
