import * as React from "react";
import { useMemo } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { RouteGuard } from "@/components/portal/RouteGuard";
import { SideDrawer } from "@/components/portal/SideDrawer";
import { useAuth } from "@/contexts/AuthContext";
import {
  getAllStudents,
  getSessionsByStudentId,
  getNotesBySessionId,
  getUserById,
  getTutorById,
  Session,
} from "@/lib/datastore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  BookOpen,
  FileText,
} from "lucide-react";
import { format, parseISO, isFuture, isPast } from "date-fns";

function getStatusConfig(status: Session["status"]) {
  switch (status) {
    case "upcoming":
      return {
        label: "Upcoming",
        icon: Calendar,
        className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      };
    case "live":
      return {
        label: "Live",
        icon: Video,
        className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      };
    case "done":
      return {
        label: "Completed",
        icon: CheckCircle2,
        className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      };
    case "missed":
      return {
        label: "Missed",
        icon: XCircle,
        className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      };
    default:
      return {
        label: status,
        icon: Calendar,
        className: "bg-gray-100 text-gray-700",
      };
  }
}

export default function ParentSessions() {
  const { user } = useAuth();
  const [selectedSession, setSelectedSession] = React.useState<Session | null>(null);

  const { child, sessions, upcomingSessions, pastSessions } = useMemo(() => {
    if (!user) {
      return { child: null, sessions: [], upcomingSessions: [], pastSessions: [] };
    }

    const students = getAllStudents();
    const childStudent = students.find((s) => s.parentId === user.id);

    if (!childStudent) {
      return { child: null, sessions: [], upcomingSessions: [], pastSessions: [] };
    }

    const allSessions = getSessionsByStudentId(childStudent.id);

    const upcoming = allSessions
      .filter((s) => s.status === "upcoming" || s.status === "live")
      .sort((a, b) => parseISO(a.startAt).getTime() - parseISO(b.startAt).getTime());

    const past = allSessions
      .filter((s) => s.status === "done" || s.status === "missed")
      .sort((a, b) => parseISO(b.startAt).getTime() - parseISO(a.startAt).getTime());

    return {
      child: childStudent,
      sessions: allSessions,
      upcomingSessions: upcoming,
      pastSessions: past,
    };
  }, [user]);

  const sessionDetails = useMemo(() => {
    if (!selectedSession) return null;

    const tutorUser = getUserById(selectedSession.tutorId.replace("tutor", "user_tutor"));
    const notes = getNotesBySessionId(selectedSession.id);
    const publicNotes = notes.filter((n) => !n.privateNote || n.privateNote === "");

    return {
      tutorName: tutorUser ? `${tutorUser.firstName} ${tutorUser.lastName || ""}`.trim() : "Unknown",
      notes: publicNotes,
    };
  }, [selectedSession]);

  if (!child) {
    return (
      <RouteGuard allowedRoles={["parent"]}>
        <PortalLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Sessions</h1>
              <p className="text-muted-foreground">Your child's tutoring sessions</p>
            </div>
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No child profile found</p>
              </CardContent>
            </Card>
          </div>
        </PortalLayout>
      </RouteGuard>
    );
  }

  const SessionCard = ({ session }: { session: Session }) => {
    const statusConfig = getStatusConfig(session.status);
    const StatusIcon = statusConfig.icon;

    return (
      <Card
        className="hover-elevate cursor-pointer"
        onClick={() => setSelectedSession(session)}
        data-testid={`session-card-${session.id}`}
      >
        <CardContent className="flex items-center gap-4 p-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Video className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium">{session.subject}</p>
              <Badge variant="secondary" className={statusConfig.className}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusConfig.label}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{format(parseISO(session.startAt), "EEE, MMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{format(parseISO(session.startAt), "h:mm a")} ({session.durationMin} min)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <RouteGuard allowedRoles={["parent"]}>
      <PortalLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Sessions</h1>
            <p className="text-muted-foreground">Your child's tutoring sessions</p>
          </div>

          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming" data-testid="tab-upcoming">
                Upcoming ({upcomingSessions.length})
              </TabsTrigger>
              <TabsTrigger value="past" data-testid="tab-past">
                Past ({pastSessions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-6">
              {upcomingSessions.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No upcoming sessions</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Sessions will appear here once scheduled
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {upcomingSessions.map((session) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="mt-6">
              {pastSessions.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No past sessions</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Completed sessions will appear here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {pastSessions.map((session) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex items-start gap-2 p-4 rounded-lg bg-muted/50">
            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">
              Your child joins sessions through their student portal. This view is for monitoring purposes only.
            </p>
          </div>
        </div>

        <SideDrawer
          open={!!selectedSession}
          onClose={() => setSelectedSession(null)}
          title="Session Details"
        >
          {selectedSession && sessionDetails && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg" data-testid="drawer-subject">
                      {selectedSession.subject}
                    </h3>
                    <Badge variant="secondary" className={getStatusConfig(selectedSession.status).className}>
                      {getStatusConfig(selectedSession.status).label}
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">
                        {format(parseISO(selectedSession.startAt), "EEEE, MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">
                        {format(parseISO(selectedSession.startAt), "h:mm a")} ({selectedSession.durationMin} minutes)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tutor</p>
                      <p className="font-medium" data-testid="drawer-tutor">
                        {sessionDetails.tutorName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedSession.status === "done" && sessionDetails.notes.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Session Notes
                  </h4>
                  {sessionDetails.notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 rounded-lg border space-y-3"
                      data-testid={`note-${note.id}`}
                    >
                      <div>
                        <p className="text-sm text-muted-foreground">Topic Covered</p>
                        <p className="font-medium">{note.coveredTopic}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">Student Response:</p>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <div
                              key={star}
                              className={`w-4 h-4 rounded-full ${
                                star <= note.studentResponse
                                  ? "bg-primary"
                                  : "bg-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{note.studentResponse}/5</span>
                      </div>
                      {note.nextFocus && (
                        <div>
                          <p className="text-sm text-muted-foreground">Next Focus</p>
                          <p>{note.nextFocus}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {selectedSession.status === "done" && sessionDetails.notes.length === 0 && (
                <div className="text-center py-6">
                  <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No session notes available</p>
                </div>
              )}
            </div>
          )}
        </SideDrawer>
      </PortalLayout>
    </RouteGuard>
  );
}
