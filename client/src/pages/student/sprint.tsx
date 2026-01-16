import { useState, useEffect, useCallback } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { RouteGuard } from "@/components/portal/RouteGuard";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Zap,
  Clock,
  CheckCircle2,
  ArrowRight,
  Trophy,
  Brain,
  Target,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SprintStep = "warmup" | "core" | "check";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

const warmupQuestions: Question[] = [
  {
    id: "w1",
    question: "What is 7 + 8?",
    options: ["14", "15", "16", "17"],
    correctIndex: 1,
  },
  {
    id: "w2",
    question: "Which word is spelled correctly?",
    options: ["Recieve", "Receive", "Receeve", "Recive"],
    correctIndex: 1,
  },
];

const coreQuestions: Question[] = [
  {
    id: "c1",
    question: "If 3x + 5 = 20, what is x?",
    options: ["3", "4", "5", "6"],
    correctIndex: 2,
  },
  {
    id: "c2",
    question: "What is the area of a rectangle with length 8 and width 5?",
    options: ["13", "26", "40", "80"],
    correctIndex: 2,
  },
  {
    id: "c3",
    question: "Which fraction is equivalent to 0.75?",
    options: ["1/2", "2/3", "3/4", "4/5"],
    correctIndex: 2,
  },
];

const checkQuestions: Question[] = [
  {
    id: "ch1",
    question: "Simplify: 12/16",
    options: ["2/3", "3/4", "4/5", "5/6"],
    correctIndex: 1,
  },
  {
    id: "ch2",
    question: "What is 15% of 80?",
    options: ["8", "10", "12", "15"],
    correctIndex: 2,
  },
];

const stepConfig: Record<SprintStep, { label: string; duration: number; questions: Question[]; icon: typeof Brain }> = {
  warmup: { label: "Warm-up", duration: 120, questions: warmupQuestions, icon: Brain },
  core: { label: "Core Practice", duration: 300, questions: coreQuestions, icon: Target },
  check: { label: "Quick Check", duration: 120, questions: checkQuestions, icon: CheckCircle2 },
};

const steps: SprintStep[] = ["warmup", "core", "check"];

