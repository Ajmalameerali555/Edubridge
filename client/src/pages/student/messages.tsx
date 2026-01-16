import { useState, useMemo, useRef, useEffect } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { RouteGuard } from "@/components/portal/RouteGuard";
import { useAuth } from "@/contexts/AuthContext";
import {
  getMessagesByThreadId,
  createMessage,
  getSessionsByStudentId,
  getUserById,
  getTutorById,
  Message,
} from "@/lib/datastore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, User, AlertCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

export default function StudentMessages() {
  const { user, student } = useAuth();
  const { toast } = useToast();
  const [messageText, setMessageText] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, tutorInfo } = useMemo(() => {
    if (!student || !user) {
      return { messages: [] as Message[], tutorInfo: null };
    }

    const sessions = getSessionsByStudentId(student.id);
    let tutorData: { id: string; name: string; userId: string } | null = null;
    if (sessions.length > 0) {
      const tutor = getTutorById(sessions[0].tutorId);
      if (tutor) {
        const tutorUser = getUserById(tutor.userId);
        if (tutorUser) {
          tutorData = {
            id: tutor.id,
            name: `${tutorUser.firstName} ${tutorUser.lastName || ""}`.trim(),
            userId: tutor.userId,
          };
        }
      }
    }

    const threadId = tutorData ? `thread_${student.id}_${tutorData.id}` : "";
    const allMessages = threadId ? getMessagesByThreadId(threadId) : [];

    return { messages: allMessages, tutorInfo: tutorData };
  }, [student, user, refreshKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !student || !user || !tutorInfo) return;

    setSending(true);
    try {
      const result = createMessage({
        threadId: `thread_${student.id}_${tutorInfo.id}`,
        studentId: student.id,
        fromUserId: user.id,
        toUserId: tutorInfo.userId,
        body: messageText.trim(),
        read: false,
      });

      if ("blocked" in result && result.blocked) {
        toast({
          variant: "destructive",
          title: "Message Blocked",
          description: result.reason || "Your message contains content that is not allowed.",
        });
      } else {
        setMessageText("");
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!tutorInfo) {
    return (
      <RouteGuard allowedRoles={["student"]}>
        <PortalLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Messages</h1>
              <p className="text-muted-foreground">Chat with your tutor</p>
            </div>

            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No tutor assigned yet. Messages will be available once you have a tutor.
                </p>
              </CardContent>
            </Card>
          </div>
        </PortalLayout>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard allowedRoles={["student"]}>
      <PortalLayout>
        <div className="flex flex-col h-[calc(100vh-180px)]">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">Messages</h1>
            <p className="text-muted-foreground">Chat with your tutor</p>
          </div>

          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="border-b py-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{getInitials(tutorInfo.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{tutorInfo.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">Your Tutor</p>
                </div>
              </div>
            </CardHeader>

            <ScrollArea className="flex-1 p-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No messages yet</p>
                  <p className="text-sm text-muted-foreground">
                    Start a conversation with your tutor
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isFromMe = message.fromUserId === user?.id;
                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-3",
                          isFromMe ? "flex-row-reverse" : "flex-row"
                        )}
                        data-testid={`message-${message.id}`}
                      >
                        <Avatar className="w-8 h-8 shrink-0">
                          <AvatarFallback className="text-xs">
                            {isFromMe
                              ? getInitials(`${user?.firstName} ${user?.lastName || ""}`)
                              : getInitials(tutorInfo.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={cn(
                            "max-w-[75%] rounded-lg p-3",
                            isFromMe
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.body}</p>
                          <p
                            className={cn(
                              "text-xs mt-1",
                              isFromMe
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            )}
                          >
                            {format(parseISO(message.createdAt), "MMM d, h:mm a")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            <div className="border-t p-4">
              <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 mb-3">
                <CardContent className="p-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    For safety, sharing personal contact information is not allowed.
                    All communication happens through this platform.
                  </p>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="resize-none min-h-[80px]"
                  data-testid="input-message"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim() || sending}
                  className="shrink-0"
                  size="icon"
                  data-testid="button-send-message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </PortalLayout>
    </RouteGuard>
  );
}
