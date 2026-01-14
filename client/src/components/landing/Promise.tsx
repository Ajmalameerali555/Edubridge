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

const colorClasses: Record<string, { bg: string; icon: string; accent: string; glow: string }> = {
  mint: { bg: "bg-brand-mint/[0.08]", icon: "text-brand-mint", accent: "from-brand-mint/10", glow: "bg-brand-mint/20" },
  blue: { bg: "bg-brand-blue/[0.08]", icon: "text-brand-blue", accent: "from-brand-blue/10", glow: "bg-brand-blue/20" },
  pink: { bg: "bg-brand-pink/[0.08]", icon: "text-brand-pink", accent: "from-brand-pink/10", glow: "bg-brand-pink/20" },
};

export function Promise() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-brand-card/50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={prefersReducedMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-brand-mint/[0.06] blur-3xl"
        />
        <motion.div
          animate={prefersReducedMotion ? {} : { scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 -right-20 w-72 h-72 rounded-full bg-brand-blue/[0.06] blur-3xl"
        />

        <svg className="absolute top-10 right-[15%] w-16 h-16 text-brand-yellow/10" viewBox="0 0 100 100" fill="currentColor">
          <polygon points="50,5 61,40 98,40 68,62 79,97 50,75 21,97 32,62 2,40 39,40" />
        </svg>

        <motion.div
          animate={prefersReducedMotion ? {} : { rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-[10%] w-12 h-12"
        >
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-pink/15">
            <rect x="15" y="15" width="70" height="70" rx="10" />
          </svg>
        </motion.div>

        <svg className="absolute top-1/2 left-[5%] w-20 h-20 text-brand-blue/8" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="20" cy="20" r="2.5" />
          <circle cx="40" cy="20" r="2.5" />
          <circle cx="60" cy="20" r="2.5" />
          <circle cx="20" cy="40" r="2.5" />
          <circle cx="40" cy="40" r="2.5" />
          <circle cx="60" cy="40" r="2.5" />
          <circle cx="20" cy="60" r="2.5" />
          <circle cx="40" cy="60" r="2.5" />
          <circle cx="60" cy="60" r="2.5" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24, filter: prefersReducedMotion ? "blur(0px)" : "blur(6px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
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
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 32, filter: prefersReducedMotion ? "blur(0px)" : "blur(6px)" }}
                animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                transition={{ duration: prefersReducedMotion ? 0.2 : 0.45, delay: prefersReducedMotion ? 0 : index * 0.1 }}
                className="group relative bg-white rounded-[32px] p-7 sm:p-8 border border-[rgba(15,23,42,0.05)] shadow-sm hover:shadow-lg hover:shadow-brand-ink/[0.04] transition-all duration-300 text-center overflow-hidden"
                data-testid={`promise-card-${index}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-b ${colors.accent} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <motion.div
                  animate={prefersReducedMotion ? {} : { scale: [1, 1.5, 1], opacity: [0, 0.3, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full ${colors.glow} blur-2xl`}
                />
                <div className="relative">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${colors.bg} flex items-center justify-center mx-auto mb-6 transition-transform duration-300 group-hover:scale-105`}>
                    <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${colors.icon}`} strokeWidth={1.8} />
                  </div>
                  <h3 className="text-sm sm:text-[15px] font-extrabold text-brand-ink tracking-tight mb-3" data-testid={`text-promise-title-${index}`}>
                    {promise.title}
                  </h3>
                  <p className="text-[13px] sm:text-sm text-brand-muted leading-relaxed" data-testid={`text-promise-desc-${index}`}>
                    {promise.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
