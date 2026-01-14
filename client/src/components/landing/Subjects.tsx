import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Calculator, BookOpen, FlaskConical, Code } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import happyStudentsImage from "@assets/IMG_7561_1768386171250.jpeg";

const subjects = [
  { name: "MATHEMATICS", icon: Calculator },
  { name: "ENGLISH", icon: BookOpen },
  { name: "SCIENCE (PHY, CHEM, BIO)", icon: FlaskConical },
  { name: "CODING", icon: Code },
];

export function Subjects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-block mb-6">
            <div className="h-1 w-12 bg-brand-blue rounded-full mx-auto mb-4" />
          </div>
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand-muted uppercase" data-testid="text-subjects-kicker">
            SUBJECTS
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.6, delay: 0.1 }}
            className="order-2 lg:order-1"
          >
            <div className="rounded-[28px] overflow-hidden shadow-xl">
              <img 
                src={happyStudentsImage}
                alt="Happy students"
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 order-1 lg:order-2">
            {subjects.map((subject, index) => {
              const Icon = subject.icon;
              return (
                <motion.div
                  key={subject.name}
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: prefersReducedMotion ? 0.2 : 0.4, delay: prefersReducedMotion ? 0 : index * 0.08 }}
                  className="bg-brand-bg rounded-[24px] p-6 text-center"
                  data-testid={`subject-${subject.name.toLowerCase().replace(/[\s(),]+/g, "-")}`}
                >
                  <div className="w-14 h-14 rounded-xl bg-brand-blue/[0.08] flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-brand-blue" strokeWidth={1.8} />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-brand-ink tracking-tight leading-tight" data-testid={`text-subject-name-${index}`}>
                    {subject.name}
                  </h3>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
