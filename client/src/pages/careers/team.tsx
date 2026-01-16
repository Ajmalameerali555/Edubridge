import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Footer } from "@/components/landing/Footer";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Rocket, Heart, Lightbulb, Users } from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  role: string;
  message: string;
}

const values = [
  {
    icon: Heart,
    title: "Student-First",
    description: "Every decision we make prioritizes student success and wellbeing",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We constantly push boundaries to improve learning outcomes",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "We work together across teams to achieve our shared mission",
  },
  {
    icon: Rocket,
    title: "Growth",
    description: "We invest in our people and celebrate continuous learning",
  },
];

export default function TeamCareers() {
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();

  const onSubmit = (data: ContactFormData) => {
    console.log("Application submitted:", data);
    toast({
      title: "Application Received!",
      description: "We'll review your application and get back to you soon.",
    });
    reset();
  };

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
            <Link
              href="/careers"
              className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white border-2 border-brand-navy text-brand-navy font-semibold text-sm sm:text-base hover:bg-brand-navy/5 transition-colors"
              data-testid="link-all-careers"
            >
              All Careers
            </Link>
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
                data-testid="text-team-kicker"
              >
                JOIN THE EDUBRIDGE TEAM
              </motion.p>
              <motion.h1
                variants={itemVariants}
                className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-ink leading-tight tracking-tight mb-6"
                data-testid="text-team-headline"
              >
                HELP US SHAPE THE{" "}
                <span className="text-brand-navy">FUTURE</span>
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg text-brand-muted max-w-2xl mx-auto"
                data-testid="text-team-description"
              >
                We're building the next generation of online education. Join our team of passionate 
                individuals working to make quality education accessible to everyone.
              </motion.p>
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
                data-testid="text-values-headline"
              >
                Our Values
              </h2>
              <p className="text-brand-muted text-sm sm:text-base max-w-xl mx-auto">
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 text-center"
                  data-testid={`card-value-${value.title.toLowerCase().replace(' ', '-')}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-navy/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-brand-navy" />
                  </div>
                  <h3 className="font-bold text-brand-ink mb-2">{value.title}</h3>
                  <p className="text-brand-muted text-sm leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <h2
                className="text-2xl sm:text-3xl font-bold text-brand-ink mb-4"
                data-testid="text-contact-headline"
              >
                Get in Touch
              </h2>
              <p className="text-brand-muted text-sm sm:text-base max-w-xl mx-auto">
                We're always looking for talented individuals. Tell us about yourself 
                and how you'd like to contribute.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-white">
                <CardContent className="p-6 sm:p-8">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-brand-ink font-medium">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        {...register("name", { required: "Name is required" })}
                        className="rounded-lg border-brand-ink/10 focus:border-brand-blue"
                        data-testid="input-name"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-brand-ink font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        {...register("email", { 
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                          }
                        })}
                        className="rounded-lg border-brand-ink/10 focus:border-brand-blue"
                        data-testid="input-email"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-brand-ink font-medium">
                        Role You're Interested In
                      </Label>
                      <Input
                        id="role"
                        placeholder="e.g., Software Engineer, Product Manager, Designer"
                        {...register("role", { required: "Role is required" })}
                        className="rounded-lg border-brand-ink/10 focus:border-brand-blue"
                        data-testid="input-role"
                      />
                      {errors.role && (
                        <p className="text-sm text-red-500">{errors.role.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-brand-ink font-medium">
                        Tell Us About Yourself
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Share your experience, skills, and why you want to join EduBridge..."
                        rows={5}
                        {...register("message", { required: "Message is required" })}
                        className="rounded-lg border-brand-ink/10 focus:border-brand-blue resize-none"
                        data-testid="input-message"
                      />
                      {errors.message && (
                        <p className="text-sm text-red-500">{errors.message.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full py-4 rounded-full bg-brand-navy text-white font-bold text-base shadow-lg shadow-brand-navy/20 transition-all hover:shadow-xl hover:shadow-brand-navy/25"
                      data-testid="button-submit-application"
                    >
                      Submit Application
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
