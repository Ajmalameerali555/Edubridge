import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, Globe, Award } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const curriculumOptions = [
  { 
    name: "CBSE", 
    subtitle: "(Indian Curriculum)",
    icon: GraduationCap,
    color: "blue",
  },
  { 
    name: "IGCSE", 
    subtitle: "(British Curriculum)",
    icon: Globe,
    color: "mint",
  },
  { 
    name: "IB: PYP AND MYP", 
    subtitle: "(International Baccalaureate)",
    icon: Award,
    color: "yellow",
  },
];

const colorClasses: Record<string, { bg: string; icon: string; border: string; glow: string }> = {
  blue: { bg: "bg-brand-blue/[0.06]", icon: "text-brand-blue", border: "border-brand-blue/20", glow: "shadow-brand-blue/10" },
  mint: { bg: "bg-brand-mint/[0.06]", icon: "text-brand-mint", border: "border-brand-mint/20", glow: "shadow-brand-mint/10" },
  yellow: { bg: "bg-brand-yellow/[0.06]", icon: "text-brand-yellow", border: "border-brand-yellow/20", glow: "shadow-brand-yellow/10" },
};

export function Curriculum() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-brand-card/50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-brand-blue/[0.02] via-brand-mint/[0.02] to-brand-yellow/[0.02] blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-[2px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-brand-mint" />
            <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand-muted uppercase" data-testid="text-curriculum-kicker">
              CURRICULUM
            </p>
            <div className="h-[2px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-brand-mint" />
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
          {curriculumOptions.map((option, index) => {
            const colors = colorClasses[option.color];
            const Icon = option.icon;
            
            return (
              <motion.div
                key={option.name}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: prefersReducedMotion ? 0.2 : 0.45, delay: prefersReducedMotion ? 0 : index * 0.1 }}
                className={`group bg-white rounded-[28px] p-7 sm:p-8 border ${colors.border} shadow-sm hover:shadow-xl ${colors.glow} transition-all duration-300 text-center cursor-pointer`}
                data-testid={`curriculum-${option.name.toLowerCase().replace(/[:\s]+/g, "-")}`}
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${colors.bg} flex items-center justify-center mx-auto mb-5 transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${colors.icon}`} strokeWidth={1.8} />
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-brand-ink tracking-tight mb-1" data-testid={`text-curriculum-name-${index}`}>
                  {option.name}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-brand-muted" data-testid={`text-curriculum-subtitle-${index}`}>
                  {option.subtitle}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
