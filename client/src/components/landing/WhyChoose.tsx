import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ShieldCheck, User, Calendar, Video, CreditCard, Monitor } from "lucide-react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

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

const colorClasses: Record<string, { bg: string; icon: string; accent: string }> = {
  blue: { bg: "bg-brand-blue/[0.08]", icon: "text-brand-blue", accent: "bg-brand-blue" },
  mint: { bg: "bg-brand-mint/[0.08]", icon: "text-brand-mint", accent: "bg-brand-mint" },
  yellow: { bg: "bg-brand-yellow/[0.08]", icon: "text-brand-yellow", accent: "bg-brand-yellow" },
  pink: { bg: "bg-brand-pink/[0.08]", icon: "text-brand-pink", accent: "bg-brand-pink" },
};

export function WhyChoose() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-brand-bg relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={prefersReducedMotion ? {} : { rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-64 h-64"
        >
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5" className="w-full h-full text-brand-blue/10">
            <circle cx="50" cy="50" r="45" />
            <circle cx="50" cy="50" r="35" />
            <circle cx="50" cy="50" r="25" />
          </svg>
        </motion.div>
        
        <svg className="absolute bottom-20 left-10 w-28 h-28 text-brand-mint/8" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="10" cy="10" r="2.5" />
          <circle cx="25" cy="10" r="2.5" />
          <circle cx="40" cy="10" r="2.5" />
          <circle cx="55" cy="10" r="2.5" />
          <circle cx="10" cy="25" r="2.5" />
          <circle cx="25" cy="25" r="2.5" />
          <circle cx="40" cy="25" r="2.5" />
          <circle cx="55" cy="25" r="2.5" />
          <circle cx="10" cy="40" r="2.5" />
          <circle cx="25" cy="40" r="2.5" />
          <circle cx="40" cy="40" r="2.5" />
          <circle cx="55" cy="40" r="2.5" />
          <circle cx="10" cy="55" r="2.5" />
          <circle cx="25" cy="55" r="2.5" />
          <circle cx="40" cy="55" r="2.5" />
          <circle cx="55" cy="55" r="2.5" />
        </svg>

        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-[8%]"
        >
          <svg className="w-8 h-8 text-brand-yellow/20" viewBox="0 0 100 100" fill="currentColor">
            <polygon points="50,10 61,40 95,40 68,60 79,90 50,70 21,90 32,60 5,40 39,40" />
          </svg>
        </motion.div>

        <motion.div
          animate={prefersReducedMotion ? {} : { scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-[12%]"
        >
          <svg className="w-10 h-10 text-brand-pink/15" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M50 10 L90 90 L10 90 Z" />
          </svg>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24, filter: prefersReducedMotion ? "blur(0px)" : "blur(6px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
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
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 32, filter: prefersReducedMotion ? "blur(0px)" : "blur(6px)" }}
                animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                transition={{ duration: prefersReducedMotion ? 0.2 : 0.45, delay: prefersReducedMotion ? 0 : index * 0.08 }}
                className="group relative bg-white rounded-[32px] p-7 sm:p-8 border border-[rgba(15,23,42,0.05)] shadow-sm hover:shadow-lg hover:shadow-brand-ink/[0.04] transition-all duration-300"
                data-testid={`card-feature-${index}`}
              >
                <div className="absolute top-0 left-8 w-12 h-1 rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: `var(--${feature.color})` }} />
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
