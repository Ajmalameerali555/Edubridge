import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Share2, ArrowRight, Sparkles, Trophy, PartyPopper } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SuccessCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  pointsEarned?: number;
  onContinue?: () => void;
  onShare?: () => void;
  showShareButton?: boolean;
}

function ConfettiParticle({ delay, x }: { delay: number; x: number }) {
  const colors = ["#34D399", "#FFC83D", "#FF4D6D", "#2F6BFF", "#A855F7"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  return (
    <motion.div
      initial={{ y: -20, x: x, opacity: 1, rotate: 0 }}
      animate={{
        y: 300,
        x: x + (Math.random() - 0.5) * 100,
        opacity: 0,
        rotate: Math.random() * 360,
      }}
      transition={{
        duration: 2 + Math.random(),
        delay: delay,
        ease: "easeOut",
      }}
      style={{
        position: "absolute",
        top: 0,
        left: "50%",
        width: 8,
        height: 8,
        backgroundColor: color,
        borderRadius: Math.random() > 0.5 ? "50%" : "2px",
      }}
    />
  );
}

function Confetti({ isActive }: { isActive: boolean }) {
  const [particles, setParticles] = useState<Array<{ id: number; delay: number; x: number }>>([]);

  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        delay: Math.random() * 0.5,
        x: (Math.random() - 0.5) * 200,
      }));
      setParticles(newParticles);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <ConfettiParticle key={particle.id} delay={particle.delay} x={particle.x} />
      ))}
    </div>
  );
}

function AnimatedPoints({ points }: { points: number }) {
  const [displayPoints, setDisplayPoints] = useState(0);

  useEffect(() => {
    let current = 0;
    const increment = Math.ceil(points / 20);
    const timer = setInterval(() => {
      current += increment;
      if (current >= points) {
        setDisplayPoints(points);
        clearInterval(timer);
      } else {
        setDisplayPoints(current);
      }
    }, 50);
    return () => clearInterval(timer);
  }, [points]);

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", damping: 12, delay: 0.3 }}
      className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-3"
      data-testid="success-points-display"
    >
      <Star className="h-5 w-5 text-white" />
      <span className="text-xl font-bold text-white" data-testid="success-points-value">
        +{displayPoints} points
      </span>
    </motion.div>
  );
}

export function SuccessCelebration({
  isOpen,
  onClose,
  title = "Amazing work!",
  message = "You're doing great! Keep up the fantastic effort.",
  pointsEarned,
  onContinue,
  onShare,
  showShareButton = false,
}: SuccessCelebrationProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-md overflow-hidden border-emerald-200 dark:border-emerald-800"
        data-testid="success-celebration-modal"
      >
        <Confetti isActive={isOpen} />
        
        <DialogHeader className="text-center relative">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12 }}
            className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500"
            data-testid="success-celebration-icon"
          >
            <Trophy className="h-10 w-10 text-white" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <DialogTitle className="text-2xl" data-testid="success-celebration-title">
              {title}
            </DialogTitle>
          </motion.div>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-6 text-center"
        >
          <p className="text-muted-foreground" data-testid="success-celebration-message">
            {message}
          </p>

          {pointsEarned !== undefined && pointsEarned > 0 && (
            <AnimatedPoints points={pointsEarned} />
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-3 text-emerald-700 dark:text-emerald-300"
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            <p className="text-sm font-medium" data-testid="success-celebration-encouragement">
              Keep going! You're on a roll!
            </p>
          </motion.div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center pt-2">
            <Button
              onClick={onContinue || onClose}
              className="gap-2"
              data-testid="success-celebration-continue-btn"
            >
              <ArrowRight className="h-4 w-4" />
              Keep Going
            </Button>
            
            {showShareButton && onShare && (
              <Button
                variant="outline"
                onClick={onShare}
                className="gap-2"
                data-testid="success-celebration-share-btn"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
