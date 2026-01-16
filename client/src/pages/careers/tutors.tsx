import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Footer } from "@/components/landing/Footer";
import { FileText, CheckCircle, Shield, BookOpen, Sparkles, Clock, Heart, Scale } from "lucide-react";

const processSteps = [
  {
    step: 1,
    title: "Apply",
    description: "Submit your application with qualifications and teaching experience",
    icon: FileText,
  },
  {
    step: 2,
    title: "Skill Check",
    description: "Complete a brief assessment to demonstrate your teaching abilities",
    icon: CheckCircle,
  },
  {
    step: 3,
    title: "Verification",
    description: "Background check and credential verification for student safety",
    icon: Shield,
  },
  {
    step: 4,
    title: "Start Teaching",
    description: "Get matched with students and begin your tutoring journey",
    icon: BookOpen,
  },
];

const tutorStandards = [
  { label: "Clarity", icon: Sparkles, description: "Explain concepts simply" },
  { label: "Patience", icon: Clock, description: "Support at every pace" },
  { label: "Reliability", icon: Heart, description: "Consistent commitment" },
  { label: "Policy Compliance", icon: Scale, description: "Safety first approach" },
];

const faqItems = [
  {
    question: "What qualifications do I need to become a tutor?",
    answer: "We look for tutors with strong academic backgrounds, relevant teaching or tutoring experience, and excellent communication skills. A bachelor's degree is preferred but not always required if you can demonstrate subject expertise.",
  },
  {
    question: "How much can I earn as an EduBridge tutor?",
    answer: "Tutor compensation varies based on experience, subjects taught, and session frequency. Our tutors typically earn competitive rates with flexible scheduling. Top tutors can increase their rates as they build positive reviews.",
  },
  {
    question: "What subjects can I teach?",
    answer: "We offer tutoring across all core subjects including Mathematics, Science, English, and more for grades 1-10. You can apply to teach subjects where you have proven expertise and comfort level.",
  },
  {
    question: "How does scheduling work?",
    answer: "You set your own availability! Our platform allows you to specify when you're available for sessions, and students book within those time slots. You have full control over your schedule.",
  },
];

export default function TutorRecruitment() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-bg/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-brand-blue flex items-center justify-center shadow-lg shadow-brand-blue/20">
                <span className="text-white font-black text-lg">E</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-extrabold text-brand-ink tracking-tight leading-none">
                  EduBridge
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-brand-muted tracking-[0.2em] leading-none">
                  LEARNING
                </span>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/careers"
                className="hidden sm:block px-4 py-2.5 text-brand-ink font-medium text-sm hover:text-brand-blue transition-colors"
                data-testid="link-careers-nav"
              >
                All Careers
              </Link>
              <Link href="/careers/tutors/apply" data-testid="button-apply-nav">
                <Button className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-brand-blue text-white font-semibold text-sm sm:text-base shadow-lg shadow-brand-blue/25">
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <section className="pt-32 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <motion.p
                variants={itemVariants}
                className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand-muted uppercase mb-4"
                data-testid="text-tutor-kicker"
              >
                BECOME AN EDUBRIDGE TUTOR
              </motion.p>
              <motion.h1
                variants={itemVariants}
                className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-ink leading-tight tracking-tight mb-6"
                data-testid="text-tutor-headline"
              >
                INSPIRE THE NEXT{" "}
                <span className="text-brand-blue">GENERATION</span>
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg text-brand-muted max-w-2xl mx-auto mb-8"
                data-testid="text-tutor-description"
              >
                Join our community of passionate educators. Flexible hours, competitive pay, 
                and the satisfaction of helping students achieve their potential.
              </motion.p>
              <motion.div variants={itemVariants}>
                <Link href="/careers/tutors/apply" data-testid="button-hero-apply">
                  <Button className="px-8 sm:px-10 py-4 rounded-full bg-brand-blue text-white font-bold text-sm sm:text-base shadow-lg shadow-brand-blue/20 transition-all hover:shadow-xl hover:shadow-brand-blue/25">
                    APPLY NOW
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-brand-card">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2
                className="text-2xl sm:text-3xl font-bold text-brand-ink mb-4"
                data-testid="text-process-headline"
              >
                How It Works
              </h2>
              <p className="text-brand-muted text-sm sm:text-base max-w-xl mx-auto">
                Our simple 4-step process gets you teaching in no time
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative bg-white rounded-2xl p-6 text-center"
                  data-testid={`card-step-${item.step}`}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="w-8 h-8 rounded-full bg-brand-blue text-white font-bold text-sm flex items-center justify-center shadow-md">
                      {item.step}
                    </div>
                  </div>
                  <div className="mt-4 mb-4">
                    <item.icon className="w-8 h-8 mx-auto text-brand-blue/70" />
                  </div>
                  <h3 className="font-bold text-brand-ink mb-2">{item.title}</h3>
                  <p className="text-brand-muted text-sm leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <h2
                className="text-2xl sm:text-3xl font-bold text-brand-ink mb-4"
                data-testid="text-standards-headline"
              >
                Tutor Standards
              </h2>
              <p className="text-brand-muted text-sm sm:text-base max-w-xl mx-auto">
                What we look for in every EduBridge tutor
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-wrap justify-center gap-3 sm:gap-4"
            >
              {tutorStandards.map((standard) => (
                <Badge
                  key={standard.label}
                  variant="secondary"
                  className="px-4 py-2.5 rounded-full text-sm font-medium bg-brand-blue/5 text-brand-ink border-brand-blue/10 flex items-center gap-2"
                  data-testid={`badge-standard-${standard.label.toLowerCase().replace(' ', '-')}`}
                >
                  <standard.icon className="w-4 h-4 text-brand-blue" />
                  {standard.label}
                </Badge>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-brand-card">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <h2
                className="text-2xl sm:text-3xl font-bold text-brand-ink mb-4"
                data-testid="text-faq-headline"
              >
                Frequently Asked Questions
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Accordion type="single" collapsible className="space-y-3">
                {faqItems.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-white rounded-xl border-0 px-6 shadow-sm"
                    data-testid={`accordion-faq-${index}`}
                  >
                    <AccordionTrigger
                      className="text-left font-semibold text-brand-ink hover:no-underline py-5"
                      data-testid={`accordion-trigger-${index}`}
                    >
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-brand-muted text-sm leading-relaxed pb-5">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>

        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2
                className="text-2xl sm:text-3xl font-bold text-brand-ink mb-4"
                data-testid="text-cta-headline"
              >
                Ready to Make a Difference?
              </h2>
              <p className="text-brand-muted text-sm sm:text-base mb-8 max-w-xl mx-auto">
                Join hundreds of tutors who are already helping students succeed with EduBridge.
              </p>
              <Link href="/careers/tutors/apply" data-testid="button-cta-apply">
                <Button className="px-8 sm:px-10 py-4 rounded-full bg-brand-blue text-white font-bold text-sm sm:text-base shadow-lg shadow-brand-blue/20 transition-all hover:shadow-xl hover:shadow-brand-blue/25">
                  START YOUR APPLICATION
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/90 backdrop-blur-md border-t border-brand-ink/5 sm:hidden">
        <Link href="/careers/tutors/apply" data-testid="button-sticky-apply">
          <Button className="w-full py-4 rounded-full bg-brand-blue text-white font-bold text-base shadow-lg shadow-brand-blue/25">
            Apply Now
          </Button>
        </Link>
      </div>

      <div className="pb-20 sm:pb-0">
        <Footer />
      </div>
    </div>
  );
}
