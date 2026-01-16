import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lightbulb, Trophy, Sparkles, RotateCcw, Check, X } from "lucide-react";

interface LogicPathsProps {
  grade: string;
  onComplete: (score: number, accuracy: number, duration: number) => void;
}

type PatternType = "number" | "shape" | "color";

interface Pattern {
  id: number;
  type: PatternType;
  sequence: string[];
  answer: string;
  options: string[];
  rule: string;
}

function getDifficulty(grade: string): "easy" | "medium" | "hard" {
  const gradeNum = parseInt(grade.replace(/\D/g, "")) || 3;
  if (gradeNum <= 2) return "easy";
  if (gradeNum <= 5) return "medium";
  return "hard";
}

const SHAPES = ["●", "■", "▲", "◆", "★", "♦", "♥", "♣"];
const COLORS = ["🔴", "🔵", "🟢", "🟡", "🟣", "🟠"];

function generatePatterns(difficulty: "easy" | "medium" | "hard"): Pattern[] {
  const patterns: Pattern[] = [];
  const count = difficulty === "easy" ? 6 : difficulty === "medium" ? 8 : 10;
  
  for (let i = 0; i < count; i++) {
    const patternType = i % 3 === 0 ? "number" : i % 3 === 1 ? "shape" : "color";
    
    if (patternType === "number") {
      let sequence: number[] = [];
      let answer: number;
      let rule: string;
      
      if (difficulty === "easy") {
        const start = Math.floor(Math.random() * 5) + 1;
        const step = Math.floor(Math.random() * 3) + 1;
        sequence = [start, start + step, start + step * 2, start + step * 3];
        answer = start + step * 4;
        rule = `Add ${step} each time`;
      } else if (difficulty === "medium") {
        const patternChoice = Math.random();
        if (patternChoice < 0.5) {
          const start = Math.floor(Math.random() * 5) + 2;
          const mult = Math.floor(Math.random() * 2) + 2;
          sequence = [start, start * mult, start * mult * mult];
          answer = start * mult * mult * mult;
          rule = `Multiply by ${mult} each time`;
        } else {
          const start = Math.floor(Math.random() * 10) + 5;
          const step = Math.floor(Math.random() * 4) + 2;
          sequence = [start, start + step, start + step + step + 1, start + step + step + 1 + step + 2];
          answer = start + step + step + 1 + step + 2 + step + 3;
          rule = "Add increasing amounts";
        }
      } else {
        const patternChoice = Math.random();
        if (patternChoice < 0.33) {
          const base = Math.floor(Math.random() * 3) + 2;
          sequence = [base, base * base, base * base * base];
          answer = base * base * base * base;
          rule = `Powers of ${base}`;
        } else if (patternChoice < 0.66) {
          sequence = [1, 1, 2, 3, 5];
          answer = 8;
          rule = "Add previous two numbers (Fibonacci)";
        } else {
          const start = Math.floor(Math.random() * 5) + 1;
          sequence = [start, start * 2, start * 2 - 1, (start * 2 - 1) * 2];
          answer = (start * 2 - 1) * 2 - 1;
          rule = "Double, then subtract 1, repeat";
        }
      }
      
      const wrongAnswers = new Set<number>();
      while (wrongAnswers.size < 3) {
        const offset = Math.floor(Math.random() * 10) - 5;
        const wrong = answer + (offset === 0 ? (Math.random() > 0.5 ? 1 : -1) : offset);
        if (wrong !== answer && wrong > 0) wrongAnswers.add(wrong);
      }
      
      const options = [answer.toString(), ...Array.from(wrongAnswers).map(String)];
      for (let j = options.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [options[j], options[k]] = [options[k], options[j]];
      }
      
      patterns.push({
        id: i,
        type: "number",
        sequence: sequence.map(String),
        answer: answer.toString(),
        options,
        rule,
      });
    } else if (patternType === "shape") {
      const shapeCount = difficulty === "easy" ? 2 : difficulty === "medium" ? 3 : 4;
      const selectedShapes = SHAPES.slice(0, shapeCount);
      
      let sequence: string[] = [];
      let answer: string;
      let rule: string;
      
      if (difficulty === "easy") {
        sequence = [selectedShapes[0], selectedShapes[1], selectedShapes[0], selectedShapes[1], selectedShapes[0]];
        answer = selectedShapes[1];
        rule = "Alternating pattern";
      } else if (difficulty === "medium") {
        sequence = [selectedShapes[0], selectedShapes[1], selectedShapes[2], selectedShapes[0], selectedShapes[1]];
        answer = selectedShapes[2];
        rule = "Repeating sequence of 3";
      } else {
        sequence = [selectedShapes[0], selectedShapes[0], selectedShapes[1], selectedShapes[1], selectedShapes[2]];
        answer = selectedShapes[2];
        rule = "Each shape appears twice";
      }
      
      const wrongOptions = selectedShapes.filter(s => s !== answer).slice(0, 3);
      const options = [answer, ...wrongOptions];
      for (let j = options.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [options[j], options[k]] = [options[k], options[j]];
      }
      
      patterns.push({
        id: i,
        type: "shape",
        sequence,
        answer,
        options,
        rule,
      });
    } else {
      const colorCount = difficulty === "easy" ? 2 : difficulty === "medium" ? 3 : 4;
      const selectedColors = COLORS.slice(0, colorCount);
      
      let sequence: string[] = [];
      let answer: string;
      let rule: string;
      
      if (difficulty === "easy") {
        sequence = [selectedColors[0], selectedColors[1], selectedColors[0], selectedColors[1], selectedColors[0]];
        answer = selectedColors[1];
        rule = "Alternating colors";
      } else if (difficulty === "medium") {
        sequence = [selectedColors[0], selectedColors[1], selectedColors[2], selectedColors[0], selectedColors[1]];
        answer = selectedColors[2];
        rule = "Repeating sequence of 3 colors";
      } else {
        sequence = [selectedColors[0], selectedColors[1], selectedColors[0], selectedColors[2], selectedColors[0]];
        answer = selectedColors[3] || selectedColors[1];
        rule = "First color alternates with others";
      }
      
      const wrongOptions = selectedColors.filter(c => c !== answer).slice(0, 3);
      const options = [answer, ...wrongOptions];
      for (let j = options.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [options[j], options[k]] = [options[k], options[j]];
      }
      
      patterns.push({
        id: i,
        type: "color",
        sequence,
        answer,
        options,
        rule,
      });
    }
  }
  
  return patterns;
}

