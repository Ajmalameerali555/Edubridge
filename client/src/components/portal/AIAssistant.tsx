import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2, Mic, MicOff, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVoiceRecorder } from "../../../replit_integrations/audio/useVoiceRecorder";
import { useVoiceStream } from "../../../replit_integrations/audio/useVoiceStream";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isVoice?: boolean;
}

interface AIAssistantProps {
  role: "student" | "tutor" | "admin" | "parent";
  context?: Record<string, unknown>;
  assistantName?: string;
  welcomeMessage?: string;
}

const ASSISTANT_NAMES: Record<string, string> = {
  student: "EduBuddy",
  tutor: "TutorAssist",
  admin: "AdminInsight",
  parent: "ParentConnect",
};

const WELCOME_MESSAGES: Record<string, string> = {
  student: "Hi there! I'm EduBuddy, your learning companion. How can I help you today? Ask me about your sessions, homework, or anything you're learning! You can also tap the microphone to talk to me.",
  tutor: "Hello! I'm TutorAssist, here to help you manage your students and sessions. Need a quick summary or reminder? You can type or use voice!",
  admin: "Welcome! I'm AdminInsight, your platform analytics assistant. I can help you track student progress and identify any concerns.",
  parent: "Hello! I'm ParentConnect, here to keep you updated on your child's learning journey. What would you like to know?",
};

