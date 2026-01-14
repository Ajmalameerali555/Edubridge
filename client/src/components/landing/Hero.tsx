import { motion } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30, filter: prefersReducedMotion ? "blur(0px)" : "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: prefersReducedMotion ? 0.2 : 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 sm:pt-24 pb-16 px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, -20, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 -left-32 w-96 h-96 rounded-full bg-brand-blue/5 blur-3xl"
        />
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 -right-32 w-80 h-80 rounded-full bg-brand-mint/5 blur-3xl"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative max-w-4xl mx-auto text-center"
      >
        <motion.p
          variants={itemVariants}
          className="text-xs sm:text-sm font-bold tracking-[0.2em] text-brand-muted mb-4 sm:mb-6"
          data-testid="text-hero-kicker-1"
        >
          CONFIDENCE BUILDING, ONE-ON-ONE
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="text-xs sm:text-sm font-bold tracking-[0.2em] text-brand-muted mb-6 sm:mb-8"
          data-testid="text-hero-kicker-2"
        >
          ONLINE TUTORING FOR GRADES 1 TO 10.
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-brand-ink leading-tight tracking-tight mb-6 sm:mb-8"
          data-testid="text-hero-headline"
        >
          BRIDGING KNOWLEDGE,{" "}
          <span className="text-brand-blue">BUILDING FUTURES</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg md:text-xl text-brand-muted leading-relaxed max-w-2xl mx-auto mb-10 sm:mb-12"
          data-testid="text-hero-description"
        >
          EduBridge Learning connects students with expert tutors for personalized online learning, helping every child achieve their full potential.
        </motion.p>

        <motion.div variants={itemVariants}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 sm:px-12 py-4 sm:py-5 rounded-full bg-brand-blue text-white font-bold text-base sm:text-lg shadow-xl shadow-brand-blue/30 transition-shadow hover:shadow-2xl hover:shadow-brand-blue/40"
            data-testid="button-hero-cta"
          >
            GET YOUR FREE LEARNING SNAPSHOT
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
