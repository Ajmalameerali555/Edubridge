import * as React from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { RouteGuard } from "@/components/portal/RouteGuard";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Search,
  Check,
  X,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { TutorApplication } from "@shared/schema";

type SortField = "submittedAt" | "qualityScore" | "status";
type SortDir = "asc" | "desc";

interface ProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  subjects?: string[];
  experience?: string;
  education?: string;
  motivation?: string;
}

export default function AdminHiring() {
  const { toast } = useToast();
  const [selectedApp, setSelectedApp] = React.useState<TutorApplication | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [sortField, setSortField] = React.useState<SortField>("submittedAt");
  const [sortDir, setSortDir] = React.useState<SortDir>("desc");
  const [adminNotes, setAdminNotes] = React.useState("");

  const { data, isLoading } = useQuery<{ applications: TutorApplication[] }>({
    queryKey: ["/api/tutor-applications"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number; status: string; notes: string }) => {
      return apiRequest("POST", `/api/tutor-applications/${id}/status`, { status, adminNotes: notes });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/tutor-applications"] });
      toast({
        title: "Status Updated",
        description: `Application ${variables.status} successfully`,
      });
      setSelectedApp(null);
      setAdminNotes("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    },
  });

  const applications = data?.applications || [];

  const filteredApplications = React.useMemo(() => {
    let filtered = [...applications];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((app) => {
        const profile = app.profile as ProfileData | null;
        const name = `${profile?.firstName || ""} ${profile?.lastName || ""}`.toLowerCase();
        const email = (profile?.email || "").toLowerCase();
        return name.includes(query) || email.includes(query);
      });
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortField === "submittedAt") {
        const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
        const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
        comparison = dateA - dateB;
      } else if (sortField === "qualityScore") {
        comparison = (a.qualityScore || 0) - (b.qualityScore || 0);
      } else if (sortField === "status") {
        comparison = (a.status || "").localeCompare(b.status || "");
      }
      return sortDir === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [applications, searchQuery, statusFilter, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
      pending: { variant: "secondary", label: "Pending" },
      submitted: { variant: "default", label: "Submitted" },
      held_by_ai: { variant: "outline", label: "Held by AI" },
      approved: { variant: "secondary", label: "Approved" },
      rejected: { variant: "destructive", label: "Rejected" },
    };
    const config = statusConfig[status] || { variant: "secondary" as const, label: status };
    return <Badge variant={config.variant} data-testid={`badge-status-${status}`}>{config.label}</Badge>;
  };

  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDir === "asc" ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    );
  };

  const getProfile = (app: TutorApplication): ProfileData => {
    return (app.profile as ProfileData) || {};
  };

  const getDimensionScores = (app: TutorApplication): Record<string, number> => {
    return (app.dimensionScores as Record<string, number>) || {};
  };

  const handleApprove = () => {
    if (!selectedApp) return;
    updateStatusMutation.mutate({ id: selectedApp.id, status: "approved", notes: adminNotes });
  };

  const handleReject = () => {
    if (!selectedApp) return;
    updateStatusMutation.mutate({ id: selectedApp.id, status: "rejected", notes: adminNotes });
  };

  const stats = React.useMemo(() => {
    const pending = applications.filter((a) => a.status === "pending" || a.status === "submitted" || a.status === "held_by_ai").length;
    const approved = applications.filter((a) => a.status === "approved").length;
    const rejected = applications.filter((a) => a.status === "rejected").length;
    return { pending, approved, rejected, total: applications.length };
  }, [applications]);

  return (
    <RouteGuard allowedRoles={["admin"]}>
      <PortalLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Hiring Center</h1>
            <p className="text-muted-foreground">Manage tutor applications and hiring pipeline</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card data-testid="card-stat-total">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Applications</p>
                    <p className="text-3xl font-bold mt-1" data-testid="text-stat-total">{stats.total}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card data-testid="card-stat-pending">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                    <p className="text-3xl font-bold mt-1" data-testid="text-stat-pending">{stats.pending}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card data-testid="card-stat-approved">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Approved</p>
                    <p className="text-3xl font-bold mt-1" data-testid="text-stat-approved">{stats.approved}</p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card data-testid="card-stat-rejected">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rejected</p>
                    <p className="text-3xl font-bold mt-1" data-testid="text-stat-rejected">{stats.rejected}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card data-testid="card-applications-list">
            <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
              <CardTitle className="text-lg font-medium">Applications</CardTitle>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-64"
                    data-testid="input-search"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40" data-testid="select-status-filter">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="held_by_ai">Held by AI</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground" data-testid="section-empty-state">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p data-testid="text-empty-message">No applications found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead
                        className="cursor-pointer select-none"
                        onClick={() => handleSort("qualityScore")}
                        data-testid="th-score"
                      >
                        Score <SortIndicator field="qualityScore" />
                      </TableHead>
                      <TableHead
                        className="cursor-pointer select-none"
                        onClick={() => handleSort("status")}
                        data-testid="th-status"
                      >
                        Status <SortIndicator field="status" />
                      </TableHead>
                      <TableHead
                        className="cursor-pointer select-none"
                        onClick={() => handleSort("submittedAt")}
                        data-testid="th-date"
                      >
                        Date <SortIndicator field="submittedAt" />
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((app) => {
                      const profile = getProfile(app);
                      return (
                        <TableRow
                          key={app.id}
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedApp(app);
                            setAdminNotes(app.adminNotes || "");
                          }}
                          data-testid={`row-application-${app.id}`}
                        >
                          <TableCell className="font-medium" data-testid={`cell-name-${app.id}`}>
                            {profile.firstName || "Unknown"} {profile.lastName || ""}
                          </TableCell>
                          <TableCell data-testid={`cell-email-${app.id}`}>{profile.email || "-"}</TableCell>
                          <TableCell data-testid={`cell-score-${app.id}`}>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{app.qualityScore || 0}%</span>
                              {(app.riskFlags?.length || 0) > 0 && (
                                <AlertTriangle className="w-4 h-4 text-orange-500" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell data-testid={`cell-status-${app.id}`}>{getStatusBadge(app.status)}</TableCell>
                          <TableCell data-testid={`cell-date-${app.id}`}>
                            {app.submittedAt
                              ? new Date(app.submittedAt).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedApp(app);
                                setAdminNotes(app.adminNotes || "");
                              }}
                              data-testid={`button-view-${app.id}`}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Sheet open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
              {selectedApp && (
                <>
                  <SheetHeader>
                    <SheetTitle>Application Details</SheetTitle>
                    <SheetDescription>
                      Review the application and take action
                    </SheetDescription>
                  </SheetHeader>

                  <div className="space-y-6 py-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Applicant</h3>
                      <p className="font-medium" data-testid="text-applicant-name">
                        {getProfile(selectedApp).firstName} {getProfile(selectedApp).lastName}
                      </p>
                      <p className="text-sm text-muted-foreground" data-testid="text-applicant-email">
                        {getProfile(selectedApp).email}
                      </p>
                      {getProfile(selectedApp).phone && (
                        <p className="text-sm text-muted-foreground">
                          {getProfile(selectedApp).phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Status</h3>
                      {getStatusBadge(selectedApp.status)}
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">AI Score</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold" data-testid="text-quality-score">
                          {selectedApp.qualityScore || 0}%
                        </span>
                        {selectedApp.autoSummary && (
                          <p className="text-sm text-muted-foreground flex-1">
                            {selectedApp.autoSummary}
                          </p>
                        )}
                      </div>
                    </div>

                    {Object.keys(getDimensionScores(selectedApp)).length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">
                          Dimension Scores
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(getDimensionScores(selectedApp)).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-2 rounded bg-muted/50">
                              <span className="text-sm capitalize">{key.replace(/_/g, " ")}</span>
                              <span className="font-medium">{value}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(selectedApp.riskFlags?.length || 0) > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                          Risk Flags
                        </h3>
                        <div className="flex flex-wrap gap-2" data-testid="container-risk-flags">
                          {selectedApp.riskFlags?.map((flag) => (
                            <Badge key={flag} variant="outline" className="border-orange-300 text-orange-700">
                              {flag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {(selectedApp.improvementChecklist?.length || 0) > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">
                          Improvement Suggestions
                        </h3>
                        <ul className="text-sm space-y-1">
                          {selectedApp.improvementChecklist?.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-muted-foreground">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {getProfile(selectedApp).subjects && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Subjects</h3>
                        <div className="flex flex-wrap gap-2">
                          {getProfile(selectedApp).subjects?.map((subj) => (
                            <Badge key={subj} variant="secondary">{subj}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {getProfile(selectedApp).experience && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Experience</h3>
                        <p className="text-sm">{getProfile(selectedApp).experience}</p>
                      </div>
                    )}

                    {getProfile(selectedApp).education && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Education</h3>
                        <p className="text-sm">{getProfile(selectedApp).education}</p>
                      </div>
                    )}

                    {getProfile(selectedApp).motivation && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Motivation</h3>
                        <p className="text-sm">{getProfile(selectedApp).motivation}</p>
                      </div>
                    )}

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Submitted</h3>
                      <p className="text-sm">
                        {selectedApp.submittedAt
                          ? new Date(selectedApp.submittedAt).toLocaleString()
                          : "Not submitted yet"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Admin Notes</h3>
                      <Textarea
                        placeholder="Add notes about this application..."
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        className="min-h-[100px]"
                        data-testid="textarea-admin-notes"
                      />
                    </div>
                  </div>

                  <SheetFooter className="flex gap-3 sm:flex-row">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedApp(null)}
                      data-testid="button-close-drawer"
                    >
                      Close
                    </Button>
                    {selectedApp.status !== "rejected" && (
                      <Button
                        variant="destructive"
                        onClick={handleReject}
                        disabled={updateStatusMutation.isPending}
                        data-testid="button-reject"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    )}
                    {selectedApp.status !== "approved" && (
                      <Button
                        onClick={handleApprove}
                        disabled={updateStatusMutation.isPending}
                        data-testid="button-approve"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    )}
                  </SheetFooter>
                </>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </PortalLayout>
    </RouteGuard>
  );
}