export default function StudentSprint() {
  const { user } = useAuth();
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [currentStep, setCurrentStep] = useState<SprintStep>("warmup");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(stepConfig.warmup.duration);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const currentConfig = stepConfig[currentStep];
  const currentQuestions = currentConfig.questions;
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const stepIndex = steps.indexOf(currentStep);
  const overallProgress = ((stepIndex * 100) / 3) + ((currentQuestionIndex / currentQuestions.length) * (100 / 3));

  useEffect(() => {
    if (!started || completed) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleNextStep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, completed, currentStep]);

  const handleNextStep = useCallback(() => {
    const nextStepIndex = steps.indexOf(currentStep) + 1;
    if (nextStepIndex >= steps.length) {
      setCompleted(true);
    } else {
      const nextStep = steps[nextStepIndex];
      setCurrentStep(nextStep);
      setCurrentQuestionIndex(0);
      setTimeRemaining(stepConfig[nextStep].duration);
      setSelectedAnswer("");
    }
  }, [currentStep]);

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const answerIndex = parseInt(selectedAnswer);
    const isCorrect = answerIndex === currentQuestion.correctIndex;

    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answerIndex }));
    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer("");
    } else {
      handleNextStep();
    }
  };

  const handleStart = () => {
    setStarted(true);
    setCurrentStep("warmup");
    setCurrentQuestionIndex(0);
    setTimeRemaining(stepConfig.warmup.duration);
    setAnswers({});
    setScore({ correct: 0, total: 0 });
    setCompleted(false);
  };

  const handleRestart = () => {
    setStarted(false);
    setCompleted(false);
    setCurrentStep("warmup");
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setAnswers({});
    setScore({ correct: 0, total: 0 });
    setTimeRemaining(stepConfig.warmup.duration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!started) {
    return (
      <RouteGuard allowedRoles={["student"]}>
        <PortalLayout>
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Daily Sprint</h1>
              <p className="text-muted-foreground">
                Quick practice sessions to sharpen your skills
              </p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="grid gap-4">
                  {steps.map((step, i) => {
                    const config = stepConfig[step];
                    const Icon = config.icon;
                    return (
                      <div
                        key={step}
                        className="flex items-center gap-4 p-4 rounded-lg border"
                        data-testid={`step-preview-${step}`}
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{config.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {config.questions.length} questions · {Math.floor(config.duration / 60)} min
                          </p>
                        </div>
                        <Badge variant="outline">{i + 1}</Badge>
                      </div>
                    );
                  })}
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleStart}
                  data-testid="button-start-sprint"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Start Sprint
                </Button>
              </CardContent>
            </Card>
          </div>
        </PortalLayout>
      </RouteGuard>
    );
  }

  if (completed) {
    const percentage = Math.round((score.correct / score.total) * 100);
    return (
      <RouteGuard allowedRoles={["student"]}>
        <PortalLayout>
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                <Trophy className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl font-bold">Sprint Complete!</h1>
              <p className="text-muted-foreground">Great job, {user?.firstName}!</p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-4xl font-bold text-primary">{percentage}%</p>
                  <p className="text-muted-foreground">
                    You got {score.correct} out of {score.total} questions correct
                  </p>
                </div>

                <Progress value={percentage} className="h-3" />

                <div className="grid grid-cols-3 gap-4 pt-4">
                  {steps.map((step) => {
                    const config = stepConfig[step];
                    const Icon = config.icon;
                    return (
                      <div
                        key={step}
                        className="text-center p-4 rounded-lg bg-muted/50"
                        data-testid={`result-${step}`}
                      >
                        <Icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <p className="text-sm font-medium">{config.label}</p>
                        <CheckCircle2 className="w-4 h-4 mx-auto mt-2 text-green-500" />
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleRestart}
                    data-testid="button-restart-sprint"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  <Button className="flex-1" asChild>
                    <a href="/dashboard" data-testid="button-back-dashboard">
                      Back to Dashboard
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </PortalLayout>
      </RouteGuard>
    );
  }

  const Icon = currentConfig.icon;

  return (
    <RouteGuard allowedRoles={["student"]}>
      <PortalLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{currentConfig.label}</p>
                <p className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {currentQuestions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-lg font-mono">
              <Clock className={cn("w-5 h-5", timeRemaining < 30 && "text-red-500")} />
              <span className={cn(timeRemaining < 30 && "text-red-500")} data-testid="timer">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          <Progress value={overallProgress} className="h-2" />

          <div className="flex gap-2 justify-center">
            {steps.map((step, i) => (
              <div
                key={step}
                className={cn(
                  "w-3 h-3 rounded-full",
                  i < stepIndex
                    ? "bg-green-500"
                    : i === stepIndex
                    ? "bg-primary"
                    : "bg-muted"
                )}
              />
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg" data-testid="question-text">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={selectedAnswer}
                onValueChange={setSelectedAnswer}
                className="space-y-3"
              >
                {currentQuestion.options.map((option, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-3 p-4 rounded-lg border hover-elevate cursor-pointer"
                    onClick={() => setSelectedAnswer(i.toString())}
                    data-testid={`option-${i}`}
                  >
                    <RadioGroupItem value={i.toString()} id={`option-${i}`} />
                    <Label htmlFor={`option-${i}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <Button
                className="w-full"
                size="lg"
                disabled={!selectedAnswer}
                onClick={handleSubmitAnswer}
                data-testid="button-submit-answer"
              >
                {currentQuestionIndex < currentQuestions.length - 1 ? (
                  <>
                    Next <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                ) : stepIndex < steps.length - 1 ? (
                  <>
                    Next Step <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Finish <CheckCircle2 className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </PortalLayout>
    </RouteGuard>
  );
}
