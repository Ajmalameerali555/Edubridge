import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Calculator, BookOpen, FlaskConical, Code } from "lucide-react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import subjectImage from "@assets/student-image-2.jpeg";

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
    <section ref={ref} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-brand-bg relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={prefersReducedMotion ? {} : { x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[10%]"
        >
          <svg className="w-16 h-16 text-brand-pink/10" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 50 L50 20 L80 50 L50 80 Z" />
          </svg>
        </motion.div>
        <svg className="absolute bottom-10 right-[15%] w-24 h-24 text-brand-blue/8" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="20" cy="20" r="3" />
          <circle cx="40" cy="20" r="3" />
          <circle cx="60" cy="20" r="3" />
          <circle cx="80" cy="20" r="3" />
          <circle cx="20" cy="40" r="3" />
          <circle cx="40" cy="40" r="3" />
          <circle cx="60" cy="40" r="3" />
          <circle cx="80" cy="40" r="3" />
          <circle cx="20" cy="60" r="3" />
          <circle cx="40" cy="60" r="3" />
          <circle cx="60" cy="60" r="3" />
          <circle cx="80" cy="60" r="3" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative">
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

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
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
            initial={{ opacity: 0, scale: 0.95, x: prefersReducedMotion ? 0 : 24 }}
            animate={isInView ? { opacity: 1, scale: 1, x: 0 } : {}}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.6, delay: 0.3 }}
            className="hidden lg:block relative"
          >
            <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-br from-brand-blue/10 via-brand-mint/10 to-brand-yellow/10 blur-xl" />
            <div className="relative overflow-hidden rounded-[32px] shadow-xl shadow-brand-ink/[0.06]">
              <img 
                src={subjectImage}
                alt="Student studying"
                className="w-full h-auto object-cover aspect-[4/3]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/30 via-transparent to-transparent" />
            </div>
            <motion.div
              animate={prefersReducedMotion ? {} : { y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 w-20 h-20 rounded-3xl bg-brand-blue/15"
            />
            <motion.div
              animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-3 -left-3 w-14 h-14 rounded-2xl bg-brand-mint/15"
            />
            <div className="absolute top-1/3 -left-2 w-4 h-4 rounded-full bg-brand-yellow/40" />
            <div className="absolute bottom-1/4 -right-2 w-3 h-3 rounded-full bg-brand-pink/40" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
