import * as React from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { RouteGuard } from "@/components/portal/RouteGuard";
import { SideDrawer } from "@/components/portal/SideDrawer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getAllStudents,
  getAllSessions,
  getAllQuestionnaires,
  getAllIncidents,
  getUserById,
  getStudentById,
  Student,
  Session,
  Questionnaire,
  Incident,
} from "@/lib/datastore";
import {
  Users,
  Calendar,
  FileText,
  AlertTriangle,
  Clock,
  UserPlus,
} from "lucide-react";

type DrawerContent = 
  | { type: "questionnaire"; data: Questionnaire }
  | { type: "student"; data: Student }
  | { type: "incident"; data: Incident }
  | null;

export default function AdminPortal() {
  const [drawerContent, setDrawerContent] = React.useState<DrawerContent>(null);

  const students = getAllStudents();
  const sessions = getAllSessions();
  const questionnaires = getAllQuestionnaires();
  const incidents = getAllIncidents();

  const today = new Date().toDateString();
  const sessionsToday = sessions.filter(
    (s) => new Date(s.startAt).toDateString() === today
  );

  const pendingQuestionnaires = questionnaires.filter(
    (q) => q.status === "new" || q.status === "reviewed"
  );

  const unmatchedStudents = students.filter((s) => {
    const studentSessions = sessions.filter((sess) => sess.studentId === s.id);
    return studentSessions.length === 0;
  });

  const recentIncidents = incidents
    .filter((i) => i.severity === "high" || i.severity === "medium")
    .slice(0, 5);

  const kpis = [
    {
      label: "Active Students",
      value: students.length,
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Sessions Today",
      value: sessionsToday.length,
      icon: Calendar,
      color: "text-green-600",
    },
    {
      label: "Pending Questionnaires",
      value: pendingQuestionnaires.length,
      icon: FileText,
      color: "text-orange-600",
    },
    {
      label: "Risk Alerts",
      value: recentIncidents.length,
      icon: AlertTriangle,
      color: "text-red-600",
    },
  ];

  const renderDrawerContent = () => {
    if (!drawerContent) return null;

    if (drawerContent.type === "questionnaire") {
      const q = drawerContent.data;
      return (
        <div className="space-y-4">
          <div>
            <span className="text-sm text-muted-foreground">Student Name</span>
            <p className="font-medium">{q.studentTemp.firstName || "Not provided"}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Grade</span>
            <p className="font-medium">{q.studentTemp.grade}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Subjects</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {q.studentTemp.subjects.map((s) => (
                <Badge key={s} variant="secondary">{s}</Badge>
              ))}
            </div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Status</span>
            <p>
              <Badge>{q.status}</Badge>
            </p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Derived Track</span>
            <p className="font-medium">{q.derived.track}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Blockers</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {q.derived.blockers.length > 0 ? (
                q.derived.blockers.map((b) => (
                  <Badge key={b} variant="outline">{b}</Badge>
                ))
              ) : (
                <span className="text-muted-foreground">None</span>
              )}
            </div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Submitted</span>
            <p className="font-medium">{new Date(q.createdAt).toLocaleString()}</p>
          </div>
        </div>
      );
    }

    if (drawerContent.type === "student") {
      const s = drawerContent.data;
      const user = getUserById(s.userId);
      return (
        <div className="space-y-4">
          <div>
            <span className="text-sm text-muted-foreground">Name</span>
            <p className="font-medium">{user?.firstName} {user?.lastName}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Grade</span>
            <p className="font-medium">{s.grade}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Track</span>
            <p className="font-medium">{s.track}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Subjects</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {s.subjects.map((subj) => (
                <Badge key={subj} variant="secondary">{subj}</Badge>
              ))}
            </div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Signals</span>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="text-sm">Confidence: {s.signals.confidence}%</div>
              <div className="text-sm">Memory: {s.signals.memory}%</div>
              <div className="text-sm">Language: {s.signals.language}%</div>
              <div className="text-sm">Foundation: {s.signals.foundation}%</div>
            </div>
          </div>
        </div>
      );
    }

    if (drawerContent.type === "incident") {
      const inc = drawerContent.data;
      const actor = getUserById(inc.actorUserId);
      return (
        <div className="space-y-4">
          <div>
            <span className="text-sm text-muted-foreground">Type</span>
            <p className="font-medium capitalize">{inc.type.replace(/_/g, " ")}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Severity</span>
            <p>
              <Badge variant={inc.severity === "high" ? "destructive" : inc.severity === "medium" ? "default" : "secondary"}>
                {inc.severity}
              </Badge>
            </p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Actor</span>
            <p className="font-medium">{actor?.firstName} {actor?.lastName}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Message Snippet</span>
            <p className="text-sm bg-muted p-2 rounded mt-1">{inc.messageSnippet}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Occurred</span>
            <p className="font-medium">{new Date(inc.createdAt).toLocaleString()}</p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <RouteGuard allowedRoles={["admin"]}>
      <PortalLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Command Center</h1>
            <p className="text-muted-foreground">Overview of platform activity and key metrics</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi) => (
              <Card key={kpi.label} data-testid={`card-kpi-${kpi.label.toLowerCase().replace(/\s/g, "-")}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{kpi.label}</p>
                      <p className="text-3xl font-bold mt-1">{kpi.value}</p>
                    </div>
                    <kpi.icon className={`w-8 h-8 ${kpi.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card data-testid="card-queue-questionnaires">
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <CardTitle className="text-base font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    New Questionnaires
                  </div>
                </CardTitle>
                <Badge variant="secondary">{pendingQuestionnaires.length}</Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                {pendingQuestionnaires.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No pending questionnaires</p>
                ) : (
                  pendingQuestionnaires.slice(0, 5).map((q) => (
                    <div
                      key={q.id}
                      className="flex items-center justify-between p-3 rounded-lg hover-elevate cursor-pointer border"
                      onClick={() => setDrawerContent({ type: "questionnaire", data: q })}
                      data-testid={`row-questionnaire-${q.id}`}
                    >
                      <div>
                        <p className="font-medium text-sm">{q.studentTemp.firstName || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">Grade {q.studentTemp.grade}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{q.status}</Badge>
                        <Clock className="w-3 h-3 text-muted-foreground" />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card data-testid="card-queue-unmatched">
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <CardTitle className="text-base font-medium">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Unmatched Students
                  </div>
                </CardTitle>
                <Badge variant="secondary">{unmatchedStudents.length}</Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                {unmatchedStudents.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">All students matched</p>
                ) : (
                  unmatchedStudents.slice(0, 5).map((s) => {
                    const user = getUserById(s.userId);
                    return (
                      <div
                        key={s.id}
                        className="flex items-center justify-between p-3 rounded-lg hover-elevate cursor-pointer border"
                        onClick={() => setDrawerContent({ type: "student", data: s })}
                        data-testid={`row-unmatched-${s.id}`}
                      >
                        <div>
                          <p className="font-medium text-sm">{user?.firstName} {user?.lastName}</p>
                          <p className="text-xs text-muted-foreground">Grade {s.grade}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">{s.track.split(" ")[0]}</Badge>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            <Card data-testid="card-queue-incidents">
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <CardTitle className="text-base font-medium">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Risk Alerts
                  </div>
                </CardTitle>
                <Badge variant="secondary">{recentIncidents.length}</Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentIncidents.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No active alerts</p>
                ) : (
                  recentIncidents.map((inc) => {
                    const actor = getUserById(inc.actorUserId);
                    return (
                      <div
                        key={inc.id}
                        className="flex items-center justify-between p-3 rounded-lg hover-elevate cursor-pointer border"
                        onClick={() => setDrawerContent({ type: "incident", data: inc })}
                        data-testid={`row-incident-${inc.id}`}
                      >
                        <div>
                          <p className="font-medium text-sm capitalize">{inc.type.replace(/_/g, " ")}</p>
                          <p className="text-xs text-muted-foreground">{actor?.firstName}</p>
                        </div>
                        <Badge variant={inc.severity === "high" ? "destructive" : "default"} className="text-xs">
                          {inc.severity}
                        </Badge>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <SideDrawer
          open={drawerContent !== null}
          onClose={() => setDrawerContent(null)}
          title={
            drawerContent?.type === "questionnaire"
              ? "Questionnaire Details"
              : drawerContent?.type === "student"
              ? "Student Details"
              : drawerContent?.type === "incident"
              ? "Incident Details"
              : undefined
          }
        >
          {renderDrawerContent()}
        </SideDrawer>
      </PortalLayout>
    </RouteGuard>
  );
}
