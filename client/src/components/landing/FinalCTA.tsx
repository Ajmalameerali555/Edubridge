import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="py-20 sm:py-28 px-4 bg-brand-card relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, -15, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 -right-20 w-64 h-64 rounded-full bg-brand-blue/5 blur-3xl"
        />
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 15, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-10 -left-20 w-72 h-72 rounded-full bg-brand-mint/5 blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30, filter: prefersReducedMotion ? "blur(0px)" : "blur(8px)" }}
        animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: prefersReducedMotion ? 0.2 : 0.6 }}
        className="relative max-w-2xl mx-auto text-center"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-brand-ink tracking-tight mb-4 sm:mb-6" data-testid="text-cta-headline">
          READY TO GET STARTED?
        </h2>
        <p className="text-base sm:text-lg text-brand-muted mb-8 sm:mb-10" data-testid="text-cta-description">
          Give your child the support they deserve without stress.
        </p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 sm:px-12 py-4 sm:py-5 rounded-full bg-brand-blue text-white font-bold text-base sm:text-lg shadow-xl shadow-brand-blue/30 transition-shadow hover:shadow-2xl hover:shadow-brand-blue/40"
          data-testid="button-final-cta"
        >
          GET YOUR FREE LEARNING SNAPSHOT
        </motion.button>
      </motion.div>
    </section>
  );
}
