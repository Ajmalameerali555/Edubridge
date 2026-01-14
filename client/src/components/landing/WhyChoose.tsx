import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ShieldCheck, User, Calendar, Video, CreditCard, Monitor } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import studentsImage from "@assets/IMG_7559_1768386171250.jpeg";

const features = [
  {
    icon: User,
    title: "EXPERT AND VERIFIED TUTORS",
    description: "Our educators are meticulously vetted and matched carefully to your child's specific needs.",
  },
  {
    icon: ShieldCheck,
    title: "PERSONALIZED LEARNING APPROACH",
    description: "Bespoke educational plans that adapt to your child's unique learning pace and style.",
  },
  {
    icon: Calendar,
    title: "FLEXIBLE SCHEDULING",
    description: "Learning that fits your life. Easily schedule and manage sessions at your convenience.",
  },
  {
    icon: Video,
    title: "SAFE & MONITORED ONLINE CLASSES",
    description: "Every session is recorded and monitored in our secure digital environment for peace of mind.",
  },
  {
    icon: CreditCard,
    title: "AFFORDABLE, TRANSPARENT PRICING",
    description: "Premium education shouldn't be a mystery. Clear plans with no hidden fees or long contracts.",
  },
  {
    icon: Monitor,
    title: "EASY-TO-USE LEARNING PLATFORM",
    description: "A world-class digital hub designed to make online learning intuitive, fun, and effective.",
  },
];

export function WhyChoose() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
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

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: prefersReducedMotion ? 0.2 : 0.4, delay: prefersReducedMotion ? 0 : index * 0.06 }}
                  className="bg-brand-bg rounded-[24px] p-6 sm:p-7"
                  data-testid={`card-feature-${index}`}
                >
                  <div className="w-11 h-11 rounded-xl bg-brand-blue/[0.08] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-brand-blue" strokeWidth={1.8} />
                  </div>
                  <h3 className="text-sm font-bold text-brand-ink tracking-tight mb-2" data-testid={`text-feature-title-${index}`}>
                    {feature.title}
                  </h3>
                  <p className="text-[13px] text-brand-muted leading-relaxed" data-testid={`text-feature-desc-${index}`}>
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.5, delay: 0.3 }}
            className="lg:col-span-4 hidden lg:block"
          >
            <div className="rounded-[24px] overflow-hidden shadow-lg">
              <img 
                src={studentsImage}
                alt="Students learning together"
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
