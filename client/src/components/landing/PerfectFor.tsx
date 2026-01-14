import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import studentImage from "@assets/student-image-1.jpeg";
import studentImage4 from "@assets/student-image-4.jpeg";

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
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-brand-pink/[0.03] blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[350px] h-[350px] rounded-full bg-brand-mint/[0.03] blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.5 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-[2px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-brand-pink lg:hidden" />
              <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand-muted uppercase" data-testid="text-perfectfor-kicker">
                TARGETED SUPPORT
              </p>
              <div className="h-[2px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-brand-pink lg:hidden" />
            </div>
            <div className="hidden lg:block h-[2px] w-12 bg-gradient-to-r from-brand-pink to-transparent mb-4" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-brand-ink tracking-tight leading-tight" data-testid="text-perfectfor-headline">
              WHO EDUBRIDGE LEARNING IS PERFECT FOR:
            </h2>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.6, delay: 0.3 }}
              className="mt-10 hidden lg:block relative"
            >
              <div className="absolute -inset-3 bg-gradient-to-br from-brand-pink/10 via-brand-mint/5 to-transparent rounded-[36px] blur-xl -z-10" />
              <div className="rounded-[28px] overflow-hidden shadow-xl shadow-brand-ink/[0.08] max-w-[320px]">
                <img 
                  src={studentImage}
                  alt="Student learning"
                  className="w-full h-auto object-cover aspect-square"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -bottom-4 -right-4 w-28 h-28 rounded-2xl overflow-hidden shadow-xl border-4 border-white"
              >
                <img 
                  src={studentImage4}
                  alt="Happy student"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </motion.div>
          </motion.div>

          <div className="space-y-4">
            {checklistItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 24 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: prefersReducedMotion ? 0.2 : 0.45, delay: prefersReducedMotion ? 0 : index * 0.08 }}
                className="group bg-white rounded-[28px] sm:rounded-[32px] px-5 sm:px-7 py-5 sm:py-6 border border-[rgba(15,23,42,0.05)] shadow-sm hover:shadow-lg hover:shadow-brand-ink/[0.04] hover:border-brand-mint/20 transition-all duration-300 flex items-center gap-4"
                data-testid={`checklist-item-${index}`}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-mint/[0.08] flex items-center justify-center flex-shrink-0 group-hover:bg-brand-mint/[0.15] group-hover:scale-105 transition-all duration-300">
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
