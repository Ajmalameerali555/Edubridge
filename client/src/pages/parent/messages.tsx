import * as React from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { RouteGuard } from "@/components/portal/RouteGuard";
import { useAuth } from "@/contexts/AuthContext";
import {
  getAllStudents,
  getSessionsByStudentId,
  getTutorById,
  getUserById,
  getMessagesByThreadId,
  createMessage,
  markMessageAsRead,
  Message,
} from "@/lib/datastore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, User, Info } from "lucide-react";
import { format, parseISO } from "date-fns";

export default function ParentMessages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [newMessage, setNewMessage] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const threadInfo = React.useMemo(() => {
    if (!user) return null;

    const students = getAllStudents();
    const childStudent = students.find((s) => s.parentId === user.id);

    if (!childStudent) return null;

    const sessions = getSessionsByStudentId(childStudent.id);
    if (sessions.length === 0) return { child: childStudent, tutor: null, tutorUser: null, threadId: null };

    const tutor = getTutorById(sessions[0].tutorId);
    if (!tutor) return { child: childStudent, tutor: null, tutorUser: null, threadId: null };

    const tutorUser = getUserById(tutor.userId);
    const threadId = `thread_${childStudent.id}_${tutor.id}`;

    return {
      child: childStudent,
      tutor,
      tutorUser,
      threadId,
    };
  }, [user]);

  const loadMessages = React.useCallback(() => {
    if (threadInfo?.threadId) {
      const threadMessages = getMessagesByThreadId(threadInfo.threadId);
      setMessages(threadMessages);

      threadMessages.forEach((msg) => {
        if (!msg.read && msg.toUserId === user?.id) {
          markMessageAsRead(msg.id);
        }
      });
    }
  }, [threadInfo, user]);

  React.useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !threadInfo?.threadId || !threadInfo.tutor || !user) return;

    setSending(true);
    const result = createMessage({
      threadId: threadInfo.threadId,
      studentId: threadInfo.child.id,
      fromUserId: user.id,
      toUserId: threadInfo.tutor.userId,
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
      loadMessages();
      toast({
        title: "Message Sent",
        description: "Your message has been sent to the tutor.",
      });
    }
    setSending(false);
  };

  if (!threadInfo?.child) {
    return (
      <RouteGuard allowedRoles={["parent"]}>
        <PortalLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Messages</h1>
              <p className="text-muted-foreground">Chat with your child's tutor</p>
            </div>
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No child profile found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete the assessment to get started.
                </p>
              </CardContent>
            </Card>
          </div>
        </PortalLayout>
      </RouteGuard>
    );
  }

  if (!threadInfo.tutor || !threadInfo.tutorUser) {
    return (
      <RouteGuard allowedRoles={["parent"]}>
        <PortalLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Messages</h1>
              <p className="text-muted-foreground">Chat with your child's tutor</p>
            </div>
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <User className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No tutor assigned yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Messaging will be available once a tutor is assigned.
                </p>
              </CardContent>
            </Card>
          </div>
        </PortalLayout>
      </RouteGuard>
    );
  }

  const tutorName = `${threadInfo.tutorUser.firstName} ${threadInfo.tutorUser.lastName || ""}`.trim();
  const childUser = getUserById(threadInfo.child.userId);
  const childName = childUser ? `${childUser.firstName}` : "your child";

  return (
    <RouteGuard allowedRoles={["parent"]}>
      <PortalLayout>
        <div className="h-[calc(100vh-12rem)] flex flex-col">
          <div className="pb-4">
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Messages</h1>
            <p className="text-muted-foreground">Chat with {childName}'s tutor</p>
          </div>

          <Card className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center gap-4 p-4 border-b">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-semibold text-primary">
                  {tutorName.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium" data-testid="text-tutor-name">{tutorName}</p>
                <p className="text-sm text-muted-foreground">
                  {threadInfo.child.subjects.join(", ")} Tutor
                </p>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No messages yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Start a conversation about {childName}'s progress
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isFromParent = msg.fromUserId === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isFromParent ? "justify-end" : "justify-start"}`}
                        data-testid={`message-${msg.id}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            isFromParent
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

            <div className="border-t p-4">
              <div className="flex gap-2">
                <Textarea
                  placeholder={`Message ${tutorName} about ${childName}'s progress...`}
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

          <div className="flex items-start gap-2 p-4 mt-4 rounded-lg bg-muted/50">
            <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p>Messages are monitored to ensure student safety.</p>
              <p className="mt-1">Sharing phone numbers, emails, or external links is not permitted.</p>
            </div>
          </div>
        </div>
      </PortalLayout>
    </RouteGuard>
  );
}
