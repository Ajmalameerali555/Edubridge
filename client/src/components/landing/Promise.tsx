import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Heart, TrendingUp, Lightbulb } from "lucide-react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

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
  mint: { bg: "bg-brand-mint/10", icon: "text-brand-mint" },
  blue: { bg: "bg-brand-blue/10", icon: "text-brand-blue" },
  pink: { bg: "bg-brand-pink/10", icon: "text-brand-pink" },
};

export function Promise() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="py-16 sm:py-24 px-4 bg-brand-bg">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30, filter: prefersReducedMotion ? "blur(0px)" : "blur(8px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-brand-muted mb-3" data-testid="text-promise-kicker">
            OUR COMMITMENT
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-brand-ink tracking-tight mb-4" data-testid="text-promise-headline">
            OUR PROMISE: SUPPORTIVE & CONFIDENCE-BUILDING
          </h2>
          <p className="text-sm sm:text-base text-brand-muted max-w-xl mx-auto" data-testid="text-promise-description">
            Learning should feel safe and encouraging. Never scary or stressful. We focus on:
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promises.map((promise, index) => {
            const colors = colorClasses[promise.color];
            const Icon = promise.icon;

            return (
              <motion.div
                key={promise.title}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 40, filter: prefersReducedMotion ? "blur(0px)" : "blur(8px)" }}
                animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                transition={{ duration: prefersReducedMotion ? 0.2 : 0.5, delay: prefersReducedMotion ? 0 : index * 0.1 }}
                className="bg-brand-card rounded-[28px] p-6 sm:p-8 border border-[rgba(15,23,42,0.06)] shadow-sm hover:shadow-md transition-shadow text-center"
                data-testid={`promise-card-${index}`}
              >
                <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center mx-auto mb-5`}>
                  <Icon className={`w-7 h-7 ${colors.icon}`} strokeWidth={2} />
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-brand-ink tracking-tight mb-3" data-testid={`text-promise-title-${index}`}>
                  {promise.title}
                </h3>
                <p className="text-sm text-brand-muted leading-relaxed" data-testid={`text-promise-desc-${index}`}>
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
