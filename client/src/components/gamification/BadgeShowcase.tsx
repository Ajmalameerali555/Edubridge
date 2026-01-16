import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Star,
  Zap,
  Brain,
  Target,
  BookOpen,
  Flame,
  Trophy,
  Sparkles,
  Lock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: keyof typeof iconMap;
  earned: boolean;
  earnedAt?: string;
  progress?: number;
  progressMax?: number;
}

const iconMap = {
  star: Star,
  zap: Zap,
  brain: Brain,
  target: Target,
  book: BookOpen,
  flame: Flame,
  trophy: Trophy,
  sparkles: Sparkles,
  award: Award,
};

const mockBadges: BadgeData[] = [
  { id: "1", name: "First Steps", description: "Complete your first lesson", icon: "star", earned: true, earnedAt: "2024-01-10" },
  { id: "2", name: "Speed Demon", description: "Finish 5 sprints in one day", icon: "zap", earned: true, earnedAt: "2024-01-12" },
  { id: "3", name: "Brain Power", description: "Score 100% on 3 quizzes", icon: "brain", earned: true, earnedAt: "2024-01-14" },
  { id: "4", name: "Sharpshooter", description: "Get 10 perfect scores", icon: "target", earned: false, progress: 7, progressMax: 10 },
  { id: "5", name: "Bookworm", description: "Complete 50 lessons", icon: "book", earned: false, progress: 32, progressMax: 50 },
  { id: "6", name: "On Fire", description: "Maintain a 30-day streak", icon: "flame", earned: false, progress: 12, progressMax: 30 },
];

interface BadgeShowcaseProps {
  badges?: BadgeData[];
  onBadgeClick?: (badge: BadgeData) => void;
}

function BadgeItem({
  badge,
  onClick,
  showUnlockAnimation,
}: {
  badge: BadgeData;
  onClick?: () => void;
  showUnlockAnimation?: boolean;
}) {
  const Icon = iconMap[badge.icon] || Award;
  const progress = badge.progress && badge.progressMax
    ? Math.round((badge.progress / badge.progressMax) * 100)
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative flex flex-col items-center p-4 rounded-xl cursor-pointer transition-colors",
        badge.earned
          ? "bg-gradient-to-br from-primary/10 to-primary/5"
          : "bg-muted/50"
      )}
      onClick={onClick}
      data-testid={`badge-item-${badge.id}`}
    >
      {showUnlockAnimation && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/30 via-amber-400/30 to-yellow-400/30"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.5, repeat: 2 }}
        />
      )}

      <motion.div
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center mb-2",
          badge.earned
            ? "bg-gradient-to-br from-primary to-primary/70"
            : "bg-muted"
        )}
        animate={
          badge.earned
            ? {
                boxShadow: [
                  "0 0 0 0 rgba(var(--primary), 0)",
                  "0 0 20px 10px rgba(var(--primary), 0.1)",
                  "0 0 0 0 rgba(var(--primary), 0)",
                ],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
        }}
      >
        {badge.earned ? (
          <Icon className="w-7 h-7 text-primary-foreground" />
        ) : (
          <Lock className="w-6 h-6 text-muted-foreground" />
        )}
      </motion.div>

      <p
        className={cn(
          "text-sm font-medium text-center mb-1",
          !badge.earned && "text-muted-foreground"
        )}
        data-testid={`text-badge-name-${badge.id}`}
      >
        {badge.name}
      </p>

      {badge.earned ? (
        <p className="text-xs text-muted-foreground">Earned</p>
      ) : badge.progress !== undefined && badge.progressMax ? (
        <div className="w-full space-y-1">
          <Progress value={progress} className="h-1.5" />
          <p className="text-xs text-muted-foreground text-center">
            {badge.progress}/{badge.progressMax}
          </p>
        </div>
      ) : null}
    </motion.div>
  );
}

export function BadgeShowcase({
  badges = mockBadges,
  onBadgeClick,
}: BadgeShowcaseProps) {
  const [selectedBadge, setSelectedBadge] = useState<BadgeData | null>(null);
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<string | null>(null);

  const earnedBadges = badges.filter((b) => b.earned);
  const inProgressBadges = badges.filter((b) => !b.earned);

  const handleBadgeClick = (badge: BadgeData) => {
    setSelectedBadge(badge);
    onBadgeClick?.(badge);
  };

  return (
    <Card data-testid="card-badge-showcase">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Award className="w-4 h-4 text-primary" />
          Your Badges
          <span className="ml-auto text-sm font-normal text-muted-foreground">
            {earnedBadges.length}/{badges.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {earnedBadges.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Earned
            </p>
            <div className="grid grid-cols-3 gap-3" data-testid="grid-earned-badges">
              {earnedBadges.map((badge) => (
                <BadgeItem
                  key={badge.id}
                  badge={badge}
                  onClick={() => handleBadgeClick(badge)}
                  showUnlockAnimation={recentlyUnlocked === badge.id}
                />
              ))}
            </div>
          </div>
        )}

        {inProgressBadges.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-muted-foreground" />
              In Progress
            </p>
            <div className="grid grid-cols-3 gap-3" data-testid="grid-progress-badges">
              {inProgressBadges.map((badge) => (
                <BadgeItem
                  key={badge.id}
                  badge={badge}
                  onClick={() => handleBadgeClick(badge)}
                />
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {selectedBadge && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-lg bg-muted/50 space-y-2"
              data-testid="container-badge-details"
            >
              <div className="flex items-center gap-2">
                {(() => {
                  const Icon = iconMap[selectedBadge.icon] || Award;
                  return <Icon className="w-5 h-5 text-primary" />;
                })()}
                <p className="font-medium">{selectedBadge.name}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedBadge.description}
              </p>
              {selectedBadge.earned && selectedBadge.earnedAt && (
                <p className="text-xs text-muted-foreground">
                  Earned on {new Date(selectedBadge.earnedAt).toLocaleDateString()}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
