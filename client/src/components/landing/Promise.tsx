import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Heart, TrendingUp, Lightbulb } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const promises = [
  {
    icon: Heart,
    title: "ENCOURAGEMENT, NOT FEAR.",
    description: "We build confidence through positive reinforcement and constructive feedback.",
  },
  {
    icon: TrendingUp,
    title: "PROGRESS, NOT PRESSURE.",
    description: "Every child learns at their own pace. We measure growth, not just grades.",
  },
  {
    icon: Lightbulb,
    title: "UNDERSTANDING, NOT COMPARISON.",
    description: "We celebrate individual breakthroughs and focus on deep conceptual clarity.",
  },
];

export function Promise() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-brand-bg">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.5 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-block mb-6">
            <div className="h-1 w-12 bg-brand-blue rounded-full mx-auto mb-4" />
          </div>
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand-muted uppercase mb-4" data-testid="text-promise-kicker">
            OUR COMMITMENT
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-brand-ink tracking-tight leading-tight mb-5" data-testid="text-promise-headline">
            OUR PROMISE: SUPPORTIVE & CONFIDENCE-BUILDING
          </h2>
          <p className="text-[13px] sm:text-sm md:text-base text-brand-muted max-w-xl mx-auto leading-relaxed" data-testid="text-promise-description">
            Learning should feel safe and encouraging. Never scary or stressful. We focus on:
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {promises.map((promise, index) => {
            const Icon = promise.icon;
            return (
              <motion.div
                key={promise.title}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: prefersReducedMotion ? 0.2 : 0.4, delay: prefersReducedMotion ? 0 : index * 0.1 }}
                className="bg-white rounded-[24px] p-7 text-center shadow-sm"
                data-testid={`promise-card-${index}`}
              >
                <div className="w-14 h-14 rounded-xl bg-brand-blue/[0.08] flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-6 h-6 text-brand-blue" strokeWidth={1.8} />
                </div>
                <h3 className="text-sm font-bold text-brand-ink tracking-tight mb-3" data-testid={`text-promise-title-${index}`}>
                  {promise.title}
                </h3>
                <p className="text-[13px] text-brand-muted leading-relaxed" data-testid={`text-promise-desc-${index}`}>
                  {promise.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
