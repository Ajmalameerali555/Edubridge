import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import studentsImage from "@assets/IMG_7559_1768386171250.jpeg";

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
    <section ref={ref} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
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
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.5, delay: 0.2 }}
              className="mt-8 hidden lg:block"
            >
              <div className="rounded-[24px] overflow-hidden shadow-lg max-w-[360px]">
                <img 
                  src={studentsImage}
                  alt="Students learning together"
                  className="w-full h-auto object-cover"
                />
              </div>
            </motion.div>
          </motion.div>

          <div className="space-y-4">
            {checklistItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: prefersReducedMotion ? 0.2 : 0.4, delay: prefersReducedMotion ? 0 : index * 0.08 }}
                className="bg-brand-bg rounded-[24px] px-5 sm:px-6 py-5 flex items-center gap-4"
                data-testid={`checklist-item-${index}`}
              >
                <div className="w-9 h-9 rounded-lg bg-brand-mint/[0.12] flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-brand-mint" strokeWidth={2.5} />
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
