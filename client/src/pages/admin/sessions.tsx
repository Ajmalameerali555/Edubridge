import * as React from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { RouteGuard } from "@/components/portal/RouteGuard";
import { SideDrawer } from "@/components/portal/SideDrawer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAllSessions,
  getAllStudents,
  getAllTutors,
  getUserById,
  updateSession,
  Session,
} from "@/lib/datastore";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Video, Clock, ExternalLink } from "lucide-react";

type SessionStatus = "upcoming" | "live" | "done" | "missed";

const statusOptions: SessionStatus[] = ["upcoming", "live", "done", "missed"];

export default function AdminSessions() {
  const { toast } = useToast();
  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = React.useState<Session | null>(null);
  const [statusFilter, setStatusFilter] = React.useState<SessionStatus | "all">("all");
  const [editMeetLink, setEditMeetLink] = React.useState<string>("");

  const students = getAllStudents();
  const tutors = getAllTutors();

  const refreshSessions = () => {
    setSessions(getAllSessions());
  };

  React.useEffect(() => {
    refreshSessions();
  }, []);

  React.useEffect(() => {
    if (selectedSession) {
      setEditMeetLink(selectedSession.meetLink);
    }
  }, [selectedSession]);

  const filteredSessions = statusFilter === "all"
    ? sessions
    : sessions.filter((s) => s.status === statusFilter);

  const sortedSessions = [...filteredSessions].sort(
    (a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime()
  );

  const handleSaveMeetLink = () => {
    if (!selectedSession) return;
    updateSession(selectedSession.id, { meetLink: editMeetLink });
    refreshSessions();
    toast({ title: "Meet link updated", description: "Session link has been saved" });
    setSelectedSession(null);
  };

  const handleUpdateStatus = (status: SessionStatus) => {
    if (!selectedSession) return;
    updateSession(selectedSession.id, { status });
    refreshSessions();
    setSelectedSession({ ...selectedSession, status });
    toast({ title: "Status updated", description: `Session marked as ${status}` });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "upcoming":
        return "default";
      case "live":
        return "destructive";
      case "done":
        return "secondary";
      case "missed":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return "Unknown";
    const user = getUserById(student.userId);
    return user ? `${user.firstName} ${user.lastName}` : "Unknown";
  };

  const getTutorName = (tutorId: string) => {
    const tutor = tutors.find((t) => t.id === tutorId);
    if (!tutor) return "Unknown";
    const user = getUserById(tutor.userId);
    return user ? `${user.firstName} ${user.lastName}` : "Unknown";
  };

  return (
    <RouteGuard allowedRoles={["admin"]}>
      <PortalLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-page-title">Sessions</h1>
              <p className="text-muted-foreground">Manage all tutoring sessions</p>
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as SessionStatus | "all")}>
              <SelectTrigger className="w-[150px]" data-testid="select-status-filter">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 flex-wrap">
            {statusOptions.map((status) => (
              <Badge
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setStatusFilter(status)}
                data-testid={`badge-filter-${status}`}
              >
                {status}
                <span className="ml-1 opacity-70">
                  ({sessions.filter((s) => s.status === status).length})
                </span>
              </Badge>
            ))}
          </div>

          <div className="space-y-3">
            {sortedSessions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No sessions found</p>
                </CardContent>
              </Card>
            ) : (
              sortedSessions.map((session) => (
                <Card
                  key={session.id}
                  className="cursor-pointer hover-elevate"
                  onClick={() => setSelectedSession(session)}
                  data-testid={`row-session-${session.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Video className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{session.subject}</p>
                          <p className="text-sm text-muted-foreground">
                            {getStudentName(session.studentId)} with {getTutorName(session.tutorId)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {new Date(session.startAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(session.startAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        <Badge variant={getStatusBadgeVariant(session.status)}>
                          {session.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <SideDrawer
          open={selectedSession !== null}
          onClose={() => setSelectedSession(null)}
          title="Session Details"
          footer={
            <Button onClick={handleSaveMeetLink} data-testid="button-save-meetlink">
              Save Changes
            </Button>
          }
        >
          {selectedSession && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Session Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Subject</span>
                    <p className="font-medium">{selectedSession.subject}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Duration</span>
                    <p className="font-medium">{selectedSession.durationMin} minutes</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Date</span>
                    <p className="font-medium">
                      {new Date(selectedSession.startAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Time</span>
                    <p className="font-medium">
                      {new Date(selectedSession.startAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Participants</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Student</p>
                      <p className="font-medium">{getStudentName(selectedSession.studentId)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Tutor</p>
                      <p className="font-medium">{getTutorName(selectedSession.tutorId)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Status</h3>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <Badge
                      key={status}
                      variant={selectedSession.status === status ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleUpdateStatus(status)}
                      data-testid={`badge-status-${status}`}
                    >
                      {status}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Meet Link</h3>
                <div className="space-y-2">
                  <Label htmlFor="meet-link">Meeting URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="meet-link"
                      value={editMeetLink}
                      onChange={(e) => setEditMeetLink(e.target.value)}
                      placeholder="https://meet.edubridge.com/..."
                      data-testid="input-meetlink"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(editMeetLink, "_blank")}
                      data-testid="button-open-link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SideDrawer>
      </PortalLayout>
    </RouteGuard>
  );
}