export default function LogicPaths({ grade, onComplete }: LogicPathsProps) {
  const difficulty = getDifficulty(grade);
  
  const [gameState, setGameState] = useState<"ready" | "playing" | "complete">("ready");
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showRule, setShowRule] = useState(false);

  const startGame = useCallback(() => {
    const newPatterns = generatePatterns(difficulty);
    setPatterns(newPatterns);
    setCurrentIndex(0);
    setScore(0);
    setCorrect(0);
    setStartTime(Date.now());
    setGameState("playing");
    setFeedback(null);
    setShowRule(false);
  }, [difficulty]);

  const handleAnswer = useCallback((answer: string) => {
    if (feedback) return;
    
    const isCorrect = answer === patterns[currentIndex].answer;
    setFeedback(isCorrect ? "correct" : "wrong");
    setShowRule(true);
    
    if (isCorrect) {
      const patternScore = difficulty === "easy" ? 100 : difficulty === "medium" ? 150 : 200;
      setScore(prev => prev + patternScore);
      setCorrect(prev => prev + 1);
    }
    
    setTimeout(() => {
      setFeedback(null);
      setShowRule(false);
      if (currentIndex + 1 < patterns.length) {
        setCurrentIndex(prev => prev + 1);
      } else {
        const duration = Math.floor((Date.now() - startTime) / 1000);
        const finalCorrect = correct + (isCorrect ? 1 : 0);
        const accuracy = Math.round((finalCorrect / patterns.length) * 100);
        setShowCelebration(true);
        setTimeout(() => {
          setGameState("complete");
          const finalScore = score + (isCorrect ? (difficulty === "easy" ? 100 : difficulty === "medium" ? 150 : 200) : 0);
          onComplete(finalScore, accuracy, duration);
        }, 2000);
      }
    }, 2000);
  }, [feedback, patterns, currentIndex, correct, score, difficulty, startTime, onComplete]);

  const getImprovementTip = () => {
    const accuracy = patterns.length > 0 ? Math.round(correct / patterns.length * 100) : 0;
    if (accuracy >= 90) return "Brilliant logical thinking! You're a pattern master!";
    if (accuracy >= 70) return "Great job! Look for what stays the same and what changes.";
    if (accuracy >= 50) return "Good effort! Try saying the pattern out loud to help spot it.";
    return "Keep practicing! Start by looking at just the first few items in each sequence.";
  };

  if (gameState === "ready") {
    return (
      <Card data-testid="logicpaths-ready" className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Lightbulb className="w-8 h-8 text-primary" />
          </div>
          <CardTitle>Logic Paths</CardTitle>
          <p className="text-muted-foreground">
            Find what comes next in the pattern!
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="outline">
              {difficulty === "easy" ? 6 : difficulty === "medium" ? 8 : 10} puzzles
            </Badge>
            <Badge variant="outline">
              Numbers, shapes & colors
            </Badge>
          </div>
          <Button
            data-testid="button-start-logicpaths"
            onClick={startGame}
            className="w-full"
            size="lg"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Start Game
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === "complete") {
    const accuracy = patterns.length > 0 ? Math.round(correct / patterns.length * 100) : 0;
    return (
      <Card data-testid="logicpaths-complete" className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4"
          >
            <Trophy className="w-10 h-10 text-primary" />
          </motion.div>
          <CardTitle>Fantastic!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary" data-testid="text-final-score">{score}</div>
              <div className="text-xs text-muted-foreground">Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary" data-testid="text-final-accuracy">{accuracy}%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary" data-testid="text-patterns-correct">{correct}/{patterns.length}</div>
              <div className="text-xs text-muted-foreground">Correct</div>
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

  const currentPattern = patterns[currentIndex];
  const progress = (currentIndex / patterns.length) * 100;

  return (
    <div className="max-w-md mx-auto space-y-4" data-testid="logicpaths-playing">
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
              💡✨
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between gap-4">
        <Badge variant="secondary" data-testid="text-current-score">
          Score: {score}
        </Badge>
        <div className="flex-1">
          <Progress value={progress} className="h-2" />
        </div>
        <Badge variant="outline" data-testid="text-pattern-progress">
          {currentIndex + 1}/{patterns.length}
        </Badge>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground mb-2">Find the next in the sequence:</p>
          </div>

          <motion.div
            key={currentPattern.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div 
              className="flex justify-center items-center gap-3 flex-wrap mb-6 p-4 bg-accent/30 rounded-lg"
              data-testid="text-pattern-sequence"
            >
              {currentPattern.sequence.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold ${
                    currentPattern.type === "number" ? "bg-primary/10 text-primary" : "bg-background"
                  }`}
                >
                  {item}
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: currentPattern.sequence.length * 0.1 }}
                className="w-12 h-12 rounded-lg border-2 border-dashed border-primary/50 flex items-center justify-center text-2xl text-primary"
              >
                ?
              </motion.div>
            </div>

            <AnimatePresence>
              {showRule && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`text-center py-3 rounded-lg mb-4 ${
                    feedback === "correct" ? "bg-green-500/20" : "bg-red-500/20"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    {feedback === "correct" ? (
                      <>
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-600">Correct!</span>
                      </>
                    ) : (
                      <>
                        <X className="w-5 h-5 text-red-600" />
                        <span className="font-medium text-red-600">Not quite</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Rule: {currentPattern.rule}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-3">
              {currentPattern.options.map((option, idx) => (
                <motion.div
                  key={option}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 + 0.3 }}
                >
                  <Button
                    data-testid={`button-option-${idx}`}
                    variant={
                      feedback
                        ? option === currentPattern.answer
                          ? "default"
                          : "secondary"
                        : "outline"
                    }
                    className={`w-full h-14 text-xl transition-all ${
                      feedback && option === currentPattern.answer
                        ? "bg-green-500 hover:bg-green-500 border-green-500 text-white"
                        : feedback && option !== currentPattern.answer
                        ? "opacity-50"
                        : ""
                    }`}
                    onClick={() => handleAnswer(option)}
                    disabled={!!feedback}
                  >
                    {option}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
