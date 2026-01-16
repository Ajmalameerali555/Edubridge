import { useMemo } from "react";
import { motion } from "framer-motion";
import { Flame, Calendar, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StreakCounterProps {
  streak: number;
  longestStreak?: number;
  lastActiveDate?: string;
}

function getEncouragementMessage(streak: number): string {
  if (streak === 0) return "Start your streak today!";
  if (streak === 1) return "Great start! Keep going!";
  if (streak < 5) return "You're building momentum!";
  if (streak < 10) return "Amazing progress!";
  if (streak < 20) return "You're on fire!";
  if (streak < 30) return "Incredible dedication!";
  if (streak < 50) return "Legendary streak!";
  return "Unstoppable!";
}

function getFlameColor(streak: number): string {
  if (streak === 0) return "text-gray-400";
  if (streak < 3) return "text-orange-400";
  if (streak < 7) return "text-orange-500";
  if (streak < 14) return "text-orange-600";
  if (streak < 30) return "text-red-500";
  return "text-red-600";
}

function getFlameScale(streak: number): number {
  if (streak === 0) return 1;
  if (streak < 7) return 1.1;
  if (streak < 14) return 1.2;
  if (streak < 30) return 1.3;
  return 1.4;
}

export function StreakCounter({
  streak = 5,
  longestStreak = 12,
  lastActiveDate,
}: StreakCounterProps) {
  const flameColor = useMemo(() => getFlameColor(streak), [streak]);
  const flameScale = useMemo(() => getFlameScale(streak), [streak]);
  const message = useMemo(() => getEncouragementMessage(streak), [streak]);

  const weekDays = useMemo(() => {
    const days = ["S", "M", "T", "W", "T", "F", "S"];
    const today = new Date().getDay();
    return days.map((day, index) => ({
      day,
      isActive: index <= today && streak > 0,
      isToday: index === today,
    }));
  }, [streak]);

  return (
    <Card data-testid="card-streak-counter">
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          <motion.div
            className="relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
          >
            <motion.div
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center",
                streak > 0
                  ? "bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-950/50 dark:to-red-950/50"
                  : "bg-muted"
              )}
              animate={
                streak > 0
                  ? {
                      boxShadow: [
                        "0 0 0 0 rgba(251, 146, 60, 0)",
                        "0 0 30px 15px rgba(251, 146, 60, 0.15)",
                        "0 0 0 0 rgba(251, 146, 60, 0)",
                      ],
                    }
                  : {}
              }
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              data-testid="container-flame"
            >
              <motion.div
                animate={
                  streak > 0
                    ? {
                        y: [0, -3, 0],
                        scale: [1, flameScale, 1],
                      }
                    : {}
                }
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Flame
                  className={cn("w-10 h-10", flameColor)}
                  style={{ filter: streak > 7 ? "drop-shadow(0 0 8px rgba(251, 146, 60, 0.5))" : undefined }}
                  data-testid="icon-flame"
                />
              </motion.div>
            </motion.div>

            {streak >= 7 && (
              <motion.div
                className="absolute -top-1 -right-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 15, -15, 0] }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Sparkles className="w-5 h-5 text-amber-400" />
              </motion.div>
            )}
          </motion.div>

          <div className="flex-1 space-y-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-4xl font-bold" data-testid="text-streak-days">
                {streak}
              </p>
              <p className="text-sm text-muted-foreground">
                {streak === 1 ? "day streak" : "day streak"}
              </p>
            </motion.div>

            <motion.p
              className={cn(
                "text-sm font-medium",
                streak > 0 ? "text-orange-600 dark:text-orange-400" : "text-muted-foreground"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              data-testid="text-encouragement"
            >
              {message}
            </motion.p>
          </div>
        </div>

        <motion.div
          className="mt-6 pt-4 border-t"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              This week
            </p>
            {longestStreak > 0 && (
              <p className="text-xs text-muted-foreground" data-testid="text-longest-streak">
                Best: {longestStreak} days
              </p>
            )}
          </div>

          <div className="flex justify-between gap-1" data-testid="container-week-days">
            {weekDays.map((day, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                    day.isActive
                      ? "bg-gradient-to-br from-orange-400 to-red-500 text-white"
                      : day.isToday
                      ? "bg-muted ring-2 ring-primary/30"
                      : "bg-muted text-muted-foreground"
                  )}
                  data-testid={`day-indicator-${index}`}
                >
                  {day.isActive ? (
                    <Flame className="w-4 h-4" />
                  ) : (
                    day.day
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
