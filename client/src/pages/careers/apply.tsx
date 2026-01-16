import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Footer } from "@/components/landing/Footer";
import { ArrowLeft, ArrowRight, Check, Clock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const STORAGE_KEY = "tutor_application_draft_v1";

const countries = [
  "United Arab Emirates",
  "Saudi Arabia",
  "Egypt",
  "India",
  "Pakistan",
  "United Kingdom",
  "United States",
  "Canada",
  "Australia",
  "Qatar",
  "Kuwait",
  "Bahrain",
  "Oman",
  "Jordan",
  "Lebanon",
  "Other",
];

const timezones = [
  "UTC+0 (GMT)",
  "UTC+1 (CET)",
  "UTC+2 (EET)",
  "UTC+3 (Arabia Standard)",
  "UTC+4 (Gulf Standard)",
  "UTC+5 (Pakistan Standard)",
  "UTC+5:30 (India Standard)",
  "UTC+8 (Singapore/HK)",
  "UTC-5 (Eastern US)",
  "UTC-8 (Pacific US)",
];

const languages = ["English", "Arabic", "Hindi", "French", "Spanish", "Urdu", "Malayalam", "Tamil"];
const subjects = ["Math", "Science", "English", "Social Studies", "Arabic", "Computer Science"];
const grades = ["Grade 1-2", "Grade 3-5", "Grade 6-8", "Grade 9-10"];
const experienceLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
const teachingStyles = ["Structured", "Patient", "Exam-focused", "Confidence-building", "Visual methods"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const timeBlocks = ["Morning", "4-6pm", "6-8pm", "8-10pm"];

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  country: z.string().min(1, "Please select a country"),
  timezone: z.string().min(1, "Please select a timezone"),
  languages: z.array(z.string()).min(1, "Please select at least one language"),
  hasEquipment: z.boolean().refine((val) => val === true, "You must confirm you have stable internet and a laptop"),
  subjects: z.array(z.string()).min(1, "Please select at least one subject"),
  grades: z.array(z.string()).min(1, "Please select at least one grade level"),
  experienceLevel: z.string().min(1, "Please select your experience level"),
  teachingStyles: z.array(z.string()).min(1, "Please select at least one teaching style"),
  availableDays: z.array(z.string()).min(1, "Please select at least one day"),
  availableTimeBlocks: z.array(z.string()).min(1, "Please select at least one time block"),
  answer1: z.string().min(10, "Please provide a more detailed answer").max(280, "Maximum 280 characters"),
  answer2: z.string().min(10, "Please provide a more detailed answer").max(280, "Maximum 280 characters"),
  answer3: z.string().min(10, "Please provide a more detailed answer").max(280, "Maximum 280 characters"),
  videoUrl: z.string().url().optional().or(z.literal("")),
  agreeToTerms: z.boolean().refine((val) => val === true, "You must agree to the policies"),
});

type FormData = z.infer<typeof formSchema>;

const defaultValues: FormData = {
  firstName: "",
  country: "",
  timezone: "",
  languages: [],
  hasEquipment: false,
  subjects: [],
  grades: [],
  experienceLevel: "",
  teachingStyles: [],
  availableDays: [],
  availableTimeBlocks: [],
  answer1: "",
  answer2: "",
  answer3: "",
  videoUrl: "",
  agreeToTerms: false,
};

function getAutoTimezone(): string {
  try {
    const offset = new Date().getTimezoneOffset();
    const hours = -offset / 60;
    const sign = hours >= 0 ? "+" : "";
    const closest = timezones.find((tz) => tz.includes(`UTC${sign}${Math.round(hours)}`));
    return closest || timezones[0];
  } catch {
    return timezones[0];
  }
}

