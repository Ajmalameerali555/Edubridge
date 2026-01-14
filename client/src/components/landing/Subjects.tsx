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

const colorClasses: Record<string, { bg: string; icon: string }> = {
  blue: { bg: "bg-brand-blue/10", icon: "text-brand-blue" },
  mint: { bg: "bg-brand-mint/10", icon: "text-brand-mint" },
  yellow: { bg: "bg-brand-yellow/10", icon: "text-brand-yellow" },
  pink: { bg: "bg-brand-pink/10", icon: "text-brand-pink" },
};

export function Subjects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="py-16 sm:py-24 px-4 bg-brand-card">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30, filter: prefersReducedMotion ? "blur(0px)" : "blur(8px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-brand-muted" data-testid="text-subjects-kicker">
            SUBJECTS
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {subjects.map((subject, index) => {
            const colors = colorClasses[subject.color];
            const Icon = subject.icon;

            return (
              <motion.div
                key={subject.name}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30, filter: prefersReducedMotion ? "blur(0px)" : "blur(8px)" }}
                animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                transition={{ duration: prefersReducedMotion ? 0.2 : 0.5, delay: prefersReducedMotion ? 0 : index * 0.1 }}
                className="bg-white rounded-[28px] p-5 sm:p-6 border border-[rgba(15,23,42,0.06)] shadow-sm hover:shadow-md transition-shadow text-center"
                data-testid={`subject-${subject.name.toLowerCase().replace(/[\s(),]+/g, "-")}`}
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${colors.bg} flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${colors.icon}`} strokeWidth={2} />
                </div>
                <h3 className="text-xs sm:text-sm font-extrabold text-brand-ink tracking-tight leading-tight" data-testid={`text-subject-name-${index}`}>
                  {subject.name}
                </h3>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
