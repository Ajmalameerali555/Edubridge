
import OpenAI from "openai";
import type { Express, Request, Response } from "express";
import { z } from "zod";

export function registerAISessionReportRoutes(app: Express) {
  app.post("/api/ai/session-report", async (req: Request, res: Response) => {
    const schema = z.object({
      sessionId: z.string().min(1),
      studentName: z.string().min(1),
      tutorName: z.string().min(1),
      subject: z.string().min(1),
      startAt: z.string().min(1),
      durationMin: z.number().int().positive(),
      tutorNotes: z.string().optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const apiKey = process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
    const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;

    if (!apiKey) {
      return res.status(400).json({ message: "Missing OPENAI_API_KEY" });
    }

    const openai = new OpenAI({ apiKey, baseURL });

    const { studentName, tutorName, subject, durationMin, tutorNotes } = parsed.data;

    const system = `You are an education quality analyst for a tutoring company.
Write a concise, practical class report for admins and parents.
Use simple English. No fluff. No emojis.`;

    const user = `Create a session report with:
- overallScore: integer 1-10
- summary: 2-4 sentences
- whatWentWell: 3-6 bullet items
- whatToImprove: 3-6 bullet items
- actionItems: 3-6 bullet items (next class + homework)
Return STRICT JSON only.

Context:
Student: ${studentName}
Tutor: ${tutorName}
Subject: ${subject}
Duration: ${durationMin} minutes
Tutor notes (optional): ${tutorNotes ?? "N/A"}`;

    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.3,
      });

      const content = completion.choices?.[0]?.message?.content ?? "";
      // Parse JSON safely
      let json: any;
      try {
        json = JSON.parse(content);
      } catch {
        // attempt to extract JSON block
        const match = content.match(/\{[\s\S]*\}/);
        if (!match) return res.status(500).json({ message: "AI returned invalid JSON" });
        json = JSON.parse(match[0]);
      }

      const outSchema = z.object({
        overallScore: z.number().int().min(1).max(10),
        summary: z.string().min(1),
        whatWentWell: z.array(z.string().min(1)).min(1),
        whatToImprove: z.array(z.string().min(1)).min(1),
        actionItems: z.array(z.string().min(1)).min(1),
      });

      const out = outSchema.safeParse(json);
      if (!out.success) {
        return res.status(500).json({ message: "AI response did not match expected format" });
      }

      return res.json(out.data);
    } catch (e: any) {
      return res.status(500).json({ message: e?.message || "AI report failed" });
    }
  });
}