export function AIAssistant({ role, context, assistantName, welcomeMessage }: AIAssistantProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasShownWelcome, setHasShownWelcome] = React.useState(false);
  const [conversationId, setConversationId] = React.useState<number | null>(null);
  const [isVoiceMode, setIsVoiceMode] = React.useState(false);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const recorder = useVoiceRecorder();
  const voiceStream = useVoiceStream({
    onUserTranscript: (text) => {
      const userMessageId = `user-voice-${Date.now()}`;
      setMessages(prev => [...prev, {
        id: userMessageId,
        role: "user",
        content: text,
        timestamp: new Date(),
        isVoice: true,
      }]);
    },
    onTranscript: (delta, full) => {
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage?.role === "assistant" && lastMessage.id.includes("voice")) {
          return prev.map((m, i) => 
            i === prev.length - 1 ? { ...m, content: full } : m
          );
        }
        return prev;
      });
    },
    onComplete: (transcript) => {
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Voice error:", error);
      setIsLoading(false);
    },
  });

  const name = assistantName || ASSISTANT_NAMES[role];
  const welcome = welcomeMessage || WELCOME_MESSAGES[role];

  React.useEffect(() => {
    if (isOpen && !hasShownWelcome) {
      setMessages([{
        id: "welcome",
        role: "assistant",
        content: welcome,
        timestamp: new Date(),
      }]);
      setHasShownWelcome(true);
    }
  }, [isOpen, hasShownWelcome, welcome]);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  React.useEffect(() => {
    if (isOpen && inputRef.current && !isVoiceMode) {
      inputRef.current.focus();
    }
  }, [isOpen, isVoiceMode]);

  const ensureConversation = async (): Promise<number> => {
    if (conversationId) return conversationId;
    
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: `${name} Chat` }),
      });
      const data = await response.json();
      setConversationId(data.id);
      return data.id;
    } catch (error) {
      console.error("Failed to create conversation:", error);
      throw error;
    }
  };

  const handleVoiceToggle = async () => {
    if (recorder.state === "recording") {
      const blob = await recorder.stopRecording();
      if (blob.size > 0) {
        setIsLoading(true);
        const assistantMessageId = `assistant-voice-${Date.now()}`;
        setMessages(prev => [...prev, {
          id: assistantMessageId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
          isVoice: true,
        }]);
        
        try {
          const convId = await ensureConversation();
          await voiceStream.streamVoiceResponse(
            `/api/conversations/${convId}/messages`,
            blob
          );
        } catch (error) {
          setMessages(prev => prev.map(m => 
            m.id === assistantMessageId 
              ? { ...m, content: "I'm having trouble responding right now. Please try again." }
              : m
          ));
          setIsLoading(false);
        }
      }
    } else {
      try {
        await recorder.startRecording();
      } catch (error) {
        console.error("Microphone permission denied:", error);
        setMessages(prev => [...prev, {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "I couldn't access your microphone. Please allow microphone access in your browser and try again.",
          timestamp: new Date(),
        }]);
      }
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    const assistantMessageId = `assistant-${Date.now()}`;
    setMessages(prev => [...prev, {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    }]);

    try {
      const conversationHistory = messages
        .filter(m => m.id !== "welcome")
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          role,
          context,
          conversationHistory,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.content) {
              fullContent += data.content;
              setMessages(prev => prev.map(m => 
                m.id === assistantMessageId 
                  ? { ...m, content: fullContent }
                  : m
              ));
            }
          } catch {}
        }
      }
    } catch (error) {
      setMessages(prev => prev.map(m => 
        m.id === assistantMessageId 
          ? { ...m, content: "I'm having trouble responding right now. Please try again in a moment." }
          : m
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          size="icon"
          data-testid="button-ai-assistant-open"
        >
          <Sparkles className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[380px] h-[520px] flex flex-col shadow-2xl z-50 overflow-hidden bg-card border border-border">
          <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm" data-testid="text-assistant-name">{name}</p>
                <p className="text-xs opacity-80" data-testid="text-assistant-status">
                  {recorder.state === "recording" ? "Listening..." : "AI Assistant"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsVoiceMode(!isVoiceMode)}
                className={cn(
                  "text-primary-foreground",
                  isVoiceMode && "bg-primary-foreground/30"
                )}
                data-testid="button-voice-mode-toggle"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground"
                data-testid="button-ai-assistant-close"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4 bg-background" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2",
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                  data-testid={`message-${message.role}-${message.id}`}
                >
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                    message.role === "user" 
                      ? "bg-secondary" 
                      : "bg-primary/10"
                  )}>
                    {message.role === "user" ? (
                      <User className="h-4 w-4 text-secondary-foreground" />
                    ) : (
                      <Bot className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div 
                    className={cn(
                      "rounded-2xl px-4 py-2 max-w-[80%] text-sm",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                    data-testid={`text-message-content-${message.id}`}
                  >
                    {message.isVoice && message.role === "user" && (
                      <span className="inline-flex items-center gap-1 mr-1">
                        <Mic className="h-3 w-3" />
                      </span>
                    )}
                    {message.content || (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t bg-card">
            {isVoiceMode ? (
              <div className="flex flex-col items-center gap-3">
                <Button
                  onClick={handleVoiceToggle}
                  disabled={isLoading && recorder.state !== "recording"}
                  size="lg"
                  variant={recorder.state === "recording" ? "destructive" : "default"}
                  className={cn(
                    "h-16 w-16 rounded-full transition-all",
                    recorder.state === "recording" && "animate-pulse"
                  )}
                  data-testid="button-voice-record"
                >
                  {isLoading && recorder.state !== "recording" ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : recorder.state === "recording" ? (
                    <MicOff className="h-6 w-6" />
                  ) : (
                    <Mic className="h-6 w-6" />
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  {recorder.state === "recording" 
                    ? "Tap to stop recording" 
                    : isLoading 
                      ? "Processing your message..." 
                      : "Tap to start talking"}
                </p>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1"
                  data-testid="input-ai-message"
                />
                <Button
                  onClick={handleVoiceToggle}
                  disabled={isLoading}
                  size="icon"
                  variant="outline"
                  data-testid="button-quick-voice"
                >
                  {recorder.state === "recording" ? (
                    <MicOff className="h-4 w-4 text-red-500" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  size="icon"
                  data-testid="button-ai-send"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </>
  );
}
