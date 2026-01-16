import * as React from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { RouteGuard } from "@/components/portal/RouteGuard";
import { SideDrawer } from "@/components/portal/SideDrawer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAllIncidents,
  getAllStudents,
  getAllTutors,
  getUserById,
  Incident,
} from "@/lib/datastore";
import { AlertTriangle, Shield, Link2, FileWarning } from "lucide-react";

type IncidentSeverity = "low" | "medium" | "high";
type IncidentType = "contact_share_attempt" | "external_link_attempt" | "policy_violation";

export default function AdminIncidents() {
  const [incidents, setIncidents] = React.useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = React.useState<Incident | null>(null);
  const [severityFilter, setSeverityFilter] = React.useState<IncidentSeverity | "all">("all");
  const [typeFilter, setTypeFilter] = React.useState<IncidentType | "all">("all");

  const students = getAllStudents();
  const tutors = getAllTutors();

  React.useEffect(() => {
    setIncidents(getAllIncidents());
  }, []);

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSeverity = severityFilter === "all" || inc.severity === severityFilter;
    const matchesType = typeFilter === "all" || inc.type === typeFilter;
    return matchesSeverity && matchesType;
  });

  const sortedIncidents = [...filteredIncidents].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "contact_share_attempt":
        return <Shield className="w-5 h-5" />;
      case "external_link_attempt":
        return <Link2 className="w-5 h-5" />;
      case "policy_violation":
        return <FileWarning className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getActorName = (userId: string) => {
    const user = getUserById(userId);
    return user ? `${user.firstName} ${user.lastName}` : "Unknown";
  };

  const getStudentName = (studentId?: string) => {
    if (!studentId) return null;
    const student = students.find((s) => s.id === studentId);
    if (!student) return null;
    const user = getUserById(student.userId);
    return user ? `${user.firstName} ${user.lastName}` : null;
  };

  const getTutorName = (tutorId?: string) => {
    if (!tutorId) return null;
    const tutor = tutors.find((t) => t.id === tutorId);
    if (!tutor) return null;
    const user = getUserById(tutor.userId);
    return user ? `${user.firstName} ${user.lastName}` : null;
  };

  return (
    <RouteGuard allowedRoles={["admin"]}>
      <PortalLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-page-title">Incidents</h1>
              <p className="text-muted-foreground">Review security and policy incidents</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v as IncidentSeverity | "all")}>
              <SelectTrigger className="w-[150px]" data-testid="select-severity-filter">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as IncidentType | "all")}>
              <SelectTrigger className="w-[200px]" data-testid="select-type-filter">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="contact_share_attempt">Contact Share</SelectItem>
                <SelectItem value="external_link_attempt">External Link</SelectItem>
                <SelectItem value="policy_violation">Policy Violation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Badge
              variant={severityFilter === "high" ? "destructive" : "outline"}
              className="cursor-pointer"
              onClick={() => setSeverityFilter("high")}
              data-testid="badge-filter-high"
            >
              High ({incidents.filter((i) => i.severity === "high").length})
            </Badge>
            <Badge
              variant={severityFilter === "medium" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSeverityFilter("medium")}
              data-testid="badge-filter-medium"
            >
              Medium ({incidents.filter((i) => i.severity === "medium").length})
            </Badge>
            <Badge
              variant={severityFilter === "low" ? "secondary" : "outline"}
              className="cursor-pointer"
              onClick={() => setSeverityFilter("low")}
              data-testid="badge-filter-low"
            >
              Low ({incidents.filter((i) => i.severity === "low").length})
            </Badge>
          </div>

          <div className="space-y-3">
            {sortedIncidents.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No incidents found</p>
                </CardContent>
              </Card>
            ) : (
              sortedIncidents.map((incident) => (
                <Card
                  key={incident.id}
                  className="cursor-pointer hover-elevate"
                  onClick={() => setSelectedIncident(incident)}
                  data-testid={`row-incident-${incident.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          incident.severity === "high"
                            ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                            : incident.severity === "medium"
                            ? "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                        }`}>
                          {getTypeIcon(incident.type)}
                        </div>
                        <div>
                          <p className="font-medium capitalize">
                            {incident.type.replace(/_/g, " ")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {getActorName(incident.actorUserId)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {new Date(incident.createdAt).toLocaleDateString()}
                        </span>
                        <Badge variant={getSeverityBadgeVariant(incident.severity)}>
                          {incident.severity}
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
          open={selectedIncident !== null}
          onClose={() => setSelectedIncident(null)}
          title="Incident Details"
        >
          {selectedIncident && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Incident Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Type</span>
                    <p className="font-medium capitalize">
                      {selectedIncident.type.replace(/_/g, " ")}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Severity</span>
                    <p>
                      <Badge variant={getSeverityBadgeVariant(selectedIncident.severity)}>
                        {selectedIncident.severity}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Date</span>
                    <p className="font-medium">
                      {new Date(selectedIncident.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Time</span>
                    <p className="font-medium">
                      {new Date(selectedIncident.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Involved Parties</h3>
                <div className="space-y-2">
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Actor</p>
                    <p className="font-medium">{getActorName(selectedIncident.actorUserId)}</p>
                  </div>
                  {selectedIncident.studentId && (
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Student</p>
                      <p className="font-medium">{getStudentName(selectedIncident.studentId) || "Unknown"}</p>
                    </div>
                  )}
                  {selectedIncident.tutorId && (
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Tutor</p>
                      <p className="font-medium">{getTutorName(selectedIncident.tutorId) || "Unknown"}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Message Snippet</h3>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{selectedIncident.messageSnippet}</p>
                </div>
              </div>
            </div>
          )}
        </SideDrawer>
      </PortalLayout>
    </RouteGuard>
  );
}
