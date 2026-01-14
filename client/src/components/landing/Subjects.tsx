import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Calculator, BookOpen, FlaskConical, Code } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import subjectImage from "@assets/student-image-2.jpeg";

const subjects = [
  { name: "MATHEMATICS", icon: Calculator, color: "blue" },
  { name: "ENGLISH", icon: BookOpen, color: "mint" },
  { name: "SCIENCE (PHY, CHEM, BIO)", icon: FlaskConical, color: "yellow" },
  { name: "CODING", icon: Code, color: "pink" },
];

const colorClasses: Record<string, { bg: string; icon: string }> = {
  blue: { bg: "bg-brand-blue/[0.06]", icon: "text-brand-blue" },
  mint: { bg: "bg-brand-mint/[0.06]", icon: "text-brand-mint" },
  yellow: { bg: "bg-brand-yellow/[0.06]", icon: "text-brand-yellow" },
  pink: { bg: "bg-brand-pink/[0.06]", icon: "text-brand-pink" },
};

export function Subjects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-brand-bg">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand-muted uppercase" data-testid="text-subjects-kicker">
            SUBJECTS
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            {subjects.map((subject, index) => {
              const colors = colorClasses[subject.color];
              const Icon = subject.icon;

              return (
                <motion.div
                  key={subject.name}
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 28 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: prefersReducedMotion ? 0.2 : 0.45, delay: prefersReducedMotion ? 0 : index * 0.08 }}
                  className="group bg-white rounded-[28px] p-6 sm:p-7 border border-[rgba(15,23,42,0.05)] shadow-sm hover:shadow-md transition-all duration-300 text-center"
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
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.6, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="rounded-[28px] overflow-hidden shadow-xl shadow-brand-ink/[0.08]">
              <img 
                src={subjectImage}
                alt="Student studying"
                className="w-full h-auto object-cover aspect-[4/3]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
