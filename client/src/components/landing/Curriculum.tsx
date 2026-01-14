import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const curriculumOptions = [
  { name: "CBSE", subtitle: "(Indian Curriculum)" },
  { name: "IGCSE", subtitle: "(British Curriculum)" },
  { name: "IB: PYP AND MYP", subtitle: "(International Baccalaureate)" },
];

export function Curriculum() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="py-16 sm:py-24 px-4 bg-brand-bg">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30, filter: prefersReducedMotion ? "blur(0px)" : "blur(8px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-brand-muted" data-testid="text-curriculum-kicker">
            CURRICULUM
          </p>
        </motion.div>

        <div className="space-y-4">
          {curriculumOptions.map((option, index) => (
            <motion.div
              key={option.name}
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -30, filter: prefersReducedMotion ? "blur(0px)" : "blur(8px)" }}
              animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.5, delay: prefersReducedMotion ? 0 : index * 0.1 }}
              className="bg-brand-card rounded-full px-6 sm:px-8 py-4 sm:py-5 border border-[rgba(15,23,42,0.06)] flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
              data-testid={`curriculum-${option.name.toLowerCase().replace(/[:\s]+/g, "-")}`}
            >
              <div className="w-3 h-3 rounded-full bg-brand-blue flex-shrink-0" />
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="text-base sm:text-lg font-extrabold text-brand-ink tracking-tight" data-testid={`text-curriculum-name-${index}`}>
                  {option.name}
                </span>
                <span className="text-sm text-brand-muted" data-testid={`text-curriculum-subtitle-${index}`}>
                  {option.subtitle}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
