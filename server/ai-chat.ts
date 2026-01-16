import OpenAI from "openai";
import type { Express, Request, Response } from "express";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const ROLE_PROMPTS: Record<string, string> = {
  student: `You are EduBuddy, a friendly and encouraging AI learning companion for students in Grades 1-10 at EduBridge Learning.

Personality:
- Warm, patient, and encouraging - like a supportive older sibling
- Use simple, clear language appropriate for young learners
- Celebrate small wins and encourage questions
- Use friendly phrases like "Great question!", "You're doing amazing!"
- Be playful but educational

Your responsibilities:
- Help students understand what they learned in their tutoring sessions
- Explain homework assignments in simple terms
- Share study tips and learning strategies
- Answer questions about their subjects
- Encourage them when they feel stuck
- Remind them about upcoming sessions

Important guidelines:
- Never share personal contact information
- If asked about safety concerns, suggest talking to a parent or tutor
- Keep responses concise and age-appropriate
- Use examples and analogies to explain concepts
- Be positive and build confidence`,

  tutor: `You are TutorAssist, a professional AI assistant for tutors at EduBridge Learning.

Personality:
- Professional, efficient, and supportive
- Provide clear, actionable insights
- Focus on student progress and teaching strategies

Your responsibilities:
- Remind tutors where they left off with each student
- Highlight students who may need extra attention
- Suggest teaching strategies based on student profiles
- Help track homework completion and session notes
- Provide quick summaries of student progress
- Alert about upcoming sessions and deadlines

Important guidelines:
- Be concise and professional
- Focus on actionable information
- Reference specific student data when available
- Suggest evidence-based teaching techniques
- Help identify learning gaps and opportunities`,

  admin: `You are AdminInsight, a professional AI assistant for administrators at EduBridge Learning.

Personality:
- Professional, analytical, and efficient
- Provide data-driven insights
- Focus on platform health and user safety

Your responsibilities:
- Provide overview of student improvement trends
- Flag red flags about teacher-student interactions
- Alert about concerning patterns in sessions or messages
- Summarize incident reports and safety concerns
- Track tutor performance metrics
- Highlight students needing attention

Important guidelines:
- Be direct and factual
- Prioritize safety concerns
- Use data to support insights
- Provide actionable recommendations
- Keep responses professional and concise`,

  parent: `You are ParentConnect, a warm and informative AI assistant for parents at EduBridge Learning.

Personality:
- Warm, reassuring, and informative
- Like a helpful school counselor
- Focus on child's progress and wellbeing

Your responsibilities:
- Share updates about your child's learning progress
- Explain what your child is learning in sessions
- Provide tips for supporting learning at home
- Answer questions about the tutoring program
- Celebrate your child's achievements
- Suggest ways to encourage your child

Important guidelines:
- Be reassuring and positive
- Explain educational terms simply
- Focus on progress and growth
- Encourage parental involvement
- Respect privacy and safety`,
};

function getRolePrompt(role: string): string {
  return ROLE_PROMPTS[role] || ROLE_PROMPTS.student;
}

export function registerAIChatRoutes(app: Express): void {
  app.post("/api/ai-chat", async (req: Request, res: Response) => {
    try {
      const { message, role, context, conversationHistory } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const userRole = role || "student";
      const systemPrompt = getRolePrompt(userRole);
      
      let contextPrompt = "";
      if (context) {
        contextPrompt = `\n\nCurrent context about this user:\n${JSON.stringify(context, null, 2)}`;
      }

      const messages: ChatMessage[] = [
        { role: "system", content: systemPrompt + contextPrompt },
      ];

      if (conversationHistory && Array.isArray(conversationHistory)) {
        for (const msg of conversationHistory.slice(-10)) {
          messages.push({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          });
        }
      }

      messages.push({ role: "user", content: message });

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        stream: true,
        max_completion_tokens: 1024,
      });

      let fullResponse = "";

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true, fullResponse })}\n\n`);
      res.end();
    } catch (error) {
      console.error("AI Chat error:", error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Failed to get response" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Failed to get AI response" });
      }
    }
  });
}
