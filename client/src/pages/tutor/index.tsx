import * as React from "react";
import { Link } from "wouter";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { RouteGuard } from "@/components/portal/RouteGuard";
import { useAuth } from "@/contexts/AuthContext";
import {
  getSessionsByTutorId,
  getStudentById,
  getUserById,
  getAllStudents,
  Session,
  Student,
} from "@/lib/datastore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Video,
  Eye,
  Plus,
  MessageSquare,
  Users,
  Clock,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
import { format, isToday, parseISO } from "date-fns";

function SignalBar({ value, label }: { value: number; label: string }) {
  const getColor = (v: number) => {
    if (v >= 70) return "bg-green-500";
    if (v >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground w-20 truncate">{label}</span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${getColor(value)}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-medium w-8">{value}%</span>
    </div>
  );
}

export default function TutorPortal() {
  const { tutor, user } = useAuth();
  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [studentsNeedingAttention, setStudentsNeedingAttention] = React.useState<
    { student: Student; reason: string }[]
  >([]);

  React.useEffect(() => {
    if (tutor) {
      const allSessions = getSessionsByTutorId(tutor.id);
      setSessions(allSessions);

      const studentIds = Array.from(new Set(allSessions.map((s) => s.studentId)));
      const attentionList: { student: Student; reason: string }[] = [];

      studentIds.forEach((studentId) => {
        const student = getStudentById(studentId);
        if (student) {
          const hasLowSignals = Object.values(student.signals).some((v) => v < 60);
          const hasMissedSession = allSessions.some(
            (s) => s.studentId === studentId && s.status === "missed"
          );

          if (hasLowSignals) {
            attentionList.push({ student, reason: "Low signals detected" });
          } else if (hasMissedSession) {
            attentionList.push({ student, reason: "Missed session" });
          }
        }
      });

      setStudentsNeedingAttention(attentionList);
    }
  }, [tutor]);

  const todaySessions = sessions
    .filter((s) => isToday(parseISO(s.startAt)))
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

  const getStudentName = (studentId: string) => {
    const student = getStudentById(studentId);
    if (!student) return "Unknown";
    const studentUser = getUserById(student.userId);
    return studentUser ? `${studentUser.firstName} ${studentUser.lastName || ""}`.trim() : "Unknown";
  };

  const getStatusBadge = (status: Session["status"]) => {
    switch (status) {
      case "live":
        return <Badge className="bg-green-500">Live</Badge>;
      case "upcoming":
        return <Badge variant="secondary">Upcoming</Badge>;
      case "done":
        return <Badge variant="outline">Done</Badge>;
      case "missed":
        return <Badge variant="destructive">Missed</Badge>;
      default:
        return null;
    }
  };

  return (
    <RouteGuard allowedRoles={["tutor"]}>
      <PortalLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-page-title">
                Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"}, {user?.firstName}
              </h1>
              <p className="text-muted-foreground">
                {format(new Date(), "EEEE, MMMM d, yyyy")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/tutor/homework">
              <Card className="hover-elevate cursor-pointer">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Create Homework</p>
                    <p className="text-sm text-muted-foreground">Assign new work</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/tutor/messages">
              <Card className="hover-elevate cursor-pointer">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Messages</p>
                    <p className="text-sm text-muted-foreground">Chat with students</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/tutor/students">
              <Card className="hover-elevate cursor-pointer">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">My Students</p>
                    <p className="text-sm text-muted-foreground">View all students</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today's Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todaySessions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No sessions scheduled for today
                </p>
              ) : (
                <div className="space-y-3">
                  {todaySessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border bg-card"
                      data-testid={`session-row-${session.id}`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-center min-w-[60px]">
                          <p className="text-lg font-semibold">
                            {format(parseISO(session.startAt), "h:mm")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(parseISO(session.startAt), "a")}
                          </p>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{getStudentName(session.studentId)}</p>
                          <p className="text-sm text-muted-foreground">{session.subject}</p>
                        </div>
                        {getStatusBadge(session.status)}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => window.open(session.meetLink, "_blank")}
                          disabled={session.status === "done" || session.status === "missed"}
                          data-testid={`button-join-${session.id}`}
                        >
                          <Video className="h-4 w-4 mr-1" />
                          Join
                        </Button>
                        <Link href={`/tutor/sessions`}>
                          <Button size="sm" variant="outline" data-testid={`button-details-${session.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {studentsNeedingAttention.length > 0 && (
            <Card className="border-yellow-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
                  <AlertTriangle className="h-5 w-5" />
                  Students Needing Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {studentsNeedingAttention.map(({ student, reason }) => {
                    const studentUser = getUserById(student.userId);
                    return (
                      <Link key={student.id} href={`/tutor/students/${student.id}`}>
                        <div
                          className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border hover-elevate cursor-pointer"
                          data-testid={`attention-student-${student.id}`}
                        >
                          <div className="flex-1">
                            <p className="font-medium">
                              {studentUser ? `${studentUser.firstName} ${studentUser.lastName || ""}`.trim() : "Unknown"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Grade {student.grade} - {student.subjects.join(", ")}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-yellow-600">
                            {reason}
                          </Badge>
                          <div className="w-48 space-y-1">
                            <SignalBar value={student.signals.confidence} label="Confidence" />
                            <SignalBar value={student.signals.memory} label="Memory" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </PortalLayout>
    </RouteGuard>
  );
}
