import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

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

const colorClasses: Record<string, string> = {
  blue: "bg-brand-blue",
  mint: "bg-brand-mint",
  yellow: "bg-brand-yellow",
  pink: "bg-brand-pink",
};

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="py-16 sm:py-24 px-4 bg-brand-bg">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30, filter: prefersReducedMotion ? "blur(0px)" : "blur(8px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-brand-muted mb-3" data-testid="text-howitworks-kicker">
            THE ROADMAP TO SUCCESS
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-brand-ink tracking-tight" data-testid="text-howitworks-headline">
            HOW EDUBRIDGE LEARNING WORKS
          </h2>
        </motion.div>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -40, filter: prefersReducedMotion ? "blur(0px)" : "blur(8px)" }}
              animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.5, delay: prefersReducedMotion ? 0 : index * 0.12 }}
              data-testid={`step-${step.number}`}
            >
              <div
                className={`${colorClasses[step.color]} rounded-[28px] sm:rounded-[32px] px-6 sm:px-8 py-5 sm:py-6 flex items-center gap-4 sm:gap-6`}
              >
                <span className="text-white/80 font-black text-xl sm:text-2xl" data-testid={`text-step-number-${step.number}`}>
                  {step.number}
                </span>
                <span className="text-white font-extrabold text-base sm:text-lg tracking-tight" data-testid={`text-step-title-${step.number}`}>
                  {step.title}
                </span>
              </div>
              {step.bullets.length > 0 && (
                <div className="mt-3 ml-6 sm:ml-10 space-y-2">
                  {step.bullets.map((bullet, bulletIndex) => (
                    <p
                      key={bulletIndex}
                      className="text-sm sm:text-[15px] text-brand-muted leading-relaxed"
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
