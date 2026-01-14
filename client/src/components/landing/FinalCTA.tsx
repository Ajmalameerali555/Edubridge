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
          animate={prefersReducedMotion ? {} : { y: [0, -12, 0], scale: [1, 1.03, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 -right-32 w-80 h-80 rounded-full bg-brand-blue/[0.04] blur-3xl"
        />
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 12, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-10 -left-32 w-96 h-96 rounded-full bg-brand-mint/[0.04] blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 28, filter: prefersReducedMotion ? "blur(0px)" : "blur(6px)" }}
        animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: prefersReducedMotion ? 0.2 : 0.5 }}
        className="relative max-w-3xl mx-auto text-center"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-brand-ink tracking-tight leading-tight mb-5 sm:mb-6" data-testid="text-cta-headline">
          READY TO GET STARTED?
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-brand-muted mb-10 sm:mb-12 max-w-lg mx-auto" data-testid="text-cta-description">
          Give your child the support they deserve without stress.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full sm:w-auto px-10 sm:px-14 py-5 sm:py-6 rounded-full bg-brand-blue text-white font-bold text-base sm:text-lg shadow-xl shadow-brand-blue/25 transition-all hover:shadow-2xl hover:shadow-brand-blue/35"
          data-testid="button-final-cta"
        >
          GET YOUR FREE LEARNING SNAPSHOT
        </motion.button>
      </motion.div>
    </section>
  );
}
