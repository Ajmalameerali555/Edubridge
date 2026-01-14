import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Calculator, BookOpen, FlaskConical, Code } from "lucide-react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const subjects = [
  { name: "MATHEMATICS", icon: Calculator, color: "blue" },
  { name: "ENGLISH", icon: BookOpen, color: "mint" },
  { name: "SCIENCE (PHY, CHEM, BIO)", icon: FlaskConical, color: "yellow" },
  { name: "CODING", icon: Code, color: "pink" },
];

const colorClasses: Record<string, { bg: string; icon: string; border: string }> = {
  blue: { bg: "bg-brand-blue/[0.06]", icon: "text-brand-blue", border: "group-hover:border-brand-blue/20" },
  mint: { bg: "bg-brand-mint/[0.06]", icon: "text-brand-mint", border: "group-hover:border-brand-mint/20" },
  yellow: { bg: "bg-brand-yellow/[0.06]", icon: "text-brand-yellow", border: "group-hover:border-brand-yellow/20" },
  pink: { bg: "bg-brand-pink/[0.06]", icon: "text-brand-pink", border: "group-hover:border-brand-pink/20" },
};

export function Subjects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-brand-bg">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24, filter: prefersReducedMotion ? "blur(0px)" : "blur(6px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand-muted uppercase" data-testid="text-subjects-kicker">
            SUBJECTS
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {subjects.map((subject, index) => {
            const colors = colorClasses[subject.color];
            const Icon = subject.icon;

            return (
              <motion.div
                key={subject.name}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 28, filter: prefersReducedMotion ? "blur(0px)" : "blur(6px)" }}
                animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                transition={{ duration: prefersReducedMotion ? 0.2 : 0.45, delay: prefersReducedMotion ? 0 : index * 0.08 }}
                className={`group bg-white rounded-[28px] p-6 sm:p-7 border border-[rgba(15,23,42,0.05)] shadow-sm hover:shadow-md transition-all duration-300 text-center ${colors.border}`}
                data-testid={`subject-${subject.name.toLowerCase().replace(/[\s(),]+/g, "-")}`}
              >
                <div className="relative mb-5">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${colors.bg} flex items-center justify-center mx-auto transition-transform duration-300 group-hover:scale-105`}>
                    <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${colors.icon}`} strokeWidth={1.8} />
                  </div>
                </div>
                <h3 className="text-xs sm:text-sm font-extrabold text-brand-ink tracking-tight leading-tight" data-testid={`text-subject-name-${index}`}>
                  {subject.name}
                </h3>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.5, delay: 0.4 }}
          className="mt-12 sm:mt-16"
        >
          <div className="relative aspect-[3/1] sm:aspect-[4/1] max-w-3xl mx-auto rounded-[32px] bg-gradient-to-r from-brand-blue/[0.04] via-brand-mint/[0.04] to-brand-pink/[0.04] border border-[rgba(15,23,42,0.05)] overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDE1LDIzLDQyLDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-brand-muted/30 text-xs sm:text-sm font-medium tracking-wide">
              <div className="w-10 h-10 rounded-xl border-2 border-dashed border-brand-muted/20" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
