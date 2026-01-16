import * as React from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { RouteGuard } from "@/components/portal/RouteGuard";
import { useAuth } from "@/contexts/AuthContext";
import {
  getSessionsByTutorId,
  getStudentById,
  getUserById,
  getMessagesByThreadId,
  createMessage,
  markMessageAsRead,
  Student,
  Message,
} from "@/lib/datastore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, User, ChevronLeft } from "lucide-react";
import { format, parseISO } from "date-fns";

interface Thread {
  id: string;
  student: Student;
  studentName: string;
  lastMessage?: Message;
  unreadCount: number;
}

export default function TutorMessages() {
  const { tutor, user } = useAuth();
  const { toast } = useToast();
  const [threads, setThreads] = React.useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = React.useState<Thread | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [newMessage, setNewMessage] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const loadThreads = React.useCallback(() => {
    if (tutor) {
      const sessions = getSessionsByTutorId(tutor.id);
      const studentIds = Array.from(new Set(sessions.map((s) => s.studentId)));
      const threadList: Thread[] = [];

      studentIds.forEach((studentId) => {
        const student = getStudentById(studentId);
        if (student) {
          const studentUser = getUserById(student.userId);
          const threadId = `thread_${student.id}_${tutor.id}`;
          const threadMessages = getMessagesByThreadId(threadId);
          const unreadCount = threadMessages.filter(
            (m) => !m.read && m.toUserId === user?.id
          ).length;

          threadList.push({
            id: threadId,
            student,
            studentName: studentUser
              ? `${studentUser.firstName} ${studentUser.lastName || ""}`.trim()
              : "Unknown",
            lastMessage: threadMessages[threadMessages.length - 1],
            unreadCount,
          });
        }
      });

      threadList.sort((a, b) => {
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime();
      });

      setThreads(threadList);
    }
  }, [tutor, user]);

  React.useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openThread = (thread: Thread) => {
    setSelectedThread(thread);
    const threadMessages = getMessagesByThreadId(thread.id);
    setMessages(threadMessages);
    
    threadMessages.forEach((msg) => {
      if (!msg.read && msg.toUserId === user?.id) {
        markMessageAsRead(msg.id);
      }
    });
    
    loadThreads();
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedThread || !tutor || !user) return;

    setSending(true);
    const result = createMessage({
      threadId: selectedThread.id,
      studentId: selectedThread.student.id,
      fromUserId: user.id,
      toUserId: selectedThread.student.userId,
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
      setMessages(getMessagesByThreadId(selectedThread.id));
      loadThreads();
    }
    setSending(false);
  };

  const goBackToList = () => {
    setSelectedThread(null);
    setMessages([]);
    loadThreads();
  };

  return (
    <RouteGuard allowedRoles={["tutor"]}>
      <PortalLayout>
        <div className="h-[calc(100vh-12rem)]">
          {!selectedThread ? (
            <div className="space-y-6 h-full">
              <div>
                <h1 className="text-2xl font-bold" data-testid="text-page-title">Messages</h1>
                <p className="text-muted-foreground">
                  Chat with your students
                </p>
              </div>

              {threads.length === 0 ? (
                <Card className="h-[calc(100%-80px)]">
                  <CardContent className="flex flex-col items-center justify-center h-full">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No message threads yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Start by viewing a student's profile
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <ScrollArea className="h-[calc(100%-80px)]">
                  <div className="space-y-2 pr-4">
                    {threads.map((thread) => (
                      <Card
                        key={thread.id}
                        className="hover-elevate cursor-pointer"
                        onClick={() => openThread(thread)}
                        data-testid={`thread-row-${thread.id}`}
                      >
                        <CardContent className="flex items-center gap-4 p-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-lg font-semibold text-primary">
                              {thread.studentName.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium truncate">{thread.studentName}</p>
                              {thread.unreadCount > 0 && (
                                <Badge variant="default" className="shrink-0">
                                  {thread.unreadCount}
                                </Badge>
                              )}
                            </div>
                            {thread.lastMessage && (
                              <p className="text-sm text-muted-foreground truncate">
                                {thread.lastMessage.fromUserId === user?.id ? "You: " : ""}
                                {thread.lastMessage.body}
                              </p>
                            )}
                          </div>
                          {thread.lastMessage && (
                            <p className="text-xs text-muted-foreground shrink-0">
                              {format(parseISO(thread.lastMessage.createdAt), "MMM d")}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-4 pb-4 border-b">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goBackToList}
                  data-testid="button-back"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">
                    {selectedThread.studentName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{selectedThread.studentName}</p>
                  <p className="text-sm text-muted-foreground">
                    Grade {selectedThread.student.grade}
                  </p>
                </div>
              </div>

              <ScrollArea className="flex-1 py-4">
                <div className="space-y-3 pr-4">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No messages yet</p>
                      <p className="text-sm text-muted-foreground">Start the conversation!</p>
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
                            <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {format(parseISO(msg.createdAt), "MMM d, h:mm a")}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="border-t pt-4">
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
                <p className="text-xs text-muted-foreground mt-2">
                  Messages are monitored. Sharing phone numbers, emails, or external links is blocked.
                </p>
              </div>
            </div>
          )}
        </div>
      </PortalLayout>
    </RouteGuard>
  );
}
