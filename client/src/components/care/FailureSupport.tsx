import { motion, AnimatePresence } from "framer-motion";
import { Heart, RefreshCw, HelpCircle, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FailureSupportProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  onAskForHelp: () => void;
  taskName?: string;
  customMessage?: string;
}

export function FailureSupport({
  isOpen,
  onClose,
  onRetry,
  onAskForHelp,
  taskName,
  customMessage,
}: FailureSupportProps) {
  const supportiveMessage = customMessage || "That's okay! Learning takes time.";
  const encouragement = "Every expert was once a beginner. You're making progress!";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-md border-amber-200 dark:border-amber-800"
        data-testid="failure-support-modal"
      >
        <DialogHeader className="text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 15, delay: 0.1 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50"
            data-testid="failure-support-icon"
          >
            <Heart className="h-8 w-8 text-amber-500" />
          </motion.div>

          <DialogTitle className="text-xl" data-testid="failure-support-title">
            {supportiveMessage}
          </DialogTitle>
          
          <DialogDescription asChild>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3 pt-2"
            >
              <p className="text-muted-foreground" data-testid="failure-support-encouragement">
                {encouragement}
              </p>
              
              {taskName && (
                <p className="text-sm text-muted-foreground">
                  Task: <span className="font-medium">{taskName}</span>
                </p>
              )}
            </motion.div>
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 space-y-3"
        >
          <div className="flex items-center gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 p-3 text-sm text-amber-800 dark:text-amber-200">
            <Sparkles className="h-4 w-4 shrink-0" />
            <p data-testid="failure-support-tip">
              Tip: Take a deep breath and try again when you're ready.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button
              onClick={onRetry}
              className="gap-2"
              data-testid="failure-support-retry-btn"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            
            <Button
              variant="outline"
              onClick={onAskForHelp}
              className="gap-2"
              data-testid="failure-support-help-btn"
            >
              <HelpCircle className="h-4 w-4" />
              Ask for Help
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
