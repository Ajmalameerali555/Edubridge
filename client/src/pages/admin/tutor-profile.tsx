
import * as React from "react";
import { useParams, Link } from "wouter";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { RouteGuard } from "@/components/portal/RouteGuard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  getTutorById,
  getUserById,
  getSessionsByTutorId,
  getSessionReportsByTutorId,
  getAssignmentsByTutorId,
  updateTutor,
} from "@/lib/datastore";
import { format, parseISO } from "date-fns";
import { ArrowLeft, User, Calendar, BookOpen, Wallet, Sparkles } from "lucide-react";

export default function AdminTutorProfile() {
  const params = useParams<{ id: string }>();
  const { toast } = useToast();

  const tutor = getTutorById(params.id);
  const user = tutor ? getUserById(tutor.userId) : undefined;

  const [tab, setTab] = React.useState("overview");

  if (!tutor || !user) {
    return (
      <RouteGuard roles={["admin"]}>
        <PortalLayout role="admin">
          <div className="p-6">
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                <User className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Tutor not found.</p>
                <div className="mt-4">
                  <Link href="/admin/tutors">
                    <Button variant="outline">Back to Tutors</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </PortalLayout>
      </RouteGuard>
    );
  }

  const sessions = getSessionsByTutorId(tutor.id).sort((a, b) => b.startAt.localeCompare(a.startAt));
  const reports = getSessionReportsByTutorId(tutor.id);
  const assignments = getAssignmentsByTutorId(tutor.id);

  // Simple payout view for now: only counts "done" sessions (editable later when you add real payments table).
  const doneCount = sessions.filter((s) => s.status === "done").length;
  const estimatedPayout = doneCount * 80; // AED 80 placeholder

  const tutorName = `${user.firstName} ${user.lastName}`.trim();

  return (
    <RouteGuard roles={["admin"]}>
      <PortalLayout role="admin">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <Link href="/admin/tutors">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Tutors
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-semibold leading-tight">{tutorName}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{user.email}</span>
                  <span>•</span>
                  <span>Rating {tutor.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={tutor.isActive ? "secondary" : "outline"}>{tutor.isActive ? "Active" : "Paused"}</Badge>
              <Button
                variant="outline"
                onClick={() => {
                  updateTutor(tutor.id, { isActive: !tutor.isActive });
                  toast({ title: "Updated", description: "Tutor status updated." });
                }}
              >
                {tutor.isActive ? "Pause tutor" : "Activate tutor"}
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Subjects</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {tutor.subjects.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Grades</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {tutor.gradesSupported.map((g) => <Badge key={g} variant="outline">G{g}</Badge>)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Languages</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {tutor.languages.map((l) => <Badge key={l} variant="outline">{l}</Badge>)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="sessions">Classes</TabsTrigger>
              <TabsTrigger value="payouts">Payouts</TabsTrigger>
              <TabsTrigger value="reports">AI Reports</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-4">
              <Card>
                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Joined</div>
                    <div className="font-medium">{format(parseISO(tutor.createdAt), "dd MMM yyyy")}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total sessions</div>
                    <div className="font-medium">{sessions.length}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Done sessions</div>
                    <div className="font-medium">{doneCount}</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="availability" className="mt-4 space-y-3">
              <Card>
                <CardContent className="p-4">
                  <div className="font-semibold mb-2">Available slots</div>
                  {tutor.availability.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No availability set.</div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {tutor.availability.map((a) => <Badge key={a} variant="secondary">{a}</Badge>)}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sessions" className="mt-4 space-y-3">
              {sessions.length === 0 ? (
                <Card><CardContent className="py-10 text-center text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No classes found.</p>
                </CardContent></Card>
              ) : (
                sessions.map((s) => (
                  <Card key={s.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            {s.subject}
                            <Badge variant="outline">{s.status}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format(parseISO(s.startAt), "dd MMM yyyy, hh:mm a")} • {s.durationMin} min
                          </div>
                        </div>
                        <Badge variant="secondary">Student: {s.studentId}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="payouts" className="mt-4 space-y-3">
              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <Wallet className="w-4 h-4" />
                    Payout overview
                  </div>
                  <div className="text-sm text-muted-foreground">
                    This is a simple estimate until we connect real payments (Stripe/Telr/PayTabs) and add a payouts table.
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Done sessions</div>
                      <div className="text-xl font-semibold">{doneCount}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Rate (placeholder)</div>
                      <div className="text-xl font-semibold">AED 80</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Estimated payout</div>
                      <div className="text-xl font-semibold">AED {estimatedPayout}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="mt-4 space-y-3">
              {reports.length === 0 ? (
                <Card><CardContent className="py-10 text-center text-muted-foreground">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No AI reports for this tutor yet.</p>
                </CardContent></Card>
              ) : (
                reports.map((r) => (
                  <Card key={r.id}>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="font-semibold">Session {r.sessionId}</div>
                        <Badge variant="secondary">Score: {r.overallScore}/10</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground whitespace-pre-wrap">{r.summary}</div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="assignments" className="mt-4 space-y-3">
              {assignments.length === 0 ? (
                <Card><CardContent className="py-10 text-center text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No assignments created by this tutor.</p>
                </CardContent></Card>
              ) : (
                assignments.map((a) => (
                  <Card key={a.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <div className="font-semibold">{a.title}</div>
                          <div className="text-sm text-muted-foreground">{a.subject} • Due {format(parseISO(a.dueAt), "dd MMM yyyy")}</div>
                        </div>
                        <Badge variant="outline">{a.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </PortalLayout>
    </RouteGuard>
  );
}
