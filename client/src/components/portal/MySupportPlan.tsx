import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Heart,
} from "lucide-react";

interface MySupportPlanProps {
  isOpen: boolean;
  onClose: () => void;
  studentId?: string;
  supportPlan?: {
    strengths: string[];
    blockers: { name: string; explanation: string }[];
    weeklyActions: string[];
    todayRule: { title: string; description: string };
  };
}

const defaultSupportPlan = {
  strengths: ["Creative thinker", "Great with visuals", "Kind to others"],
  blockers: [
    { name: "Focus gaps", explanation: "Sometimes it's hard to stay on one task for a long time" },
    { name: "Math anxiety", explanation: "Numbers can feel overwhelming, but we're working on it together" },
  ],
  weeklyActions: [
    "Practice 10 minutes of focused reading each day",
    "Use the number line tool for math problems",
  ],
  todayRule: {
    title: "Take micro steps",
    description: "Break big tasks into tiny pieces. One small step at a time leads to big success!",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export function MySupportPlan({
  isOpen,
  onClose,
  studentId,
  supportPlan = defaultSupportPlan,
}: MySupportPlanProps) {
  const { strengths, blockers, weeklyActions, todayRule } = supportPlan;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md md:max-w-lg p-0 flex flex-col"
        data-testid="support-plan-drawer"
      >
        <SheetHeader className="p-6 pb-4 border-b bg-gradient-to-r from-primary/5 to-purple-500/5">
          <SheetTitle
            className="flex items-center gap-2 text-xl"
            data-testid="support-plan-title"
          >
            <Heart className="w-5 h-5 text-pink-500" />
            My Support Plan
          </SheetTitle>
          <SheetDescription data-testid="support-plan-description">
            Your personalized learning journey and how we support you every step of the way.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key="support-content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6 py-6"
            >
              <motion.section variants={itemVariants} data-testid="section-strengths">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="font-semibold text-base">What I'm great at</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {strengths.map((strength, index) => (
                    <motion.div
                      key={strength}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <Badge
                        variant="secondary"
                        className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                        data-testid={`strength-badge-${index}`}
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        {strength}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              <motion.section variants={itemVariants} data-testid="section-blockers">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-base">What is blocking me</h3>
                </div>
                <div className="space-y-3">
                  {blockers.map((blocker, index) => (
                    <motion.div
                      key={blocker.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.15 }}
                    >
                      <Card
                        className="border-orange-200 dark:border-orange-800/50 bg-orange-50/50 dark:bg-orange-900/10"
                        data-testid={`blocker-card-${index}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                            <div>
                              <p className="font-medium text-sm text-orange-900 dark:text-orange-200">
                                {blocker.name}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {blocker.explanation}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              <motion.section variants={itemVariants} data-testid="section-weekly-actions">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-base">How we fix it this week</h3>
                </div>
                <div className="space-y-3">
                  {weeklyActions.slice(0, 2).map((action, index) => (
                    <motion.div
                      key={action}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.15 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-green-50/50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/50"
                      data-testid={`action-item-${index}`}
                    >
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0 text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-sm text-green-900 dark:text-green-200 leading-relaxed">
                        {action}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              <motion.section variants={itemVariants} data-testid="section-today-rule">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-base">Today's rule</h3>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card
                    className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-800/50"
                    data-testid="today-rule-card"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-5 h-5 text-purple-500" />
                        <span className="font-semibold text-purple-900 dark:text-purple-200">
                          {todayRule.title}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {todayRule.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.section>
            </motion.div>
          </AnimatePresence>
        </ScrollArea>

        <div className="p-6 border-t bg-muted/30">
          <p className="text-xs text-center text-muted-foreground">
            Remember: Every small step counts. You're doing amazing!
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface SupportPlanTriggerProps {
  onClick: () => void;
  className?: string;
}

export function SupportPlanTrigger({ onClick, className }: SupportPlanTriggerProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={`
        bg-gradient-to-r from-purple-50 to-pink-50 
        dark:from-purple-900/20 dark:to-pink-900/20
        border-purple-200 dark:border-purple-800/50
        text-purple-700 dark:text-purple-300
        hover:from-purple-100 hover:to-pink-100
        dark:hover:from-purple-900/30 dark:hover:to-pink-900/30
        transition-all duration-200
        ${className || ""}
      `}
      data-testid="button-open-support-plan"
    >
      <Heart className="w-4 h-4 mr-2 text-pink-500" />
      My Support Plan
    </Button>
  );
}

export function useSupportPlan() {
  const [isOpen, setIsOpen] = useState(false);

  const openSupportPlan = () => setIsOpen(true);
  const closeSupportPlan = () => setIsOpen(false);

  return {
    isOpen,
    openSupportPlan,
    closeSupportPlan,
  };
}
