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
    <section ref={ref} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-brand-card/50">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand-muted uppercase" data-testid="text-curriculum-kicker">
            CURRICULUM
          </p>
        </motion.div>

        <div className="space-y-4 sm:space-y-5">
          {curriculumOptions.map((option, index) => (
            <motion.div
              key={option.name}
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -24 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.45, delay: prefersReducedMotion ? 0 : index * 0.1 }}
              className="group bg-white rounded-full px-6 sm:px-8 py-5 sm:py-6 border border-[rgba(15,23,42,0.05)] shadow-sm hover:shadow-md hover:border-brand-blue/20 transition-all duration-300 flex items-center gap-4 sm:gap-5 cursor-pointer"
              data-testid={`curriculum-${option.name.toLowerCase().replace(/[:\s]+/g, "-")}`}
            >
              <div className="w-3 h-3 rounded-full bg-brand-blue flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                <span className="text-base sm:text-lg font-extrabold text-brand-ink tracking-tight group-hover:text-brand-blue transition-colors duration-300" data-testid={`text-curriculum-name-${index}`}>
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
