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
    color: "mint",
  },
  {
    icon: TrendingUp,
    title: "PROGRESS, NOT PRESSURE.",
    description: "Every child learns at their own pace. We measure growth, not just grades.",
    color: "blue",
  },
  {
    icon: Lightbulb,
    title: "UNDERSTANDING, NOT COMPARISON.",
    description: "We celebrate individual breakthroughs and focus on deep conceptual clarity.",
    color: "pink",
  },
];

const colorClasses: Record<string, { bg: string; icon: string }> = {
  mint: { bg: "bg-brand-mint/[0.08]", icon: "text-brand-mint" },
  blue: { bg: "bg-brand-blue/[0.08]", icon: "text-brand-blue" },
  pink: { bg: "bg-brand-pink/[0.08]", icon: "text-brand-pink" },
};

export function Promise() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-brand-card/50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full bg-brand-mint/[0.03] blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-brand-blue/[0.03] blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.5 }}
          className="text-center mb-10 sm:mb-14 lg:mb-16"
        >
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
          {promises.map((promise, index) => {
            const colors = colorClasses[promise.color];
            const Icon = promise.icon;

            return (
              <motion.div
                key={promise.title}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: prefersReducedMotion ? 0.2 : 0.45, delay: prefersReducedMotion ? 0 : index * 0.1 }}
                className="group bg-white rounded-[28px] p-7 sm:p-8 border border-[rgba(15,23,42,0.05)] shadow-sm hover:shadow-lg hover:shadow-brand-ink/[0.04] transition-all duration-300 text-center"
                data-testid={`promise-card-${index}`}
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${colors.bg} flex items-center justify-center mx-auto mb-6 transition-transform duration-300 group-hover:scale-105`}>
                  <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${colors.icon}`} strokeWidth={1.8} />
                </div>
                <h3 className="text-sm sm:text-[15px] font-extrabold text-brand-ink tracking-tight mb-3" data-testid={`text-promise-title-${index}`}>
                  {promise.title}
                </h3>
                <p className="text-[13px] sm:text-sm text-brand-muted leading-relaxed" data-testid={`text-promise-desc-${index}`}>
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
