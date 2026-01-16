import { motion } from "framer-motion";
import {
  Lightbulb,
  Check,
  X,
  AlertTriangle,
  Heart,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CareTip {
  id: string;
  text: string;
}

interface ParentCareTipsProps {
  weekNumber?: number;
  helpSteps: CareTip[];
  avoidItems: CareTip[];
  showWorryIndicator?: boolean;
  worryMessage?: string;
  className?: string;
}

export function ParentCareTips({
  weekNumber = 1,
  helpSteps,
  avoidItems,
  showWorryIndicator = false,
  worryMessage = "Please consider reaching out to a tutor for additional support.",
  className,
}: ParentCareTipsProps) {
  return (
    <Card className={cn("overflow-hidden", className)} data-testid="parent-care-tips">
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10"
          >
            <Lightbulb className="h-4 w-4 text-primary" />
          </motion.div>
          <span data-testid="parent-tips-title">How to Help This Week</span>
          <span className="ml-auto text-xs font-normal text-muted-foreground">
            Week {weekNumber}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <p className="text-sm font-medium flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <Check className="h-4 w-4" />
            Steps You Can Take
          </p>
          <ul className="space-y-2" data-testid="parent-tips-help-steps">
            {helpSteps.slice(0, 2).map((step, index) => (
              <motion.li
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.1 }}
                className="flex items-start gap-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-3"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                  {index + 1}
                </span>
                <p className="text-sm text-foreground" data-testid={`help-step-${step.id}`}>
                  {step.text}
                </p>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <p className="text-sm font-medium flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <Heart className="h-4 w-4" />
            Gentle Guidance
          </p>
          <ul className="space-y-2" data-testid="parent-tips-avoid-items">
            {avoidItems.map((item, index) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + index * 0.1 }}
                className="flex items-start gap-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 p-3"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
                  <X className="h-3 w-3 text-amber-700 dark:text-amber-300" />
                </span>
                <p className="text-sm text-foreground" data-testid={`avoid-item-${item.id}`}>
                  {item.text}
                </p>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {showWorryIndicator && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 p-4"
            data-testid="parent-tips-worry-indicator"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-rose-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-rose-700 dark:text-rose-400">
                  When to Seek Extra Help
                </p>
                <p className="text-sm text-rose-600 dark:text-rose-300" data-testid="worry-message">
                  {worryMessage}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="pt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground"
        >
          <Heart className="h-3 w-3 text-primary" />
          <span>Your support makes all the difference</span>
        </motion.div>
      </CardContent>
    </Card>
  );
}

export function ParentCareTipsPreview() {
  const sampleHelpSteps: CareTip[] = [
    { id: "1", text: "Celebrate small wins together — even finishing one lesson is an achievement!" },
    { id: "2", text: "Set a consistent study time that works for your child's energy levels." },
  ];

  const sampleAvoidItems: CareTip[] = [
    { id: "1", text: "Try not to compare their progress with other children — everyone learns differently." },
    { id: "2", text: "Avoid pressuring them if they need more time — patience is key." },
  ];

  return (
    <ParentCareTips
      weekNumber={3}
      helpSteps={sampleHelpSteps}
      avoidItems={sampleAvoidItems}
      showWorryIndicator={false}
    />
  );
}
