import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import studentsImage from "@assets/IMG_7559_1768386171250.jpeg";

export function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="rounded-[28px] overflow-hidden shadow-xl">
              <img 
                src={studentsImage}
                alt="Students learning"
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.5 }}
            className="text-center lg:text-left order-1 lg:order-2"
          >
            <div className="inline-block mb-6">
              <div className="h-1 w-12 bg-brand-blue rounded-full mx-auto lg:mx-0 mb-4" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-brand-ink tracking-tight leading-tight mb-5 sm:mb-6" data-testid="text-cta-headline">
              READY TO GET STARTED?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-brand-muted mb-10 sm:mb-12 max-w-lg mx-auto lg:mx-0" data-testid="text-cta-description">
              Give your child the support they deserve without stress.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-10 sm:px-14 py-5 sm:py-6 rounded-full bg-brand-blue text-white font-bold text-base sm:text-lg shadow-lg shadow-brand-blue/20 transition-all hover:shadow-xl hover:shadow-brand-blue/25"
              data-testid="button-final-cta"
            >
              GET YOUR FREE LEARNING SNAPSHOT
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
