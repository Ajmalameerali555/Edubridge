import * as React from "react";
import { useLocation } from "wouter";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { RouteGuard } from "@/components/portal/RouteGuard";
import { SideDrawer } from "@/components/portal/SideDrawer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAllTutors,
  getAllSessions,
  getUserById,
  updateTutor,
  Tutor,
} from "@/lib/datastore";
import { useToast } from "@/hooks/use-toast";
import { UserCheck, Star, Calendar, Users } from "lucide-react";

const allSubjects = ["Mathematics", "Science", "English", "Social Studies", "Hindi"];
const allGrades = ["4", "5", "6", "7", "8", "9", "10"];

export default function AdminTutors() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [tutors, setTutors] = React.useState<Tutor[]>([]);
  const [selectedTutor, setSelectedTutor] = React.useState<Tutor | null>(null);
  const [subjectFilter, setSubjectFilter] = React.useState<string>("all");
  const [gradeFilter, setGradeFilter] = React.useState<string>("all");

  const sessions = getAllSessions();

  const refreshTutors = () => {
    setTutors(getAllTutors());
  };

  React.useEffect(() => {
    refreshTutors();
  }, []);

  const filteredTutors = tutors.filter((t) => {
    const matchesSubject = subjectFilter === "all" || t.subjects.includes(subjectFilter);
    const matchesGrade = gradeFilter === "all" || t.gradesSupported.includes(gradeFilter);
    return matchesSubject && matchesGrade;
  });

  const getTutorMetrics = (tutorId: string) => {
    const tutorSessions = sessions.filter((s) => s.tutorId === tutorId);
    const completedSessions = tutorSessions.filter((s) => s.status === "done").length;
    const upcomingSessions = tutorSessions.filter((s) => s.status === "upcoming").length;
    const uniqueStudents = new Set(tutorSessions.map((s) => s.studentId)).size;
    return { completedSessions, upcomingSessions, uniqueStudents, totalSessions: tutorSessions.length };
  };

  const handleToggleActive = (tutor: Tutor) => {
    updateTutor(tutor.id, { isActive: !tutor.isActive });
    refreshTutors();
    toast({
      title: tutor.isActive ? "Tutor disabled" : "Tutor enabled",
      description: `${getUserById(tutor.userId)?.firstName} has been ${tutor.isActive ? "disabled" : "enabled"}`,
    });
  };

  return (
    <RouteGuard allowedRoles={["admin"]}>
      <PortalLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-page-title">Tutors</h1>
              <p className="text-muted-foreground">Manage tutor profiles and status</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-[180px]" data-testid="select-subject-filter">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {allSubjects.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-[150px]" data-testid="select-grade-filter">
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                {allGrades.map((g) => (
                  <SelectItem key={g} value={g}>Grade {g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {filteredTutors.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <UserCheck className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No tutors found</p>
                </CardContent>
              </Card>
            ) : (
              filteredTutors.map((t) => {
                const user = getUserById(t.userId);
                const metrics = getTutorMetrics(t.id);
                return (
                  <Card
                    key={t.id}
                    className="cursor-pointer hover-elevate"
                    onClick={() => setLocation(`/admin/tutors/${t.id}`)}
                    data-testid={`row-tutor-${t.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserCheck className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                              {!t.isActive && <Badge variant="destructive">Disabled</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {t.subjects.join(", ")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>{t.rating.toFixed(1)}</span>
                          </div>
                          <Badge variant="secondary">
                            <Calendar className="w-3 h-3 mr-1" />
                            {metrics.totalSessions} sessions
                          </Badge>
                          <Switch
                            checked={t.isActive}
                            onCheckedChange={() => handleToggleActive(t)}
                            onClick={(e) => e.stopPropagation()}
                            data-testid={`switch-active-${t.id}`}
                          />
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
          open={selectedTutor !== null}
          onClose={() => setSelectedTutor(null)}
          title="Tutor Details"
        >
          {selectedTutor && (
            <div className="space-y-6">
              {(() => {
                const user = getUserById(selectedTutor.userId);
                const metrics = getTutorMetrics(selectedTutor.id);
                return (
                  <>
                    <div className="space-y-4">
                      <h3 className="font-semibold">Profile</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Name</span>
                          <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Email</span>
                          <p className="font-medium text-sm">{user?.email}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Rating</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium">{selectedTutor.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Status</span>
                          <p>
                            <Badge variant={selectedTutor.isActive ? "default" : "destructive"}>
                              {selectedTutor.isActive ? "Active" : "Disabled"}
                            </Badge>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Subjects</h3>
                      <div className="flex flex-wrap gap-1">
                        {selectedTutor.subjects.map((s) => (
                          <Badge key={s} variant="secondary">{s}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Grades Supported</h3>
                      <div className="flex flex-wrap gap-1">
                        {selectedTutor.gradesSupported.map((g) => (
                          <Badge key={g} variant="outline">Grade {g}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Languages</h3>
                      <div className="flex flex-wrap gap-1">
                        {selectedTutor.languages.map((l) => (
                          <Badge key={l} variant="secondary">{l}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Availability</h3>
                      <div className="space-y-1">
                        {selectedTutor.availability.map((a) => (
                          <p key={a} className="text-sm">{a}</p>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Performance Metrics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
                            <p className="text-2xl font-bold">{metrics.completedSessions}</p>
                            <p className="text-xs text-muted-foreground">Completed</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                            <p className="text-2xl font-bold">{metrics.upcomingSessions}</p>
                            <p className="text-xs text-muted-foreground">Upcoming</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <Users className="w-6 h-6 mx-auto mb-2 text-green-500" />
                            <p className="text-2xl font-bold">{metrics.uniqueStudents}</p>
                            <p className="text-xs text-muted-foreground">Students</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <Star className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                            <p className="text-2xl font-bold">{selectedTutor.rating.toFixed(1)}</p>
                            <p className="text-xs text-muted-foreground">Rating</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="tutor-active-toggle">Tutor Active</Label>
                        <Switch
                          id="tutor-active-toggle"
                          checked={selectedTutor.isActive}
                          onCheckedChange={() => {
                            handleToggleActive(selectedTutor);
                            setSelectedTutor({ ...selectedTutor, isActive: !selectedTutor.isActive });
                          }}
                          data-testid="switch-drawer-active"
                        />
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </SideDrawer>
      </PortalLayout>
    </RouteGuard>
  );
}
