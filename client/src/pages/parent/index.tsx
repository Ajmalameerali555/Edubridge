import { useMemo } from "react";
import { Link } from "wouter";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { RouteGuard } from "@/components/portal/RouteGuard";
import { useAuth } from "@/contexts/AuthContext";
import {
  getAllStudents,
  getQuestionnairesByParentId,
  getSessionsByStudentId,
  getNotesByStudentId,
  getUserById,
  Student,
  Questionnaire,
} from "@/lib/datastore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Calendar,
  BarChart3,
  MessageSquare,
  Clock,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileSearch,
  UserPlus,
  CalendarCheck,
  Zap,
  GraduationCap,
  Video,
} from "lucide-react";
import { format, parseISO, isFuture, isPast } from "date-fns";

function getStatusConfig(status: Questionnaire["status"]) {
  switch (status) {
    case "new":
      return {
        label: "Submitted",
        description: "Your questionnaire has been submitted and is awaiting review.",
        icon: FileSearch,
        color: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-950",
      };
    case "reviewed":
      return {
        label: "Under Review",
        description: "Our team is reviewing your child's profile and will match them with the perfect tutor.",
        icon: Clock3,
        color: "text-amber-600",
        bgColor: "bg-amber-50 dark:bg-amber-950",
      };
    case "assigned":
      return {
        label: "Tutor Assigned",
        description: "A tutor has been assigned! Scheduling will begin shortly.",
        icon: UserPlus,
        color: "text-purple-600",
        bgColor: "bg-purple-50 dark:bg-purple-950",
      };
    case "scheduled":
      return {
        label: "Sessions Scheduled",
        description: "Sessions have been scheduled. Your child's learning journey is about to begin!",
        icon: CalendarCheck,
        color: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-950",
      };
    case "active":
      return {
        label: "Active",
        description: "Your child is actively learning with their tutor.",
        icon: Zap,
        color: "text-primary",
        bgColor: "bg-primary/5",
      };
    default:
      return {
        label: "Unknown",
        description: "Status unknown",
        icon: Clock,
        color: "text-muted-foreground",
        bgColor: "bg-muted",
      };
  }
}

