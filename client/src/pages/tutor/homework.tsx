import * as React from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { RouteGuard } from "@/components/portal/RouteGuard";
import { SideDrawer } from "@/components/portal/SideDrawer";
import { useAuth } from "@/contexts/AuthContext";
import {
  getHomeworkByTutorId,
  getSessionsByTutorId,
  getStudentById,
  getUserById,
  getSettings,
  createHomework,
  updateHomework,
  Homework,
  Student,
} from "@/lib/datastore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Plus, Calendar, User, FileText, CheckCircle, X } from "lucide-react";
import { format, parseISO } from "date-fns";

export default function TutorHomework() {
  const { tutor } = useAuth();
  const { toast } = useToast();
  const [homework, setHomework] = React.useState<Homework[]>([]);
  const [students, setStudents] = React.useState<Student[]>([]);
  const [selectedHomework, setSelectedHomework] = React.useState<Homework | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [newHomework, setNewHomework] = React.useState({
    studentId: "",
    subject: "",
    title: "",
    items: [{ id: "1", question: "" }],
    dueAt: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
  });

  const loadData = React.useCallback(() => {
    if (tutor) {
      setHomework(getHomeworkByTutorId(tutor.id));
      const sessions = getSessionsByTutorId(tutor.id);
      const studentIds = Array.from(new Set(sessions.map((s) => s.studentId)));
      const studentList: Student[] = [];
      studentIds.forEach((id) => {
        const student = getStudentById(id);
        if (student) studentList.push(student);
      });
      setStudents(studentList);
    }
  }, [tutor]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const getStudentName = (studentId: string) => {
    const student = getStudentById(studentId);
    if (!student) return "Unknown";
    const studentUser = getUserById(student.userId);
    return studentUser ? `${studentUser.firstName} ${studentUser.lastName || ""}`.trim() : "Unknown";
  };

  const openHomeworkDetails = (hw: Homework) => {
    setSelectedHomework(hw);
    setDrawerOpen(true);
  };

  const addItem = () => {
    setNewHomework((prev) => ({
      ...prev,
      items: [...prev.items, { id: String(prev.items.length + 1), question: "" }],
    }));
  };

  const removeItem = (index: number) => {
    setNewHomework((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateItem = (index: number, value: string) => {
    setNewHomework((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, question: value } : item)),
    }));
  };

  const applyTemplate = (templateId: string) => {
    const settings = getSettings();
    const template = settings.templates.homework.find((t) => t.id === templateId);
    if (template) {
      setNewHomework((prev) => ({
        ...prev,
        title: template.title,
        subject: template.subject,
        items: template.items.map((q, i) => ({ id: String(i + 1), question: q })),
      }));
    }
  };

  const handleCreateHomework = () => {
    if (!tutor || !newHomework.studentId || !newHomework.title.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a student and enter a title.",
      });
      return;
    }

    const validItems = newHomework.items.filter((item) => item.question.trim());
    if (validItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please add at least one homework item.",
      });
      return;
    }

    createHomework({
      studentId: newHomework.studentId,
      tutorId: tutor.id,
      subject: newHomework.subject,
      title: newHomework.title.trim(),
      items: validItems,
      dueAt: new Date(newHomework.dueAt).toISOString(),
      status: "assigned",
    });

    toast({
      title: "Homework Created",
      description: "Homework has been assigned to the student.",
    });

    setCreateDialogOpen(false);
    setNewHomework({
      studentId: "",
      subject: "",
      title: "",
      items: [{ id: "1", question: "" }],
      dueAt: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    });
    loadData();
  };

  const handleMarkReviewed = (hwId: string) => {
    updateHomework(hwId, { status: "reviewed" });
    toast({
      title: "Homework Reviewed",
      description: "Homework has been marked as reviewed.",
    });
    loadData();
    setDrawerOpen(false);
  };

  const getStatusBadge = (status: Homework["status"]) => {
    switch (status) {
      case "assigned":
        return <Badge variant="outline">Assigned</Badge>;
      case "submitted":
        return <Badge variant="secondary">Submitted</Badge>;
      case "reviewed":
        return <Badge className="bg-green-500">Reviewed</Badge>;
      default:
        return null;
    }
  };

  const settings = getSettings();

  return (
    <RouteGuard allowedRoles={["tutor"]}>
      <PortalLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-page-title">Homework</h1>
              <p className="text-muted-foreground">
                {homework.length} assignment{homework.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-create-homework">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Homework
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Homework</DialogTitle>
                  <DialogDescription>
                    Assign homework to one of your students.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Use Template</Label>
                    <Select onValueChange={applyTemplate}>
                      <SelectTrigger data-testid="select-template">
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {settings.templates.homework.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Student *</Label>
                    <Select
                      value={newHomework.studentId}
                      onValueChange={(v) => setNewHomework((p) => ({ ...p, studentId: v }))}
                    >
                      <SelectTrigger data-testid="select-student">
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {getStudentName(student.id)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={newHomework.title}
                      onChange={(e) => setNewHomework((p) => ({ ...p, title: e.target.value }))}
                      placeholder="Homework title"
                      data-testid="input-title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={newHomework.subject}
                      onChange={(e) => setNewHomework((p) => ({ ...p, subject: e.target.value }))}
                      placeholder="e.g., Mathematics"
                      data-testid="input-subject"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueAt">Due Date</Label>
                    <Input
                      id="dueAt"
                      type="date"
                      value={newHomework.dueAt}
                      onChange={(e) => setNewHomework((p) => ({ ...p, dueAt: e.target.value }))}
                      data-testid="input-due-date"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Homework Items</Label>
                    <div className="space-y-2">
                      {newHomework.items.map((item, index) => (
                        <div key={item.id} className="flex gap-2">
                          <Input
                            value={item.question}
                            onChange={(e) => updateItem(index, e.target.value)}
                            placeholder={`Question ${index + 1}`}
                            data-testid={`input-item-${index}`}
                          />
                          {newHomework.items.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={addItem}>
                        <Plus className="h-4 w-4 mr-1" /> Add Item
                      </Button>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateHomework} data-testid="button-submit-homework">
                    Create Homework
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {homework.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No homework created yet</p>
                <Button className="mt-4" onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Create Your First Homework
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {homework
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((hw) => (
                  <Card
                    key={hw.id}
                    className="hover-elevate cursor-pointer"
                    onClick={() => openHomeworkDetails(hw)}
                    data-testid={`homework-row-${hw.id}`}
                  >
                    <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{hw.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {getStudentName(hw.studentId)} - {hw.subject}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Due</p>
                          <p className="text-sm font-medium">
                            {format(parseISO(hw.dueAt), "MMM d, yyyy")}
                          </p>
                        </div>
                        {getStatusBadge(hw.status)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>

        <SideDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title={selectedHomework?.title || "Homework Details"}
          footer={
            selectedHomework?.status === "submitted" ? (
              <Button
                onClick={() => handleMarkReviewed(selectedHomework.id)}
                className="w-full"
                data-testid="button-mark-reviewed"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Reviewed
              </Button>
            ) : null
          }
        >
          {selectedHomework && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Student</p>
                    <p className="font-medium">{getStudentName(selectedHomework.studentId)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Subject</p>
                    <p className="font-medium">{selectedHomework.subject || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <p className="font-medium">
                      {format(parseISO(selectedHomework.dueAt), "EEEE, MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(selectedHomework.status)}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Items ({selectedHomework.items.length})
                </h4>
                <div className="space-y-2">
                  {selectedHomework.items.map((item, index) => (
                    <Card key={item.id}>
                      <CardContent className="p-3">
                        <p className="text-sm">
                          <span className="font-medium">Q{index + 1}:</span> {item.question}
                        </p>
                        {item.answer && (
                          <div className="mt-2 pt-2 border-t">
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Answer:</span> {item.answer}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </SideDrawer>
      </PortalLayout>
    </RouteGuard>
  );
}
