import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const checklistItems = [
  "Children who need extra academic support.",
  "Shy or anxious learners.",
  "Students who struggle in group classes.",
  "Busy parents who want reliable, structured help.",
  "Families looking for quality without pressure.",
];

export function PerfectFor() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="py-16 sm:py-24 px-4 bg-brand-card">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30, filter: prefersReducedMotion ? "blur(0px)" : "blur(8px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-brand-muted mb-3" data-testid="text-perfectfor-kicker">
            TARGETED SUPPORT
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-brand-ink tracking-tight" data-testid="text-perfectfor-headline">
            WHO EDUBRIDGE LEARNING IS PERFECT FOR:
          </h2>
        </motion.div>

        <div className="space-y-4">
          {checklistItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -30, filter: prefersReducedMotion ? "blur(0px)" : "blur(8px)" }}
              animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.5, delay: prefersReducedMotion ? 0 : index * 0.1 }}
              className="bg-white rounded-[28px] sm:rounded-[32px] px-5 sm:px-7 py-4 sm:py-5 border border-[rgba(15,23,42,0.06)] shadow-sm flex items-center gap-4"
              data-testid={`checklist-item-${index}`}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-brand-mint/15 flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-brand-mint" strokeWidth={3} />
              </div>
              <p className="text-sm sm:text-base font-medium text-brand-ink leading-snug" data-testid={`text-checklist-${index}`}>
                {item}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
