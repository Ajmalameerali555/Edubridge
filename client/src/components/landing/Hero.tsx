import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

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
              <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-brand-blue/10 via-brand-mint/5 to-brand-pink/5 border border-[rgba(15,23,42,0.06)]" />
              <div className="relative rounded-[32px] overflow-hidden bg-brand-card border border-[rgba(15,23,42,0.08)] shadow-xl shadow-brand-ink/[0.04]">
                <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-brand-navy/[0.02] to-brand-blue/[0.04]">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-blue/90 backdrop-blur-sm flex items-center justify-center cursor-pointer shadow-lg shadow-brand-blue/30 transition-shadow hover:shadow-xl hover:shadow-brand-blue/40"
                    data-testid="button-play-video"
                  >
                    <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1" fill="white" strokeWidth={0} />
                  </motion.div>
                </div>
              </div>
              <div className="absolute -bottom-3 -right-3 w-24 h-24 sm:w-32 sm:h-32 rounded-[28px] bg-brand-mint/10 -z-10" />
              <div className="absolute -top-3 -left-3 w-20 h-20 sm:w-28 sm:h-28 rounded-[28px] bg-brand-blue/10 -z-10" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
