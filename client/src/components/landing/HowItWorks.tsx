import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const steps = [
  {
    number: "01",
    title: "SHARE NEEDS",
    color: "blue",
    bullets: ["Fill out a short form to help us understand your child before any class begins."],
  },
  {
    number: "02",
    title: "SNAPSHOT SESSION",
    color: "mint",
    bullets: ["Your child attends a 20-30 minute one-on-one session with us to assess learning pace and communication."],
  },
  {
    number: "03",
    title: "TUTOR MATCH & PLAN",
    color: "yellow",
    bullets: ["We share a detailed learning summary and discuss the best academic plan for your child."],
  },
  {
    number: "04",
    title: "START LEARNING",
    color: "pink",
    bullets: [],
  },
];

const colorClasses: Record<string, { bg: string; shadow: string }> = {
  blue: { bg: "bg-brand-blue", shadow: "shadow-brand-blue/25" },
  mint: { bg: "bg-brand-mint", shadow: "shadow-brand-mint/25" },
  yellow: { bg: "bg-brand-yellow", shadow: "shadow-brand-yellow/25" },
  pink: { bg: "bg-brand-pink", shadow: "shadow-brand-pink/25" },
};

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-brand-card/50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-brand-yellow/[0.02] blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] rounded-full bg-brand-pink/[0.02] blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.5 }}
          className="text-center mb-14 sm:mb-18 lg:mb-20"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-[2px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-brand-yellow" />
            <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand-muted uppercase" data-testid="text-howitworks-kicker">
              THE ROADMAP TO SUCCESS
            </p>
            <div className="h-[2px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-brand-yellow" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-brand-ink tracking-tight leading-tight" data-testid="text-howitworks-headline">
            HOW EDUBRIDGE LEARNING WORKS
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-8 sm:left-10 top-0 bottom-0 w-[2px] bg-gradient-to-b from-brand-blue via-brand-mint via-brand-yellow to-brand-pink hidden sm:block" />
          
          <div className="space-y-5 sm:space-y-6">
            {steps.map((step, index) => {
              const colors = colorClasses[step.color];
              
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -32 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: prefersReducedMotion ? 0.2 : 0.45, delay: prefersReducedMotion ? 0 : index * 0.1 }}
                  data-testid={`step-${step.number}`}
                  className="relative"
                >
                  <div
                    className={`${colors.bg} rounded-[28px] sm:rounded-[32px] px-6 sm:px-8 py-5 sm:py-6 flex items-center gap-5 sm:gap-6 shadow-lg ${colors.shadow} ml-0 sm:ml-16`}
                  >
                    <span className="text-white/70 font-black text-2xl sm:text-3xl tracking-tight" data-testid={`text-step-number-${step.number}`}>
                      {step.number}
                    </span>
                    <span className="text-white font-extrabold text-base sm:text-lg tracking-tight" data-testid={`text-step-title-${step.number}`}>
                      {step.title}
                    </span>
                  </div>
                  {step.bullets.length > 0 && (
                    <div className="mt-4 ml-4 sm:ml-20 pl-6 sm:pl-8 border-l-2 border-[rgba(15,23,42,0.06)]">
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
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
