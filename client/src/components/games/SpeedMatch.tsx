import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Zap, Trophy, Clock, Target, Sparkles, X, Check } from "lucide-react";

interface SpeedMatchProps {
  grade: string;
  onComplete: (score: number, accuracy: number, duration: number) => void;
}

interface Question {
  id: number;
  question: string;
  answer: string;
  options: string[];
}

function getDifficulty(grade: string): "easy" | "medium" | "hard" {
  const gradeNum = parseInt(grade.replace(/\D/g, "")) || 3;
  if (gradeNum <= 2) return "easy";
  if (gradeNum <= 5) return "medium";
  return "hard";
}

function generateQuestions(difficulty: "easy" | "medium" | "hard"): Question[] {
  const questions: Question[] = [];
  const count = difficulty === "easy" ? 8 : difficulty === "medium" ? 10 : 12;
  
  for (let i = 0; i < count; i++) {
    let a: number, b: number, answer: number, op: string;
    
    if (difficulty === "easy") {
      a = Math.floor(Math.random() * 10) + 1;
      b = Math.floor(Math.random() * 10) + 1;
      op = Math.random() > 0.5 ? "+" : "-";
      if (op === "-" && b > a) [a, b] = [b, a];
      answer = op === "+" ? a + b : a - b;
    } else if (difficulty === "medium") {
      const ops = ["+", "-", "×"];
      op = ops[Math.floor(Math.random() * ops.length)];
      if (op === "×") {
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        answer = a * b;
      } else {
        a = Math.floor(Math.random() * 50) + 10;
        b = Math.floor(Math.random() * 30) + 1;
        if (op === "-" && b > a) [a, b] = [b, a];
        answer = op === "+" ? a + b : a - b;
      }
    } else {
      const ops = ["+", "-", "×", "÷"];
      op = ops[Math.floor(Math.random() * ops.length)];
      if (op === "×") {
        a = Math.floor(Math.random() * 12) + 1;
        b = Math.floor(Math.random() * 12) + 1;
        answer = a * b;
      } else if (op === "÷") {
        b = Math.floor(Math.random() * 10) + 2;
        answer = Math.floor(Math.random() * 10) + 1;
        a = b * answer;
      } else {
        a = Math.floor(Math.random() * 100) + 20;
        b = Math.floor(Math.random() * 50) + 10;
        if (op === "-" && b > a) [a, b] = [b, a];
        answer = op === "+" ? a + b : a - b;
      }
    }
    
    const wrongAnswers = new Set<number>();
    while (wrongAnswers.size < 3) {
      const offset = Math.floor(Math.random() * 10) - 5;
      const wrong = answer + (offset === 0 ? 1 : offset);
      if (wrong !== answer && wrong >= 0) wrongAnswers.add(wrong);
    }
    
    const options = [answer.toString(), ...Array.from(wrongAnswers).map(String)];
    for (let j = options.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [options[j], options[k]] = [options[k], options[j]];
    }
    
    questions.push({
      id: i,
      question: `${a} ${op} ${b} = ?`,
      answer: answer.toString(),
      options,
    });
  }
  
  return questions;
}

