import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const steps = [
  {
    number: "01",
    title: "SHARE NEEDS",
    bullets: ["Fill out a short form to help us understand your child before any class begins."],
  },
  {
    number: "02",
    title: "SNAPSHOT SESSION",
    bullets: ["Your child attends a 20-30 minute one-on-one session with us to assess learning pace and communication."],
  },
  {
    number: "03",
    title: "TUTOR MATCH & PLAN",
    bullets: ["We share a detailed learning summary and discuss the best academic plan for your child."],
  },
  {
    number: "04",
    title: "START LEARNING",
    bullets: [],
  },
];

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-brand-bg">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.5 }}
          className="text-center mb-14 sm:mb-18"
        >
          <div className="inline-block mb-6">
            <div className="h-1 w-12 bg-brand-blue rounded-full mx-auto mb-4" />
          </div>
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand-muted uppercase mb-4" data-testid="text-howitworks-kicker">
            THE ROADMAP TO SUCCESS
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-brand-ink tracking-tight leading-tight" data-testid="text-howitworks-headline">
            HOW EDUBRIDGE LEARNING WORKS
          </h2>
        </motion.div>

        <div className="space-y-5">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.4, delay: prefersReducedMotion ? 0 : index * 0.1 }}
              data-testid={`step-${step.number}`}
            >
              <div className="bg-brand-blue rounded-[24px] px-6 sm:px-8 py-5 flex items-center gap-5 shadow-md">
                <span className="text-white/60 font-black text-2xl sm:text-3xl" data-testid={`text-step-number-${step.number}`}>
                  {step.number}
                </span>
                <span className="text-white font-bold text-base sm:text-lg" data-testid={`text-step-title-${step.number}`}>
                  {step.title}
                </span>
              </div>
              {step.bullets.length > 0 && (
                <div className="mt-3 ml-6 pl-6 border-l-2 border-brand-blue/20">
                  {step.bullets.map((bullet, bulletIndex) => (
                    <p
                      key={bulletIndex}
                      className="text-[13px] sm:text-[15px] text-brand-muted leading-relaxed"
                      data-testid={`text-step-bullet-${step.number}-${bulletIndex}`}
                    >
                      {bullet}
                    </p>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
