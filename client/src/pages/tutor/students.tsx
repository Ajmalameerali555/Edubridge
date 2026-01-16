import * as React from "react";
import { Link } from "wouter";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { RouteGuard } from "@/components/portal/RouteGuard";
import { useAuth } from "@/contexts/AuthContext";
import {
  getSessionsByTutorId,
  getStudentById,
  getUserById,
  Student,
} from "@/lib/datastore";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, GraduationCap, ChevronRight } from "lucide-react";

function MiniSignalBars({ signals }: { signals: Student["signals"] }) {
  const bars = [
    { key: "confidence", value: signals.confidence, label: "C" },
    { key: "memory", value: signals.memory, label: "M" },
    { key: "language", value: signals.language, label: "L" },
    { key: "foundation", value: signals.foundation, label: "F" },
  ];

  const getColor = (v: number) => {
    if (v >= 70) return "bg-green-500";
    if (v >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex gap-1 items-end h-8">
      {bars.map((bar) => (
        <div key={bar.key} className="flex flex-col items-center gap-0.5">
          <div className="w-3 h-6 bg-muted rounded-sm relative overflow-hidden">
            <div
              className={`absolute bottom-0 w-full ${getColor(bar.value)} transition-all`}
              style={{ height: `${bar.value}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground">{bar.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function TutorStudents() {
  const { tutor } = useAuth();
  const [students, setStudents] = React.useState<Student[]>([]);
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState<{
    grade: string | null;
    subject: string | null;
    track: string | null;
  }>({ grade: null, subject: null, track: null });

  React.useEffect(() => {
    if (tutor) {
      const sessions = getSessionsByTutorId(tutor.id);
      const studentIds = Array.from(new Set(sessions.map((s) => s.studentId)));
      const studentList: Student[] = [];

      studentIds.forEach((id) => {
        const student = getStudentById(id);
        if (student) {
          studentList.push(student);
        }
      });

      setStudents(studentList);
    }
  }, [tutor]);

  const allGrades = Array.from(new Set(students.map((s) => s.grade))).sort();
  const allSubjects = Array.from(new Set(students.flatMap((s) => s.subjects))).sort();
  const allTracks = Array.from(new Set(students.map((s) => s.track)));

  const filteredStudents = students.filter((student) => {
    const studentUser = getUserById(student.userId);
    const fullName = studentUser
      ? `${studentUser.firstName} ${studentUser.lastName || ""}`.toLowerCase()
      : "";

    const matchesSearch = search === "" || fullName.includes(search.toLowerCase());
    const matchesGrade = !filters.grade || student.grade === filters.grade;
    const matchesSubject = !filters.subject || student.subjects.includes(filters.subject);
    const matchesTrack = !filters.track || student.track === filters.track;

    return matchesSearch && matchesGrade && matchesSubject && matchesTrack;
  });

  const toggleFilter = (type: "grade" | "subject" | "track", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type] === value ? null : value,
    }));
  };

  return (
    <RouteGuard allowedRoles={["tutor"]}>
      <PortalLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">My Students</h1>
            <p className="text-muted-foreground">
              {students.length} student{students.length !== 1 ? "s" : ""} assigned to you
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {allGrades.map((grade) => (
                <Badge
                  key={grade}
                  variant={filters.grade === grade ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleFilter("grade", grade)}
                  data-testid={`filter-grade-${grade}`}
                >
                  Grade {grade}
                </Badge>
              ))}
              {allSubjects.map((subject) => (
                <Badge
                  key={subject}
                  variant={filters.subject === subject ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleFilter("subject", subject)}
                  data-testid={`filter-subject-${subject}`}
                >
                  {subject}
                </Badge>
              ))}
            </div>

            {allTracks.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {allTracks.map((track) => (
                  <Badge
                    key={track}
                    variant={filters.track === track ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => toggleFilter("track", track)}
                    data-testid={`filter-track-${track}`}
                  >
                    {track}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {filteredStudents.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No students found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {filteredStudents.map((student) => {
                const studentUser = getUserById(student.userId);
                return (
                  <Link key={student.id} href={`/tutor/students/${student.id}`}>
                    <Card
                      className="hover-elevate cursor-pointer"
                      data-testid={`student-row-${student.id}`}
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-lg font-semibold text-primary">
                            {studentUser?.firstName?.charAt(0) || "?"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {studentUser
                              ? `${studentUser.firstName} ${studentUser.lastName || ""}`.trim()
                              : "Unknown"}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              Grade {student.grade}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {student.subjects.join(", ")}
                            </span>
                          </div>
                        </div>
                        <MiniSignalBars signals={student.signals} />
                        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </PortalLayout>
    </RouteGuard>
  );
}
