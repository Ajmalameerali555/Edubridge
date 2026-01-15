import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Download, Check, Loader2, FileText, Phone, Mail, User, Lock } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ContactInfo {
  parentName: string;
  studentName: string;
  mobile: string;
  email: string;
  grade: string;
}

interface AssessmentAnswers {
  learningStyle: string;
  academicChallenge: string;
  studyTime: string;
  focusLevel: string;
  motivation: string;
  additionalNotes: string;
}

const grades = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

const learningStyles = [
  "Visual (learns best by seeing)",
  "Auditory (learns best by hearing)",
  "Reading/Writing (learns from text)",
  "Kinesthetic (learns by doing)",
  "Not sure yet",
];

const academicChallenges = [
  "Mathematics concepts",
  "Reading comprehension",
  "Science subjects",
  "Writing and expression",
  "Time management",
  "All subjects equally",
];

const studyTimes = [
  "Less than 1 hour daily",
  "1-2 hours daily",
  "2-3 hours daily",
  "More than 3 hours daily",
  "Irregular study pattern",
];

const focusLevels = [
  "Excellent - stays focused easily",
  "Good - occasional distractions",
  "Average - needs some guidance",
  "Needs improvement - easily distracted",
  "Varies by subject interest",
];

const motivations = [
  "Self-motivated and curious",
  "Responds well to encouragement",
  "Needs structured guidance",
  "Motivated by rewards/goals",
  "Requires constant supervision",
];

