import { useMemo } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { RouteGuard } from "@/components/portal/RouteGuard";
import { useAuth } from "@/contexts/AuthContext";
import {
  getAllStudents,
  getSessionsByStudentId,
  getNotesByStudentId,
  getHomeworkByStudentId,
  getUserById,
} from "@/lib/datastore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  Brain,
  TrendingUp,
  Calendar,
  CheckCircle2,
  BookOpen,
  FileText,
  Clock,
  Target,
  Award,
} from "lucide-react";
import { format, parseISO } from "date-fns";

function SignalCard({ label, value, trend, color }: { label: string; value: number; trend?: string; color: string }) {
  return (
    <div className="p-4 rounded-lg border space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium capitalize">{label}</span>
        {trend && (
          <Badge variant="secondary" className="text-xs">
            <TrendingUp className="w-3 h-3 mr-1" />
            {trend}
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Progress value={value} className={`flex-1 h-3 ${color}`} />
        <span className="text-lg font-bold w-12 text-right">{value}%</span>
      </div>
    </div>
  );
}

export default function ParentReports() {
  const { user } = useAuth();

  const { child, childUser, stats, notes, signals } = useMemo(() => {
    if (!user) {
      return { child: null, childUser: null, stats: null, notes: [], signals: null };
    }

    const students = getAllStudents();
    const childStudent = students.find((s) => s.parentId === user.id);

    if (!childStudent) {
      return { child: null, childUser: null, stats: null, notes: [], signals: null };
    }

    const childUserData = getUserById(childStudent.userId);
    const sessions = getSessionsByStudentId(childStudent.id);
    const allNotes = getNotesByStudentId(childStudent.id);
    const homework = getHomeworkByStudentId(childStudent.id);

    const completedSessions = sessions.filter((s) => s.status === "done").length;
    const totalSessions = sessions.length;
    const completedHomework = homework.filter((h) => h.status === "reviewed" || h.status === "submitted").length;
    const totalHomework = homework.length;

    const publicNotes = allNotes
      .filter((n) => !n.privateNote || n.privateNote === "")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const avgResponse = publicNotes.length > 0
      ? Math.round(publicNotes.reduce((sum, n) => sum + n.studentResponse, 0) / publicNotes.length * 20)
      : 0;

    return {
      child: childStudent,
      childUser: childUserData,
      stats: {
        completedSessions,
        totalSessions,
        completedHomework,
        totalHomework,
        avgResponse,
      },
      notes: publicNotes,
      signals: childStudent.signals,
    };
  }, [user]);

  if (!child || !childUser) {
    return (
      <RouteGuard allowedRoles={["parent"]}>
        <PortalLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Reports</h1>
              <p className="text-muted-foreground">Your child's progress reports</p>
            </div>
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No child profile found</p>
              </CardContent>
            </Card>
          </div>
        </PortalLayout>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard allowedRoles={["parent"]}>
      <PortalLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Reports</h1>
            <p className="text-muted-foreground">
              {childUser.firstName}'s learning progress and insights
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" data-testid="stat-sessions">
                      {stats?.completedSessions || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Sessions Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" data-testid="stat-homework">
                      {stats?.completedHomework || 0}/{stats?.totalHomework || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Homework Done</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" data-testid="stat-response">
                      {stats?.avgResponse || 0}%
                    </p>
                    <p className="text-sm text-muted-foreground">Avg. Response</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" data-testid="stat-track">
                      {child.track.split(" ")[0]}
                    </p>
                    <p className="text-sm text-muted-foreground">Learner Type</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Learning Signal Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <SignalCard
                  label="Confidence"
                  value={signals?.confidence || 0}
                  trend="+5%"
                  color="[&>div]:bg-green-500"
                />
                <SignalCard
                  label="Memory"
                  value={signals?.memory || 0}
                  color="[&>div]:bg-blue-500"
                />
                <SignalCard
                  label="Language"
                  value={signals?.language || 0}
                  trend="+3%"
                  color="[&>div]:bg-purple-500"
                />
                <SignalCard
                  label="Foundation"
                  value={signals?.foundation || 0}
                  color="[&>div]:bg-orange-500"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Trends are based on tutor observations and assessment results.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Recent Tutor Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notes.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No tutor notes yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Notes will appear here after sessions are completed
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 rounded-lg border space-y-3"
                      data-testid={`note-${note.id}`}
                    >
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-primary" />
                          <span className="font-medium">{note.coveredTopic}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {format(parseISO(note.createdAt), "MMM d, yyyy")}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Response:</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <div
                                key={star}
                                className={`w-3 h-3 rounded-full ${
                                  star <= note.studentResponse
                                    ? "bg-primary"
                                    : "bg-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{note.studentResponse}/5</span>
                        </div>
                      </div>

                      {note.nextFocus && (
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                          <p className="text-xs text-muted-foreground mb-1">Next Focus Area</p>
                          <p className="text-sm">{note.nextFocus}</p>
                        </div>
                      )}

                      {note.issues.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm text-muted-foreground">Areas noted:</span>
                          {note.issues.map((issue, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {issue}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Learning Progress Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-100 dark:border-green-900">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">Strengths</p>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        {childUser.firstName} is showing great progress in{" "}
                        {signals && signals.language >= 70 ? "language comprehension" : "foundational concepts"}.
                        {signals && signals.confidence >= 70 && " Confidence levels are improving steadily."}
                      </p>
                    </div>
                  </div>
                </div>

                {child.blockers.length > 0 && (
                  <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-100 dark:border-amber-900">
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-amber-800 dark:text-amber-200">Focus Areas</p>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                          Our tutors are actively working on improving{" "}
                          {child.blockers.join(" and ")} skills through targeted exercises.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900">
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-blue-800 dark:text-blue-200">Learning Track</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        {childUser.firstName} is on the <strong>{child.track}</strong>. 
                        Sessions are tailored to match their learning style for maximum engagement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PortalLayout>
    </RouteGuard>
  );
}
