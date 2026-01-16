import * as React from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { RouteGuard } from "@/components/portal/RouteGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  getAllStudents,
  getAllTutors,
  getUserById,
  createSession,
  Student,
  Tutor,
} from "@/lib/datastore";
import { useToast } from "@/hooks/use-toast";
import { Users, CheckCircle, BookOpen, GraduationCap, Globe } from "lucide-react";

interface MatchResult {
  tutor: Tutor;
  score: number;
  reasons: { type: string; label: string }[];
}

export default function AdminMatching() {
  const { toast } = useToast();
  const [selectedStudentId, setSelectedStudentId] = React.useState<string>("");
  const [sessionDate, setSessionDate] = React.useState<string>("");
  const [sessionSubject, setSessionSubject] = React.useState<string>("");

  const students = getAllStudents();
  const tutors = getAllTutors();

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const calculateMatches = (): MatchResult[] => {
    if (!selectedStudent) return [];

    return tutors
      .filter((t) => t.isActive)
      .map((tutor) => {
        let score = 0;
        const reasons: { type: string; label: string }[] = [];

        const gradeMatch = tutor.gradesSupported.includes(selectedStudent.grade);
        if (gradeMatch) {
          score += 30;
          reasons.push({ type: "grade", label: `Grade ${selectedStudent.grade}` });
        }

        const matchingSubjects = selectedStudent.subjects.filter((s) =>
          tutor.subjects.includes(s)
        );
        if (matchingSubjects.length > 0) {
          score += matchingSubjects.length * 20;
          matchingSubjects.forEach((s) => {
            reasons.push({ type: "subject", label: s });
          });
        }

        if (tutor.languages.includes("English")) {
          score += 10;
          reasons.push({ type: "language", label: "English" });
        }

        score += tutor.rating * 5;
        if (tutor.rating >= 4.5) {
          reasons.push({ type: "rating", label: `${tutor.rating.toFixed(1)} rating` });
        }

        return { tutor, score, reasons };
      })
      .sort((a, b) => b.score - a.score);
  };

  const matches = calculateMatches();

  const handleAssignTutor = (tutorId: string) => {
    if (!selectedStudent || !sessionDate || !sessionSubject) {
      toast({
        title: "Missing information",
        description: "Please select a date and subject for the session",
        variant: "destructive",
      });
      return;
    }

    createSession({
      studentId: selectedStudent.id,
      tutorId,
      subject: sessionSubject,
      startAt: new Date(sessionDate).toISOString(),
      durationMin: 45,
      meetLink: `https://meet.edubridge.com/session_${Date.now()}`,
      status: "upcoming",
    });

    toast({
      title: "Session created",
      description: "Tutor has been assigned and session scheduled",
    });

    setSelectedStudentId("");
    setSessionDate("");
    setSessionSubject("");
  };

  const getReasonIcon = (type: string) => {
    switch (type) {
      case "grade":
        return <GraduationCap className="w-3 h-3" />;
      case "subject":
        return <BookOpen className="w-3 h-3" />;
      case "language":
        return <Globe className="w-3 h-3" />;
      case "rating":
        return <CheckCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <RouteGuard allowedRoles={["admin"]}>
      <PortalLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Matching Engine</h1>
            <p className="text-muted-foreground">Find the best tutor match for students</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Select Student</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="student-select">Student</Label>
                <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                  <SelectTrigger id="student-select" data-testid="select-student">
                    <SelectValue placeholder="Choose a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((s) => {
                      const user = getUserById(s.userId);
                      return (
                        <SelectItem key={s.id} value={s.id}>
                          {user?.firstName} {user?.lastName} - Grade {s.grade}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {selectedStudent && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="session-subject">Subject</Label>
                      <Select value={sessionSubject} onValueChange={setSessionSubject}>
                        <SelectTrigger id="session-subject" data-testid="select-subject">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedStudent.subjects.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="session-date">Session Date & Time</Label>
                      <Input
                        id="session-date"
                        type="datetime-local"
                        value={sessionDate}
                        onChange={(e) => setSessionDate(e.target.value)}
                        data-testid="input-session-date"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="text-sm text-muted-foreground">Student needs:</span>
                    {selectedStudent.subjects.map((s) => (
                      <Badge key={s} variant="secondary">{s}</Badge>
                    ))}
                    <Badge variant="outline">Grade {selectedStudent.grade}</Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {selectedStudent && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Suggested Tutors</h2>
              {matches.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No matching tutors found</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {matches.map(({ tutor, score, reasons }) => {
                    const user = getUserById(tutor.userId);
                    return (
                      <Card key={tutor.id} data-testid={`card-tutor-${tutor.id}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between flex-wrap gap-4">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Users className="w-6 h-6 text-primary" />
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {tutor.subjects.join(", ")}
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {reasons.map((reason, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs gap-1">
                                      {getReasonIcon(reason.type)}
                                      {reason.label}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge variant="secondary" className="text-sm">
                                Match: {Math.round(score)}%
                              </Badge>
                              <Button
                                size="sm"
                                onClick={() => handleAssignTutor(tutor.id)}
                                disabled={!sessionDate || !sessionSubject}
                                data-testid={`button-assign-${tutor.id}`}
                              >
                                Assign Tutor
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </PortalLayout>
    </RouteGuard>
  );
}
