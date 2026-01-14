import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ShieldCheck, User, Calendar, Video, CreditCard, Monitor } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const features = [
  {
    icon: User,
    title: "EXPERT AND VERIFIED TUTORS",
    description: "Our educators are meticulously vetted and matched carefully to your child's specific needs.",
    color: "blue",
  },
  {
    icon: ShieldCheck,
    title: "PERSONALIZED LEARNING APPROACH",
    description: "Bespoke educational plans that adapt to your child's unique learning pace and style.",
    color: "mint",
  },
  {
    icon: Calendar,
    title: "FLEXIBLE SCHEDULING",
    description: "Learning that fits your life. Easily schedule and manage sessions at your convenience.",
    color: "yellow",
  },
  {
    icon: Video,
    title: "SAFE & MONITORED ONLINE CLASSES",
    description: "Every session is recorded and monitored in our secure digital environment for peace of mind.",
    color: "pink",
  },
  {
    icon: CreditCard,
    title: "AFFORDABLE, TRANSPARENT PRICING",
    description: "Premium education shouldn't be a mystery. Clear plans with no hidden fees or long contracts.",
    color: "blue",
  },
  {
    icon: Monitor,
    title: "EASY-TO-USE LEARNING PLATFORM",
    description: "A world-class digital hub designed to make online learning intuitive, fun, and effective.",
    color: "mint",
  },
];

const colorClasses: Record<string, { bg: string; icon: string }> = {
  blue: { bg: "bg-brand-blue/[0.08]", icon: "text-brand-blue" },
  mint: { bg: "bg-brand-mint/[0.08]", icon: "text-brand-mint" },
  yellow: { bg: "bg-brand-yellow/[0.08]", icon: "text-brand-yellow" },
  pink: { bg: "bg-brand-pink/[0.08]", icon: "text-brand-pink" },
};

export function WhyChoose() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-brand-bg relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-brand-blue/[0.02] blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-brand-mint/[0.02] blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.5 }}
          className="text-center mb-14 sm:mb-18 lg:mb-20"
        >
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand-muted uppercase mb-4" data-testid="text-why-choose-kicker">
            THE EDUBRIDGE ADVANTAGE
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-brand-ink tracking-tight leading-tight" data-testid="text-why-choose-headline">
            WHY CHOOSE EDUBRIDGE LEARNING?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
          {features.map((feature, index) => {
            const colors = colorClasses[feature.color];
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: prefersReducedMotion ? 0.2 : 0.45, delay: prefersReducedMotion ? 0 : index * 0.08 }}
                className="group bg-white rounded-[28px] p-7 sm:p-8 border border-[rgba(15,23,42,0.05)] shadow-sm hover:shadow-lg hover:shadow-brand-ink/[0.04] transition-all duration-300"
                data-testid={`card-feature-${index}`}
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${colors.bg} flex items-center justify-center mb-5 sm:mb-6`}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.icon}`} strokeWidth={1.8} />
                </div>
                <h3 className="text-sm sm:text-[15px] font-extrabold text-brand-ink tracking-tight mb-3" data-testid={`text-feature-title-${index}`}>
                  {feature.title}
                </h3>
                <p className="text-[13px] sm:text-sm text-brand-muted leading-relaxed" data-testid={`text-feature-desc-${index}`}>
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
