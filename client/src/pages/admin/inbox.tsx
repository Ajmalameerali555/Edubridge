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
  getAllQuestionnaires,
  getAllTutors,
  updateQuestionnaire,
  createSession,
  createStudent,
  createUser,
  getUserById,
  Questionnaire,
  Tutor,
} from "@/lib/datastore";
import { useToast } from "@/hooks/use-toast";
import { FileText, ChevronRight } from "lucide-react";

const statusOrder = ["new", "reviewed", "assigned", "scheduled", "active"] as const;

type QuestionnaireStatus = typeof statusOrder[number];

export default function AdminInbox() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = React.useState<QuestionnaireStatus | "all">("all");
  const [selectedQuestionnaire, setSelectedQuestionnaire] = React.useState<Questionnaire | null>(null);
  const [selectedTutor, setSelectedTutor] = React.useState<string>("");
  const [scheduledDate, setScheduledDate] = React.useState<string>("");
  const [questionnaires, setQuestionnaires] = React.useState<Questionnaire[]>([]);
  const tutors = getAllTutors();

  const refreshQuestionnaires = () => {
    setQuestionnaires(getAllQuestionnaires());
  };

  React.useEffect(() => {
    refreshQuestionnaires();
  }, []);

  const filteredQuestionnaires = statusFilter === "all"
    ? questionnaires
    : questionnaires.filter((q) => q.status === statusFilter);

  const handleApproveTrack = () => {
    if (!selectedQuestionnaire) return;
    updateQuestionnaire(selectedQuestionnaire.id, { status: "reviewed" });
    refreshQuestionnaires();
    toast({ title: "Track approved", description: "Questionnaire moved to reviewed status" });
    setSelectedQuestionnaire(null);
  };

  const handleAssignTutor = () => {
    if (!selectedQuestionnaire || !selectedTutor) return;
    updateQuestionnaire(selectedQuestionnaire.id, { status: "assigned" });
    refreshQuestionnaires();
    toast({ title: "Tutor assigned", description: "Questionnaire moved to assigned status" });
    setSelectedQuestionnaire(null);
    setSelectedTutor("");
  };

  const handleScheduleSession = () => {
    if (!selectedQuestionnaire || !selectedTutor || !scheduledDate) return;

    const parentUser = getUserById(selectedQuestionnaire.parentId);
    const newUser = createUser({
      email: `student_${Date.now()}@edubridge.com`,
      password: "student123",
      firstName: selectedQuestionnaire.studentTemp.firstName || "Student",
      mobile: parentUser?.mobile || "",
      role: "student",
      isActive: true,
    });

    const newStudent = createStudent({
      userId: newUser.id,
      parentId: selectedQuestionnaire.parentId,
      grade: selectedQuestionnaire.studentTemp.grade,
      subjects: selectedQuestionnaire.studentTemp.subjects,
      track: selectedQuestionnaire.derived.track,
      blockers: selectedQuestionnaire.derived.blockers,
      signals: selectedQuestionnaire.derived.signals,
    });

    createSession({
      studentId: newStudent.id,
      tutorId: selectedTutor,
      subject: selectedQuestionnaire.studentTemp.subjects[0] || "General",
      startAt: new Date(scheduledDate).toISOString(),
      durationMin: 45,
      meetLink: `https://meet.edubridge.com/session_${Date.now()}`,
      status: "upcoming",
    });

    updateQuestionnaire(selectedQuestionnaire.id, { status: "scheduled" });
    refreshQuestionnaires();
    toast({ title: "Session scheduled", description: "Student created and first session scheduled" });
    setSelectedQuestionnaire(null);
    setSelectedTutor("");
    setScheduledDate("");
  };

  const handleActivate = () => {
    if (!selectedQuestionnaire) return;
    updateQuestionnaire(selectedQuestionnaire.id, { status: "active" });
    refreshQuestionnaires();
    toast({ title: "Activated", description: "Questionnaire marked as active" });
    setSelectedQuestionnaire(null);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "new":
        return "default";
      case "reviewed":
        return "secondary";
      case "assigned":
        return "outline";
      case "scheduled":
        return "default";
      case "active":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <RouteGuard allowedRoles={["admin"]}>
      <PortalLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-page-title">Questionnaire Inbox</h1>
              <p className="text-muted-foreground">Review and process questionnaire submissions</p>
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as QuestionnaireStatus | "all")}>
              <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statusOrder.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground overflow-x-auto pb-2">
            {statusOrder.map((status, idx) => (
              <React.Fragment key={status}>
                <Badge
                  variant={statusFilter === status ? "default" : "outline"}
                  className="cursor-pointer shrink-0"
                  onClick={() => setStatusFilter(status)}
                  data-testid={`badge-status-${status}`}
                >
                  {status}
                  <span className="ml-1 opacity-70">
                    ({questionnaires.filter((q) => q.status === status).length})
                  </span>
                </Badge>
                {idx < statusOrder.length - 1 && <ChevronRight className="w-4 h-4 shrink-0" />}
              </React.Fragment>
            ))}
          </div>

          <div className="space-y-3">
            {filteredQuestionnaires.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No questionnaires found</p>
                </CardContent>
              </Card>
            ) : (
              filteredQuestionnaires.map((q) => (
                <Card
                  key={q.id}
                  className="cursor-pointer hover-elevate"
                  onClick={() => setSelectedQuestionnaire(q)}
                  data-testid={`row-questionnaire-${q.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{q.studentTemp.firstName || "Unknown Student"}</p>
                          <p className="text-sm text-muted-foreground">
                            Grade {q.studentTemp.grade} - {q.studentTemp.subjects.join(", ")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusBadgeVariant(q.status)}>{q.status}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(q.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <SideDrawer
          open={selectedQuestionnaire !== null}
          onClose={() => {
            setSelectedQuestionnaire(null);
            setSelectedTutor("");
            setScheduledDate("");
          }}
          title="Process Questionnaire"
          footer={
            selectedQuestionnaire && (
              <div className="flex flex-wrap gap-2">
                {selectedQuestionnaire.status === "new" && (
                  <Button onClick={handleApproveTrack} data-testid="button-approve-track">
                    Approve Track
                  </Button>
                )}
                {selectedQuestionnaire.status === "reviewed" && (
                  <Button onClick={handleAssignTutor} disabled={!selectedTutor} data-testid="button-assign-tutor">
                    Assign Tutor
                  </Button>
                )}
                {selectedQuestionnaire.status === "assigned" && (
                  <Button
                    onClick={handleScheduleSession}
                    disabled={!selectedTutor || !scheduledDate}
                    data-testid="button-schedule-session"
                  >
                    Schedule Session
                  </Button>
                )}
                {selectedQuestionnaire.status === "scheduled" && (
                  <Button onClick={handleActivate} data-testid="button-activate">
                    Mark Active
                  </Button>
                )}
              </div>
            )
          }
        >
          {selectedQuestionnaire && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Student Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Name</span>
                    <p className="font-medium">{selectedQuestionnaire.studentTemp.firstName || "Not provided"}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Grade</span>
                    <p className="font-medium">{selectedQuestionnaire.studentTemp.grade}</p>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Subjects</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedQuestionnaire.studentTemp.subjects.map((s) => (
                      <Badge key={s} variant="secondary">{s}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Derived Analysis</h3>
                <div>
                  <span className="text-sm text-muted-foreground">Recommended Track</span>
                  <p className="font-medium">{selectedQuestionnaire.derived.track}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Blockers</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedQuestionnaire.derived.blockers.length > 0 ? (
                      selectedQuestionnaire.derived.blockers.map((b) => (
                        <Badge key={b} variant="outline">{b}</Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">None identified</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Signals</span>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div className="text-sm">Confidence: {selectedQuestionnaire.derived.signals.confidence}%</div>
                    <div className="text-sm">Memory: {selectedQuestionnaire.derived.signals.memory}%</div>
                    <div className="text-sm">Language: {selectedQuestionnaire.derived.signals.language}%</div>
                    <div className="text-sm">Foundation: {selectedQuestionnaire.derived.signals.foundation}%</div>
                  </div>
                </div>
              </div>

              {(selectedQuestionnaire.status === "reviewed" || selectedQuestionnaire.status === "assigned") && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Assign Tutor</h3>
                  <div>
                    <Label htmlFor="tutor-select">Select Tutor</Label>
                    <Select value={selectedTutor} onValueChange={setSelectedTutor}>
                      <SelectTrigger id="tutor-select" data-testid="select-tutor">
                        <SelectValue placeholder="Choose a tutor" />
                      </SelectTrigger>
                      <SelectContent>
                        {tutors.map((t) => {
                          const user = getUserById(t.userId);
                          return (
                            <SelectItem key={t.id} value={t.id}>
                              {user?.firstName} {user?.lastName} - {t.subjects.join(", ")}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {selectedQuestionnaire.status === "assigned" && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Schedule Session</h3>
                  <div>
                    <Label htmlFor="session-date">Session Date & Time</Label>
                    <Input
                      id="session-date"
                      type="datetime-local"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      data-testid="input-session-date"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-semibold">Questionnaire Answers</h3>
                {Object.entries(selectedQuestionnaire.answers).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                    <p className="font-medium">{value || "Not answered"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SideDrawer>
      </PortalLayout>
    </RouteGuard>
  );
}