export default function TutorApply() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const watchedValues = form.watch();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.keys(parsed).forEach((key) => {
          form.setValue(key as keyof FormData, parsed[key]);
        });
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    } else {
      const autoTz = getAutoTimezone();
      form.setValue("timezone", autoTz);
    }
  }, [form]);

  const saveDraft = useCallback(() => {
    const values = form.getValues();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  }, [form]);

  useEffect(() => {
    const handler = setTimeout(() => {
      saveDraft();
    }, 500);
    return () => clearTimeout(handler);
  }, [watchedValues, saveDraft]);

  const step1Fields = ["firstName", "country", "timezone", "languages", "hasEquipment"] as const;
  const step2Fields = ["subjects", "grades", "experienceLevel", "teachingStyles", "availableDays", "availableTimeBlocks"] as const;
  const step3Fields = ["answer1", "answer2", "answer3"] as const;

  const validateStep = async (currentStep: number): Promise<boolean> => {
    let fieldsToValidate: (keyof FormData)[] = [];
    if (currentStep === 1) fieldsToValidate = [...step1Fields];
    if (currentStep === 2) fieldsToValidate = [...step2Fields];
    if (currentStep === 3) fieldsToValidate = [...step3Fields];

    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateStep(step);
    if (isValid) {
      setStep((s) => Math.min(s + 1, 4));
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/tutor-applications", data);
      localStorage.removeItem(STORAGE_KEY);
      toast({
        title: "Application Submitted!",
        description: "We'll review your application and get back to you soon.",
      });
      setLocation("/careers/tutors");
    } catch {
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleArrayField = (field: keyof FormData, value: string) => {
    const current = form.getValues(field) as string[];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    form.setValue(field, updated as never, { shouldValidate: true });
  };

  const progressValue = (step / 4) * 100;

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 100 : -100, opacity: 0 }),
  };

  const stepTimes = ["45 sec", "60 sec", "90 sec", "Review"];

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-bg/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="flex items-center gap-3" data-testid="link-home">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-brand-blue flex items-center justify-center shadow-lg shadow-brand-blue/20">
                <span className="text-white font-black text-lg">E</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-extrabold text-brand-ink tracking-tight leading-none">
                  EduBridge
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-brand-muted tracking-[0.2em] leading-none">
                  LEARNING
                </span>
              </div>
            </Link>
            <Link
              href="/careers/tutors"
              className="px-4 py-2.5 text-brand-ink font-medium text-sm hover:text-brand-blue transition-colors"
              data-testid="link-back-tutors"
            >
              Back to Tutors
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-brand-ink" data-testid="text-wizard-title">
                Tutor Application
              </h1>
              <div className="flex items-center gap-2 text-sm text-brand-muted">
                <Clock className="w-4 h-4" />
                <span data-testid="text-step-time">{stepTimes[step - 1]}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Progress value={progressValue} className="flex-1 h-2" data-testid="progress-bar" />
              <span className="text-sm font-medium text-brand-muted" data-testid="text-step-indicator">
                Step {step}/4
              </span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-1 rounded-full transition-colors ${
                    s <= step ? "bg-brand-blue" : "bg-brand-card"
                  }`}
                  data-testid={`step-indicator-${s}`}
                />
              ))}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait" custom={step}>
                {step === 1 && (
                  <motion.div
                    key="step1"
                    custom={1}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                    data-testid="step-1-container"
                  >
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
                      <h2 className="text-xl font-bold text-brand-ink mb-6">Basic Information</h2>

                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem className="mb-5">
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter your first name"
                                data-testid="input-first-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem className="mb-5">
                            <FormLabel>Country</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-country">
                                  <SelectValue placeholder="Select your country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem key={country} value={country} data-testid={`option-country-${country}`}>
                                    {country}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="timezone"
                        render={({ field }) => (
                          <FormItem className="mb-5">
                            <FormLabel>Timezone</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-timezone">
                                  <SelectValue placeholder="Select timezone" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {timezones.map((tz) => (
                                  <SelectItem key={tz} value={tz} data-testid={`option-tz-${tz}`}>
                                    {tz}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="languages"
                        render={() => (
                          <FormItem className="mb-5">
                            <FormLabel>Languages You Can Teach In</FormLabel>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {languages.map((lang) => (
                                <Badge
                                  key={lang}
                                  variant={watchedValues.languages.includes(lang) ? "default" : "outline"}
                                  className={`cursor-pointer transition-all ${
                                    watchedValues.languages.includes(lang)
                                      ? "bg-brand-blue text-white border-brand-blue"
                                      : "bg-white hover:border-brand-blue"
                                  }`}
                                  onClick={() => toggleArrayField("languages", lang)}
                                  data-testid={`chip-language-${lang}`}
                                >
                                  {lang}
                                  {watchedValues.languages.includes(lang) && <Check className="w-3 h-3 ml-1" />}
                                </Badge>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hasEquipment"
                        render={({ field }) => (
                          <FormItem className="flex items-start gap-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid="checkbox-equipment"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="cursor-pointer">
                                I have stable internet and a laptop for teaching
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    custom={1}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                    data-testid="step-2-container"
                  >
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
                      <h2 className="text-xl font-bold text-brand-ink mb-6">Teaching Fit</h2>

                      <FormField
                        control={form.control}
                        name="subjects"
                        render={() => (
                          <FormItem className="mb-5">
                            <FormLabel>Subjects You Can Teach</FormLabel>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {subjects.map((subject) => (
                                <Badge
                                  key={subject}
                                  variant={watchedValues.subjects.includes(subject) ? "default" : "outline"}
                                  className={`cursor-pointer transition-all ${
                                    watchedValues.subjects.includes(subject)
                                      ? "bg-brand-blue text-white border-brand-blue"
                                      : "bg-white hover:border-brand-blue"
                                  }`}
                                  onClick={() => toggleArrayField("subjects", subject)}
                                  data-testid={`chip-subject-${subject}`}
                                >
                                  {subject}
                                  {watchedValues.subjects.includes(subject) && <Check className="w-3 h-3 ml-1" />}
                                </Badge>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="grades"
                        render={() => (
                          <FormItem className="mb-5">
                            <FormLabel>Grades You Can Support</FormLabel>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {grades.map((grade) => (
                                <Badge
                                  key={grade}
                                  variant={watchedValues.grades.includes(grade) ? "default" : "outline"}
                                  className={`cursor-pointer transition-all ${
                                    watchedValues.grades.includes(grade)
                                      ? "bg-brand-blue text-white border-brand-blue"
                                      : "bg-white hover:border-brand-blue"
                                  }`}
                                  onClick={() => toggleArrayField("grades", grade)}
                                  data-testid={`chip-grade-${grade}`}
                                >
                                  {grade}
                                  {watchedValues.grades.includes(grade) && <Check className="w-3 h-3 ml-1" />}
                                </Badge>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="experienceLevel"
                        render={({ field }) => (
                          <FormItem className="mb-5">
                            <FormLabel>Experience Level</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-experience">
                                  <SelectValue placeholder="Select experience level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {experienceLevels.map((level) => (
                                  <SelectItem key={level} value={level} data-testid={`option-exp-${level}`}>
                                    {level}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="teachingStyles"
                        render={() => (
                          <FormItem className="mb-5">
                            <FormLabel>Teaching Style</FormLabel>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {teachingStyles.map((style) => (
                                <Badge
                                  key={style}
                                  variant={watchedValues.teachingStyles.includes(style) ? "default" : "outline"}
                                  className={`cursor-pointer transition-all ${
                                    watchedValues.teachingStyles.includes(style)
                                      ? "bg-brand-blue text-white border-brand-blue"
                                      : "bg-white hover:border-brand-blue"
                                  }`}
                                  onClick={() => toggleArrayField("teachingStyles", style)}
                                  data-testid={`chip-style-${style}`}
                                >
                                  {style}
                                  {watchedValues.teachingStyles.includes(style) && <Check className="w-3 h-3 ml-1" />}
                                </Badge>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="availableDays"
                        render={() => (
                          <FormItem className="mb-5">
                            <FormLabel>Available Days</FormLabel>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {days.map((day) => (
                                <Badge
                                  key={day}
                                  variant={watchedValues.availableDays.includes(day) ? "default" : "outline"}
                                  className={`cursor-pointer transition-all ${
                                    watchedValues.availableDays.includes(day)
                                      ? "bg-brand-blue text-white border-brand-blue"
                                      : "bg-white hover:border-brand-blue"
                                  }`}
                                  onClick={() => toggleArrayField("availableDays", day)}
                                  data-testid={`chip-day-${day}`}
                                >
                                  {day}
                                  {watchedValues.availableDays.includes(day) && <Check className="w-3 h-3 ml-1" />}
                                </Badge>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="availableTimeBlocks"
                        render={() => (
                          <FormItem>
                            <FormLabel>Available Time Blocks</FormLabel>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {timeBlocks.map((block) => (
                                <Badge
                                  key={block}
                                  variant={watchedValues.availableTimeBlocks.includes(block) ? "default" : "outline"}
                                  className={`cursor-pointer transition-all ${
                                    watchedValues.availableTimeBlocks.includes(block)
                                      ? "bg-brand-blue text-white border-brand-blue"
                                      : "bg-white hover:border-brand-blue"
                                  }`}
                                  onClick={() => toggleArrayField("availableTimeBlocks", block)}
                                  data-testid={`chip-time-${block}`}
                                >
                                  {block}
                                  {watchedValues.availableTimeBlocks.includes(block) && <Check className="w-3 h-3 ml-1" />}
                                </Badge>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    custom={1}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                    data-testid="step-3-container"
                  >
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
                      <h2 className="text-xl font-bold text-brand-ink mb-6">Micro Skill Check</h2>

                      <FormField
                        control={form.control}
                        name="answer1"
                        render={({ field }) => (
                          <FormItem className="mb-5">
                            <FormLabel>Q1: Explain a hard topic to a weak student in 2 steps.</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Describe your approach..."
                                maxLength={280}
                                className="min-h-[100px]"
                                data-testid="textarea-answer1"
                              />
                            </FormControl>
                            <div className="flex justify-between items-center mt-1">
                              <FormMessage />
                              <span className="text-xs text-brand-muted" data-testid="text-char-count-1">
                                {field.value.length}/280
                              </span>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="answer2"
                        render={({ field }) => (
                          <FormItem className="mb-5">
                            <FormLabel>Q2: How do you handle a distracted student respectfully?</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Describe your approach..."
                                maxLength={280}
                                className="min-h-[100px]"
                                data-testid="textarea-answer2"
                              />
                            </FormControl>
                            <div className="flex justify-between items-center mt-1">
                              <FormMessage />
                              <span className="text-xs text-brand-muted" data-testid="text-char-count-2">
                                {field.value.length}/280
                              </span>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="answer3"
                        render={({ field }) => (
                          <FormItem className="mb-5">
                            <FormLabel>Q3: How do you confirm understanding in 2 minutes?</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Describe your approach..."
                                maxLength={280}
                                className="min-h-[100px]"
                                data-testid="textarea-answer3"
                              />
                            </FormControl>
                            <div className="flex justify-between items-center mt-1">
                              <FormMessage />
                              <span className="text-xs text-brand-muted" data-testid="text-char-count-3">
                                {field.value.length}/280
                              </span>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="videoUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Intro Video URL{" "}
                              <span className="text-brand-muted font-normal">(Optional)</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="https://youtube.com/watch?v=..."
                                data-testid="input-video-url"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    custom={1}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                    data-testid="step-4-container"
                  >
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
                      <h2 className="text-xl font-bold text-brand-ink mb-6">Review Your Application</h2>

                      <div className="space-y-4">
                        <div className="border-b border-brand-card pb-4">
                          <h3 className="font-semibold text-brand-ink mb-2">Basic Information</h3>
                          <div className="grid sm:grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-brand-muted">Name:</span>{" "}
                              <span className="text-brand-ink" data-testid="review-name">{watchedValues.firstName}</span>
                            </div>
                            <div>
                              <span className="text-brand-muted">Country:</span>{" "}
                              <span className="text-brand-ink" data-testid="review-country">{watchedValues.country}</span>
                            </div>
                            <div>
                              <span className="text-brand-muted">Timezone:</span>{" "}
                              <span className="text-brand-ink" data-testid="review-timezone">{watchedValues.timezone}</span>
                            </div>
                            <div>
                              <span className="text-brand-muted">Languages:</span>{" "}
                              <span className="text-brand-ink" data-testid="review-languages">{watchedValues.languages.join(", ")}</span>
                            </div>
                          </div>
                        </div>

                        <div className="border-b border-brand-card pb-4">
                          <h3 className="font-semibold text-brand-ink mb-2">Teaching Fit</h3>
                          <div className="grid sm:grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-brand-muted">Subjects:</span>{" "}
                              <span className="text-brand-ink" data-testid="review-subjects">{watchedValues.subjects.join(", ")}</span>
                            </div>
                            <div>
                              <span className="text-brand-muted">Grades:</span>{" "}
                              <span className="text-brand-ink" data-testid="review-grades">{watchedValues.grades.join(", ")}</span>
                            </div>
                            <div>
                              <span className="text-brand-muted">Experience:</span>{" "}
                              <span className="text-brand-ink" data-testid="review-experience">{watchedValues.experienceLevel}</span>
                            </div>
                            <div>
                              <span className="text-brand-muted">Styles:</span>{" "}
                              <span className="text-brand-ink" data-testid="review-styles">{watchedValues.teachingStyles.join(", ")}</span>
                            </div>
                          </div>
                          <div className="mt-2 text-sm">
                            <span className="text-brand-muted">Availability:</span>{" "}
                            <span className="text-brand-ink" data-testid="review-availability">
                              {watchedValues.availableDays.join(", ")} | {watchedValues.availableTimeBlocks.join(", ")}
                            </span>
                          </div>
                        </div>

                        <div className="border-b border-brand-card pb-4">
                          <h3 className="font-semibold text-brand-ink mb-2">Skill Check Answers</h3>
                          <div className="space-y-3 text-sm">
                            <div>
                              <span className="text-brand-muted block">Q1:</span>
                              <span className="text-brand-ink" data-testid="review-answer1">{watchedValues.answer1}</span>
                            </div>
                            <div>
                              <span className="text-brand-muted block">Q2:</span>
                              <span className="text-brand-ink" data-testid="review-answer2">{watchedValues.answer2}</span>
                            </div>
                            <div>
                              <span className="text-brand-muted block">Q3:</span>
                              <span className="text-brand-ink" data-testid="review-answer3">{watchedValues.answer3}</span>
                            </div>
                            {watchedValues.videoUrl && (
                              <div>
                                <span className="text-brand-muted">Video:</span>{" "}
                                <a
                                  href={watchedValues.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-brand-blue underline"
                                  data-testid="review-video"
                                >
                                  {watchedValues.videoUrl}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name="agreeToTerms"
                          render={({ field }) => (
                            <FormItem className="flex items-start gap-3 space-y-0 pt-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="checkbox-terms"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="cursor-pointer">
                                  I agree to{" "}
                                  <a href="#" className="text-brand-blue underline">
                                    EduBridge policies
                                  </a>
                                </FormLabel>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between mt-8 gap-4">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex items-center gap-2"
                    data-testid="button-back"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 bg-brand-blue hover:bg-brand-blue/90 text-white"
                    data-testid="button-next"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting || !watchedValues.agreeToTerms}
                    className="flex items-center gap-2 bg-brand-blue hover:bg-brand-blue/90 text-white px-8"
                    data-testid="button-submit"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Submit Application
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
