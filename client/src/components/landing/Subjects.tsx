import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Calculator, BookOpen, FlaskConical, Code } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import subjectImage from "@assets/student-image-2.jpeg";
import studentImage3 from "@assets/student-image-3.jpeg";

const subjects = [
  { name: "MATHEMATICS", icon: Calculator, color: "blue" },
  { name: "ENGLISH", icon: BookOpen, color: "mint" },
  { name: "SCIENCE (PHY, CHEM, BIO)", icon: FlaskConical, color: "yellow" },
  { name: "CODING", icon: Code, color: "pink" },
];

const colorClasses: Record<string, { bg: string; icon: string; accent: string }> = {
  blue: { bg: "bg-brand-blue/[0.06]", icon: "text-brand-blue", accent: "bg-brand-blue" },
  mint: { bg: "bg-brand-mint/[0.06]", icon: "text-brand-mint", accent: "bg-brand-mint" },
  yellow: { bg: "bg-brand-yellow/[0.06]", icon: "text-brand-yellow", accent: "bg-brand-yellow" },
  pink: { bg: "bg-brand-pink/[0.06]", icon: "text-brand-pink", accent: "bg-brand-pink" },
};

export function Subjects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-brand-bg relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 -right-20 w-[300px] h-[300px] rounded-full bg-brand-blue/[0.03] blur-3xl" />
        <div className="absolute bottom-20 -left-20 w-[250px] h-[250px] rounded-full bg-brand-mint/[0.03] blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.5 }}
          className="text-center mb-14 sm:mb-18"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-[2px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-brand-blue" />
            <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand-muted uppercase" data-testid="text-subjects-kicker">
              SUBJECTS
            </p>
            <div className="h-[2px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-brand-blue" />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-7 grid grid-cols-2 gap-4 sm:gap-5">
            {subjects.map((subject, index) => {
              const colors = colorClasses[subject.color];
              const Icon = subject.icon;

              return (
                <motion.div
                  key={subject.name}
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 28 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: prefersReducedMotion ? 0.2 : 0.45, delay: prefersReducedMotion ? 0 : index * 0.08 }}
                  className="group bg-white rounded-[28px] p-6 sm:p-7 border border-[rgba(15,23,42,0.05)] shadow-sm hover:shadow-lg hover:shadow-brand-ink/[0.05] transition-all duration-300 text-center relative overflow-hidden"
                  data-testid={`subject-${subject.name.toLowerCase().replace(/[\s(),]+/g, "-")}`}
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 ${colors.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className="relative mb-5">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${colors.bg} flex items-center justify-center mx-auto transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg`}>
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
            className="lg:col-span-5 hidden lg:block relative"
          >
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-br from-brand-blue/10 via-brand-mint/10 to-brand-yellow/10 rounded-[36px] blur-xl -z-10" />
              <div className="rounded-[28px] overflow-hidden shadow-2xl shadow-brand-ink/[0.1] relative">
                <img 
                  src={subjectImage}
                  alt="Student studying"
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/20 via-transparent to-transparent" />
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -bottom-4 -left-4 w-24 h-24 rounded-2xl overflow-hidden shadow-xl border-4 border-white"
              >
                <img 
                  src={studentImage3}
                  alt="Student learning"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
