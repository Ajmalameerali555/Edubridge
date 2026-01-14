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
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-brand-bg">
      <div className="max-w-4xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24, filter: prefersReducedMotion ? "blur(0px)" : "blur(6px)" }}
            animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.5 }}
            className="text-center lg:text-left"
          >
            <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand-muted uppercase mb-4" data-testid="text-perfectfor-kicker">
              TARGETED SUPPORT
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-brand-ink tracking-tight leading-tight" data-testid="text-perfectfor-headline">
              WHO EDUBRIDGE LEARNING IS PERFECT FOR:
            </h2>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.5, delay: 0.3 }}
              className="mt-10 hidden lg:block"
            >
              <div className="relative aspect-square max-w-[280px] rounded-[32px] bg-gradient-to-br from-brand-mint/[0.06] to-brand-blue/[0.06] border border-[rgba(15,23,42,0.05)] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-brand-muted/15" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div className="space-y-4">
            {checklistItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 24, filter: prefersReducedMotion ? "blur(0px)" : "blur(6px)" }}
                animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
                transition={{ duration: prefersReducedMotion ? 0.2 : 0.45, delay: prefersReducedMotion ? 0 : index * 0.08 }}
                className="group bg-white rounded-[28px] sm:rounded-[32px] px-5 sm:px-7 py-5 sm:py-6 border border-[rgba(15,23,42,0.05)] shadow-sm hover:shadow-md hover:border-brand-mint/15 transition-all duration-300 flex items-center gap-4"
                data-testid={`checklist-item-${index}`}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-mint/[0.08] flex items-center justify-center flex-shrink-0 group-hover:bg-brand-mint/[0.12] transition-colors duration-300">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-brand-mint" strokeWidth={2.5} />
                </div>
                <p className="text-sm sm:text-[15px] font-medium text-brand-ink leading-snug" data-testid={`text-checklist-${index}`}>
                  {item}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
