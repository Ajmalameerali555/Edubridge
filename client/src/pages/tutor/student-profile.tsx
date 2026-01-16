import * as React from "react";
import { useParams, Link } from "wouter";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { RouteGuard } from "@/components/portal/RouteGuard";
import { useAuth } from "@/contexts/AuthContext";
import {
  getStudentById,
  getUserById,
  getSessionsByStudentId,
  getHomeworkByStudentId,
  getMessagesByThreadId,
  createMessage,
  Session,
  Homework,
  Message,
  Student,
} from "@/lib/datastore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Calendar,
  BookOpen,
  MessageSquare,
  TrendingUp,
  User,
  AlertTriangle,
  Video,
  Send,
} from "lucide-react";
import { format, parseISO } from "date-fns";

function SignalBar({ value, label }: { value: number; label: string }) {
  const getColor = (v: number) => {
    if (v >= 70) return "bg-green-500";
    if (v >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">{value}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${getColor(value)} transition-all`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function TutorStudentProfile() {
  const { id } = useParams<{ id: string }>();
  const { tutor, user } = useAuth();
  const { toast } = useToast();
  const [student, setStudent] = React.useState<Student | null>(null);
  const [studentUser, setStudentUser] = React.useState<ReturnType<typeof getUserById>>(undefined);
  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [homework, setHomework] = React.useState<Homework[]>([]);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [newMessage, setNewMessage] = React.useState("");
  const [sending, setSending] = React.useState(false);

  const threadId = student && tutor ? `thread_${student.id}_${tutor.id}` : "";

  const loadData = React.useCallback(() => {
    if (id) {
      const s = getStudentById(id);
      if (s) {
        setStudent(s);
        setStudentUser(getUserById(s.userId));
        setSessions(getSessionsByStudentId(s.id));
        setHomework(getHomeworkByStudentId(s.id));
        if (tutor) {
          setMessages(getMessagesByThreadId(`thread_${s.id}_${tutor.id}`));
        }
      }
    }
  }, [id, tutor]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !student || !tutor || !user) return;

    setSending(true);
    const result = createMessage({
      threadId,
      studentId: student.id,
      fromUserId: user.id,
      toUserId: student.userId,
      body: newMessage.trim(),
      read: false,
    });

    if ("blocked" in result) {
      toast({
        variant: "destructive",
        title: "Message Blocked",
        description: result.reason,
      });
    } else {
      setNewMessage("");
      loadData();
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
      });
    }
    setSending(false);
  };

  if (!student || !studentUser) {
    return (
      <RouteGuard allowedRoles={["tutor"]}>
        <PortalLayout>
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Student not found</p>
          </div>
        </PortalLayout>
      </RouteGuard>
    );
  }

  const tutorSessions = sessions.filter((s) => s.tutorId === tutor?.id);
  const tutorHomework = homework.filter((h) => h.tutorId === tutor?.id);

  return (
    <RouteGuard allowedRoles={["tutor"]}>
      <PortalLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/tutor/students">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-student-name">
                {studentUser.firstName} {studentUser.lastName || ""}
              </h1>
              <p className="text-muted-foreground">
                Grade {student.grade} - {student.track}
              </p>
            </div>
          </div>

          <Tabs defaultValue="snapshot" className="space-y-4">
            <TabsList className="flex-wrap h-auto gap-1">
              <TabsTrigger value="snapshot" className="gap-1" data-testid="tab-snapshot">
                <User className="h-4 w-4" /> Snapshot
              </TabsTrigger>
              <TabsTrigger value="sessions" className="gap-1" data-testid="tab-sessions">
                <Calendar className="h-4 w-4" /> Sessions
              </TabsTrigger>
              <TabsTrigger value="homework" className="gap-1" data-testid="tab-homework">
                <BookOpen className="h-4 w-4" /> Homework
              </TabsTrigger>
              <TabsTrigger value="messages" className="gap-1" data-testid="tab-messages">
                <MessageSquare className="h-4 w-4" /> Messages
              </TabsTrigger>
              <TabsTrigger value="progress" className="gap-1" data-testid="tab-progress">
                <TrendingUp className="h-4 w-4" /> Progress
              </TabsTrigger>
            </TabsList>

            <TabsContent value="snapshot" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Learning Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Track</p>
                      <Badge variant="secondary" className="mt-1">{student.track}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Subjects</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {student.subjects.map((s) => (
                          <Badge key={s} variant="outline">{s}</Badge>
                        ))}
                      </div>
                    </div>
                    {student.blockers.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Blockers
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {student.blockers.map((b) => (
                            <Badge key={b} variant="destructive" className="capitalize">{b}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Learning Signals</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <SignalBar value={student.signals.confidence} label="Confidence" />
                    <SignalBar value={student.signals.memory} label="Memory" />
                    <SignalBar value={student.signals.language} label="Language" />
                    <SignalBar value={student.signals.foundation} label="Foundation" />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Teaching Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {student.signals.confidence < 60 && (
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                        Provide extra encouragement and positive reinforcement
                      </li>
                    )}
                    {student.signals.memory < 60 && (
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                        Use repetition and spaced review for key concepts
                      </li>
                    )}
                    {student.signals.language < 60 && (
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                        Simplify vocabulary and check for understanding frequently
                      </li>
                    )}
                    {student.signals.foundation < 60 && (
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                        Review foundational concepts before introducing new material
                      </li>
                    )}
                    {Object.values(student.signals).every((v) => v >= 60) && (
                      <li className="text-muted-foreground">No specific teaching adjustments needed</li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sessions" className="space-y-4">
              {tutorSessions.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center py-12">
                    <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No sessions with this student</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {tutorSessions
                    .sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime())
                    .map((session) => (
                      <Card key={session.id} data-testid={`session-item-${session.id}`}>
                        <CardContent className="flex items-center gap-4 p-4">
                          <div className="flex-1">
                            <p className="font-medium">{session.subject}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(parseISO(session.startAt), "MMM d, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                          <Badge
                            variant={
                              session.status === "done"
                                ? "outline"
                                : session.status === "missed"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {session.status}
                          </Badge>
                          {(session.status === "upcoming" || session.status === "live") && (
                            <Button
                              size="sm"
                              onClick={() => window.open(session.meetLink, "_blank")}
                            >
                              <Video className="h-4 w-4 mr-1" /> Join
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="homework" className="space-y-4">
              {tutorHomework.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No homework assigned to this student</p>
                    <Link href="/tutor/homework">
                      <Button className="mt-4">Create Homework</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {tutorHomework
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((hw) => (
                      <Card key={hw.id} data-testid={`homework-item-${hw.id}`}>
                        <CardContent className="flex items-center gap-4 p-4">
                          <div className="flex-1">
                            <p className="font-medium">{hw.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {hw.subject} - Due {format(parseISO(hw.dueAt), "MMM d, yyyy")}
                            </p>
                          </div>
                          <Badge
                            variant={
                              hw.status === "reviewed"
                                ? "default"
                                : hw.status === "submitted"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {hw.status}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="messages" className="space-y-4">
              <Card className="flex flex-col h-[400px]">
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No messages yet</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isFromTutor = msg.fromUserId === user?.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isFromTutor ? "justify-end" : "justify-start"}`}
                          data-testid={`message-${msg.id}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              isFromTutor
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p className="text-sm">{msg.body}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {format(parseISO(msg.createdAt), "MMM d, h:mm a")}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </CardContent>
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="min-h-[60px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      data-testid="input-message"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sending}
                      data-testid="button-send"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="progress" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Progress Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-3xl font-bold">{tutorSessions.length}</p>
                      <p className="text-sm text-muted-foreground">Total Sessions</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-3xl font-bold">
                        {tutorSessions.filter((s) => s.status === "done").length}
                      </p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-3xl font-bold">{tutorHomework.length}</p>
                      <p className="text-sm text-muted-foreground">Homework Given</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-3xl font-bold">
                        {tutorHomework.filter((h) => h.status !== "assigned").length}
                      </p>
                      <p className="text-sm text-muted-foreground">Submitted</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Signal Trends</h4>
                    <div className="space-y-4">
                      {(["confidence", "memory", "language", "foundation"] as const).map((key) => (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{key}</span>
                            <span className="text-muted-foreground">{student.signals[key]}%</span>
                          </div>
                          <Progress value={student.signals[key]} />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PortalLayout>
    </RouteGuard>
  );
}
