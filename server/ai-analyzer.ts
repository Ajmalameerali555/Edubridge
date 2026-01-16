import { checkPolicy } from "./policy-engine";

export interface TutorApplicationProfile {
  firstName: string;
  email?: string;
  country: string;
  timezone: string;
  languages: string[];
  subjects: string[];
  gradesSupported: string[];
  experienceLevel: string;
  teachingStyleTags: string[];
  availability: {
    days: string[];
    slots: string[];
  };
  shortBio?: string;
  introVideoUrl?: string;
}

export interface TutorApplicationSkillCheck {
  microTeachingAnswers: {
    q1: string;
    q2: string;
    q3: string;
  };
}

export interface TutorApplication {
  profile: TutorApplicationProfile;
  skillCheck: TutorApplicationSkillCheck;
}

export interface DimensionScores {
  clarity: number;
  structure: number;
  empathy: number;
  subjectFit: number;
  communication: number;
  reliability: number;
  policyCompliance: number;
  availability: number;
}

export interface AnalysisResult {
  qualityScore: number;
  dimensionScores: DimensionScores;
  riskFlags: string[];
  improvementChecklist: string[];
  autoSummary: string;
}

const STEP_KEYWORDS = ["first", "then", "step 1", "step 2", "1.", "2.", "1)", "2)", "next", "finally", "after that"];
const STUDENT_FOCUSED_KEYWORDS = ["student", "child", "they", "them", "learner", "their", "kid", "pupil"];
const ACTION_KEYWORDS = ["explain", "show", "demonstrate", "ask", "check", "practice", "review", "help", "guide", "break down", "simplify"];
const RESPECTFUL_KEYWORDS = ["gently", "calmly", "patiently", "kindly", "respectfully", "understanding", "supportive", "encourage"];
const EMPATHY_KEYWORDS = ["understand", "feel", "struggle", "challenge", "difficult", "okay", "normal", "patience", "time", "support"];

function scoreCompleteness(profile: TutorApplicationProfile): number {
  let score = 0;
  const maxScore = 20;
  
  if (profile.firstName?.length >= 2) score += 2;
  if (profile.country) score += 2;
  if (profile.timezone) score += 2;
  if (profile.languages?.length > 0) score += 2;
  if (profile.subjects?.length > 0) score += 3;
  if (profile.gradesSupported?.length > 0) score += 3;
  if (profile.experienceLevel) score += 2;
  if (profile.teachingStyleTags?.length > 0) score += 2;
  if (profile.availability?.days?.length > 0 && profile.availability?.slots?.length > 0) score += 2;
  
  return Math.min(score, maxScore);
}

function scoreAvailability(profile: TutorApplicationProfile): number {
  let score = 0;
  const maxScore = 15;
  
  const days = profile.availability?.days?.length || 0;
  const slots = profile.availability?.slots?.length || 0;
  
  if (days >= 5) score += 8;
  else if (days >= 3) score += 5;
  else if (days >= 1) score += 2;
  
  if (slots >= 3) score += 7;
  else if (slots >= 2) score += 4;
  else if (slots >= 1) score += 2;
  
  return Math.min(score, maxScore);
}

function scoreSubjectGradeFit(profile: TutorApplicationProfile): number {
  let score = 0;
  const maxScore = 10;
  
  const subjects = profile.subjects?.length || 0;
  const grades = profile.gradesSupported?.length || 0;
  
  if (subjects >= 3) score += 5;
  else if (subjects >= 2) score += 3;
  else if (subjects >= 1) score += 2;
  
  if (grades >= 3) score += 5;
  else if (grades >= 2) score += 3;
  else if (grades >= 1) score += 2;
  
  return Math.min(score, maxScore);
}

