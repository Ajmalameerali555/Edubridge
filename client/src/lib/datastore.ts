const DB_KEY = "edubridge_db_v1";

export type UserRole = "student" | "tutor" | "admin" | "parent";

export interface User {
  id: string;
  role: UserRole;
  firstName: string;
  lastName?: string;
  email: string;
  mobile: string;
  passwordHash: string;
  isActive: boolean;
  createdAt: string;
}

export interface StudentSignals {
  confidence: number;
  memory: number;
  language: number;
  foundation: number;
}

export interface Student {
  id: string;
  userId: string;
  parentId?: string;
  grade: string;
  subjects: string[];
  track: string;
  blockers: string[];
  signals: StudentSignals;
  createdAt: string;
}

export interface Tutor {
  id: string;
  userId: string;
  subjects: string[];
  gradesSupported: string[];
  languages: string[];
  availability: string[];
  rating: number;
  isActive: boolean;
  createdAt: string;
}

export interface QuestionnaireAnswers {
  learningStyle?: string;
  academicFocus?: string;
  studyHabits?: string;
  focusAttention?: string;
  motivation?: string;
  additionalNotes?: string;
}

export interface QuestionnaireDerived {
  track: string;
  blockers: string[];
  signals: StudentSignals;
}

export interface Questionnaire {
  id: string;
  parentId: string;
  studentTemp: {
    firstName?: string;
    grade: string;
    subjects: string[];
  };
  answers: QuestionnaireAnswers;
  derived: QuestionnaireDerived;
  status: "new" | "reviewed" | "assigned" | "scheduled" | "active";
  createdAt: string;
}

export interface Session {
  id: string;
  studentId: string;
  tutorId: string;
  subject: string;
  startAt: string;
  durationMin: number;
  meetLink: string;
  status: "upcoming" | "live" | "done" | "missed";
  createdAt: string;
}


export interface SessionReport {
  id: string;
  sessionId: string;
  studentId: string;
  tutorId: string;
  createdAt: string;
  overallScore: number; // 1-10
  summary: string;
  whatWentWell: string[];
  whatToImprove: string[];
  actionItems: string[];
  tutorNotes?: string;
}

export interface Assignment {
  id: string;
  studentId: string;
  tutorId?: string;
  subject: string;
  title: string;
  description?: string;
  dueAt: string;
  status: "assigned" | "submitted" | "graded";
  submissionUrl?: string;
  grade?: string;
  feedback?: string;
  createdAt: string;
}

export interface Quiz {
  id: string;
  studentId: string;
  tutorId?: string;
  subject: string;
  title: string;
  questions: { id: string; q: string; options: string[]; answerIndex: number }[];
  status: "assigned" | "attempted" | "graded";
  score?: number;
  createdAt: string;
}


export interface Note {
  id: string;
  sessionId: string;
  tutorId: string;
  studentId: string;
  coveredTopic: string;
  studentResponse: number;
  issues: string[];
  nextFocus: string;
  homeworkId?: string;
  privateNote: string;
  createdAt: string;
}

export interface HomeworkItem {
  id: string;
  question: string;
  answer?: string;
}

export interface Homework {
  id: string;
  studentId: string;
  tutorId: string;
  subject: string;
  title: string;
  items: HomeworkItem[];
  dueAt: string;
  status: "assigned" | "submitted" | "reviewed";
  createdAt: string;
}

