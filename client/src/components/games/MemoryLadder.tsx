import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Trophy, Sparkles, RotateCcw } from "lucide-react";

interface MemoryLadderProps {
  grade: string;
  onComplete: (score: number, accuracy: number, duration: number) => void;
}

type GameItem = {
  id: number;
  color: string;
  label: string;
};

const COLORS: GameItem[] = [
  { id: 0, color: "bg-red-500", label: "Red" },
  { id: 1, color: "bg-blue-500", label: "Blue" },
  { id: 2, color: "bg-green-500", label: "Green" },
  { id: 3, color: "bg-yellow-500", label: "Yellow" },
  { id: 4, color: "bg-purple-500", label: "Purple" },
  { id: 5, color: "bg-orange-500", label: "Orange" },
  { id: 6, color: "bg-pink-500", label: "Pink" },
  { id: 7, color: "bg-cyan-500", label: "Cyan" },
];

function getDifficulty(grade: string): "easy" | "medium" | "hard" {
  const gradeNum = parseInt(grade.replace(/\D/g, "")) || 3;
  if (gradeNum <= 2) return "easy";
  if (gradeNum <= 5) return "medium";
  return "hard";
}

export default function MemoryLadder({ grade, onComplete }: MemoryLadderProps) {
  const difficulty = getDifficulty(grade);
  const startingLength = difficulty === "easy" ? 2 : difficulty === "medium" ? 3 : 4;
  const maxLevel = difficulty === "easy" ? 6 : difficulty === "medium" ? 8 : 10;
  const colorCount = difficulty === "easy" ? 4 : difficulty === "medium" ? 6 : 8;
  
  const [gameState, setGameState] = useState<"ready" | "showing" | "input" | "complete">("ready");
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [levelsCompleted, setLevelsCompleted] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const availableColors = COLORS.slice(0, colorCount);

  const generateSequence = useCallback((length: number) => {
    const seq: number[] = [];
    for (let i = 0; i < length; i++) {
      seq.push(Math.floor(Math.random() * colorCount));
    }
    return seq;
  }, [colorCount]);

  const startGame = useCallback(() => {
    const initialSequence = generateSequence(startingLength);
    setSequence(initialSequence);
    setPlayerSequence([]);
    setLevel(1);
    setScore(0);
    setLevelsCompleted(0);
    setAttempts(0);
    setStartTime(Date.now());
    setGameState("showing");
    setFeedback(null);
  }, [generateSequence, startingLength]);

  const showSequence = useCallback(async () => {
    for (let i = 0; i < sequence.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveItem(sequence[i]);
      await new Promise(resolve => setTimeout(resolve, 400));
      setActiveItem(null);
    }
    await new Promise(resolve => setTimeout(resolve, 300));
    setGameState("input");
  }, [sequence]);

  useEffect(() => {
    if (gameState === "showing") {
      showSequence();
    }
  }, [gameState, showSequence]);

  const handleItemClick = useCallback((itemId: number) => {
    if (gameState !== "input") return;
    
    setActiveItem(itemId);
    setTimeout(() => setActiveItem(null), 150);
    
    const newPlayerSequence = [...playerSequence, itemId];
    setPlayerSequence(newPlayerSequence);
    setAttempts(prev => prev + 1);
    
    const currentIndex = newPlayerSequence.length - 1;
    
    if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
      setFeedback("wrong");
      setTimeout(() => {
        setFeedback(null);
        if (level >= maxLevel || levelsCompleted >= maxLevel - 1) {
          const duration = Math.floor((Date.now() - startTime) / 1000);
          const accuracy = attempts > 0 ? Math.round((levelsCompleted * sequence.length) / attempts * 100) : 0;
          setShowCelebration(true);
          setTimeout(() => {
            setGameState("complete");
            onComplete(score, Math.min(accuracy, 100), duration);
          }, 2000);
        } else {
          const newSequence = generateSequence(startingLength + level - 1);
          setSequence(newSequence);
          setPlayerSequence([]);
          setGameState("showing");
        }
      }, 1000);
      return;
    }
    
    if (newPlayerSequence.length === sequence.length) {
      setFeedback("correct");
      const levelScore = sequence.length * 50 + level * 25;
      setScore(prev => prev + levelScore);
      setLevelsCompleted(prev => prev + 1);
      
      setTimeout(() => {
        setFeedback(null);
        if (level >= maxLevel) {
          const duration = Math.floor((Date.now() - startTime) / 1000);
          const accuracy = Math.round(((levelsCompleted + 1) * sequence.length) / (attempts + newPlayerSequence.length) * 100);
          setShowCelebration(true);
          setTimeout(() => {
            setGameState("complete");
            onComplete(score + levelScore, Math.min(accuracy, 100), duration);
          }, 2000);
        } else {
          const newSequence = [...sequence, Math.floor(Math.random() * colorCount)];
          setSequence(newSequence);
          setPlayerSequence([]);
          setLevel(prev => prev + 1);
          setGameState("showing");
        }
      }, 800);
    }
  }, [gameState, playerSequence, sequence, level, maxLevel, levelsCompleted, attempts, startTime, score, generateSequence, startingLength, colorCount, onComplete]);

  const getImprovementTip = () => {
    if (levelsCompleted >= maxLevel - 2) return "Amazing memory! You're a sequence master!";
    if (levelsCompleted >= maxLevel / 2) return "Great progress! Try grouping colors in your mind to remember longer sequences.";
    if (levelsCompleted >= 2) return "Good effort! Saying the colors out loud can help you remember them.";
    return "Keep practicing! Focus on the first few colors and add more as you improve.";
  };

  if (gameState === "ready") {
    return (
      <Card data-testid="memoryladder-ready" className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <CardTitle>Memory Ladder</CardTitle>
          <p className="text-muted-foreground">
            Watch the sequence, then repeat it!
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="outline">
              Starting: {startingLength} colors
            </Badge>
            <Badge variant="outline">
              Max: {maxLevel} levels
            </Badge>
          </div>
          <Button
            data-testid="button-start-memoryladder"
            onClick={startGame}
            className="w-full"
            size="lg"
          >
            <Brain className="w-4 h-4 mr-2" />
            Start Game
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === "complete") {
    const accuracy = attempts > 0 ? Math.round((levelsCompleted * (startingLength + levelsCompleted - 1)) / attempts * 100) : 0;
    return (
      <Card data-testid="memoryladder-complete" className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4"
          >
            <Trophy className="w-10 h-10 text-primary" />
          </motion.div>
          <CardTitle>Well Done!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary" data-testid="text-final-score">{score}</div>
              <div className="text-xs text-muted-foreground">Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary" data-testid="text-final-accuracy">{Math.min(accuracy, 100)}%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary" data-testid="text-levels-completed">{levelsCompleted}/{maxLevel}</div>
              <div className="text-xs text-muted-foreground">Levels</div>
            </div>
          </div>
          
          <div className="bg-accent/50 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-sm" data-testid="text-improvement-tip">{getImprovementTip()}</p>
            </div>
          </div>
          
          <Button
            data-testid="button-play-again"
            onClick={startGame}
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4" data-testid="memoryladder-playing">
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              className="text-6xl"
            >
              🧠✨
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between gap-4">
        <Badge variant="secondary" data-testid="text-current-score">
          Score: {score}
        </Badge>
        <Badge variant="outline" data-testid="text-current-level">
          Level {level}/{maxLevel}
        </Badge>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            {gameState === "showing" ? (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg font-medium text-muted-foreground"
              >
                Watch the sequence...
              </motion.p>
            ) : (
              <div className="space-y-2">
                <p className="text-lg font-medium">Your turn!</p>
                <p className="text-sm text-muted-foreground" data-testid="text-sequence-progress">
                  {playerSequence.length} / {sequence.length}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-3 mb-6">
            {availableColors.map((item) => (
              <motion.button
                key={item.id}
                data-testid={`button-color-${item.id}`}
                className={`aspect-square rounded-lg ${item.color} transition-all ${
                  activeItem === item.id ? "scale-110 ring-4 ring-white shadow-lg" : ""
                } ${gameState === "input" ? "cursor-pointer hover:scale-105" : "cursor-default"}`}
                onClick={() => handleItemClick(item.id)}
                disabled={gameState !== "input"}
                whileTap={gameState === "input" ? { scale: 0.95 } : {}}
                aria-label={item.label}
              />
            ))}
          </div>

          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`text-center py-3 rounded-lg ${
                  feedback === "correct" ? "bg-green-500/20 text-green-600" : "bg-red-500/20 text-red-600"
                }`}
              >
                <p className="font-medium">
                  {feedback === "correct" ? "Perfect! Moving to next level..." : "Oops! Try again..."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
