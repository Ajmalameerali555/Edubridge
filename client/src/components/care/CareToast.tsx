import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Sparkles,
  RefreshCw,
  Bell,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CareToastType = "success" | "failure" | "encouragement" | "reminder";

interface CareToastProps {
  type: CareToastType;
  title: string;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

const toastConfig: Record<CareToastType, { 
  icon: typeof Heart; 
  bgClass: string; 
  borderClass: string;
  iconColor: string;
}> = {
  success: {
    icon: Sparkles,
    bgClass: "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30",
    borderClass: "border-emerald-200 dark:border-emerald-800",
    iconColor: "text-emerald-500",
  },
  failure: {
    icon: Heart,
    bgClass: "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
    borderClass: "border-amber-200 dark:border-amber-800",
    iconColor: "text-amber-500",
  },
  encouragement: {
    icon: Sparkles,
    bgClass: "bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30",
    borderClass: "border-violet-200 dark:border-violet-800",
    iconColor: "text-violet-500",
  },
  reminder: {
    icon: Bell,
    bgClass: "bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-sky-950/30",
    borderClass: "border-blue-200 dark:border-blue-800",
    iconColor: "text-blue-500",
  },
};

export function CareToast({
  type,
  title,
  message,
  isVisible,
  onClose,
  actionLabel,
  onAction,
}: CareToastProps) {
  const config = toastConfig[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={cn(
            "fixed bottom-6 right-6 z-50 max-w-sm rounded-xl border p-4 shadow-lg",
            config.bgClass,
            config.borderClass
          )}
          data-testid="care-toast"
        >
          <div className="flex gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", damping: 15 }}
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                type === "success" && "bg-emerald-100 dark:bg-emerald-900/50",
                type === "failure" && "bg-amber-100 dark:bg-amber-900/50",
                type === "encouragement" && "bg-violet-100 dark:bg-violet-900/50",
                type === "reminder" && "bg-blue-100 dark:bg-blue-900/50"
              )}
              data-testid="care-toast-icon"
            >
              <Icon className={cn("h-5 w-5", config.iconColor)} />
            </motion.div>

            <div className="flex-1 space-y-1">
              <p className="font-medium text-foreground" data-testid="care-toast-title">
                {title}
              </p>
              <p className="text-sm text-muted-foreground" data-testid="care-toast-message">
                {message}
              </p>
              
              {actionLabel && onAction && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onAction}
                    className="mt-2 -ml-2"
                    data-testid="care-toast-action"
                  >
                    {actionLabel}
                  </Button>
                </motion.div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 shrink-0"
              data-testid="care-toast-close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
