import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 bg-brand-bg relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 -right-20 w-80 h-80 rounded-full bg-brand-blue/[0.06] blur-3xl"
        />
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 20, 0], x: [0, -10, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-10 -left-20 w-96 h-96 rounded-full bg-brand-mint/[0.06] blur-3xl"
        />
        <motion.div
          animate={prefersReducedMotion ? {} : { scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-yellow/[0.03] blur-3xl"
        />

        <svg className="absolute top-20 left-[15%] w-20 h-20 text-brand-blue/10" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="15" cy="15" r="3" />
          <circle cx="40" cy="15" r="3" />
          <circle cx="65" cy="15" r="3" />
          <circle cx="15" cy="40" r="3" />
          <circle cx="40" cy="40" r="3" />
          <circle cx="65" cy="40" r="3" />
          <circle cx="15" cy="65" r="3" />
          <circle cx="40" cy="65" r="3" />
          <circle cx="65" cy="65" r="3" />
        </svg>

        <motion.div
          animate={prefersReducedMotion ? {} : { rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-[10%] w-16 h-16"
        >
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-pink/15">
            <polygon points="50,10 90,90 10,90" />
          </svg>
        </motion.div>

        <motion.div
          animate={prefersReducedMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-[8%]"
        >
          <div className="w-4 h-4 rounded-full bg-brand-yellow/30" />
        </motion.div>

        <motion.div
          animate={prefersReducedMotion ? {} : { scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/3 right-[15%]"
        >
          <div className="w-3 h-3 rounded-full bg-brand-mint/30" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 28, filter: prefersReducedMotion ? "blur(0px)" : "blur(6px)" }}
        animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: prefersReducedMotion ? 0.2 : 0.5 }}
        className="relative max-w-3xl mx-auto text-center"
      >
        <motion.div
          animate={prefersReducedMotion ? {} : { scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-brand-ink tracking-tight leading-tight mb-5 sm:mb-6" data-testid="text-cta-headline">
            READY TO GET STARTED?
          </h2>
        </motion.div>
        <p className="text-base sm:text-lg md:text-xl text-brand-muted mb-10 sm:mb-12 max-w-lg mx-auto" data-testid="text-cta-description">
          Give your child the support they deserve without stress.
        </p>
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: "0 25px 50px -12px rgba(47, 107, 255, 0.35)" }}
          whileTap={{ scale: 0.98 }}
          className="w-full sm:w-auto px-10 sm:px-14 py-5 sm:py-6 rounded-full bg-brand-blue text-white font-bold text-base sm:text-lg shadow-xl shadow-brand-blue/25 transition-all relative overflow-hidden group"
          data-testid="button-final-cta"
        >
          <span className="relative z-10">GET YOUR FREE LEARNING SNAPSHOT</span>
          <motion.div
            animate={prefersReducedMotion ? {} : { x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
        </motion.button>
      </motion.div>
    </section>
  );
}
