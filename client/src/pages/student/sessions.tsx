import { useState, useMemo } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { RouteGuard } from "@/components/portal/RouteGuard";
import { SideDrawer } from "@/components/portal/SideDrawer";
import { useAuth } from "@/contexts/AuthContext";
import {
  getSessionsByStudentId,
  getNotesBySessionId,
  getUserById,
  getTutorById,
  Session,
  Note,
} from "@/lib/datastore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Video,
  Calendar,
  Clock,
  User,
  ExternalLink,
  BookOpen,
  MessageSquare,
} from "lucide-react";
import { format, parseISO, isFuture, isPast } from "date-fns";

export default function StudentSessions() {
  const { student } = useAuth();
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { upcomingSessions, pastSessions } = useMemo(() => {
    if (!student) return { upcomingSessions: [], pastSessions: [] };

    const sessions = getSessionsByStudentId(student.id);
    const upcoming = sessions
      .filter((s) => s.status === "upcoming" || (s.status === "live"))
      .sort((a, b) => parseISO(a.startAt).getTime() - parseISO(b.startAt).getTime());
    const past = sessions
      .filter((s) => s.status === "done" || s.status === "missed")
      .sort((a, b) => parseISO(b.startAt).getTime() - parseISO(a.startAt).getTime());

    return { upcomingSessions: upcoming, pastSessions: past };
  }, [student]);

  const sessionNotes = useMemo(() => {
    if (!selectedSession) return [];
    return getNotesBySessionId(selectedSession.id);
  }, [selectedSession]);

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

  const getStatusBadge = (status: Session["status"]) => {
    switch (status) {
      case "upcoming":
        return <Badge variant="secondary">Upcoming</Badge>;
      case "live":
        return <Badge className="bg-green-500 text-white">Live Now</Badge>;
      case "done":
        return <Badge variant="outline">Completed</Badge>;
      case "missed":
        return <Badge variant="destructive">Missed</Badge>;
      default:
        return null;
    }
  };

  const handleSessionClick = (session: Session) => {
    setSelectedSession(session);
    setDrawerOpen(true);
  };

  const SessionCard = ({ session, showJoin = false }: { session: Session; showJoin?: boolean }) => (
    <div
      className="flex items-center gap-4 p-4 rounded-lg border hover-elevate cursor-pointer"
      onClick={() => handleSessionClick(session)}
      data-testid={`session-${session.id}`}
    >
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Video className="w-6 h-6 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-medium">{session.subject}</h3>
          {getStatusBadge(session.status)}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {format(parseISO(session.startAt), "MMM d, yyyy")}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {format(parseISO(session.startAt), "h:mm a")}
          </span>
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {getTutorName(session.tutorId)}
          </span>
        </div>
      </div>
      {showJoin && (session.status === "upcoming" || session.status === "live") && (
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            window.open(session.meetLink, "_blank");
          }}
          data-testid={`button-join-${session.id}`}
        >
          <ExternalLink className="w-4 h-4 mr-1" />
          Join
        </Button>
      )}
    </div>
  );

  return (
    <RouteGuard allowedRoles={["student"]}>
      <PortalLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Sessions</h1>
            <p className="text-muted-foreground">Your tutoring sessions</p>
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

            <TabsContent value="upcoming" className="mt-4">
              {upcomingSessions.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No upcoming sessions</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {upcomingSessions.map((session) => (
                    <SessionCard key={session.id} session={session} showJoin />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="mt-4">
              {pastSessions.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No past sessions</p>
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
        </div>

        <SideDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title={selectedSession ? `${selectedSession.subject} Session` : "Session Details"}
        >
          {selectedSession && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedSession.status)}
                </div>

                <div className="grid gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">
                        {format(parseISO(selectedSession.startAt), "EEEE, MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">
                        {format(parseISO(selectedSession.startAt), "h:mm a")} ({selectedSession.durationMin} min)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tutor</p>
                      <p className="font-medium">{getTutorName(selectedSession.tutorId)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Subject</p>
                      <p className="font-medium">{selectedSession.subject}</p>
                    </div>
                  </div>
                </div>

                {(selectedSession.status === "upcoming" || selectedSession.status === "live") && (
                  <Button
                    className="w-full"
                    onClick={() => window.open(selectedSession.meetLink, "_blank")}
                    data-testid="button-join-drawer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Join Session
                  </Button>
                )}
              </div>

              {sessionNotes.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Tutor Notes
                    </h3>
                    {sessionNotes.map((note) => (
                      <Card key={note.id}>
                        <CardContent className="p-4 space-y-3">
                          <div>
                            <p className="text-sm text-muted-foreground">Covered Topic</p>
                            <p className="font-medium">{note.coveredTopic}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">Response:</p>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    i <= note.studentResponse
                                      ? "bg-primary"
                                      : "bg-muted"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {note.nextFocus && (
                            <div>
                              <p className="text-sm text-muted-foreground">Next Focus</p>
                              <p>{note.nextFocus}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </SideDrawer>
      </PortalLayout>
    </RouteGuard>
  );
}
