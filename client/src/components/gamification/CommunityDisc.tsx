import { motion } from "framer-motion";
import { Link } from "wouter";
import { Gamepad2, Trophy, Target, Zap, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface CommunityDiscProps {
  points: number;
  leagueRank: string;
  xpCurrent: number;
  xpTarget: number;
  level: number;
}

export function CommunityDisc({
  points = 1250,
  leagueRank = "Silver",
  xpCurrent = 350,
  xpTarget = 500,
  level = 7,
}: CommunityDiscProps) {
  const xpProgress = Math.round((xpCurrent / xpTarget) * 100);

  const leagueColors: Record<string, string> = {
    Bronze: "from-amber-600 to-amber-800",
    Silver: "from-slate-400 to-slate-600",
    Gold: "from-yellow-400 to-yellow-600",
    Platinum: "from-cyan-400 to-cyan-600",
    Diamond: "from-purple-400 to-purple-600",
  };

  const leagueGradient = leagueColors[leagueRank] || leagueColors.Silver;

  return (
    <Card
      className="overflow-visible bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20"
      data-testid="card-community-disc"
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              className={`w-14 h-14 rounded-full bg-gradient-to-br ${leagueGradient} flex items-center justify-center shadow-lg`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              data-testid="icon-league-badge"
            >
              <Trophy className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <motion.p
                className="text-2xl font-bold"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                data-testid="text-points"
              >
                {points.toLocaleString()}
              </motion.p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className={`bg-gradient-to-r ${leagueGradient} text-white border-0`}
            data-testid="badge-league-rank"
          >
            {leagueRank} League
          </Badge>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Level {level} Progress</span>
            <span className="font-medium">
              {xpCurrent} / {xpTarget} XP
            </span>
          </div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{ transformOrigin: "left" }}
          >
            <Progress
              value={xpProgress}
              className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-primary/70"
              data-testid="progress-xp"
            />
          </motion.div>
          <p className="text-xs text-muted-foreground text-right">
            {xpTarget - xpCurrent} XP to Level {level + 1}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link href="/dashboard/sprint">
              <Button
                variant="default"
                className="w-full justify-between"
                data-testid="button-play-game"
              >
                <span className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4" />
                  3-min Game
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link href="/dashboard/sprint">
              <Button
                variant="outline"
                className="w-full justify-between"
                data-testid="button-weekly-challenge"
              >
                <span className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Challenge
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
