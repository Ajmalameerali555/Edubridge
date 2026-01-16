import { sql } from "drizzle-orm";
import { pgTable, serial, varchar, text, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "../schema";

export const supportPlans = pgTable("support_plans", {
  id: serial("id").primaryKey(),
  studentId: varchar("student_id").notNull(),
  userId: varchar("user_id").references(() => users.id),
  track: text("track"),
  blockers: text("blockers").array(),
  rootCauses: text("root_causes").array(),
  prioritySubjects: text("priority_subjects").array(),
  weeklyPlan: jsonb("weekly_plan"),
  accommodations: jsonb("accommodations"),
  strengths: text("strengths").array(),
  currentFocus: text("current_focus"),
  todayRule: text("today_rule"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const pointsLedger = pgTable("points_ledger", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  studentId: varchar("student_id"),
  type: text("type").notNull(),
  points: integer("points").notNull(),
  reason: text("reason").notNull(),
  awardedBy: varchar("awarded_by"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  criteria: jsonb("criteria"),
  icon: text("icon"),
  category: text("category"),
  rarity: text("rarity").default("common"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  studentId: varchar("student_id"),
  badgeId: integer("badge_id").references(() => badges.id),
  earnedAt: timestamp("earned_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  notified: boolean("notified").default(false),
});

export const streaks = pgTable("streaks", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  studentId: varchar("student_id"),
  type: text("type").notNull(),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastActivityAt: timestamp("last_activity_at"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const gameSessions = pgTable("game_sessions", {
  id: serial("id").primaryKey(),
  gameId: text("game_id").notNull(),
  studentId: varchar("student_id").notNull(),
  userId: varchar("user_id").references(() => users.id),
  score: integer("score").default(0),
  accuracy: integer("accuracy").default(0),
  duration: integer("duration").default(0),
  level: integer("level").default(1),
  grade: text("grade"),
  completedAt: timestamp("completed_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const leaderboards = pgTable("leaderboards", {
  id: serial("id").primaryKey(),
  scope: text("scope").notNull(),
  period: text("period").notNull(),
  gradeBracket: text("grade_bracket"),
  entries: jsonb("entries"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  expiresAt: timestamp("expires_at"),
});

export const tutorApplications = pgTable("tutor_applications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  status: text("status").default("draft").notNull(),
  qualityScore: integer("quality_score").default(0),
  dimensionScores: jsonb("dimension_scores"),
  riskFlags: text("risk_flags").array(),
  improvementChecklist: text("improvement_checklist").array(),
  autoSummary: text("auto_summary"),
  profile: jsonb("profile"),
  skillCheck: jsonb("skill_check"),
  verification: jsonb("verification"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  submittedAt: timestamp("submitted_at"),
  reviewedAt: timestamp("reviewed_at"),
});

export const policyIncidents = pgTable("policy_incidents", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  studentId: varchar("student_id"),
  type: text("type").notNull(),
  severity: text("severity").default("low"),
  context: text("context"),
  blockedContent: text("blocked_content"),
  action: text("action"),
  resolved: boolean("resolved").default(false),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: varchar("resolved_by"),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  forRole: text("for_role").notNull(),
  forUserId: varchar("for_user_id"),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message"),
  payload: jsonb("payload"),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const classRecaps = pgTable("class_recaps", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id").notNull(),
  studentId: varchar("student_id").notNull(),
  tutorId: varchar("tutor_id").notNull(),
  whatWeDid: text("what_we_did"),
  whereWeStopped: text("where_we_stopped"),
  nextFocus: text("next_focus"),
  homeworkReminders: text("homework_reminders").array(),
  encouragementNote: text("encouragement_note"),
  autoGenerated: boolean("auto_generated").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const weeklyChallenge = pgTable("weekly_challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  gameId: text("game_id"),
  targetScore: integer("target_score"),
  bonusPoints: integer("bonus_points").default(50),
  gradeBracket: text("grade_bracket"),
  startsAt: timestamp("starts_at").notNull(),
  endsAt: timestamp("ends_at").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const platformSettings = pgTable("platform_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: jsonb("value"),
  category: text("category"),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedBy: varchar("updated_by"),
});

export const insertSupportPlanSchema = createInsertSchema(supportPlans).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPointsSchema = createInsertSchema(pointsLedger).omit({ id: true, createdAt: true });
export const insertBadgeSchema = createInsertSchema(badges).omit({ id: true, createdAt: true });
export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({ id: true, earnedAt: true });
export const insertStreakSchema = createInsertSchema(streaks).omit({ id: true, createdAt: true });
export const insertGameSessionSchema = createInsertSchema(gameSessions).omit({ id: true, completedAt: true });
export const insertTutorApplicationSchema = createInsertSchema(tutorApplications).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPolicyIncidentSchema = createInsertSchema(policyIncidents).omit({ id: true, createdAt: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export const insertClassRecapSchema = createInsertSchema(classRecaps).omit({ id: true, createdAt: true });
export const insertWeeklyChallengeSchema = createInsertSchema(weeklyChallenge).omit({ id: true, createdAt: true });
export const insertPlatformSettingSchema = createInsertSchema(platformSettings).omit({ id: true, updatedAt: true });

export type SupportPlan = typeof supportPlans.$inferSelect;
export type InsertSupportPlan = z.infer<typeof insertSupportPlanSchema>;
export type PointsEntry = typeof pointsLedger.$inferSelect;
export type InsertPointsEntry = z.infer<typeof insertPointsSchema>;
export type Badge = typeof badges.$inferSelect;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;
export type Streak = typeof streaks.$inferSelect;
export type InsertStreak = z.infer<typeof insertStreakSchema>;
export type GameSession = typeof gameSessions.$inferSelect;
export type InsertGameSession = z.infer<typeof insertGameSessionSchema>;
export type Leaderboard = typeof leaderboards.$inferSelect;
export type TutorApplication = typeof tutorApplications.$inferSelect;
export type InsertTutorApplication = z.infer<typeof insertTutorApplicationSchema>;
export type PolicyIncident = typeof policyIncidents.$inferSelect;
export type InsertPolicyIncident = z.infer<typeof insertPolicyIncidentSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type ClassRecap = typeof classRecaps.$inferSelect;
export type InsertClassRecap = z.infer<typeof insertClassRecapSchema>;
export type WeeklyChallenge = typeof weeklyChallenge.$inferSelect;
export type InsertWeeklyChallenge = z.infer<typeof insertWeeklyChallengeSchema>;
export type PlatformSetting = typeof platformSettings.$inferSelect;
export type InsertPlatformSetting = z.infer<typeof insertPlatformSettingSchema>;
