import { useMemo } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { RouteGuard } from "@/components/portal/RouteGuard";
import { useAuth } from "@/contexts/AuthContext";
import {
  getSessionsByStudentId,
  getNotesByStudentId,
  getHomeworkByStudentId,
  getUserById,
  getTutorById,
} from "@/lib/datastore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  TrendingUp,
  Calendar,
  BookOpen,
  MessageSquare,
  Target,
  Award,
  Clock,
} from "lucide-react";
import { format, parseISO } from "date-fns";

function SignalCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: typeof Brain;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}%</p>
          </div>
        </div>
        <Progress value={value} className="h-2" />
      </CardContent>
    </Card>
  );
}

export default function StudentReports() {
  const { user, student } = useAuth();

  const { sessions, notes, homework, stats } = useMemo(() => {
    if (!student) {
      return {
        sessions: [],
        notes: [],
        homework: [],
        stats: { completedSessions: 0, completedHomework: 0, avgResponse: 0 },
      };
    }

    const allSessions = getSessionsByStudentId(student.id);
    const allNotes = getNotesByStudentId(student.id).sort(
      (a, b) => parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime()
    );
    const allHomework = getHomeworkByStudentId(student.id);

    const completedSessions = allSessions.filter((s) => s.status === "done").length;
    const completedHomework = allHomework.filter((h) => h.status === "reviewed" || h.status === "submitted").length;
    const avgResponse = allNotes.length > 0
      ? Math.round(allNotes.reduce((sum, n) => sum + n.studentResponse, 0) / allNotes.length * 20)
      : 0;

    return {
      sessions: allSessions,
      notes: allNotes,
      homework: allHomework,
      stats: { completedSessions, completedHomework, avgResponse },
    };
  }, [student]);

  const signals = student?.signals || { confidence: 70, memory: 70, language: 70, foundation: 70 };

  const getTutorName = (tutorId: string) => {
    const tutor = getTutorById(tutorId);
    if (tutor) {
      const tutorUser = getUserById(tutor.userId);
      if (tutorUser) {
        return `${tutorUser.firstName} ${tutorUser.lastName || ""}`.trim();
      }
    }
    return "Tutor";
  };

  return (
    <RouteGuard allowedRoles={["student"]}>
      <PortalLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">My Progress</h1>
            <p className="text-muted-foreground">Track your learning journey</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <SignalCard
              label="Confidence"
              value={signals.confidence}
              icon={Award}
              color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
            />
            <SignalCard
              label="Memory"
              value={signals.memory}
              icon={Brain}
              color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            />
            <SignalCard
              label="Language"
              value={signals.language}
              icon={MessageSquare}
              color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
            />
            <SignalCard
              label="Foundation"
              value={signals.foundation}
              icon={Target}
              color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Learning Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-3xl font-bold" data-testid="stat-sessions">
                    {stats.completedSessions}
                  </p>
                  <p className="text-sm text-muted-foreground">Sessions Completed</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-3xl font-bold" data-testid="stat-homework">
                    {stats.completedHomework}
                  </p>
                  <p className="text-sm text-muted-foreground">Homework Submitted</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <Award className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-3xl font-bold" data-testid="stat-response">
                    {stats.avgResponse}%
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Response Score</p>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Current Track</p>
                  <Badge variant="secondary" data-testid="badge-track">
                    {student?.track || "Not assigned"}
                  </Badge>
                </div>
                {student?.blockers && student.blockers.length > 0 && (
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <p className="font-medium">Areas to Improve</p>
                    <div className="flex gap-2 flex-wrap">
                      {student.blockers.map((blocker) => (
                        <Badge key={blocker} variant="outline" className="border-amber-500 text-amber-600">
                          {blocker}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <p className="font-medium">Grade</p>
                  <Badge variant="outline" data-testid="badge-grade">
                    Grade {student?.grade || "N/A"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Recent Session Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No session notes yet
                </p>
              ) : (
                <div className="space-y-4">
                  {notes.slice(0, 5).map((note) => (
                    <div
                      key={note.id}
                      className="p-4 rounded-lg border space-y-3"
                      data-testid={`note-${note.id}`}
                    >
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {format(parseISO(note.createdAt), "MMM d, yyyy")}
                          </span>
                        </div>
                        <Badge variant="outline">{getTutorName(note.tutorId)}</Badge>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Covered</p>
                        <p className="font-medium">{note.coveredTopic}</p>
                      </div>

                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Response:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div
                                key={i}
                                className={`w-3 h-3 rounded-full ${
                                  i <= note.studentResponse ? "bg-primary" : "bg-muted"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {note.nextFocus && (
                        <div className="pt-2 border-t">
                          <p className="text-sm text-muted-foreground">Next Focus</p>
                          <p className="text-sm">{note.nextFocus}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PortalLayout>
    </RouteGuard>
  );
}
