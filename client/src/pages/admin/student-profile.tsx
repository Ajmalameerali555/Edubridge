import * as React from "react";
import { useParams, Link } from "wouter";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { RouteGuard } from "@/components/portal/RouteGuard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  getStudentById,
  getTutorById,
  getUserById,
  getSessionsByStudentId,
  getHomeworkByStudentId,
  getAssignmentsByStudentId,
  getQuizzesByStudentId,
  getSessionReportBySessionId,
  upsertSessionReport,
  updateStudent,
  Session,
} from "@/lib/datastore";
import { format, parseISO } from "date-fns";
import {
  ArrowLeft,
  GraduationCap,
  Calendar,
  BookOpen,
  FileText,
  Sparkles,
  ClipboardList,
  HelpCircle,
} from "lucide-react";

async function generateSessionReport(payload: {
  sessionId: string;
  studentName: string;
  tutorName: string;
  subject: string;
  startAt: string;
  durationMin: number;
  tutorNotes?: string;
}) {
  const res = await fetch("/api/ai/session-report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || "Failed to generate report");
  }

  return res.json() as Promise<{
    overallScore: number;
    summary: string;
    whatWentWell: string[];
    whatToImprove: string[];
    actionItems: string[];
  }>;
}

export default function AdminStudentProfile() {
  const params = useParams<{ id: string }>();
  const { toast } = useToast();

  const studentId = params?.id;

  // Guard: missing route param
  if (!studentId) {
    return (
      <RouteGuard roles={["admin"]}>
        <PortalLayout role="admin">
          <div className="p-6">
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Invalid student id.</p>
                <div className="mt-4">
                  <Link href="/admin/students">
                    <Button variant="outline">Back to Students</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </PortalLayout>
      </RouteGuard>
    );
  }

  const student = getStudentById(studentId);
  const user = student ? getUserById(student.userId) : undefined;

  const [activeTab, setActiveTab] = React.useState("overview");
  const [notesBySession, setNotesBySession] = React.useState<Record<string, string>>({});
  const [busySessionId, setBusySessionId] = React.useState<string | null>(null);

  if (!student || !user) {
    return (
      <RouteGuard roles={["admin"]}>
        <PortalLayout role="admin">
          <div className="p-6">
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Student not found.</p>
                <div className="mt-4">
                  <Link href="/admin/students">
                    <Button variant="outline">Back to Students</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </PortalLayout>
      </RouteGuard>
    );
  }

  // IMPORTANT: ensure arrays (prevents filter/sort crash)
  const sessions = (getSessionsByStudentId(student.id) ?? [])
    .slice()
    .sort((a, b) => (a.startAt || "").localeCompare(b.startAt || ""));

  const homework = getHomeworkByStudentId(student.id) ?? [];
  const assignments = getAssignmentsByStudentId(student.id) ?? [];
  const quizzes = getQuizzesByStudentId(student.id) ?? [];

  const studentName = `${user.firstName} ${user.lastName}`.trim();

  const onGenerateReport = async (session: Session) => {
    try {
      setBusySessionId(session.id);

      // Prefer real mapping: tutor -> tutor.userId -> user
      const tutor = getTutorById(session.tutorId);
      const tutorUser = tutor ? getUserById(tutor.userId) : undefined;
      const tutorName = tutorUser ? `${tutorUser.firstName} ${tutorUser.lastName}`.trim() : "Tutor";

      const tutorNotes = (notesBySession[session.id] || "").trim();

      const ai = await generateSessionReport({
        sessionId: session.id,
        studentName,
        tutorName,
        subject: session.subject,
        startAt: session.startAt,
        durationMin: session.durationMin,
        tutorNotes: tutorNotes || undefined,
      });

      upsertSessionReport({
        sessionId: session.id,
        studentId: student.id,
        tutorId: session.tutorId,
        overallScore: ai.overallScore,
        summary: ai.summary,
        whatWentWell: ai.whatWentWell,
        whatToImprove: ai.whatToImprove,
        actionItems: ai.actionItems,
        tutorNotes: tutorNotes || undefined,
      });

      toast({ title: "Report generated", description: "AI report saved to this student profile." });
      setActiveTab("reports");
    } catch (e: any) {
      toast({
        title: "Could not generate report",
        description: e?.message || "Unknown error",
        variant: "destructive",
      });
    } finally {
      setBusySessionId(null);
    }
  };

  const subjects = student.subjects ?? [];

  return (
    <RouteGuard roles={["admin"]}>
      <PortalLayout role="admin">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <Link href="/admin/students">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Students
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-semibold leading-tight">{studentName}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Grade {student.grade}</span>
                  <span>•</span>
                  <span>{user.email}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary">{student.track}</Badge>
              <Badge variant="outline">{student.status}</Badge>
            </div>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Subjects:</span>
                {subjects.length === 0 ? (
                  <span className="text-sm text-muted-foreground">—</span>
                ) : (
                  subjects.map((s) => (
                    <Badge key={s} variant="secondary">
                      {s}
                    </Badge>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="sessions">Classes</TabsTrigger>
              <TabsTrigger value="reports">AI Reports</TabsTrigger>
              <TabsTrigger value="homework">Homework</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-4">
              <Card>
                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Parent</div>
                    <div className="font-medium">{user.parentName || "—"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Mobile</div>
                    <div className="font-medium">{user.mobile || "—"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Joined</div>
                    <div className="font-medium">
                      {student.createdAt ? format(parseISO(student.createdAt), "dd MMM yyyy") : "—"}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <div className="font-semibold">Admin controls</div>
                      <div className="text-sm text-muted-foreground">Quick actions for this student.</div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        updateStudent(student.id, { status: student.status === "active" ? "paused" : "active" });
                        toast({ title: "Updated", description: "Student status updated." });
                      }}
                    >
                      {student.status === "active" ? "Pause student" : "Activate student"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sessions" className="mt-4 space-y-3">
              {sessions.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No classes found.</p>
                  </CardContent>
                </Card>
              ) : (
                sessions.map((s) => {
                  const report = getSessionReportBySessionId(s.id);
                  return (
                    <Card key={s.id}>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="space-y-1">
                            <div className="font-semibold flex items-center gap-2">
                              <BookOpen className="w-4 h-4" />
                              {s.subject}
                              <Badge variant="outline">{s.status}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {s.startAt ? format(parseISO(s.startAt), "dd MMM yyyy, hh:mm a") : "—"} • {s.durationMin}{" "}
                              min
                            </div>
                          </div>

                          {report ? (
                            <Badge className="gap-1" variant="secondary">
                              <FileText className="w-3 h-3" /> Report ready
                            </Badge>
                          ) : (
                            <Badge className="gap-1" variant="outline">
                              <HelpCircle className="w-3 h-3" /> No report
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium flex items-center gap-2">
                            <ClipboardList className="w-4 h-4" />
                            Tutor notes (optional)
                          </div>
                          <Textarea
                            value={notesBySession[s.id] || ""}
                            onChange={(e) => setNotesBySession((prev) => ({ ...prev, [s.id]: e.target.value }))}
                            placeholder="Short notes about the class (topics covered, behavior, strengths, struggles)..."
                          />
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <Button onClick={() => onGenerateReport(s)} disabled={busySessionId === s.id}>
                            <Sparkles className="w-4 h-4 mr-2" />
                            {busySessionId === s.id ? "Generating..." : "Generate AI report"}
                          </Button>

                          {report && (
                            <Button variant="outline" onClick={() => setActiveTab("reports")}>
                              View report
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="reports" className="mt-4 space-y-3">
              {(sessions ?? []).filter((s) => !!getSessionReportBySessionId(s.id)).length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center text-muted-foreground">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No AI reports yet. Generate one from a class.</p>
                  </CardContent>
                </Card>
              ) : (
                (sessions ?? []).map((s) => {
                  const r = getSessionReportBySessionId(s.id);
                  if (!r) return null;

                  return (
                    <Card key={r.id}>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <div className="font-semibold">{s.subject}</div>
                            <div className="text-sm text-muted-foreground">
                              {s.startAt ? format(parseISO(s.startAt), "dd MMM yyyy, hh:mm a") : "—"}
                            </div>
                          </div>
                          <Badge variant="secondary">Score: {r.overallScore}/10</Badge>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <div className="text-sm font-medium">Summary</div>
                          <div className="text-sm text-muted-foreground whitespace-pre-wrap">{r.summary}</div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <div className="text-sm font-medium">Went well</div>
                            <ul className="list-disc ml-5 text-sm text-muted-foreground">
                              {(r.whatWentWell ?? []).map((x, i) => (
                                <li key={i}>{x}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="text-sm font-medium">To improve</div>
                            <ul className="list-disc ml-5 text-sm text-muted-foreground">
                              {(r.whatToImprove ?? []).map((x, i) => (
                                <li key={i}>{x}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Action items</div>
                            <ul className="list-disc ml-5 text-sm text-muted-foreground">
                              {(r.actionItems ?? []).map((x, i) => (
                                <li key={i}>{x}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {r.tutorNotes && (
                          <div className="pt-2">
                            <div className="text-sm font-medium">Tutor notes</div>
                            <div className="text-sm text-muted-foreground whitespace-pre-wrap">{r.tutorNotes}</div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="homework" className="mt-4 space-y-3">
              {homework.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center text-muted-foreground">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No homework items.</p>
                  </CardContent>
                </Card>
              ) : (
                homework.map((h) => (
                  <Card key={h.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <div className="font-semibold">{h.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {h.subject} • Due {h.dueAt ? format(parseISO(h.dueAt), "dd MMM yyyy") : "—"}
                          </div>
                        </div>
                        <Badge variant="outline">{h.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="assignments" className="mt-4 space-y-3">
              {assignments.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center text-muted-foreground">
                    <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No assignments yet.</p>
                  </CardContent>
                </Card>
              ) : (
                assignments.map((a) => (
                  <Card key={a.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <div className="font-semibold">{a.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {a.subject} • Due {a.dueAt ? format(parseISO(a.dueAt), "dd MMM yyyy") : "—"}
                          </div>
                        </div>
                        <Badge variant="outline">{a.status}</Badge>
                      </div>
                      {a.feedback && (
                        <div className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{a.feedback}</div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="quizzes" className="mt-4 space-y-3">
              {quizzes.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center text-muted-foreground">
                    <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No quizzes yet.</p>
                  </CardContent>
                </Card>
              ) : (
                quizzes.map((q) => (
                  <Card key={q.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <div className="font-semibold">{q.title}</div>
                          <div className="text-sm text-muted-foreground">{q.subject}</div>
                        </div>
                        <Badge variant="outline">{q.status}</Badge>
                      </div>
                      {typeof q.score === "number" && (
                        <div className="mt-2 text-sm text-muted-foreground">Score: {q.score}%</div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </PortalLayout>
    </RouteGuard>
  );
}
