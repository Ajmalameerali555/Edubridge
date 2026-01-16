import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Zap, Brain, BookOpen, Lightbulb, Trophy, Star, 
  ArrowLeft, Calendar, Target, Flame
} from "lucide-react";
import SpeedMatch from "./SpeedMatch";
import MemoryLadder from "./MemoryLadder";
import WordBuilder from "./WordBuilder";
import LogicPaths from "./LogicPaths";

interface GamesHubProps {
  grade?: string;
  onPointsEarned?: (points: number, gameName: string) => void;
}

interface GameStats {
  totalPoints: number;
  gamesPlayed: number;
  bestAccuracy: number;
}

interface WeeklyChallenge {
  game: string;
  targetScore: number;
  currentScore: number;
  expiresAt: Date;
}

const GAMES = [
  {
    id: "speedmatch",
    name: "Speed Match",
    description: "Race against time to solve math problems",
    icon: Zap,
    color: "bg-yellow-500",
    skills: ["Quick thinking", "Math facts"],
  },
  {
    id: "memoryladder",
    name: "Memory Ladder",
    description: "Remember and repeat growing sequences",
    icon: Brain,
    color: "bg-purple-500",
    skills: ["Memory", "Focus"],
  },
  {
    id: "wordbuilder",
    name: "Word Builder",
    description: "Arrange letters to spell words correctly",
    icon: BookOpen,
    color: "bg-green-500",
    skills: ["Spelling", "Vocabulary"],
  },
  {
    id: "logicpaths",
    name: "Logic Paths",
    description: "Find patterns in numbers, shapes & colors",
    icon: Lightbulb,
    color: "bg-blue-500",
    skills: ["Pattern recognition", "Logic"],
  },
];

export default function GamesHub({ grade = "3", onPointsEarned }: GamesHubProps) {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [stats, setStats] = useState<GameStats>({
    totalPoints: 0,
    gamesPlayed: 0,
    bestAccuracy: 0,
  });
  const [weeklyChallenge] = useState<WeeklyChallenge | null>({
    game: "speedmatch",
    targetScore: 1000,
    currentScore: 450,
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  });
  const [recentResult, setRecentResult] = useState<{
    score: number;
    accuracy: number;
    game: string;
  } | null>(null);

  const handleGameComplete = useCallback((
    gameName: string,
    score: number,
    accuracy: number,
    duration: number
  ) => {
    setStats(prev => ({
      totalPoints: prev.totalPoints + score,
      gamesPlayed: prev.gamesPlayed + 1,
      bestAccuracy: Math.max(prev.bestAccuracy, accuracy),
    }));
    
    setRecentResult({ score, accuracy, game: gameName });
    
    if (onPointsEarned) {
      onPointsEarned(score, gameName);
    }
  }, [onPointsEarned]);

  const renderGame = () => {
    const commonProps = {
      grade,
      onComplete: (score: number, accuracy: number, duration: number) => {
        handleGameComplete(activeGame!, score, accuracy, duration);
      },
    };

    switch (activeGame) {
      case "speedmatch":
        return <SpeedMatch {...commonProps} />;
      case "memoryladder":
        return <MemoryLadder {...commonProps} />;
      case "wordbuilder":
        return <WordBuilder {...commonProps} />;
      case "logicpaths":
        return <LogicPaths {...commonProps} />;
      default:
        return null;
    }
  };

  if (activeGame) {
    return (
      <div className="space-y-4" data-testid="games-active-game">
        <Button
          data-testid="button-back-to-hub"
          variant="ghost"
          onClick={() => {
            setActiveGame(null);
            setRecentResult(null);
          }}
          className="mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Games
        </Button>
        
        {renderGame()}
      </div>
    );
  }

  const challengeProgress = weeklyChallenge 
    ? (weeklyChallenge.currentScore / weeklyChallenge.targetScore) * 100 
    : 0;

  const daysRemaining = weeklyChallenge 
    ? Math.ceil((weeklyChallenge.expiresAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
    : 0;

  return (
    <div className="space-y-6" data-testid="games-hub">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold" data-testid="text-hub-title">Learning Games</h2>
          <p className="text-muted-foreground">Play games to earn points and build skills</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="px-3 py-1.5">
            <Trophy className="w-4 h-4 mr-1" />
            <span data-testid="text-total-points">{stats.totalPoints} pts</span>
          </Badge>
          <Badge variant="outline" className="px-3 py-1.5">
            <Star className="w-4 h-4 mr-1" />
            <span data-testid="text-games-played">{stats.gamesPlayed} games</span>
          </Badge>
        </div>
      </div>

      <AnimatePresence>
        {recentResult && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-primary/5 border-primary/20" data-testid="card-recent-result">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Game Complete!</p>
                      <p className="text-sm text-muted-foreground">
                        {GAMES.find(g => g.id === recentResult.game)?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-primary">{recentResult.score}</div>
                      <div className="text-xs text-muted-foreground">Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-primary">{recentResult.accuracy}%</div>
                      <div className="text-xs text-muted-foreground">Accuracy</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {weeklyChallenge && (
        <Card data-testid="card-weekly-challenge" className="overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4">
            <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-primary" />
                <span className="font-semibold">Weekly Challenge</span>
              </div>
              <Badge variant="outline">
                <Calendar className="w-3 h-3 mr-1" />
                {daysRemaining} days left
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>
                  Score {weeklyChallenge.targetScore} in{" "}
                  {GAMES.find(g => g.id === weeklyChallenge.game)?.name}
                </span>
                <span className="font-medium" data-testid="text-challenge-progress">
                  {weeklyChallenge.currentScore} / {weeklyChallenge.targetScore}
                </span>
              </div>
              <Progress value={challengeProgress} className="h-2" />
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GAMES.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="hover-elevate cursor-pointer h-full"
              onClick={() => setActiveGame(game.id)}
              data-testid={`card-game-${game.id}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className={`w-12 h-12 rounded-lg ${game.color} flex items-center justify-center`}>
                    <game.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex gap-1">
                    {game.skills.map(skill => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <CardTitle className="text-lg mt-3">{game.name}</CardTitle>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  data-testid={`button-play-${game.id}`}
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveGame(game.id);
                  }}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Play Now
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {stats.gamesPlayed > 0 && (
        <Card data-testid="card-stats-summary">
          <CardHeader>
            <CardTitle className="text-lg">Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary" data-testid="text-stat-total-points">
                  {stats.totalPoints}
                </div>
                <div className="text-xs text-muted-foreground">Total Points</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary" data-testid="text-stat-games-played">
                  {stats.gamesPlayed}
                </div>
                <div className="text-xs text-muted-foreground">Games Played</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary" data-testid="text-stat-best-accuracy">
                  {stats.bestAccuracy}%
                </div>
                <div className="text-xs text-muted-foreground">Best Accuracy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
