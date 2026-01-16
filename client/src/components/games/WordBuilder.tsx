import { useState, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Trophy, Sparkles, RotateCcw, Check, X, Shuffle } from "lucide-react";

interface WordBuilderProps {
  grade: string;
  onComplete: (score: number, accuracy: number, duration: number) => void;
}

interface WordChallenge {
  word: string;
  hint: string;
  scrambled: string[];
}

function getDifficulty(grade: string): "easy" | "medium" | "hard" {
  const gradeNum = parseInt(grade.replace(/\D/g, "")) || 3;
  if (gradeNum <= 2) return "easy";
  if (gradeNum <= 5) return "medium";
  return "hard";
}

const WORD_LISTS = {
  easy: [
    { word: "CAT", hint: "A furry pet that meows" },
    { word: "DOG", hint: "A pet that barks" },
    { word: "SUN", hint: "Shines in the sky" },
    { word: "HAT", hint: "Worn on your head" },
    { word: "BIG", hint: "Opposite of small" },
    { word: "RUN", hint: "Move fast with legs" },
    { word: "RED", hint: "Color of an apple" },
    { word: "BED", hint: "Where you sleep" },
    { word: "CUP", hint: "Drink from this" },
    { word: "FUN", hint: "Having a good time" },
  ],
  medium: [
    { word: "HAPPY", hint: "Feeling joyful" },
    { word: "BEACH", hint: "Sandy place by the ocean" },
    { word: "NIGHT", hint: "When stars come out" },
    { word: "PLANT", hint: "Grows in a garden" },
    { word: "WATER", hint: "You drink this" },
    { word: "SMILE", hint: "Show your teeth when happy" },
    { word: "CLOUD", hint: "Floats in the sky" },
    { word: "FRUIT", hint: "Apples and oranges are this" },
    { word: "TRAIN", hint: "Rides on tracks" },
    { word: "CLIMB", hint: "Go up high" },
  ],
  hard: [
    { word: "SCIENCE", hint: "Study of nature" },
    { word: "WEATHER", hint: "Rain, sun, or snow" },
    { word: "THOUGHT", hint: "An idea in your mind" },
    { word: "BEAUTIFUL", hint: "Very pretty" },
    { word: "ADVENTURE", hint: "An exciting journey" },
    { word: "KNOWLEDGE", hint: "What you learn" },
    { word: "STRENGTH", hint: "Being strong" },
    { word: "MOUNTAIN", hint: "A very tall hill" },
    { word: "DISCOVERY", hint: "Finding something new" },
    { word: "CHAMPION", hint: "A winner" },
  ],
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function WordBuilder({ grade, onComplete }: WordBuilderProps) {
  const difficulty = getDifficulty(grade);
  const wordCount = difficulty === "easy" ? 6 : difficulty === "medium" ? 8 : 10;
  
  const [gameState, setGameState] = useState<"ready" | "playing" | "complete">("ready");
  const [challenges, setChallenges] = useState<WordChallenge[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentLetters, setCurrentLetters] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  const startGame = useCallback(() => {
    const wordList = WORD_LISTS[difficulty];
    const selectedWords = shuffleArray(wordList).slice(0, wordCount);
    const newChallenges: WordChallenge[] = selectedWords.map(({ word, hint }) => ({
      word,
      hint,
      scrambled: shuffleArray(word.split("")),
    }));
    
    setChallenges(newChallenges);
    setCurrentIndex(0);
    setCurrentLetters(newChallenges[0].scrambled);
    setScore(0);
    setCorrect(0);
    setHintsUsed(0);
    setStartTime(Date.now());
    setGameState("playing");
    setFeedback(null);
  }, [difficulty, wordCount]);

  const shuffleCurrentLetters = () => {
    setCurrentLetters(prev => shuffleArray(prev));
    setHintsUsed(prev => prev + 1);
  };

  const checkAnswer = useCallback(() => {
    const currentWord = currentLetters.join("");
    const isCorrect = currentWord === challenges[currentIndex].word;
    
    setFeedback(isCorrect ? "correct" : "wrong");
    
    if (isCorrect) {
      const wordScore = challenges[currentIndex].word.length * 20;
      setScore(prev => prev + wordScore);
      setCorrect(prev => prev + 1);
    }
    
    setTimeout(() => {
      setFeedback(null);
      if (currentIndex + 1 < challenges.length) {
        setCurrentIndex(prev => prev + 1);
        setCurrentLetters(challenges[currentIndex + 1].scrambled);
      } else {
        const duration = Math.floor((Date.now() - startTime) / 1000);
        const finalCorrect = correct + (isCorrect ? 1 : 0);
        const accuracy = Math.round((finalCorrect / challenges.length) * 100);
        setShowCelebration(true);
        setTimeout(() => {
          setGameState("complete");
          onComplete(score + (isCorrect ? challenges[currentIndex].word.length * 20 : 0), accuracy, duration);
        }, 2000);
      }
    }, 1000);
  }, [currentLetters, challenges, currentIndex, correct, score, startTime, onComplete]);

  const getImprovementTip = () => {
    const accuracy = challenges.length > 0 ? Math.round(correct / challenges.length * 100) : 0;
    if (accuracy >= 90) return "Outstanding spelling! You're a word wizard!";
    if (accuracy >= 70) return "Great job! Practice reading to see more words in action.";
    if (accuracy >= 50) return "Good effort! Sound out each letter to help spell correctly.";
    return "Keep practicing! Start with shorter words and work your way up.";
  };

  if (gameState === "ready") {
    return (
      <Card data-testid="wordbuilder-ready" className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <CardTitle>Word Builder</CardTitle>
          <p className="text-muted-foreground">
            Arrange the letters to spell the word!
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center gap-2">
            <Badge variant="outline">
              {wordCount} words
            </Badge>
            <Badge variant="outline">
              {difficulty} difficulty
            </Badge>
          </div>
          <Button
            data-testid="button-start-wordbuilder"
            onClick={startGame}
            className="w-full"
            size="lg"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Start Game
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === "complete") {
    const accuracy = challenges.length > 0 ? Math.round(correct / challenges.length * 100) : 0;
    return (
      <Card data-testid="wordbuilder-complete" className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4"
          >
            <Trophy className="w-10 h-10 text-primary" />
          </motion.div>
          <CardTitle>Amazing!</CardTitle>
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
              <div className="text-2xl font-bold text-primary" data-testid="text-words-correct">{correct}/{challenges.length}</div>
              <div className="text-xs text-muted-foreground">Words</div>
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

  const currentChallenge = challenges[currentIndex];
  const progress = (currentIndex / challenges.length) * 100;

  return (
    <div className="max-w-md mx-auto space-y-4" data-testid="wordbuilder-playing">
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
              📚✨
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
        <Badge variant="outline" data-testid="text-word-progress">
          {currentIndex + 1}/{challenges.length}
        </Badge>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground mb-2">Hint:</p>
            <p className="text-lg font-medium" data-testid="text-word-hint">
              {currentChallenge.hint}
            </p>
          </div>

          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Reorder.Group
              axis="x"
              values={currentLetters}
              onReorder={setCurrentLetters}
              className="flex justify-center gap-2 flex-wrap"
            >
              {currentLetters.map((letter, idx) => (
                <Reorder.Item
                  key={`${letter}-${idx}`}
                  value={letter}
                  data-testid={`draggable-letter-${idx}`}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-14 rounded-lg flex items-center justify-center text-2xl font-bold select-none
                      ${feedback === "correct" ? "bg-green-500 text-white" : 
                        feedback === "wrong" ? "bg-red-500 text-white" : 
                        "bg-primary text-primary-foreground"}`}
                  >
                    {letter}
                  </motion.div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </motion.div>

          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">
              Drag letters to rearrange them
            </p>
          </div>

          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`text-center py-3 rounded-lg mb-4 ${
                  feedback === "correct" ? "bg-green-500/20 text-green-600" : "bg-red-500/20 text-red-600"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {feedback === "correct" ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span className="font-medium">Correct!</span>
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5" />
                      <span className="font-medium">The word was: {currentChallenge.word}</span>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3">
            <Button
              data-testid="button-shuffle"
              variant="outline"
              onClick={shuffleCurrentLetters}
              disabled={!!feedback}
              className="flex-1"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Shuffle
            </Button>
            <Button
              data-testid="button-check-word"
              onClick={checkAnswer}
              disabled={!!feedback}
              className="flex-1"
            >
              <Check className="w-4 h-4 mr-2" />
              Check
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
