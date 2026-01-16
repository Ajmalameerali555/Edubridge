import * as React from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { RouteGuard } from "@/components/portal/RouteGuard";
import { SideDrawer } from "@/components/portal/SideDrawer";
import { useAuth } from "@/contexts/AuthContext";
import {
  getSessionsByTutorId,
  getStudentById,
  getUserById,
  getNotesBySessionId,
  createNote,
  createHomework,
  getSettings,
  Session,
  Note,
} from "@/lib/datastore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Video, Calendar, Clock, User, FileText, Plus, X } from "lucide-react";
import { format, parseISO } from "date-fns";

const ISSUE_OPTIONS = [
  "Distracted",
  "Struggling",
  "Technical Issues",
  "Low Engagement",
  "Missed Content",
  "Behavioral",
];

export default function TutorSessions() {
  const { tutor, user } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [selectedSession, setSelectedSession] = React.useState<Session | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [existingNotes, setExistingNotes] = React.useState<Note[]>([]);
  const [noteForm, setNoteForm] = React.useState({
    coveredTopic: "",
    studentResponse: 3,
    issues: [] as string[],
    nextFocus: "",
    privateNote: "",
    assignHomework: false,
  });
  const [saving, setSaving] = React.useState(false);

  const loadSessions = React.useCallback(() => {
    if (tutor) {
      setSessions(getSessionsByTutorId(tutor.id));
    }
  }, [tutor]);

  React.useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const filteredSessions = sessions
    .filter((s) => statusFilter === "all" || s.status === statusFilter)
    .sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime());

  const getStudentName = (studentId: string) => {
    const student = getStudentById(studentId);
    if (!student) return "Unknown";
    const studentUser = getUserById(student.userId);
    return studentUser ? `${studentUser.firstName} ${studentUser.lastName || ""}`.trim() : "Unknown";
  };

  const openSessionDetails = (session: Session) => {
    setSelectedSession(session);
    setExistingNotes(getNotesBySessionId(session.id));
    setNoteForm({
      coveredTopic: "",
      studentResponse: 3,
      issues: [],
      nextFocus: "",
      privateNote: "",
      assignHomework: false,
    });
    setDrawerOpen(true);
  };

  const toggleIssue = (issue: string) => {
    setNoteForm((prev) => ({
      ...prev,
      issues: prev.issues.includes(issue)
        ? prev.issues.filter((i) => i !== issue)
        : [...prev.issues, issue],
    }));
  };

  const handleSaveNote = () => {
    if (!selectedSession || !tutor || !noteForm.coveredTopic.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter the topic covered.",
      });
      return;
    }

    setSaving(true);

    let homeworkId: string | undefined;

    if (noteForm.assignHomework) {
      const settings = getSettings();
      const template = settings.templates.homework[0];
      if (template) {
        const student = getStudentById(selectedSession.studentId);
        const hw = createHomework({
          studentId: selectedSession.studentId,
          tutorId: tutor.id,
          subject: selectedSession.subject,
          title: `${selectedSession.subject} - ${noteForm.coveredTopic}`,
          items: template.items.map((q, i) => ({ id: `item${i}`, question: q })),
          dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: "assigned",
        });
        homeworkId = hw.id;
      }
    }

    createNote({
      sessionId: selectedSession.id,
      tutorId: tutor.id,
      studentId: selectedSession.studentId,
      coveredTopic: noteForm.coveredTopic.trim(),
      studentResponse: noteForm.studentResponse,
      issues: noteForm.issues,
      nextFocus: noteForm.nextFocus.trim(),
      homeworkId,
      privateNote: noteForm.privateNote.trim(),
    });

    toast({
      title: "Note Saved",
      description: noteForm.assignHomework
        ? "Session note saved and homework assigned."
        : "Session note saved successfully.",
    });

    setExistingNotes(getNotesBySessionId(selectedSession.id));
    setNoteForm({
      coveredTopic: "",
      studentResponse: 3,
      issues: [],
      nextFocus: "",
      privateNote: "",
      assignHomework: false,
    });
    setSaving(false);
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
              <h1 className="text-2xl font-bold" data-testid="text-page-title">Sessions</h1>
              <p className="text-muted-foreground">
                {sessions.length} total session{sessions.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sessions</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="done">Done</SelectItem>
                <SelectItem value="missed">Missed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredSessions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No sessions found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {filteredSessions.map((session) => (
                <Card
                  key={session.id}
                  className="hover-elevate cursor-pointer"
                  onClick={() => openSessionDetails(session)}
                  data-testid={`session-row-${session.id}`}
                >
                  <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{getStudentName(session.studentId)}</p>
                        <p className="text-sm text-muted-foreground">{session.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {format(parseISO(session.startAt), "MMM d, yyyy")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(parseISO(session.startAt), "h:mm a")} - {session.durationMin}min
                        </p>
                      </div>
                      {getStatusBadge(session.status)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <SideDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title={selectedSession ? `Session: ${selectedSession.subject}` : "Session Details"}
          footer={
            selectedSession?.status === "done" ? (
              <Button onClick={handleSaveNote} disabled={saving} className="w-full" data-testid="button-save-note">
                <Plus className="h-4 w-4 mr-2" />
                Save Note
              </Button>
            ) : null
          }
        >
          {selectedSession && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Student</p>
                    <p className="font-medium">{getStudentName(selectedSession.studentId)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date & Time</p>
                    <p className="font-medium">
                      {format(parseISO(selectedSession.startAt), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{selectedSession.durationMin} minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(selectedSession.status)}
                </div>
                {(selectedSession.status === "upcoming" || selectedSession.status === "live") && (
                  <Button
                    className="w-full"
                    onClick={() => window.open(selectedSession.meetLink, "_blank")}
                    data-testid="button-join-session"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Join Session
                  </Button>
                )}
              </div>

              {existingNotes.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Previous Notes
                  </h4>
                  {existingNotes.map((note) => (
                    <Card key={note.id}>
                      <CardContent className="p-3 space-y-2 text-sm">
                        <p><strong>Topic:</strong> {note.coveredTopic}</p>
                        <p><strong>Response:</strong> {note.studentResponse}/5</p>
                        {note.issues.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {note.issues.map((issue) => (
                              <Badge key={issue} variant="outline" className="text-xs">
                                {issue}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {note.nextFocus && <p><strong>Next Focus:</strong> {note.nextFocus}</p>}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {selectedSession.status === "done" && (
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-medium">Add Session Note</h4>

                  <div className="space-y-2">
                    <Label htmlFor="coveredTopic">Topic Covered *</Label>
                    <Input
                      id="coveredTopic"
                      value={noteForm.coveredTopic}
                      onChange={(e) => setNoteForm((p) => ({ ...p, coveredTopic: e.target.value }))}
                      placeholder="What was covered in this session?"
                      data-testid="input-covered-topic"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Student Response (1-5)</Label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Button
                          key={n}
                          type="button"
                          size="sm"
                          variant={noteForm.studentResponse === n ? "default" : "outline"}
                          onClick={() => setNoteForm((p) => ({ ...p, studentResponse: n }))}
                          data-testid={`button-response-${n}`}
                        >
                          {n}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Issues (if any)</Label>
                    <div className="flex flex-wrap gap-2">
                      {ISSUE_OPTIONS.map((issue) => (
                        <Badge
                          key={issue}
                          variant={noteForm.issues.includes(issue) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleIssue(issue)}
                          data-testid={`issue-chip-${issue}`}
                        >
                          {issue}
                          {noteForm.issues.includes(issue) && (
                            <X className="h-3 w-3 ml-1" />
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nextFocus">Next Focus</Label>
                    <Input
                      id="nextFocus"
                      value={noteForm.nextFocus}
                      onChange={(e) => setNoteForm((p) => ({ ...p, nextFocus: e.target.value }))}
                      placeholder="What to focus on next session"
                      data-testid="input-next-focus"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="privateNote">Private Note (Optional)</Label>
                    <Textarea
                      id="privateNote"
                      value={noteForm.privateNote}
                      onChange={(e) => setNoteForm((p) => ({ ...p, privateNote: e.target.value }))}
                      placeholder="Notes for yourself..."
                      className="resize-none"
                      data-testid="input-private-note"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="assignHomework"
                      checked={noteForm.assignHomework}
                      onCheckedChange={(checked) =>
                        setNoteForm((p) => ({ ...p, assignHomework: checked === true }))
                      }
                      data-testid="checkbox-assign-homework"
                    />
                    <Label htmlFor="assignHomework" className="text-sm cursor-pointer">
                      Assign homework from template
                    </Label>
                  </div>
                </div>
              )}
            </div>
          )}
        </SideDrawer>
      </PortalLayout>
    </RouteGuard>
  );
}
