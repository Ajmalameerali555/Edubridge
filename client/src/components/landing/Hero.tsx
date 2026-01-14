import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import heroImage from "@assets/hero-video-frame.webp";

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

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
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 24, filter: prefersReducedMotion ? "blur(0px)" : "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: prefersReducedMotion ? 0.2 : 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, -15, 0], scale: [1, 1.03, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 -left-40 w-[500px] h-[500px] rounded-full bg-brand-blue/[0.04] blur-3xl"
        />
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 18, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute bottom-32 -right-40 w-[450px] h-[450px] rounded-full bg-brand-mint/[0.04] blur-3xl"
        />
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-yellow/[0.02] blur-3xl"
        />
        
        <svg className="absolute top-20 right-10 w-24 h-24 text-brand-blue/10" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="10" cy="10" r="3" />
          <circle cx="30" cy="10" r="3" />
          <circle cx="50" cy="10" r="3" />
          <circle cx="10" cy="30" r="3" />
          <circle cx="30" cy="30" r="3" />
          <circle cx="50" cy="30" r="3" />
          <circle cx="10" cy="50" r="3" />
          <circle cx="30" cy="50" r="3" />
          <circle cx="50" cy="50" r="3" />
        </svg>
        
        <svg className="absolute bottom-40 left-10 w-16 h-16 text-brand-mint/15" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="10" y="10" width="80" height="80" rx="15" />
        </svg>
        
        <motion.div
          animate={prefersReducedMotion ? {} : { rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 right-[15%] w-8 h-8"
        >
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" className="text-brand-yellow/20">
            <polygon points="50,5 61,40 98,40 68,62 79,97 50,75 21,97 32,62 2,40 39,40" />
          </svg>
        </motion.div>
      </div>

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
                className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-full bg-brand-blue text-white font-bold text-sm sm:text-base shadow-lg shadow-brand-blue/25 transition-all hover:shadow-xl hover:shadow-brand-blue/30"
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
              <div className="absolute -inset-3 rounded-[36px] bg-gradient-to-br from-brand-blue/15 via-brand-mint/10 to-brand-pink/10 blur-xl" />
              <div className="relative rounded-[32px] overflow-hidden bg-brand-card border border-[rgba(15,23,42,0.08)] shadow-2xl shadow-brand-ink/[0.08]">
                <div className="aspect-video relative">
                  <img 
                    src={heroImage} 
                    alt="Online tutoring session"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/40 via-transparent to-transparent" />
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div 
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center cursor-pointer shadow-2xl shadow-brand-ink/20 transition-shadow hover:shadow-brand-blue/30"
                      data-testid="button-play-video"
                    >
                      <Play className="w-6 h-6 sm:w-8 sm:h-8 text-brand-blue ml-1" fill="currentColor" strokeWidth={0} />
                    </div>
                  </motion.div>
                </div>
              </div>
              <motion.div
                animate={prefersReducedMotion ? {} : { y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -right-4 w-20 h-20 sm:w-28 sm:h-28 rounded-[24px] bg-brand-mint/15 -z-10"
              />
              <motion.div
                animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -top-4 -left-4 w-16 h-16 sm:w-24 sm:h-24 rounded-[24px] bg-brand-blue/15 -z-10"
              />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-brand-yellow/40" />
              <div className="absolute top-1/4 -right-3 w-3 h-3 rounded-full bg-brand-pink/40" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
