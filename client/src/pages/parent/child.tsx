import { useMemo } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { RouteGuard } from "@/components/portal/RouteGuard";
import { useAuth } from "@/contexts/AuthContext";
import {
  getAllStudents,
  getUserById,
  getSessionsByStudentId,
} from "@/lib/datastore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  User,
  GraduationCap,
  BookOpen,
  Brain,
  AlertCircle,
  Route,
  Calendar,
  Clock,
} from "lucide-react";
import { format, parseISO } from "date-fns";

function SignalBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium capitalize">{label}</span>
        <span className="text-sm font-semibold">{value}%</span>
      </div>
      <Progress value={value} className={`h-3 ${color}`} />
    </div>
  );
}

export default function ParentChild() {
  const { user } = useAuth();

  const { child, childUser, tutorName, sessionCount } = useMemo(() => {
    if (!user) {
      return { child: null, childUser: null, tutorName: "", sessionCount: 0 };
    }

    const students = getAllStudents();
    const childStudent = students.find((s) => s.parentId === user.id);

    if (!childStudent) {
      return { child: null, childUser: null, tutorName: "", sessionCount: 0 };
    }

    const childUserData = getUserById(childStudent.userId);
    const sessions = getSessionsByStudentId(childStudent.id);
    const completedSessions = sessions.filter((s) => s.status === "done").length;

    let tutorNameStr = "";
    if (sessions.length > 0) {
      const tutorUser = getUserById(sessions[0].tutorId.replace("tutor", "user_tutor"));
      if (tutorUser) {
        tutorNameStr = `${tutorUser.firstName} ${tutorUser.lastName || ""}`.trim();
      }
    }

    return {
      child: childStudent,
      childUser: childUserData,
      tutorName: tutorNameStr,
      sessionCount: completedSessions,
    };
  }, [user]);

  if (!child || !childUser) {
    return (
      <RouteGuard allowedRoles={["parent"]}>
        <PortalLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">My Child</h1>
              <p className="text-muted-foreground">View your child's profile</p>
            </div>
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <User className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No child profile found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete the assessment questionnaire to create a profile.
                </p>
              </CardContent>
            </Card>
          </div>
        </PortalLayout>
      </RouteGuard>
    );
  }

  const signals = child.signals;

  return (
    <RouteGuard allowedRoles={["parent"]}>
      <PortalLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">My Child</h1>
            <p className="text-muted-foreground">View your child's profile and learning signals</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-6 flex-wrap">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-10 h-10 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold" data-testid="text-child-name">
                    {childUser.firstName} {childUser.lastName || ""}
                  </h2>
                  <div className="flex items-center gap-4 mt-2 text-muted-foreground flex-wrap">
                    <div className="flex items-center gap-1">
                      <GraduationCap className="w-4 h-4" />
                      <span>Grade {child.grade}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{sessionCount} sessions completed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Joined {format(parseISO(child.createdAt), "MMM yyyy")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 flex-wrap">
                    {child.subjects.map((subject) => (
                      <Badge key={subject} variant="secondary" className="text-sm">
                        <BookOpen className="w-3 h-3 mr-1" />
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Learning Signals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <SignalBar
                  label="Confidence"
                  value={signals.confidence}
                  color="[&>div]:bg-green-500"
                />
                <SignalBar
                  label="Memory"
                  value={signals.memory}
                  color="[&>div]:bg-blue-500"
                />
                <SignalBar
                  label="Language"
                  value={signals.language}
                  color="[&>div]:bg-purple-500"
                />
                <SignalBar
                  label="Foundation"
                  value={signals.foundation}
                  color="[&>div]:bg-orange-500"
                />
                <p className="text-xs text-muted-foreground pt-2">
                  These signals are derived from assessments and tutor observations.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Route className="w-4 h-4" />
                    Learning Track
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="font-semibold text-primary" data-testid="text-track">
                      {child.track}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Personalized learning path based on your child's assessment
                    </p>
                  </div>
                  {tutorName && (
                    <div className="mt-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Assigned Tutor</p>
                        <p className="font-medium" data-testid="text-tutor-name">{tutorName}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {child.blockers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No specific areas of concern identified.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {child.blockers.map((blocker) => (
                        <div
                          key={blocker}
                          className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800"
                          data-testid={`blocker-${blocker}`}
                        >
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span className="text-sm font-medium text-amber-700 dark:text-amber-400 capitalize">
                            {blocker}
                          </span>
                        </div>
                      ))}
                      <p className="text-xs text-muted-foreground pt-2">
                        Our tutors focus on these areas during sessions.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PortalLayout>
    </RouteGuard>
  );
}