export default function ParentPortal() {
  const { user } = useAuth();

  const { child, childUser, questionnaire, upcomingSessions, recentSessions, latestNote, tutorName } = useMemo(() => {
    if (!user) {
      return {
        child: null,
        childUser: null,
        questionnaire: null,
        upcomingSessions: [],
        recentSessions: [],
        latestNote: null,
        tutorName: "",
      };
    }

    const students = getAllStudents();
    const childStudent = students.find((s) => s.parentId === user.id);

    let childUserData = null;
    let sessions: ReturnType<typeof getSessionsByStudentId> = [];
    let notes: ReturnType<typeof getNotesByStudentId> = [];
    let tutorNameStr = "";

    if (childStudent) {
      childUserData = getUserById(childStudent.userId);
      sessions = getSessionsByStudentId(childStudent.id);
      notes = getNotesByStudentId(childStudent.id);

      if (sessions.length > 0) {
        const tutorUser = getUserById(sessions[0].tutorId.replace("tutor", "user_tutor"));
        if (tutorUser) {
          tutorNameStr = `${tutorUser.firstName} ${tutorUser.lastName || ""}`.trim();
        }
      }
    }

    const questionnaires = getQuestionnairesByParentId(user.id);
    const latestQuestionnaire = questionnaires.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    const upcomingSessionsList = sessions
      .filter((s) => (s.status === "upcoming" || s.status === "live") && isFuture(parseISO(s.startAt)))
      .sort((a, b) => parseISO(a.startAt).getTime() - parseISO(b.startAt).getTime())
      .slice(0, 3);

    const recentSessionsList = sessions
      .filter((s) => s.status === "done" && isPast(parseISO(s.startAt)))
      .sort((a, b) => parseISO(b.startAt).getTime() - parseISO(a.startAt).getTime())
      .slice(0, 2);

    const latestNoteData = notes
      .filter((n) => !n.privateNote || n.privateNote === "")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    return {
      child: childStudent,
      childUser: childUserData,
      questionnaire: latestQuestionnaire,
      upcomingSessions: upcomingSessionsList,
      recentSessions: recentSessionsList,
      latestNote: latestNoteData,
      tutorName: tutorNameStr,
    };
  }, [user]);

  const statusConfig = questionnaire ? getStatusConfig(questionnaire.status) : null;
  const isActive = child && (!questionnaire || questionnaire.status === "active");

  return (
    <RouteGuard allowedRoles={["parent"]}>
      <PortalLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-welcome">
              Welcome, {user?.firstName}!
            </h1>
            <p className="text-muted-foreground">Monitor your child's learning progress</p>
          </div>

          {child && childUser ? (
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-semibold" data-testid="text-child-name">
                      {childUser.firstName} {childUser.lastName || ""}
                    </h2>
                    <p className="text-muted-foreground">Grade {child.grade}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {child.subjects.map((subject) => (
                        <Badge key={subject} variant="secondary">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Link href="/parent/child">
                    <Button variant="outline" data-testid="button-view-profile">
                      View Profile
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : questionnaire ? (
            <Card className={statusConfig?.bgColor}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {statusConfig && (
                    <div className={`w-12 h-12 rounded-full bg-background flex items-center justify-center shrink-0`}>
                      <statusConfig.icon className={`w-6 h-6 ${statusConfig.color}`} />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-semibold">Questionnaire Status</h2>
                      {statusConfig && (
                        <Badge variant="outline" className={statusConfig.color}>
                          {statusConfig.label}
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-1">{statusConfig?.description}</p>
                    {questionnaire.studentTemp.firstName && (
                      <p className="text-sm mt-3">
                        <span className="text-muted-foreground">For:</span>{" "}
                        <span className="font-medium">{questionnaire.studentTemp.firstName}</span>
                        {" - "}Grade {questionnaire.studentTemp.grade}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-lg font-semibold">No Child Profile Yet</h2>
                <p className="text-muted-foreground mt-1">
                  Complete the assessment questionnaire to get started.
                </p>
              </CardContent>
            </Card>
          )}

          {isActive && (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Upcoming Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {upcomingSessions.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No upcoming sessions scheduled
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {upcomingSessions.map((session) => (
                          <div
                            key={session.id}
                            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                            data-testid={`upcoming-session-${session.id}`}
                          >
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <Video className="w-5 h-5 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium truncate">{session.subject}</p>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>{format(parseISO(session.startAt), "EEE, MMM d 'at' h:mm a")}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <Link href="/parent/sessions">
                      <Button variant="ghost" className="w-full mt-3" data-testid="button-view-sessions">
                        View All Sessions
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Recent Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentSessions.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No completed sessions yet
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {recentSessions.map((session) => (
                          <div
                            key={session.id}
                            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                            data-testid={`recent-session-${session.id}`}
                          >
                            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium truncate">{session.subject}</p>
                              <p className="text-sm text-muted-foreground">
                                {format(parseISO(session.startAt), "MMM d, yyyy")}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {latestNote && (
                      <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900">
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Latest Tutor Note</p>
                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                          {latestNote.coveredTopic}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium">Quick Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Link href="/parent/child">
                      <div className="flex items-center gap-3 p-4 rounded-lg border hover-elevate cursor-pointer" data-testid="link-child">
                        <User className="w-5 h-5 text-primary shrink-0" />
                        <div>
                          <p className="font-medium">My Child</p>
                          <p className="text-sm text-muted-foreground">View profile</p>
                        </div>
                      </div>
                    </Link>
                    <Link href="/parent/sessions">
                      <div className="flex items-center gap-3 p-4 rounded-lg border hover-elevate cursor-pointer" data-testid="link-sessions">
                        <Calendar className="w-5 h-5 text-primary shrink-0" />
                        <div>
                          <p className="font-medium">Sessions</p>
                          <p className="text-sm text-muted-foreground">View schedule</p>
                        </div>
                      </div>
                    </Link>
                    <Link href="/parent/reports">
                      <div className="flex items-center gap-3 p-4 rounded-lg border hover-elevate cursor-pointer" data-testid="link-reports">
                        <BarChart3 className="w-5 h-5 text-primary shrink-0" />
                        <div>
                          <p className="font-medium">Reports</p>
                          <p className="text-sm text-muted-foreground">View progress</p>
                        </div>
                      </div>
                    </Link>
                    <Link href="/parent/messages">
                      <div className="flex items-center gap-3 p-4 rounded-lg border hover-elevate cursor-pointer" data-testid="link-messages">
                        <MessageSquare className="w-5 h-5 text-primary shrink-0" />
                        <div>
                          <p className="font-medium">Messages</p>
                          <p className="text-sm text-muted-foreground">Chat with tutor</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {!isActive && child && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Link href="/parent/child">
                    <div className="flex items-center gap-3 p-4 rounded-lg border hover-elevate cursor-pointer" data-testid="link-child">
                      <User className="w-5 h-5 text-primary shrink-0" />
                      <div>
                        <p className="font-medium">My Child</p>
                        <p className="text-sm text-muted-foreground">View profile details</p>
                      </div>
                    </div>
                  </Link>
                  <Link href="/parent/messages">
                    <div className="flex items-center gap-3 p-4 rounded-lg border hover-elevate cursor-pointer" data-testid="link-messages">
                      <MessageSquare className="w-5 h-5 text-primary shrink-0" />
                      <div>
                        <p className="font-medium">Messages</p>
                        <p className="text-sm text-muted-foreground">Contact support</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </PortalLayout>
    </RouteGuard>
  );
}