function scoreMicroTeaching(skillCheck: TutorApplicationSkillCheck): { score: number; details: { clarity: number; structure: number; empathy: number; communication: number } } {
  const answers = [
    skillCheck.microTeachingAnswers?.q1 || "",
    skillCheck.microTeachingAnswers?.q2 || "",
    skillCheck.microTeachingAnswers?.q3 || "",
  ];
  
  let clarity = 0;
  let structure = 0;
  let empathy = 0;
  let communication = 0;
  
  answers.forEach(answer => {
    const lowerAnswer = answer.toLowerCase();
    
    const hasSteps = STEP_KEYWORDS.some(kw => lowerAnswer.includes(kw));
    if (hasSteps) structure += 4;
    
    const hasStudentFocus = STUDENT_FOCUSED_KEYWORDS.some(kw => lowerAnswer.includes(kw));
    if (hasStudentFocus) clarity += 3;
    
    const hasActions = ACTION_KEYWORDS.some(kw => lowerAnswer.includes(kw));
    if (hasActions) clarity += 2;
    
    const hasRespect = RESPECTFUL_KEYWORDS.some(kw => lowerAnswer.includes(kw));
    if (hasRespect) empathy += 3;
    
    const hasEmpathy = EMPATHY_KEYWORDS.some(kw => lowerAnswer.includes(kw));
    if (hasEmpathy) empathy += 2;
    
    if (answer.length >= 100 && answer.length <= 280) communication += 3;
    else if (answer.length >= 50) communication += 2;
    
    const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length >= 2 && sentences.length <= 5) communication += 2;
  });
  
  clarity = Math.min(clarity, 12);
  structure = Math.min(structure, 12);
  empathy = Math.min(empathy, 8);
  communication = Math.min(communication, 10);
  
  const totalScore = Math.min(clarity + structure + empathy + communication, 35);
  
  return {
    score: totalScore,
    details: {
      clarity: Math.round((clarity / 12) * 100),
      structure: Math.round((structure / 12) * 100),
      empathy: Math.round((empathy / 8) * 100),
      communication: Math.round((communication / 10) * 100),
    }
  };
}

function scorePolicyCompliance(application: TutorApplication): { score: number; hasViolation: boolean } {
  const textsToCheck = [
    application.skillCheck?.microTeachingAnswers?.q1 || "",
    application.skillCheck?.microTeachingAnswers?.q2 || "",
    application.skillCheck?.microTeachingAnswers?.q3 || "",
    application.profile?.shortBio || "",
  ];
  
  let hasViolation = false;
  
  for (const text of textsToCheck) {
    const result = checkPolicy(text);
    if (result.blocked) {
      hasViolation = true;
      break;
    }
  }
  
  return {
    score: hasViolation ? 0 : 10,
    hasViolation
  };
}

export function evaluateTutorApplication(application: TutorApplication): AnalysisResult {
  const profile = application.profile || {} as TutorApplicationProfile;
  const skillCheck = application.skillCheck || { microTeachingAnswers: { q1: "", q2: "", q3: "" } };
  
  const completenessScore = scoreCompleteness(profile);
  const availabilityScore = scoreAvailability(profile);
  const subjectFitScore = scoreSubjectGradeFit(profile);
  const microTeachingResult = scoreMicroTeaching(skillCheck);
  const policyResult = scorePolicyCompliance(application);
  
  const totalScore = Math.min(
    completenessScore + 
    availabilityScore + 
    subjectFitScore + 
    microTeachingResult.score + 
    policyResult.score,
    100
  );
  
  const riskFlags: string[] = [];
  const improvementChecklist: string[] = [];
  
  if (availabilityScore < 5) {
    riskFlags.push("low_availability");
    improvementChecklist.push("Add more available days and time slots to increase your chances");
  }
  
  if (microTeachingResult.score < 15) {
    riskFlags.push("weak_demo");
    improvementChecklist.push("Include step-by-step explanations in your teaching answers");
    improvementChecklist.push("Show how you focus on the student's understanding");
  }
  
  if (completenessScore < 15) {
    riskFlags.push("missing_profile_fields");
    improvementChecklist.push("Complete all profile fields including subjects and grades");
  }
  
  if (policyResult.hasViolation) {
    riskFlags.push("policy_risk");
    improvementChecklist.push("Remove any contact information or external platform references");
  }
  
  if (microTeachingResult.details.empathy < 50) {
    improvementChecklist.push("Show more empathy and patience in your teaching approach");
  }
  
  const dimensionScores: DimensionScores = {
    clarity: microTeachingResult.details.clarity,
    structure: microTeachingResult.details.structure,
    empathy: microTeachingResult.details.empathy,
    communication: microTeachingResult.details.communication,
    subjectFit: Math.round((subjectFitScore / 10) * 100),
    reliability: Math.round((completenessScore / 20) * 100),
    policyCompliance: policyResult.score * 10,
    availability: Math.round((availabilityScore / 15) * 100),
  };
  
  let summary = "";
  if (totalScore >= 90) {
    summary = "Excellent candidate with strong teaching skills and high availability.";
  } else if (totalScore >= 80) {
    summary = "Strong candidate with good teaching methodology and communication.";
  } else if (totalScore >= 70) {
    summary = "Meets requirements with room for improvement in some areas.";
  } else if (totalScore >= 50) {
    summary = "Needs improvement in teaching demonstrations and/or availability.";
  } else {
    summary = "Application requires significant improvements before review.";
  }
  
  return {
    qualityScore: totalScore,
    dimensionScores,
    riskFlags,
    improvementChecklist: improvementChecklist.slice(0, 5),
    autoSummary: summary,
  };
}
