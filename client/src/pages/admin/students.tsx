import * as React from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { RouteGuard } from "@/components/portal/RouteGuard";
import { SideDrawer } from "@/components/portal/SideDrawer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAllStudents,
  getAllTutors,
  getAllSessions,
  getUserById,
  updateStudent,
  Student,
  Session,
} from "@/lib/datastore";
import { useToast } from "@/hooks/use-toast";
import { Search, GraduationCap, Calendar } from "lucide-react";

const grades = ["4", "5", "6", "7", "8", "9", "10"];
const tracks = ["Visual Learner Track", "Auditory Learner Track", "Hands-on Learner Track", "Reading/Writing Track"];

export default function AdminStudents() {
  const { toast } = useToast();
  const [students, setStudents] = React.useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [gradeFilter, setGradeFilter] = React.useState<string>("all");
  const [trackFilter, setTrackFilter] = React.useState<string>("all");

  const [editSignals, setEditSignals] = React.useState({
    confidence: 70,
    memory: 70,
    language: 70,
    foundation: 70,
  });

  const tutors = getAllTutors();
  const sessions = getAllSessions();

  const refreshStudents = () => {
    setStudents(getAllStudents());
  };

  React.useEffect(() => {
    refreshStudents();
  }, []);

  React.useEffect(() => {
    if (selectedStudent) {
      setEditSignals({ ...selectedStudent.signals });
    }
  }, [selectedStudent]);

  const filteredStudents = students.filter((s) => {
    const user = getUserById(s.userId);
    const name = `${user?.firstName || ""} ${user?.lastName || ""}`.toLowerCase();
    const matchesSearch = name.includes(searchQuery.toLowerCase());
    const matchesGrade = gradeFilter === "all" || s.grade === gradeFilter;
    const matchesTrack = trackFilter === "all" || s.track === trackFilter;
    return matchesSearch && matchesGrade && matchesTrack;
  });

  const getStudentSessions = (studentId: string): Session[] => {
    return sessions.filter((s) => s.studentId === studentId);
  };

  const handleSaveSignals = () => {
    if (!selectedStudent) return;
    updateStudent(selectedStudent.id, { signals: editSignals });
    refreshStudents();
    toast({ title: "Signals updated", description: "Student signals have been saved" });
    setSelectedStudent(null);
  };

  return (
    <RouteGuard allowedRoles={["admin"]}>
      <PortalLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-page-title">Students</h1>
              <p className="text-muted-foreground">Manage all enrolled students</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-[150px]" data-testid="select-grade-filter">
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                {grades.map((g) => (
                  <SelectItem key={g} value={g}>Grade {g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={trackFilter} onValueChange={setTrackFilter}>
              <SelectTrigger className="w-[200px]" data-testid="select-track-filter">
                <SelectValue placeholder="Track" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tracks</SelectItem>
                {tracks.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {filteredStudents.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No students found</p>
                </CardContent>
              </Card>
            ) : (
              filteredStudents.map((s) => {
                const user = getUserById(s.userId);
                const studentSessions = getStudentSessions(s.id);
                return (
                  <Card
                    key={s.id}
                    className="cursor-pointer hover-elevate"
                    onClick={() => setSelectedStudent(s)}
                    data-testid={`row-student-${s.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                            <p className="text-sm text-muted-foreground">
                              Grade {s.grade} - {s.subjects.join(", ")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{s.track.split(" ")[0]}</Badge>
                          <Badge variant="secondary">
                            <Calendar className="w-3 h-3 mr-1" />
                            {studentSessions.length} sessions
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        <SideDrawer
          open={selectedStudent !== null}
          onClose={() => setSelectedStudent(null)}
          title="Student Details"
          footer={
            <Button onClick={handleSaveSignals} data-testid="button-save-signals">
              Save Changes
            </Button>
          }
        >
          {selectedStudent && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Snapshot</h3>
                {(() => {
                  const user = getUserById(selectedStudent.userId);
                  return (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Name</span>
                        <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Grade</span>
                        <p className="font-medium">{selectedStudent.grade}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Email</span>
                        <p className="font-medium text-sm">{user?.email}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Track</span>
                        <p className="font-medium">{selectedStudent.track}</p>
                      </div>
                    </div>
                  );
                })()}
                <div>
                  <span className="text-sm text-muted-foreground">Subjects</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedStudent.subjects.map((s) => (
                      <Badge key={s} variant="secondary">{s}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Blockers</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedStudent.blockers.length > 0 ? (
                      selectedStudent.blockers.map((b) => (
                        <Badge key={b} variant="outline">{b}</Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">None</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Signals Editor</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Confidence</Label>
                      <span className="text-sm text-muted-foreground">{editSignals.confidence}%</span>
                    </div>
                    <Slider
                      value={[editSignals.confidence]}
                      onValueChange={([v]) => setEditSignals({ ...editSignals, confidence: v })}
                      max={100}
                      step={5}
                      data-testid="slider-confidence"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Memory</Label>
                      <span className="text-sm text-muted-foreground">{editSignals.memory}%</span>
                    </div>
                    <Slider
                      value={[editSignals.memory]}
                      onValueChange={([v]) => setEditSignals({ ...editSignals, memory: v })}
                      max={100}
                      step={5}
                      data-testid="slider-memory"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Language</Label>
                      <span className="text-sm text-muted-foreground">{editSignals.language}%</span>
                    </div>
                    <Slider
                      value={[editSignals.language]}
                      onValueChange={([v]) => setEditSignals({ ...editSignals, language: v })}
                      max={100}
                      step={5}
                      data-testid="slider-language"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Foundation</Label>
                      <span className="text-sm text-muted-foreground">{editSignals.foundation}%</span>
                    </div>
                    <Slider
                      value={[editSignals.foundation]}
                      onValueChange={([v]) => setEditSignals({ ...editSignals, foundation: v })}
                      max={100}
                      step={5}
                      data-testid="slider-foundation"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Session History</h3>
                {(() => {
                  const studentSessions = getStudentSessions(selectedStudent.id);
                  if (studentSessions.length === 0) {
                    return <p className="text-sm text-muted-foreground">No sessions yet</p>;
                  }
                  return (
                    <div className="space-y-2">
                      {studentSessions.slice(0, 5).map((sess) => {
                        const tutor = tutors.find((t) => t.id === sess.tutorId);
                        const tutorUser = tutor ? getUserById(tutor.userId) : null;
                        return (
                          <div key={sess.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="text-sm font-medium">{sess.subject}</p>
                              <p className="text-xs text-muted-foreground">
                                {tutorUser?.firstName} - {new Date(sess.startAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant={sess.status === "done" ? "secondary" : "outline"}>
                              {sess.status}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </SideDrawer>
      </PortalLayout>
    </RouteGuard>
  );
}
