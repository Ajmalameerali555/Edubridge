import { useState, useMemo } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { RouteGuard } from "@/components/portal/RouteGuard";
import { SideDrawer } from "@/components/portal/SideDrawer";
import { useAuth } from "@/contexts/AuthContext";
import {
  getHomeworkByStudentId,
  updateHomework,
  getUserById,
  getTutorById,
  Homework,
} from "@/lib/datastore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Circle,
  Send,
  AlertCircle,
} from "lucide-react";
import { format, parseISO, isFuture, isPast, differenceInDays } from "date-fns";

export default function StudentHomework() {
  const { student } = useAuth();
  const { toast } = useToast();
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const homeworkList = useMemo(() => {
    if (!student) return [];
    return getHomeworkByStudentId(student.id).sort((a, b) => {
      if (a.status === "assigned" && b.status !== "assigned") return -1;
      if (a.status !== "assigned" && b.status === "assigned") return 1;
      return parseISO(a.dueAt).getTime() - parseISO(b.dueAt).getTime();
    });
  }, [student, refreshKey]);

  const getTutorName = (tutorId: string) => {
    const tutor = getTutorById(tutorId);
    if (tutor) {
      const tutorUser = getUserById(tutor.userId);
      if (tutorUser) {
        return `${tutorUser.firstName} ${tutorUser.lastName || ""}`.trim();
      }
    }
    return "Tutor";
  };

  const getStatusBadge = (status: Homework["status"]) => {
    switch (status) {
      case "assigned":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
            Assigned
          </Badge>
        );
      case "submitted":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Submitted
          </Badge>
        );
      case "reviewed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Reviewed
          </Badge>
        );
      default:
        return null;
    }
  };

  const getDueStatus = (dueAt: string) => {
    const dueDate = parseISO(dueAt);
    const daysUntil = differenceInDays(dueDate, new Date());

    if (isPast(dueDate)) {
      return { text: "Overdue", color: "text-red-500" };
    } else if (daysUntil === 0) {
      return { text: "Due today", color: "text-amber-500" };
    } else if (daysUntil === 1) {
      return { text: "Due tomorrow", color: "text-amber-500" };
    } else {
      return { text: `Due in ${daysUntil} days`, color: "text-muted-foreground" };
    }
  };

  const handleHomeworkClick = (homework: Homework) => {
    setSelectedHomework(homework);
    setDrawerOpen(true);
  };

  const handleMarkAsSubmitted = () => {
    if (!selectedHomework) return;

    updateHomework(selectedHomework.id, { status: "submitted" });
    setRefreshKey((prev) => prev + 1);
    
    const updated = { ...selectedHomework, status: "submitted" as const };
    setSelectedHomework(updated);

    toast({
      title: "Homework Submitted",
      description: "Your homework has been marked as submitted.",
    });
  };

  return (
    <RouteGuard allowedRoles={["student"]}>
      <PortalLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Homework</h1>
            <p className="text-muted-foreground">Your homework assignments</p>
          </div>

          {homeworkList.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No homework assignments</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {homeworkList.map((homework) => {
                const dueStatus = getDueStatus(homework.dueAt);
                return (
                  <div
                    key={homework.id}
                    className="flex items-center gap-4 p-4 rounded-lg border hover-elevate cursor-pointer"
                    onClick={() => handleHomeworkClick(homework)}
                    data-testid={`homework-${homework.id}`}
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      {homework.status === "reviewed" ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : homework.status === "submitted" ? (
                        <Send className="w-6 h-6 text-blue-500" />
                      ) : (
                        <BookOpen className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium">{homework.title}</h3>
                        {getStatusBadge(homework.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {homework.subject}
                        </span>
                        <span className={`flex items-center gap-1 ${dueStatus.color}`}>
                          <Calendar className="w-3 h-3" />
                          {dueStatus.text}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {getTutorName(homework.tutorId)}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline">{homework.items.length} items</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <SideDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title={selectedHomework?.title || "Homework Details"}
          footer={
            selectedHomework?.status === "assigned" ? (
              <Button
                className="w-full"
                onClick={handleMarkAsSubmitted}
                data-testid="button-mark-submitted"
              >
                <Send className="w-4 h-4 mr-2" />
                Mark as Submitted
              </Button>
            ) : null
          }
        >
          {selectedHomework && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedHomework.status)}
                </div>

                <div className="grid gap-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Subject</p>
                      <p className="font-medium">{selectedHomework.subject}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Due Date</p>
                      <p className="font-medium">
                        {format(parseISO(selectedHomework.dueAt), "EEEE, MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Assigned by</p>
                      <p className="font-medium">{getTutorName(selectedHomework.tutorId)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Tasks ({selectedHomework.items.length})</h3>
                <div className="space-y-3">
                  {selectedHomework.items.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                      data-testid={`homework-item-${index}`}
                    >
                      <div className="mt-0.5">
                        {selectedHomework.status === "reviewed" ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : selectedHomework.status === "submitted" ? (
                          <Circle className="w-5 h-5 text-blue-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Task {index + 1}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.question}
                        </p>
                        {item.answer && (
                          <div className="mt-2 p-2 rounded bg-background border">
                            <p className="text-xs text-muted-foreground">Your answer:</p>
                            <p className="text-sm">{item.answer}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedHomework.status === "assigned" && (
                <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
                  <CardContent className="p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800 dark:text-amber-200">
                        Complete your homework
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        Work through the tasks above, then mark as submitted when done.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </SideDrawer>
      </PortalLayout>
    </RouteGuard>
  );
}
