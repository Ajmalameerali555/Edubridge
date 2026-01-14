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

const shadowClasses: Record<string, string> = {
  blue: "shadow-brand-blue/20",
  mint: "shadow-brand-mint/20",
  yellow: "shadow-brand-yellow/20",
  pink: "shadow-brand-pink/20",
};

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-brand-card/50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-blue/10 to-transparent" />
        
        <motion.div
          animate={prefersReducedMotion ? {} : { rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-[8%] w-16 h-16"
        >
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-mint/15">
            <path d="M50 10 L90 50 L50 90 L10 50 Z" />
          </svg>
        </motion.div>

        <svg className="absolute bottom-10 left-[5%] w-24 h-24 text-brand-yellow/8" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="15" cy="15" r="3" />
          <circle cx="35" cy="15" r="3" />
          <circle cx="55" cy="15" r="3" />
          <circle cx="75" cy="15" r="3" />
          <circle cx="15" cy="35" r="3" />
          <circle cx="35" cy="35" r="3" />
          <circle cx="55" cy="35" r="3" />
          <circle cx="75" cy="35" r="3" />
        </svg>

        <motion.div
          animate={prefersReducedMotion ? {} : { scale: [1, 1.15, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-[12%]"
        >
          <div className="w-6 h-6 rounded-full border-2 border-brand-pink/15" />
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24, filter: prefersReducedMotion ? "blur(0px)" : "blur(6px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.5 }}
          className="text-center mb-14 sm:mb-18 lg:mb-20"
        >
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand-muted uppercase mb-4" data-testid="text-howitworks-kicker">
            THE ROADMAP TO SUCCESS
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-brand-ink tracking-tight leading-tight" data-testid="text-howitworks-headline">
            HOW EDUBRIDGE LEARNING WORKS
          </h2>
        </motion.div>

        <div className="space-y-5 sm:space-y-6 relative">
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-blue/20 via-brand-mint/20 via-brand-yellow/20 to-brand-pink/20 hidden sm:block" style={{ height: 'calc(100% - 40px)', top: '20px' }} />
          
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -32, filter: prefersReducedMotion ? "blur(0px)" : "blur(6px)" }}
              animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.45, delay: prefersReducedMotion ? 0 : index * 0.1 }}
              data-testid={`step-${step.number}`}
              className="relative"
            >
              <div
                className={`${colorClasses[step.color]} rounded-[28px] sm:rounded-[32px] px-6 sm:px-8 py-5 sm:py-6 flex items-center gap-5 sm:gap-6 shadow-lg ${shadowClasses[step.color]} relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent" />
                <span className="text-white/70 font-black text-2xl sm:text-3xl tracking-tight relative z-10" data-testid={`text-step-number-${step.number}`}>
                  {step.number}
                </span>
                <span className="text-white font-extrabold text-base sm:text-lg tracking-tight relative z-10" data-testid={`text-step-title-${step.number}`}>
                  {step.title}
                </span>
              </div>
              {step.bullets.length > 0 && (
                <div className="mt-4 ml-4 sm:ml-6 pl-6 sm:pl-8 border-l-2 border-[rgba(15,23,42,0.06)]">
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
