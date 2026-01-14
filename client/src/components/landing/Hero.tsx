import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
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
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, -15, 0], scale: [1, 1.03, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 -left-32 w-[400px] h-[400px] rounded-full bg-brand-blue/[0.04] blur-3xl"
        />
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 18, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute bottom-20 -right-32 w-[350px] h-[350px] rounded-full bg-brand-mint/[0.04] blur-3xl"
        />
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-1/2 right-1/4 w-[200px] h-[200px] rounded-full bg-brand-yellow/[0.03] blur-3xl"
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
              <div className="absolute -inset-4 bg-gradient-to-br from-brand-blue/10 via-brand-mint/10 to-brand-pink/10 rounded-[36px] blur-xl -z-10" />
              <div className="relative rounded-[28px] overflow-hidden shadow-2xl shadow-brand-ink/[0.12]">
                <img 
                  src={heroImage} 
                  alt="Online tutoring session"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/30 via-transparent to-transparent" />
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div 
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center cursor-pointer shadow-2xl"
                    data-testid="button-play-video"
                  >
                    <Play className="w-6 h-6 sm:w-8 sm:h-8 text-brand-blue ml-1" fill="currentColor" strokeWidth={0} />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
