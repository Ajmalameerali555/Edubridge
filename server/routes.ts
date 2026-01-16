import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import session from "express-session";
import pgSession from "connect-pg-simple";
import { pool } from "./db";
import { insertUserSchema, insertAssessmentSchema } from "@shared/schema";
import { z } from "zod";
import { registerAIChatRoutes } from "./ai-chat";
import { registerAudioRoutes } from "./replit_integrations/audio";
import { evaluateTutorApplication } from "./ai-analyzer";
import { checkPolicy } from "./policy-engine";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { tutorApplications, pointsLedger, gameSessions, badges, userBadges, streaks, notifications, leaderboards } from "@shared/schema";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET must be set for secure session management");
  }

  const PgStore = pgSession(session);
  
  app.use(
    session({
      store: new PgStore({
        pool,
        tableName: "user_sessions",
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    })
  );

  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const registerSchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
        parentName: z.string().min(1),
        studentName: z.string().min(1),
        mobile: z.string().min(10),
        grade: z.string().min(1),
        assessment: z.object({
          learningStyle: z.string().optional(),
          academicFocus: z.string().optional(),
          studyHabits: z.string().optional(),
          focusAttention: z.string().optional(),
          motivation: z.string().optional(),
          additionalNotes: z.string().optional(),
        }),
      });

      const data = registerSchema.parse(req.body);

      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await storage.createUser({
        email: data.email,
        password: hashedPassword,
        parentName: data.parentName,
        studentName: data.studentName,
        mobile: data.mobile,
        grade: data.grade,
      });

      await storage.createAssessment({
        userId: user.id,
        learningStyle: data.assessment.learningStyle || null,
        academicFocus: data.assessment.academicFocus || null,
        studyHabits: data.assessment.studyHabits || null,
        focusAttention: data.assessment.focusAttention || null,
        motivation: data.assessment.motivation || null,
        additionalNotes: data.assessment.additionalNotes || null,
        status: "pending",
      });

      req.session.userId = user.id;

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      req.session.userId = user.id;

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Auth check error:", error);
      res.status(500).json({ message: "Auth check failed" });
    }
  });

  app.get("/api/assessments", async (req: Request, res: Response) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const assessments = await storage.getAssessmentsByUserId(req.session.userId);
      res.json({ assessments });
    } catch (error) {
      console.error("Get assessments error:", error);
      res.status(500).json({ message: "Failed to get assessments" });
    }
  });

  registerAIChatRoutes(app);
  registerAudioRoutes(app);

  app.post("/api/tutor-applications", async (req: Request, res: Response) => {
    try {
      const { profile, skillCheck } = req.body;
      
      if (!profile || !skillCheck) {
        return res.status(400).json({ message: "Profile and skill check are required" });
      }

      const analysis = evaluateTutorApplication({ profile, skillCheck });
      
      const minScore = 70;
      const status = analysis.qualityScore >= minScore && !analysis.riskFlags.includes("policy_risk") 
        ? "submitted" 
        : "held_by_ai";

      const [application] = await db.insert(tutorApplications).values({
        userId: req.session.userId || null,
        status,
        qualityScore: analysis.qualityScore,
        dimensionScores: analysis.dimensionScores,
        riskFlags: analysis.riskFlags,
        improvementChecklist: analysis.improvementChecklist,
        autoSummary: analysis.autoSummary,
        profile,
        skillCheck,
        submittedAt: new Date(),
      }).returning();

      if (status === "submitted") {
        await db.insert(notifications).values({
          forRole: "admin",
          type: "tutor_application_new",
          title: "New Tutor Application",
          message: `${profile.firstName} has submitted a tutor application with score ${analysis.qualityScore}%`,
          payload: { applicationId: application.id },
        });
      }

      res.json({ 
        application,
        analysis,
        status,
        message: status === "submitted" 
          ? "Application submitted successfully! We'll review it soon." 
          : "Your application needs some improvements before review."
      });
    } catch (error) {
      console.error("Tutor application error:", error);
      res.status(500).json({ message: "Failed to submit application" });
    }
  });

  app.get("/api/tutor-applications/status", async (req: Request, res: Response) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const applications = await db.select().from(tutorApplications)
        .where(eq(tutorApplications.userId, req.session.userId));

      res.json({ applications });
    } catch (error) {
      console.error("Get applications error:", error);
      res.status(500).json({ message: "Failed to get applications" });
    }
  });

  app.post("/api/games/complete", async (req: Request, res: Response) => {
    try {
      const { gameId, score, accuracy, duration, grade, studentId } = req.body;

      const [gameSession] = await db.insert(gameSessions).values({
        gameId,
        studentId: studentId || req.session.userId,
        userId: req.session.userId || null,
        score,
        accuracy,
        duration,
        grade,
      }).returning();

      const pointsEarned = 10 + Math.floor(accuracy / 10);
      
      await db.insert(pointsLedger).values({
        userId: req.session.userId || null,
        studentId: studentId || req.session.userId,
        type: "game",
        points: pointsEarned,
        reason: `Completed ${gameId} with ${accuracy}% accuracy`,
      });

      res.json({ 
        gameSession, 
        pointsEarned,
        message: `Great job! You earned ${pointsEarned} points!`
      });
    } catch (error) {
      console.error("Game completion error:", error);
      res.status(500).json({ message: "Failed to record game" });
    }
  });

  app.get("/api/gamification/stats", async (req: Request, res: Response) => {
    try {
      const studentId = (req.query.studentId as string) || req.session.userId || "";

      const allPoints = await db.select().from(pointsLedger);
      const points = allPoints.filter(p => p.studentId === studentId);
      const totalPoints = points.reduce((sum, p) => sum + p.points, 0);

      const allBadges = await db.select().from(userBadges);
      const earnedBadges = allBadges.filter(b => b.studentId === studentId);

      const allStreaks = await db.select().from(streaks);
      const currentStreakData = allStreaks.find(s => s.studentId === studentId);

      const allGames = await db.select().from(gameSessions);
      const games = allGames.filter(g => g.studentId === studentId);

      res.json({
        totalPoints,
        badgeCount: earnedBadges.length,
        currentStreak: currentStreakData?.currentStreak || 0,
        gamesPlayed: games.length,
        recentPoints: points.slice(-5),
      });
    } catch (error) {
      console.error("Gamification stats error:", error);
      res.status(500).json({ message: "Failed to get stats" });
    }
  });

  app.get("/api/leaderboard/:gradeBracket", async (req: Request, res: Response) => {
    try {
      const { gradeBracket } = req.params;
      
      const allPoints = await db.select().from(pointsLedger);
      
      const studentPoints = allPoints.reduce((acc, p) => {
        if (p.studentId) {
          acc[p.studentId] = (acc[p.studentId] || 0) + p.points;
        }
        return acc;
      }, {} as Record<string, number>);

      const leaderboard = Object.entries(studentPoints)
        .map(([studentId, points]) => ({
          studentId,
          maskedId: studentId.slice(0, 1).toUpperCase() + "***" + studentId.slice(-2),
          firstName: "Student",
          points,
        }))
        .sort((a, b) => b.points - a.points)
        .slice(0, 20);

      res.json({ leaderboard, gradeBracket });
    } catch (error) {
      console.error("Leaderboard error:", error);
      res.status(500).json({ message: "Failed to get leaderboard" });
    }
  });

  app.get("/api/badges", async (req: Request, res: Response) => {
    try {
      const allBadges = await db.select().from(badges);
      res.json({ badges: allBadges });
    } catch (error) {
      console.error("Badges error:", error);
      res.status(500).json({ message: "Failed to get badges" });
    }
  });

  app.post("/api/policy/check", async (req: Request, res: Response) => {
    try {
      const { text, context } = req.body;
      const result = checkPolicy(text, context);
      res.json(result);
    } catch (error) {
      console.error("Policy check error:", error);
      res.status(500).json({ message: "Failed to check policy" });
    }
  });

  app.get("/api/tutor-applications", async (req: Request, res: Response) => {
    try {
      const applications = await db.select().from(tutorApplications);
      res.json({ applications });
    } catch (error) {
      console.error("Get all applications error:", error);
      res.status(500).json({ message: "Failed to get applications" });
    }
  });

  app.post("/api/tutor-applications/:id/status", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;

      if (!status || !["pending", "approved", "rejected", "submitted", "held_by_ai"].includes(status)) {
        return res.status(400).json({ message: "Valid status required (pending, approved, rejected)" });
      }

      const [updated] = await db.update(tutorApplications)
        .set({
          status,
          adminNotes: adminNotes || null,
          reviewedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(tutorApplications.id, parseInt(id)))
        .returning();

      if (!updated) {
        return res.status(404).json({ message: "Application not found" });
      }

      res.json({ application: updated, message: `Application ${status} successfully` });
    } catch (error) {
      console.error("Update application status error:", error);
      res.status(500).json({ message: "Failed to update application status" });
    }
  });

  return httpServer;
}