export function AssessmentModal({ isOpen, onClose }: AssessmentModalProps) {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    parentName: "",
    studentName: "",
    mobile: "",
    email: "",
    grade: "",
  });

  const [answers, setAnswers] = useState<AssessmentAnswers>({
    learningStyle: "",
    academicChallenge: "",
    studyTime: "",
    focusLevel: "",
    motivation: "",
    additionalNotes: "",
  });

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState("");
  const [errors, setErrors] = useState<Partial<ContactInfo>>({});

  const totalSteps = 7;

  const validateContact = () => {
    const newErrors: Partial<ContactInfo> = {};
    if (!contactInfo.parentName.trim()) newErrors.parentName = "Required";
    if (!contactInfo.studentName.trim()) newErrors.studentName = "Required";
    if (!contactInfo.mobile.trim() || !/^\d{10}$/.test(contactInfo.mobile.replace(/\D/g, ""))) {
      newErrors.mobile = "Valid 10-digit number required";
    }
    if (!contactInfo.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      newErrors.email = "Valid email required";
    }
    if (!contactInfo.grade) newErrors.grade = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    if (!password || password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validateContact()) return;
    }
    if (step === 7) {
      if (!validatePassword()) return;
    }
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setApiError("");
    
    try {
      const registrationData = {
        email: contactInfo.email,
        password: password,
        parentName: contactInfo.parentName,
        studentName: contactInfo.studentName,
        mobile: contactInfo.mobile,
        grade: contactInfo.grade,
        assessment: {
          learningStyle: answers.learningStyle,
          academicFocus: answers.academicChallenge,
          studyHabits: answers.studyTime,
          focusAttention: answers.focusLevel,
          motivation: answers.motivation,
          additionalNotes: answers.additionalNotes,
        },
      };

      await apiRequest("POST", "/api/auth/register", registrationData);
      setIsLoading(false);
      setShowReport(true);
    } catch (error: any) {
      setIsLoading(false);
      const errorMessage = error?.message || "Registration failed. Please try again.";
      setApiError(errorMessage);
    }
  };

  const handleVerifyAndSubmit = () => {
    setShowReport(false);
    handleClose();
    setLocation("/dashboard");
  };

  const handleClose = () => {
    setStep(1);
    setShowReport(false);
    setShowThankYou(false);
    setIsLoading(false);
    setContactInfo({ parentName: "", studentName: "", mobile: "", email: "", grade: "" });
    setAnswers({ learningStyle: "", academicChallenge: "", studyTime: "", focusLevel: "", motivation: "", additionalNotes: "" });
    setPassword("");
    setPasswordError("");
    setApiError("");
    setErrors({});
    onClose();
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`EduBridge_Assessment_${contactInfo.studentName.replace(/\s+/g, "_")}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
    setIsDownloading(false);
  };

  const downloadPNG = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `EduBridge_Assessment_${contactInfo.studentName.replace(/\s+/g, "_")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("PNG generation failed:", error);
    }
    setIsDownloading(false);
  };

  const getRecommendation = () => {
    const challenges = answers.academicChallenge;
    const focus = answers.focusLevel;
    
    if (focus.includes("Needs improvement") || focus.includes("easily distracted")) {
      return "We recommend starting with shorter, focused sessions (25-30 minutes) with regular breaks. Our tutors will use engaging, interactive methods to maintain attention.";
    }
    if (challenges.includes("Mathematics")) {
      return "Our mathematics specialists will focus on building strong foundational concepts through visual aids and practical problem-solving exercises.";
    }
    if (challenges.includes("Science")) {
      return "Our science tutors use experiment-based learning and real-world examples to make complex concepts accessible and engaging.";
    }
    return "Based on the assessment, we recommend a balanced approach with personalized attention to strengthen core academic skills while building confidence.";
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-[24px] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            data-testid="button-close-modal"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {isLoading && (
            <div className="p-8 sm:p-12 flex flex-col items-center justify-center min-h-[500px]">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-brand-blue/20 border-t-brand-blue animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-brand-blue" />
                </div>
              </div>
              <h3 className="mt-8 text-xl font-bold text-brand-ink">Generating Your Learning Snapshot</h3>
              <p className="mt-3 text-brand-muted text-center max-w-sm">
                Our experts are analyzing the responses to create a personalized assessment report...
              </p>
              <div className="mt-6 flex gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 rounded-full bg-brand-blue"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          )}

          {showThankYou && (
            <div className="p-8 sm:p-12 flex flex-col items-center justify-center min-h-[500px] text-center">
              <div className="w-20 h-20 rounded-full bg-brand-mint/10 flex items-center justify-center mb-6">
                <Check className="w-10 h-10 text-brand-mint" />
              </div>
              <h3 className="text-2xl font-black text-brand-ink mb-4">Thank You!</h3>
              <p className="text-brand-muted max-w-md mb-6 leading-relaxed">
                Your Learning Snapshot has been submitted successfully. Our academic advisors will review the assessment and contact you within 24-48 hours to discuss the best learning plan for {contactInfo.studentName}.
              </p>
              <p className="text-sm text-brand-muted mb-8">
                A copy of the report has been sent to <span className="font-semibold text-brand-ink">{contactInfo.email}</span>
              </p>
              <button
                onClick={handleClose}
                className="px-8 py-4 rounded-full bg-brand-blue text-white font-bold hover:bg-brand-blue/90 transition-colors"
                data-testid="button-close-thankyou"
              >
                Back to Home
              </button>
            </div>
          )}

          {showReport && !showThankYou && (
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-brand-ink">Learning Snapshot Report</h3>
                <div className="flex gap-2">
                  <button
                    onClick={downloadPDF}
                    disabled={isDownloading}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue text-white text-sm font-semibold hover:bg-brand-blue/90 transition-colors disabled:opacity-50"
                    data-testid="button-download-pdf"
                  >
                    {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    PDF
                  </button>
                  <button
                    onClick={downloadPNG}
                    disabled={isDownloading}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-ink text-white text-sm font-semibold hover:bg-brand-ink/90 transition-colors disabled:opacity-50"
                    data-testid="button-download-png"
                  >
                    {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    PNG
                  </button>
                </div>
              </div>

              <div ref={reportRef} className="bg-white p-8 border border-gray-200 rounded-xl">
                <div className="border-b-2 border-brand-blue pb-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-black text-brand-blue">EDUBRIDGE LEARNING</h1>
                      <p className="text-sm text-brand-muted mt-1">Bridging Knowledge, Building Futures</p>
                    </div>
                    <div className="text-right text-sm text-brand-muted">
                      <p>Assessment Date: {new Date().toLocaleDateString()}</p>
                      <p>Report ID: EB-{Date.now().toString().slice(-6)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-brand-bg rounded-xl p-5 mb-6">
                  <h2 className="text-sm font-bold text-brand-muted uppercase tracking-wider mb-4">Student Information</h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-brand-muted">Student Name:</span>
                      <p className="font-bold text-brand-ink">{contactInfo.studentName}</p>
                    </div>
                    <div>
                      <span className="text-brand-muted">Grade:</span>
                      <p className="font-bold text-brand-ink">Grade {contactInfo.grade}</p>
                    </div>
                    <div>
                      <span className="text-brand-muted">Parent/Guardian:</span>
                      <p className="font-bold text-brand-ink">{contactInfo.parentName}</p>
                    </div>
                    <div>
                      <span className="text-brand-muted">Contact:</span>
                      <p className="font-bold text-brand-ink">{contactInfo.mobile}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-sm font-bold text-brand-muted uppercase tracking-wider mb-4">Assessment Findings</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-brand-blue font-bold text-sm">1</span>
                      </div>
                      <div>
                        <p className="font-semibold text-brand-ink text-sm">Learning Style</p>
                        <p className="text-brand-muted text-sm">{answers.learningStyle || "Not specified"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-brand-mint/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-brand-mint font-bold text-sm">2</span>
                      </div>
                      <div>
                        <p className="font-semibold text-brand-ink text-sm">Primary Academic Focus Area</p>
                        <p className="text-brand-muted text-sm">{answers.academicChallenge || "Not specified"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 font-bold text-sm">3</span>
                      </div>
                      <div>
                        <p className="font-semibold text-brand-ink text-sm">Study Habits</p>
                        <p className="text-brand-muted text-sm">{answers.studyTime || "Not specified"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-amber-600 font-bold text-sm">4</span>
                      </div>
                      <div>
                        <p className="font-semibold text-brand-ink text-sm">Focus & Attention Level</p>
                        <p className="text-brand-muted text-sm">{answers.focusLevel || "Not specified"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-pink-50 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-pink-600 font-bold text-sm">5</span>
                      </div>
                      <div>
                        <p className="font-semibold text-brand-ink text-sm">Motivation Pattern</p>
                        <p className="text-brand-muted text-sm">{answers.motivation || "Not specified"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {answers.additionalNotes && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                    <h2 className="text-sm font-bold text-brand-muted uppercase tracking-wider mb-2">Additional Notes</h2>
                    <p className="text-sm text-brand-ink">{answers.additionalNotes}</p>
                  </div>
                )}

                <div className="mb-6 p-5 bg-brand-blue/5 border border-brand-blue/20 rounded-xl">
                  <h2 className="text-sm font-bold text-brand-blue uppercase tracking-wider mb-3">Our Recommendation</h2>
                  <p className="text-sm text-brand-ink leading-relaxed">{getRecommendation()}</p>
                </div>

                <div className="border-t-2 border-gray-100 pt-6 mt-6">
                  <p className="text-xs text-brand-muted text-center">
                    This assessment is based on the information provided and serves as an initial learning profile.
                    A detailed learning plan will be created after the Snapshot Session with our academic advisor.
                  </p>
                  <p className="text-xs text-brand-muted text-center mt-2">
                    EduBridge Learning | www.edubridgelearning.com | support@edubridgelearning.com
                  </p>
                </div>
              </div>

              <div className="mt-6 p-5 bg-amber-50 border border-amber-200 rounded-xl">
                <h4 className="font-bold text-amber-800 mb-2">Parent Verification Required</h4>
                <p className="text-sm text-amber-700 mb-4">
                  Please review the findings above. By submitting, you confirm that the information provided is accurate to the best of your knowledge.
                </p>
                <button
                  onClick={handleVerifyAndSubmit}
                  className="w-full py-4 rounded-full bg-brand-blue text-white font-bold hover:bg-brand-blue/90 transition-colors"
                  data-testid="button-verify-submit"
                >
                  Verify & Submit Assessment
                </button>
              </div>
            </div>
          )}

          {!isLoading && !showReport && !showThankYou && (
            <div className="p-6 sm:p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
                    Step {step} of {totalSteps}
                  </span>
                  <span className="text-xs text-brand-muted font-medium">
                    {Math.round((step / totalSteps) * 100)}% Complete
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-brand-blue to-brand-mint rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(step / totalSteps) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-black text-brand-ink mb-2">Let's Get Started</h2>
                    <p className="text-brand-muted mb-6">Please provide your contact details so we can personalize your child's learning journey.</p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-brand-ink mb-2">
                          <User className="w-4 h-4 inline mr-2" />
                          Parent/Guardian Name *
                        </label>
                        <input
                          type="text"
                          value={contactInfo.parentName}
                          onChange={(e) => setContactInfo({ ...contactInfo, parentName: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl border-2 ${errors.parentName ? "border-red-400 bg-red-50" : "border-gray-200"} focus:border-brand-blue focus:outline-none transition-colors`}
                          placeholder="Enter your full name"
                          data-testid="input-parent-name"
                        />
                        {errors.parentName && <p className="text-red-500 text-sm mt-1">{errors.parentName}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-brand-ink mb-2">
                          <User className="w-4 h-4 inline mr-2" />
                          Student Name *
                        </label>
                        <input
                          type="text"
                          value={contactInfo.studentName}
                          onChange={(e) => setContactInfo({ ...contactInfo, studentName: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl border-2 ${errors.studentName ? "border-red-400 bg-red-50" : "border-gray-200"} focus:border-brand-blue focus:outline-none transition-colors`}
                          placeholder="Enter student's full name"
                          data-testid="input-student-name"
                        />
                        {errors.studentName && <p className="text-red-500 text-sm mt-1">{errors.studentName}</p>}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-brand-ink mb-2">
                            <Phone className="w-4 h-4 inline mr-2" />
                            Mobile Number *
                          </label>
                          <input
                            type="tel"
                            value={contactInfo.mobile}
                            onChange={(e) => setContactInfo({ ...contactInfo, mobile: e.target.value })}
                            className={`w-full px-4 py-3 rounded-xl border-2 ${errors.mobile ? "border-red-400 bg-red-50" : "border-gray-200"} focus:border-brand-blue focus:outline-none transition-colors`}
                            placeholder="10-digit mobile"
                            data-testid="input-mobile"
                          />
                          {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-brand-ink mb-2">
                            <Mail className="w-4 h-4 inline mr-2" />
                            Email Address *
                          </label>
                          <input
                            type="email"
                            value={contactInfo.email}
                            onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                            className={`w-full px-4 py-3 rounded-xl border-2 ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200"} focus:border-brand-blue focus:outline-none transition-colors`}
                            placeholder="your@email.com"
                            data-testid="input-email"
                          />
                          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-brand-ink mb-3">Student's Grade *</label>
                        <div className="grid grid-cols-5 gap-2">
                          {grades.map((grade) => (
                            <button
                              key={grade}
                              type="button"
                              onClick={() => setContactInfo({ ...contactInfo, grade })}
                              className={`py-3 rounded-xl font-bold transition-all ${
                                contactInfo.grade === grade
                                  ? "bg-brand-blue text-white shadow-lg"
                                  : "bg-gray-100 text-brand-ink hover:bg-gray-200"
                              }`}
                              data-testid={`button-grade-${grade}`}
                            >
                              {grade}
                            </button>
                          ))}
                        </div>
                        {errors.grade && <p className="text-red-500 text-sm mt-2">{errors.grade}</p>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-black text-brand-ink mb-2">Learning Style</h2>
                    <p className="text-brand-muted mb-6">How does {contactInfo.studentName || "your child"} learn best?</p>
                    <div className="space-y-3">
                      {learningStyles.map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => setAnswers({ ...answers, learningStyle: style })}
                          className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
                            answers.learningStyle === style
                              ? "border-brand-blue bg-brand-blue/5 text-brand-ink font-semibold"
                              : "border-gray-200 hover:border-gray-300 text-brand-ink"
                          }`}
                          data-testid={`option-learning-${style.slice(0, 10)}`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-black text-brand-ink mb-2">Academic Focus</h2>
                    <p className="text-brand-muted mb-6">Which area needs the most attention?</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {academicChallenges.map((challenge) => (
                        <button
                          key={challenge}
                          type="button"
                          onClick={() => setAnswers({ ...answers, academicChallenge: challenge })}
                          className={`text-left px-5 py-4 rounded-xl border-2 transition-all ${
                            answers.academicChallenge === challenge
                              ? "border-brand-blue bg-brand-blue/5 text-brand-ink font-semibold"
                              : "border-gray-200 hover:border-gray-300 text-brand-ink"
                          }`}
                          data-testid={`option-challenge-${challenge.slice(0, 10)}`}
                        >
                          {challenge}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-black text-brand-ink mb-2">Study Habits</h2>
                    <p className="text-brand-muted mb-6">How much time does {contactInfo.studentName || "your child"} typically spend studying?</p>
                    <div className="space-y-3">
                      {studyTimes.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setAnswers({ ...answers, studyTime: time })}
                          className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
                            answers.studyTime === time
                              ? "border-brand-blue bg-brand-blue/5 text-brand-ink font-semibold"
                              : "border-gray-200 hover:border-gray-300 text-brand-ink"
                          }`}
                          data-testid={`option-study-${time.slice(0, 10)}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-black text-brand-ink mb-2">Focus & Attention</h2>
                    <p className="text-brand-muted mb-6">How would you describe {contactInfo.studentName || "your child"}'s focus during studies?</p>
                    <div className="space-y-3">
                      {focusLevels.map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setAnswers({ ...answers, focusLevel: level })}
                          className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
                            answers.focusLevel === level
                              ? "border-brand-blue bg-brand-blue/5 text-brand-ink font-semibold"
                              : "border-gray-200 hover:border-gray-300 text-brand-ink"
                          }`}
                          data-testid={`option-focus-${level.slice(0, 10)}`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 6 && (
                  <motion.div
                    key="step6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-black text-brand-ink mb-2">Motivation Style</h2>
                    <p className="text-brand-muted mb-6">What best describes {contactInfo.studentName || "your child"}'s motivation?</p>
                    <div className="space-y-3">
                      {motivations.map((motivation) => (
                        <button
                          key={motivation}
                          type="button"
                          onClick={() => setAnswers({ ...answers, motivation })}
                          className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
                            answers.motivation === motivation
                              ? "border-brand-blue bg-brand-blue/5 text-brand-ink font-semibold"
                              : "border-gray-200 hover:border-gray-300 text-brand-ink"
                          }`}
                          data-testid={`option-motivation-${motivation.slice(0, 10)}`}
                        >
                          {motivation}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 7 && (
                  <motion.div
                    key="step7"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-black text-brand-ink mb-2">Final Step</h2>
                    <p className="text-brand-muted mb-6">Create your account password and add any additional notes about {contactInfo.studentName || "your child"}.</p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-brand-ink mb-2">
                          <Lock className="w-4 h-4 inline mr-2" />
                          Create Password *
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border-2 ${passwordError ? "border-red-400 bg-red-50" : "border-gray-200"} focus:border-brand-blue focus:outline-none transition-colors`}
                          placeholder="Minimum 6 characters"
                          data-testid="input-password"
                        />
                        {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                        <p className="text-xs text-brand-muted mt-1">This will be your login password</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-brand-ink mb-2">Additional Notes (Optional)</label>
                        <textarea
                          value={answers.additionalNotes}
                          onChange={(e) => setAnswers({ ...answers, additionalNotes: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-blue focus:outline-none transition-colors min-h-[120px] resize-none"
                          placeholder="Any specific concerns, learning goals, or important information about your child..."
                          data-testid="input-additional-notes"
                        />
                      </div>

                      {apiError && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                          <p className="text-red-600 text-sm font-medium">{apiError}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={handleBack}
                  disabled={step === 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                    step === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-brand-muted hover:text-brand-ink hover:bg-gray-100"
                  }`}
                  data-testid="button-back"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-8 py-4 rounded-full bg-brand-blue text-white font-bold hover:bg-brand-blue/90 transition-all shadow-lg shadow-brand-blue/20"
                  data-testid="button-next"
                >
                  {step === totalSteps ? "Generate Report" : "Next"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
