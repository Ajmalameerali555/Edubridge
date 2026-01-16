import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Users,
  Sparkles,
  Clock,
  Coffee,
  Sun,
  Moon,
  Star,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type CarePromptType = 
  | "support" 
  | "encouragement" 
  | "reminder" 
  | "break" 
  | "greeting"
  | "community";

interface CarePromptProps {
  type: CarePromptType;
  message: string;
  isVisible: boolean;
  onDismiss?: () => void;
  className?: string;
}

const promptConfig: Record<CarePromptType, {
  icon: typeof Heart;
  bgClass: string;
  iconBgClass: string;
  iconColor: string;
}> = {
  support: {
    icon: Heart,
    bgClass: "bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border-rose-200 dark:border-rose-800",
    iconBgClass: "bg-rose-100 dark:bg-rose-900/50",
    iconColor: "text-rose-500",
  },
  encouragement: {
    icon: Sparkles,
    bgClass: "bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border-violet-200 dark:border-violet-800",
    iconBgClass: "bg-violet-100 dark:bg-violet-900/50",
    iconColor: "text-violet-500",
  },
  reminder: {
    icon: Clock,
    bgClass: "bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-sky-950/30 border-blue-200 dark:border-blue-800",
    iconBgClass: "bg-blue-100 dark:bg-blue-900/50",
    iconColor: "text-blue-500",
  },
  break: {
    icon: Coffee,
    bgClass: "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800",
    iconBgClass: "bg-amber-100 dark:bg-amber-900/50",
    iconColor: "text-amber-500",
  },
  greeting: {
    icon: Sun,
    bgClass: "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border-yellow-200 dark:border-yellow-800",
    iconBgClass: "bg-yellow-100 dark:bg-yellow-900/50",
    iconColor: "text-yellow-500",
  },
  community: {
    icon: Users,
    bgClass: "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800",
    iconBgClass: "bg-emerald-100 dark:bg-emerald-900/50",
    iconColor: "text-emerald-500",
  },
};

export function CarePrompt({
  type,
  message,
  isVisible,
  onDismiss,
  className,
}: CarePromptProps) {
  const config = promptConfig[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={cn(
            "rounded-lg border p-3 cursor-pointer",
            config.bgClass,
            className
          )}
          onClick={onDismiss}
          data-testid={`care-prompt-${type}`}
        >
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", damping: 15 }}
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                config.iconBgClass
              )}
              data-testid={`care-prompt-icon-${type}`}
            >
              <Icon className={cn("h-4 w-4", config.iconColor)} />
            </motion.div>
            <p className="text-sm text-foreground" data-testid={`care-prompt-message-${type}`}>
              {message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface CarePromptsContainerProps {
  prompts: Array<{
    id: string;
    type: CarePromptType;
    message: string;
  }>;
  onDismiss?: (id: string) => void;
  className?: string;
}

export function CarePromptsContainer({
  prompts,
  onDismiss,
  className,
}: CarePromptsContainerProps) {
  return (
    <div className={cn("space-y-2", className)} data-testid="care-prompts-container">
      {prompts.map((prompt) => (
        <CarePrompt
          key={prompt.id}
          type={prompt.type}
          message={prompt.message}
          isVisible={true}
          onDismiss={() => onDismiss?.(prompt.id)}
        />
      ))}
    </div>
  );
}

const defaultMessages: Record<CarePromptType, string[]> = {
  support: [
    "You're not alone in this journey.",
    "We believe in you.",
    "It's okay to take things one step at a time.",
    "Your effort matters more than perfection.",
  ],
  encouragement: [
    "You're making great progress!",
    "Every small step counts.",
    "You've got this!",
    "Your hard work is paying off.",
  ],
  reminder: [
    "Remember to take breaks when needed.",
    "Stay hydrated and keep going!",
    "Your next lesson is waiting for you.",
  ],
  break: [
    "Time for a quick stretch?",
    "A short break can boost your focus.",
    "Rest is part of learning too.",
  ],
  greeting: [
    "Welcome back! Ready to learn?",
    "Great to see you again!",
    "Let's make today count!",
  ],
  community: [
    "Thousands of learners are with you.",
    "You're part of an amazing community.",
    "We're all learning together.",
  ],
};

export function getRandomCareMessage(type: CarePromptType): string {
  const messages = defaultMessages[type];
  return messages[Math.floor(Math.random() * messages.length)];
}