export interface Message {
  id: string;
  threadId: string;
  studentId: string;
  fromUserId: string;
  toUserId: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface Incident {
  id: string;
  type: "contact_share_attempt" | "external_link_attempt" | "policy_violation";
  severity: "low" | "medium" | "high";
  actorUserId: string;
  studentId?: string;
  tutorId?: string;
  messageSnippet: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  forRole: UserRole;
  type: "session_live" | "policy_block" | "incident_logged" | "questionnaire_new";
  payload: Record<string, unknown>;
  createdAt: string;
  read: boolean;
}

export interface Settings {
  decoderRules: {
    trackMappings: Record<string, string>;
    blockerKeywords: string[];
  };
  communicationControls: {
    maskPhoneEmail: boolean;
    blockPhoneEmailSharing: boolean;
    blockExternalLinks: boolean;
    blockedKeywords: string[];
  };
  sessionPolicies: {
    meetLinkLockedAfterSchedule: boolean;
    adminNotificationLevel: "all" | "important" | "none";
  };
  templates: {
    homework: { id: string; title: string; subject: string; items: string[] }[];
    reports: { id: string; name: string; template: string }[];
    tutorNotes: { id: string; name: string; template: string }[];
  };
  branding: {
    appName: string;
    supportEmail: string;
    footerText: string;
  };
}

export interface Database {
  users: User[];
  students: Student[];
  tutors: Tutor[];
  questionnaires: Questionnaire[];
  sessions: Session[];
  sessionReports: SessionReport[];
  assignments: Assignment[];
  quizzes: Quiz[];
  notes: Note[];
  homework: Homework[];
  messages: Message[];
  incidents: Incident[];
  notifications: Notification[];
  settings: Settings;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

function simpleHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return "hash_" + Math.abs(hash).toString(16);
}

export function verifyPassword(password: string, hash: string): boolean {
  return simpleHash(password) === hash;
}

export function hashPassword(password: string): string {
  return simpleHash(password);
}

function getDefaultSettings(): Settings {
  return {
    decoderRules: {
      trackMappings: {
        visual: "Visual Learner Track",
        auditory: "Auditory Learner Track",
        kinesthetic: "Hands-on Learner Track",
        reading: "Reading/Writing Track",
      },
      blockerKeywords: ["memory", "focus", "language", "foundation"],
    },
    communicationControls: {
      maskPhoneEmail: true,
      blockPhoneEmailSharing: true,
      blockExternalLinks: true,
      blockedKeywords: [
        "whatsapp",
        "call me",
        "telegram",
        "dm",
        "number",
        "mobile",
        "contact",
        "phone",
        "email me",
      ],
    },
    sessionPolicies: {
      meetLinkLockedAfterSchedule: true,
      adminNotificationLevel: "important",
    },
    templates: {
      homework: [
        {
          id: "hw1",
          title: "Math Practice",
          subject: "Mathematics",
          items: ["Solve 10 addition problems", "Complete worksheet page 5"],
        },
        {
          id: "hw2",
          title: "Reading Comprehension",
          subject: "English",
          items: ["Read chapter 3", "Answer questions 1-5"],
        },
      ],
      reports: [
        {
          id: "rpt1",
          name: "Weekly Progress",
          template: "Student showed improvement in {subject}...",
        },
      ],
      tutorNotes: [
        {
          id: "tn1",
          name: "Standard Session Note",
          template: "Covered {topic}. Student response: {response}/5",
        },
      ],
    },
    branding: {
      appName: "EduBridge Learning",
      supportEmail: "support@edubridge.com",
      footerText: "Empowering students through personalized learning",
    },
  };
}

function createSeedData(): Database {
  const now = new Date().toISOString();
  const yesterday = new Date(Date.now() - 86400000).toISOString();
  const tomorrow = new Date(Date.now() + 86400000).toISOString();
  const inTwoHours = new Date(Date.now() + 7200000).toISOString();

  const adminUser: User = {
    id: "user_admin1",
    role: "admin",
    firstName: "Admin",
    lastName: "User",
    email: "admin@edubridge.com",
    mobile: "9999999999",
    passwordHash: simpleHash("admin123"),
    isActive: true,
    createdAt: now,
  };

  const tutor1User: User = {
    id: "user_tutor1",
    role: "tutor",
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya@edubridge.com",
    mobile: "9888888881",
    passwordHash: simpleHash("tutor123"),
    isActive: true,
    createdAt: now,
  };

  const tutor2User: User = {
    id: "user_tutor2",
    role: "tutor",
    firstName: "Rahul",
    lastName: "Verma",
    email: "rahul@edubridge.com",
    mobile: "9888888882",
    passwordHash: simpleHash("tutor123"),
    isActive: true,
    createdAt: now,
  };

  const parent1User: User = {
    id: "user_parent1",
    role: "parent",
    firstName: "Anita",
    lastName: "Gupta",
    email: "anita@gmail.com",
    mobile: "9777777771",
    passwordHash: simpleHash("parent123"),
    isActive: true,
    createdAt: now,
  };

  const parent2User: User = {
    id: "user_parent2",
    role: "parent",
    firstName: "Suresh",
    lastName: "Kumar",
    email: "suresh@gmail.com",
    mobile: "9777777772",
    passwordHash: simpleHash("parent123"),
    isActive: true,
    createdAt: now,
  };

  const student1User: User = {
    id: "user_student1",
    role: "student",
    firstName: "Arjun",
    lastName: "Gupta",
    email: "arjun@edubridge.com",
    mobile: "9666666661",
    passwordHash: simpleHash("student123"),
    isActive: true,
    createdAt: now,
  };

  const student2User: User = {
    id: "user_student2",
    role: "student",
    firstName: "Meera",
    lastName: "Kumar",
    email: "meera@edubridge.com",
    mobile: "9666666662",
    passwordHash: simpleHash("student123"),
    isActive: true,
    createdAt: now,
  };

  const tutor1: Tutor = {
    id: "tutor1",
    userId: "user_tutor1",
    subjects: ["Mathematics", "Science"],
    gradesSupported: ["5", "6", "7", "8"],
    languages: ["English", "Hindi"],
    availability: ["Mon 4-6PM", "Wed 4-6PM", "Fri 4-6PM"],
    rating: 4.8,
    isActive: true,
    createdAt: now,
  };

  const tutor2: Tutor = {
    id: "tutor2",
    userId: "user_tutor2",
    subjects: ["English", "Social Studies"],
    gradesSupported: ["4", "5", "6", "7"],
    languages: ["English", "Hindi", "Marathi"],
    availability: ["Tue 5-7PM", "Thu 5-7PM", "Sat 10AM-12PM"],
    rating: 4.6,
    isActive: true,
    createdAt: now,
  };

  const student1: Student = {
    id: "student1",
    userId: "user_student1",
    parentId: "user_parent1",
    grade: "6",
    subjects: ["Mathematics", "Science"],
    track: "Visual Learner Track",
    blockers: ["memory"],
    signals: { confidence: 70, memory: 55, language: 80, foundation: 75 },
    createdAt: now,
  };

  const student2: Student = {
    id: "student2",
    userId: "user_student2",
    parentId: "user_parent2",
    grade: "5",
    subjects: ["English", "Mathematics"],
    track: "Reading/Writing Track",
    blockers: ["focus"],
    signals: { confidence: 65, memory: 70, language: 60, foundation: 80 },
    createdAt: now,
  };

  const session1: Session = {
    id: "session1",
    studentId: "student1",
    tutorId: "tutor1",
    subject: "Mathematics",
    startAt: inTwoHours,
    durationMin: 45,
    meetLink: "https://meet.edubridge.com/session1",
    status: "upcoming",
    createdAt: now,
  };

  const session2: Session = {
    id: "session2",
    studentId: "student1",
    tutorId: "tutor1",
    subject: "Science",
    startAt: yesterday,
    durationMin: 45,
    meetLink: "https://meet.edubridge.com/session2",
    status: "done",
    createdAt: yesterday,
  };

  const session3: Session = {
    id: "session3",
    studentId: "student2",
    tutorId: "tutor2",
    subject: "English",
    startAt: tomorrow,
    durationMin: 45,
    meetLink: "https://meet.edubridge.com/session3",
    status: "upcoming",
    createdAt: now,
  };

  const note1: Note = {
    id: "note1",
    sessionId: "session2",
    tutorId: "tutor1",
    studentId: "student1",
    coveredTopic: "Fractions and Decimals",
    studentResponse: 4,
    issues: [],
    nextFocus: "Division of fractions",
    privateNote: "Student is progressing well",
    createdAt: yesterday,
  };

  const homework1: Homework = {
    id: "homework1",
    studentId: "student1",
    tutorId: "tutor1",
    subject: "Mathematics",
    title: "Fraction Practice",
    items: [
      { id: "item1", question: "Solve: 1/2 + 1/4" },
      { id: "item2", question: "Convert 0.75 to fraction" },
      { id: "item3", question: "Simplify: 6/8" },
    ],
    dueAt: tomorrow,
    status: "assigned",
    createdAt: now,
  };

  const homework2: Homework = {
    id: "homework2",
    studentId: "student2",
    tutorId: "tutor2",
    subject: "English",
    title: "Reading Comprehension",
    items: [
      { id: "item1", question: "Read passage and identify main idea" },
      { id: "item2", question: "List 5 new vocabulary words" },
    ],
    dueAt: tomorrow,
    status: "assigned",
    createdAt: now,
  };

  const message1: Message = {
    id: "msg1",
    threadId: "thread_student1_tutor1",
    studentId: "student1",
    fromUserId: "user_tutor1",
    toUserId: "user_student1",
    body: "Great progress in today's session! Keep practicing the fraction problems.",
    createdAt: yesterday,
    read: true,
  };

  const message2: Message = {
    id: "msg2",
    threadId: "thread_student1_tutor1",
    studentId: "student1",
    fromUserId: "user_student1",
    toUserId: "user_tutor1",
    body: "Thank you! I will complete the homework by tomorrow.",
    createdAt: yesterday,
    read: true,
  };

  const notification1: Notification = {
    id: "notif1",
    forRole: "admin",
    type: "session_live",
    payload: { sessionId: "session1", studentName: "Arjun" },
    createdAt: now,
    read: false,
  };

  return {
    users: [
      adminUser,
      tutor1User,
      tutor2User,
      parent1User,
      parent2User,
      student1User,
      student2User,
    ],
    students: [student1, student2],
    tutors: [tutor1, tutor2],
    questionnaires: [],
    sessions: [session1, session2, session3],
    sessionReports: [],
    assignments: [],
    quizzes: [],
    notes: [note1],
    homework: [homework1, homework2],
    messages: [message1, message2],
    incidents: [],
    notifications: [notification1],
    settings: getDefaultSettings(),
  };
}

export function getDB(): Database {
  try {
    const stored = localStorage.getItem(DB_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error reading database:", e);
  }
  return seedDB();
}

export function setDB(db: Database): void {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function seedDB(): Database {
  const db = createSeedData();
  setDB(db);
  return db;
}

export function resetDB(): Database {
  localStorage.removeItem(DB_KEY);
  return seedDB();
}

export function createUser(userData: Omit<User, "id" | "createdAt" | "passwordHash"> & { password: string }): User {
  const db = getDB();
  const { password, ...rest } = userData;
  const user: User = {
    id: "user_" + generateId(),
    ...rest,
    passwordHash: simpleHash(password),
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  setDB(db);
  return user;
}

export function getUserByEmail(email: string): User | undefined {
  const db = getDB();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string): User | undefined {
  const db = getDB();
  return db.users.find((u) => u.id === id);
}

export function updateUser(id: string, updates: Partial<User>): User | undefined {
  const db = getDB();
  const index = db.users.findIndex((u) => u.id === id);
  if (index === -1) return undefined;
  db.users[index] = { ...db.users[index], ...updates };
  setDB(db);
  return db.users[index];
}

export function getStudentByUserId(userId: string): Student | undefined {
  const db = getDB();
  return db.students.find((s) => s.userId === userId);
}

export function getStudentById(id: string): Student | undefined {
  const db = getDB();
  return db.students.find((s) => s.id === id);
}

export function createStudent(studentData: Omit<Student, "id" | "createdAt">): Student {
  const db = getDB();
  const student: Student = {
    id: "student_" + generateId(),
    ...studentData,
    createdAt: new Date().toISOString(),
  };
  db.students.push(student);
  setDB(db);
  return student;
}

export function updateStudent(id: string, updates: Partial<Student>): Student | undefined {
  const db = getDB();
  const index = db.students.findIndex((s) => s.id === id);
  if (index === -1) return undefined;
  db.students[index] = { ...db.students[index], ...updates };
  setDB(db);
  return db.students[index];
}

export function getAllStudents(): Student[] {
  return getDB().students;
}

export function getTutorByUserId(userId: string): Tutor | undefined {
  const db = getDB();
  return db.tutors.find((t) => t.userId === userId);
}

export function getTutorById(id: string): Tutor | undefined {
  const db = getDB();
  return db.tutors.find((t) => t.id === id);
}

export function createTutor(tutorData: Omit<Tutor, "id" | "createdAt">): Tutor {
  const db = getDB();
  const tutor: Tutor = {
    id: "tutor_" + generateId(),
    ...tutorData,
    createdAt: new Date().toISOString(),
  };
  db.tutors.push(tutor);
  setDB(db);
  return tutor;
}

export function updateTutor(id: string, updates: Partial<Tutor>): Tutor | undefined {
  const db = getDB();
  const index = db.tutors.findIndex((t) => t.id === id);
  if (index === -1) return undefined;
  db.tutors[index] = { ...db.tutors[index], ...updates };
  setDB(db);
  return db.tutors[index];
}

export function getAllTutors(): Tutor[] {
  return getDB().tutors;
}

export function createQuestionnaire(data: Omit<Questionnaire, "id" | "createdAt">): Questionnaire {
  const db = getDB();
  const questionnaire: Questionnaire = {
    id: "quest_" + generateId(),
    ...data,
    createdAt: new Date().toISOString(),
  };
  db.questionnaires.push(questionnaire);
  
  const notification: Notification = {
    id: "notif_" + generateId(),
    forRole: "admin",
    type: "questionnaire_new",
    payload: { questionnaireId: questionnaire.id },
    createdAt: new Date().toISOString(),
    read: false,
  };
  db.notifications.push(notification);
  
  setDB(db);
  return questionnaire;
}

export function getQuestionnaireById(id: string): Questionnaire | undefined {
  const db = getDB();
  return db.questionnaires.find((q) => q.id === id);
}

export function getQuestionnairesByParentId(parentId: string): Questionnaire[] {
  const db = getDB();
  return db.questionnaires.filter((q) => q.parentId === parentId);
}

export function updateQuestionnaire(id: string, updates: Partial<Questionnaire>): Questionnaire | undefined {
  const db = getDB();
  const index = db.questionnaires.findIndex((q) => q.id === id);
  if (index === -1) return undefined;
  db.questionnaires[index] = { ...db.questionnaires[index], ...updates };
  setDB(db);
  return db.questionnaires[index];
}

export function getAllQuestionnaires(): Questionnaire[] {
  return getDB().questionnaires;
}

export function createSession(sessionData: Omit<Session, "id" | "createdAt">): Session {
  const db = getDB();
  const session: Session = {
    id: "session_" + generateId(),
    ...sessionData,
    createdAt: new Date().toISOString(),
  };
  db.sessions.push(session);
  setDB(db);
  return session;
}

export function getSessionById(id: string): Session | undefined {
  const db = getDB();
  return db.sessions.find((s) => s.id === id);
}

export function getSessionsByStudentId(studentId: string): Session[] {
  const db = getDB();
  return db.sessions.filter((s) => s.studentId === studentId);
}

export function getSessionsByTutorId(tutorId: string): Session[] {
  const db = getDB();
  return db.sessions.filter((s) => s.tutorId === tutorId);
}

export function updateSession(id: string, updates: Partial<Session>): Session | undefined {
  const db = getDB();
  const index = db.sessions.findIndex((s) => s.id === id);
  if (index === -1) return undefined;
  db.sessions[index] = { ...db.sessions[index], ...updates };
  setDB(db);
  return db.sessions[index];
}


export function getSessionReportsByStudentId(studentId: string): SessionReport[] {
  const db = getDB();
  return db.sessionReports
    .filter((r) => r.studentId === studentId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getSessionReportsByTutorId(tutorId: string): SessionReport[] {
  const db = getDB();
  return db.sessionReports
    .filter((r) => r.tutorId === tutorId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getSessionReportBySessionId(sessionId: string): SessionReport | undefined {
  const db = getDB();
  return db.sessionReports.find((r) => r.sessionId === sessionId);
}

export function upsertSessionReport(report: Omit<SessionReport, "id" | "createdAt"> & { id?: string; createdAt?: string }): SessionReport {
  const db = getDB();
  const existingIndex = report.id ? db.sessionReports.findIndex((r) => r.id === report.id) : db.sessionReports.findIndex((r) => r.sessionId === report.sessionId);
  const normalized: SessionReport = {
    id: report.id ?? "report_" + generateId(),
    createdAt: report.createdAt ?? new Date().toISOString(),
    sessionId: report.sessionId,
    studentId: report.studentId,
    tutorId: report.tutorId,
    overallScore: report.overallScore,
    summary: report.summary,
    whatWentWell: report.whatWentWell,
    whatToImprove: report.whatToImprove,
    actionItems: report.actionItems,
    tutorNotes: report.tutorNotes,
  };

  if (existingIndex >= 0) db.sessionReports[existingIndex] = normalized;
  else db.sessionReports.push(normalized);

  setDB(db);
  return normalized;
}

export function getAssignmentsByStudentId(studentId: string): Assignment[] {
  const db = getDB();
  return db.assignments
    .filter((a) => a.studentId === studentId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getAssignmentsByTutorId(tutorId: string): Assignment[] {
  const db = getDB();
  return db.assignments
    .filter((a) => a.tutorId === tutorId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createAssignment(data: Omit<Assignment, "id" | "createdAt">): Assignment {
  const db = getDB();
  const assignment: Assignment = { id: "asg_" + generateId(), createdAt: new Date().toISOString(), ...data };
  db.assignments.push(assignment);
  setDB(db);
  return assignment;
}

export function updateAssignment(id: string, updates: Partial<Assignment>): Assignment | undefined {
  const db = getDB();
  const index = db.assignments.findIndex((a) => a.id === id);
  if (index === -1) return undefined;
  db.assignments[index] = { ...db.assignments[index], ...updates };
  setDB(db);
  return db.assignments[index];
}

export function getQuizzesByStudentId(studentId: string): Quiz[] {
  const db = getDB();
  return db.quizzes
    .filter((q) => q.studentId === studentId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createQuiz(data: Omit<Quiz, "id" | "createdAt">): Quiz {
  const db = getDB();
  const quiz: Quiz = { id: "quiz_" + generateId(), createdAt: new Date().toISOString(), ...data };
  db.quizzes.push(quiz);
  setDB(db);
  return quiz;
}

export function updateQuiz(id: string, updates: Partial<Quiz>): Quiz | undefined {
  const db = getDB();
  const index = db.quizzes.findIndex((q) => q.id === id);
  if (index === -1) return undefined;
  db.quizzes[index] = { ...db.quizzes[index], ...updates };
  setDB(db);
  return db.quizzes[index];
}

export function getAllSessions(): Session[] {
  return getDB().sessions;
}

export function createNote(noteData: Omit<Note, "id" | "createdAt">): Note {
  const db = getDB();
  const note: Note = {
    id: "note_" + generateId(),
    ...noteData,
    createdAt: new Date().toISOString(),
  };
  db.notes.push(note);
  
  if (noteData.issues.length > 0) {
    const notification: Notification = {
      id: "notif_" + generateId(),
      forRole: "admin",
      type: "incident_logged",
      payload: { noteId: note.id, issues: noteData.issues },
      createdAt: new Date().toISOString(),
      read: false,
    };
    db.notifications.push(notification);
  }
  
  setDB(db);
  return note;
}

export function getNotesBySessionId(sessionId: string): Note[] {
  const db = getDB();
  return db.notes.filter((n) => n.sessionId === sessionId);
}

export function getNotesByStudentId(studentId: string): Note[] {
  const db = getDB();
  return db.notes.filter((n) => n.studentId === studentId);
}

export function getAllNotes(): Note[] {
  return getDB().notes;
}

export function createHomework(homeworkData: Omit<Homework, "id" | "createdAt">): Homework {
  const db = getDB();
  const homework: Homework = {
    id: "hw_" + generateId(),
    ...homeworkData,
    createdAt: new Date().toISOString(),
  };
  db.homework.push(homework);
  setDB(db);
  return homework;
}

export function getHomeworkById(id: string): Homework | undefined {
  const db = getDB();
  return db.homework.find((h) => h.id === id);
}

export function getHomeworkByStudentId(studentId: string): Homework[] {
  const db = getDB();
  return db.homework.filter((h) => h.studentId === studentId);
}

export function getHomeworkByTutorId(tutorId: string): Homework[] {
  const db = getDB();
  return db.homework.filter((h) => h.tutorId === tutorId);
}

export function updateHomework(id: string, updates: Partial<Homework>): Homework | undefined {
  const db = getDB();
  const index = db.homework.findIndex((h) => h.id === id);
  if (index === -1) return undefined;
  db.homework[index] = { ...db.homework[index], ...updates };
  setDB(db);
  return db.homework[index];
}

export function getAllHomework(): Homework[] {
  return getDB().homework;
}

export function createMessage(messageData: Omit<Message, "id" | "createdAt">): Message | { blocked: true; reason: string } {
  const db = getDB();
  const settings = db.settings;
  
  if (settings.communicationControls.blockPhoneEmailSharing) {
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\d{7,}/;
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    
    if (phoneRegex.test(messageData.body) || emailRegex.test(messageData.body)) {
      const incident: Incident = {
        id: "incident_" + generateId(),
        type: "contact_share_attempt",
        severity: "high",
        actorUserId: messageData.fromUserId,
        studentId: messageData.studentId,
        messageSnippet: messageData.body.substring(0, 100),
        createdAt: new Date().toISOString(),
      };
      db.incidents.push(incident);
      
      const notification: Notification = {
        id: "notif_" + generateId(),
        forRole: "admin",
        type: "policy_block",
        payload: { incidentId: incident.id, type: "contact_share_attempt" },
        createdAt: new Date().toISOString(),
        read: false,
      };
      db.notifications.push(notification);
      
      setDB(db);
      return { blocked: true, reason: "Phone numbers and email addresses cannot be shared in messages." };
    }
  }
  
  if (settings.communicationControls.blockExternalLinks) {
    const linkRegex = /https?:\/\/[^\s]+/i;
    if (linkRegex.test(messageData.body)) {
      const incident: Incident = {
        id: "incident_" + generateId(),
        type: "external_link_attempt",
        severity: "medium",
        actorUserId: messageData.fromUserId,
        studentId: messageData.studentId,
        messageSnippet: messageData.body.substring(0, 100),
        createdAt: new Date().toISOString(),
      };
      db.incidents.push(incident);
      
      const notification: Notification = {
        id: "notif_" + generateId(),
        forRole: "admin",
        type: "policy_block",
        payload: { incidentId: incident.id, type: "external_link_attempt" },
        createdAt: new Date().toISOString(),
        read: false,
      };
      db.notifications.push(notification);
      
      setDB(db);
      return { blocked: true, reason: "External links cannot be shared in messages." };
    }
  }
  
  const blockedKeywords = settings.communicationControls.blockedKeywords;
  const lowerBody = messageData.body.toLowerCase();
  const foundKeyword = blockedKeywords.find((kw) => lowerBody.includes(kw.toLowerCase()));
  if (foundKeyword) {
    const incident: Incident = {
      id: "incident_" + generateId(),
      type: "policy_violation",
      severity: "medium",
      actorUserId: messageData.fromUserId,
      studentId: messageData.studentId,
      messageSnippet: messageData.body.substring(0, 100),
      createdAt: new Date().toISOString(),
    };
    db.incidents.push(incident);
    
    const notification: Notification = {
      id: "notif_" + generateId(),
      forRole: "admin",
      type: "policy_block",
      payload: { incidentId: incident.id, keyword: foundKeyword },
      createdAt: new Date().toISOString(),
      read: false,
    };
    db.notifications.push(notification);
    
    setDB(db);
    return { blocked: true, reason: `Messages cannot contain restricted words like "${foundKeyword}".` };
  }
  
  const message: Message = {
    id: "msg_" + generateId(),
    ...messageData,
    createdAt: new Date().toISOString(),
  };
  db.messages.push(message);
  setDB(db);
  return message;
}

export function getMessagesByThreadId(threadId: string): Message[] {
  const db = getDB();
  return db.messages.filter((m) => m.threadId === threadId).sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

export function getMessagesByUserId(userId: string): Message[] {
  const db = getDB();
  return db.messages.filter((m) => m.fromUserId === userId || m.toUserId === userId);
}

export function markMessageAsRead(id: string): void {
  const db = getDB();
  const index = db.messages.findIndex((m) => m.id === id);
  if (index !== -1) {
    db.messages[index].read = true;
    setDB(db);
  }
}

export function createIncident(incidentData: Omit<Incident, "id" | "createdAt">): Incident {
  const db = getDB();
  const incident: Incident = {
    id: "incident_" + generateId(),
    ...incidentData,
    createdAt: new Date().toISOString(),
  };
  db.incidents.push(incident);
  
  const notification: Notification = {
    id: "notif_" + generateId(),
    forRole: "admin",
    type: "incident_logged",
    payload: { incidentId: incident.id },
    createdAt: new Date().toISOString(),
    read: false,
  };
  db.notifications.push(notification);
  
  setDB(db);
  return incident;
}

export function getAllIncidents(): Incident[] {
  return getDB().incidents;
}

export function getNotificationsByRole(role: UserRole): Notification[] {
  const db = getDB();
  return db.notifications.filter((n) => n.forRole === role).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function markNotificationAsRead(id: string): void {
  const db = getDB();
  const index = db.notifications.findIndex((n) => n.id === id);
  if (index !== -1) {
    db.notifications[index].read = true;
    setDB(db);
  }
}

export function getSettings(): Settings {
  return getDB().settings;
}

export function updateSettings(updates: Partial<Settings>): Settings {
  const db = getDB();
  db.settings = { ...db.settings, ...updates };
  setDB(db);
  return db.settings;
}

export function deriveTrackFromAnswers(answers: QuestionnaireAnswers): QuestionnaireDerived {
  let track = "Visual Learner Track";
  const blockers: string[] = [];
  const signals: StudentSignals = {
    confidence: 70,
    memory: 70,
    language: 70,
    foundation: 70,
  };
  
  if (answers.learningStyle === "visual") {
    track = "Visual Learner Track";
  } else if (answers.learningStyle === "auditory") {
    track = "Auditory Learner Track";
  } else if (answers.learningStyle === "kinesthetic") {
    track = "Hands-on Learner Track";
  } else if (answers.learningStyle === "reading") {
    track = "Reading/Writing Track";
  }
  
  if (answers.focusAttention === "easily_distracted" || answers.focusAttention === "struggles") {
    blockers.push("focus");
    signals.confidence -= 15;
  }
  
  if (answers.studyHabits === "inconsistent" || answers.studyHabits === "needs_help") {
    blockers.push("memory");
    signals.memory -= 15;
  }
  
  if (answers.motivation === "low" || answers.motivation === "extrinsic_only") {
    signals.confidence -= 10;
  }
  
  return { track, blockers, signals };
}
