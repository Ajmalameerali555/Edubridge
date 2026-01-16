import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, TrendingUp, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PointsDisplayProps {
  totalPoints: number;
  recentPoints?: number;
  streak?: number;
}

function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    const diff = value - startValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + diff * easeOut);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{displayValue.toLocaleString()}</span>;
}

export function PointsDisplay({
  totalPoints = 1250,
  recentPoints = 50,
  streak = 5,
}: PointsDisplayProps) {
  const [showRecent, setShowRecent] = useState(false);

  useEffect(() => {
    if (recentPoints > 0) {
      setShowRecent(true);
      const timer = setTimeout(() => setShowRecent(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [recentPoints]);

  return (
    <Card data-testid="card-points-display">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-md"
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 5,
              }}
              data-testid="icon-points-star"
            >
              <Star className="w-6 h-6 text-white fill-white" />
            </motion.div>
            <div className="relative">
              <motion.p
                className="text-3xl font-bold"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                data-testid="text-total-points"
              >
                <AnimatedCounter value={totalPoints} />
              </motion.p>
              <p className="text-sm text-muted-foreground">Total Points</p>

              <AnimatePresence>
                {showRecent && recentPoints > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: -20, scale: 1 }}
                    exit={{ opacity: 0, y: -40, scale: 0.8 }}
                    className="absolute -top-6 left-0"
                    data-testid="text-recent-points"
                  >
                    <Badge className="bg-green-500 text-white border-0 shadow-md">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +{recentPoints}
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {streak > 0 && (
            <motion.div
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-50 dark:bg-orange-950/30"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              data-testid="container-streak-mini"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              >
                <Flame className="w-5 h-5 text-orange-500" />
              </motion.div>
              <div className="text-center">
                <p className="text-lg font-bold text-orange-600 dark:text-orange-400" data-testid="text-streak-count">
                  {streak}
                </p>
                <p className="text-xs text-muted-foreground">day streak</p>
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
