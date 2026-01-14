import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import studentImage from "@assets/student-image-1.jpeg";

const checklistItems = [
  "Children who need extra academic support.",
  "Shy or anxious learners.",
  "Students who struggle in group classes.",
  "Busy parents who want reliable, structured help.",
  "Families looking for quality without pressure.",
];

export function PerfectFor() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-brand-bg relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute top-10 right-20 w-20 h-20 text-brand-mint/10" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="15" cy="15" r="4" />
          <circle cx="40" cy="15" r="4" />
          <circle cx="65" cy="15" r="4" />
          <circle cx="15" cy="40" r="4" />
          <circle cx="40" cy="40" r="4" />
          <circle cx="65" cy="40" r="4" />
        </svg>
        <motion.div
          animate={prefersReducedMotion ? {} : { rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-[5%] w-12 h-12"
        >
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-blue/10">
            <circle cx="50" cy="50" r="40" />
            <circle cx="50" cy="50" r="25" />
          </svg>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24, filter: prefersReducedMotion ? "blur(0px)" : "blur(6px)" }}
            animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.5 }}
            className="text-center lg:text-left"
          >
            <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand-muted uppercase mb-4" data-testid="text-perfectfor-kicker">
              TARGETED SUPPORT
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-brand-ink tracking-tight leading-tight" data-testid="text-perfectfor-headline">
              WHO EDUBRIDGE LEARNING IS PERFECT FOR:
            </h2>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.6, delay: 0.3 }}
              className="mt-10 hidden lg:block relative"
            >
              <div className="absolute -inset-3 rounded-[36px] bg-gradient-to-br from-brand-mint/15 via-brand-blue/10 to-brand-pink/10 blur-lg" />
              <div className="relative overflow-hidden rounded-[32px] shadow-xl shadow-brand-ink/[0.06]">
                <img 
                  src={studentImage}
                  alt="Student learning"
                  className="w-full h-auto object-cover aspect-square max-w-[320px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/20 via-transparent to-transparent" />
              </div>
              <motion.div
                animate={prefersReducedMotion ? {} : { y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-3 -right-3 w-16 h-16 rounded-2xl bg-brand-yellow/20"
              />
              <div className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-brand-blue/30" />
            </motion.div>
          </motion.div>

          <div className="space-y-4">
            {checklistItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 24, filter: prefersReducedMotion ? "blur(0px)" : "blur(6px)" }}
                animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
                transition={{ duration: prefersReducedMotion ? 0.2 : 0.45, delay: prefersReducedMotion ? 0 : index * 0.08 }}
                className="group bg-white rounded-[28px] sm:rounded-[32px] px-5 sm:px-7 py-5 sm:py-6 border border-[rgba(15,23,42,0.05)] shadow-sm hover:shadow-md hover:border-brand-mint/15 transition-all duration-300 flex items-center gap-4"
                data-testid={`checklist-item-${index}`}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-mint/[0.08] flex items-center justify-center flex-shrink-0 group-hover:bg-brand-mint/[0.12] transition-colors duration-300">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-brand-mint" strokeWidth={2.5} />
                </div>
                <p className="text-sm sm:text-[15px] font-medium text-brand-ink leading-snug" data-testid={`text-checklist-${index}`}>
                  {item}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