export default function SpeedMatch({ grade, onComplete }: SpeedMatchProps) {
  const difficulty = getDifficulty(grade);
  const timePerQuestion = difficulty === "easy" ? 8 : difficulty === "medium" ? 6 : 5;
  
  const [gameState, setGameState] = useState<"ready" | "playing" | "complete">("ready");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [startTime, setStartTime] = useState<number>(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const startGame = useCallback(() => {
    const newQuestions = generateQuestions(difficulty);
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setScore(0);
    setCorrect(0);
    setTimeLeft(timePerQuestion);
    setStartTime(Date.now());
    setGameState("playing");
    setFeedback(null);
  }, [difficulty, timePerQuestion]);

  const handleAnswer = useCallback((answer: string) => {
    if (feedback) return;
    
    const isCorrect = answer === questions[currentIndex].answer;
    setFeedback(isCorrect ? "correct" : "wrong");
    
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft * 10);
      setScore(prev => prev + 100 + timeBonus);
      setCorrect(prev => prev + 1);
    }
    
    setTimeout(() => {
      setFeedback(null);
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(prev => prev + 1);
        setTimeLeft(timePerQuestion);
      } else {
        const duration = Math.floor((Date.now() - startTime) / 1000);
        const accuracy = Math.round((correct + (isCorrect ? 1 : 0)) / questions.length * 100);
        setShowCelebration(true);
        setTimeout(() => {
          setGameState("complete");
          onComplete(score + (isCorrect ? 100 + Math.floor(timeLeft * 10) : 0), accuracy, duration);
        }, 2000);
      }
    }, 500);
  }, [currentIndex, questions, feedback, timeLeft, timePerQuestion, correct, score, startTime, onComplete]);

  useEffect(() => {
    if (gameState !== "playing" || feedback) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) {
          handleAnswer("");
          return timePerQuestion;
        }
        return prev - 0.1;
      });
    }, 100);
    
    return () => clearInterval(timer);
  }, [gameState, feedback, timePerQuestion, handleAnswer]);

  const getImprovementTip = () => {
    const accuracy = questions.length > 0 ? Math.round(correct / questions.length * 100) : 0;
    if (accuracy >= 90) return "Excellent work! Try challenging yourself with harder problems.";
    if (accuracy >= 70) return "Great job! Practice times tables to get even faster.";
    if (accuracy >= 50) return "Good effort! Take a breath before answering to improve accuracy.";
    return "Keep practicing! Start with easier problems to build confidence.";
  };

  if (gameState === "ready") {
    return (
      <Card data-testid="speedmatch-ready" className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <CardTitle>Speed Match</CardTitle>
          <p className="text-muted-foreground">
            Answer math problems as fast as you can!
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center gap-2">
            <Badge variant="outline">
              <Clock className="w-3 h-3 mr-1" />
              {timePerQuestion}s per question
            </Badge>
            <Badge variant="outline">
              <Target className="w-3 h-3 mr-1" />
              {difficulty === "easy" ? 8 : difficulty === "medium" ? 10 : 12} questions
            </Badge>
          </div>
          <Button
            data-testid="button-start-speedmatch"
            onClick={startGame}
            className="w-full"
            size="lg"
          >
            <Zap className="w-4 h-4 mr-2" />
            Start Game
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === "complete") {
    const accuracy = questions.length > 0 ? Math.round(correct / questions.length * 100) : 0;
    return (
      <Card data-testid="speedmatch-complete" className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4"
          >
            <Trophy className="w-10 h-10 text-primary" />
          </motion.div>
          <CardTitle>Great Job!</CardTitle>
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
              <div className="text-2xl font-bold text-primary" data-testid="text-correct-count">{correct}/{questions.length}</div>
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
            Play Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <div className="max-w-md mx-auto space-y-4" data-testid="speedmatch-playing">
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
              🎉
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
        <Badge variant="outline" data-testid="text-question-progress">
          {currentIndex + 1}/{questions.length}
        </Badge>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Time</span>
              <span className="text-sm font-medium" data-testid="text-time-left">
                {timeLeft.toFixed(1)}s
              </span>
            </div>
            <Progress 
              value={(timeLeft / timePerQuestion) * 100} 
              className="h-2"
            />
          </div>

          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center"
          >
            <div 
              className="text-4xl font-bold mb-8 py-4"
              data-testid="text-current-question"
            >
              {currentQuestion.question}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {currentQuestion.options.map((option, idx) => (
                <motion.div
                  key={option}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Button
                    data-testid={`button-option-${idx}`}
                    variant={
                      feedback
                        ? option === currentQuestion.answer
                          ? "default"
                          : "secondary"
                        : "outline"
                    }
                    className={`w-full h-14 text-xl transition-all ${
                      feedback && option === currentQuestion.answer
                        ? "bg-green-500 hover:bg-green-500 border-green-500"
                        : feedback && option !== currentQuestion.answer
                        ? "opacity-50"
                        : ""
                    }`}
                    onClick={() => handleAnswer(option)}
                    disabled={!!feedback}
                  >
                    {option}
                    {feedback && option === currentQuestion.answer && (
                      <Check className="w-5 h-5 ml-2" />
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute inset-0 flex items-center justify-center pointer-events-none`}
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                  feedback === "correct" ? "bg-green-500/20" : "bg-red-500/20"
                }`}>
                  {feedback === "correct" ? (
                    <Check className="w-10 h-10 text-green-500" />
                  ) : (
                    <X className="w-10 h-10 text-red-500" />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
