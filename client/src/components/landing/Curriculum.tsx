import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const curriculumOptions = [
  { name: "CBSE", subtitle: "(Indian Curriculum)" },
  { name: "IGCSE", subtitle: "(British Curriculum)" },
  { name: "IB: PYP AND MYP", subtitle: "(International Baccalaureate)" },
];

export function Curriculum() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-brand-bg">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-block mb-6">
            <div className="h-1 w-12 bg-brand-blue rounded-full mx-auto mb-4" />
          </div>
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand-muted uppercase" data-testid="text-curriculum-kicker">
            CURRICULUM
          </p>
        </motion.div>

        <div className="space-y-4">
          {curriculumOptions.map((option, index) => (
            <motion.div
              key={option.name}
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.4, delay: prefersReducedMotion ? 0 : index * 0.08 }}
              className="bg-white rounded-full px-6 sm:px-8 py-5 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
              data-testid={`curriculum-${option.name.toLowerCase().replace(/[:\s]+/g, "-")}`}
            >
              <div className="w-3 h-3 rounded-full bg-brand-blue flex-shrink-0" />
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                <span className="text-base sm:text-lg font-bold text-brand-ink" data-testid={`text-curriculum-name-${index}`}>
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
