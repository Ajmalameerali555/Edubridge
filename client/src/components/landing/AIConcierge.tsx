import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, MessageCircle, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const WELCOME_MESSAGE = `Hi! I'm the EduBridge assistant. I'm here to help you learn about our tutoring platform. 

You can ask me about:
• Our tutoring services and subjects we cover
• How our assessment and matching process works
• Pricing and scheduling options
• What makes EduBridge different

How can I help you today?`;

const QUICK_QUESTIONS = [
  "What subjects do you offer?",
  "How does tutoring work?",
  "What grades do you support?",
  "How much does it cost?",
];

export function AIConcierge() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasShownWelcome, setHasShownWelcome] = React.useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = React.useState(true);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen && !hasShownWelcome) {
      setMessages([{
        id: "welcome",
        role: "assistant",
        content: WELCOME_MESSAGE,
        timestamp: new Date(),
      }]);
      setHasShownWelcome(true);
    }
  }, [isOpen, hasShownWelcome]);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text || isLoading) return;

    setShowQuickQuestions(false);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
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
          message: text,
          role: "concierge",
          context: { platform: "EduBridge Learning", isPublicVisitor: true },
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
          ? { ...m, content: "I'm having trouble responding right now. Please try again or contact us directly for assistance." }
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
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="rounded-full shadow-lg"
              data-testid="button-concierge-open"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">Chat with us</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Card className="w-[380px] h-[520px] flex flex-col shadow-2xl overflow-hidden border-2 border-primary/20 bg-card">
              <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary to-blue-600 text-white">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold" data-testid="text-assistant-name">EduBridge Assistant</p>
                    <p className="text-xs opacity-80" data-testid="text-assistant-subtitle">Here to help you learn more</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white"
                  data-testid="button-concierge-close"
                >
                  <X className="h-5 w-5" />
                </Button>
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
                          ? "bg-primary text-primary-foreground" 
                          : "bg-gradient-to-r from-primary/20 to-blue-500/20"
                      )}>
                        {message.role === "user" ? (
                          <span className="text-xs font-medium">You</span>
                        ) : (
                          <Sparkles className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div 
                        className={cn(
                          "rounded-2xl px-4 py-3 max-w-[80%] text-sm whitespace-pre-wrap",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                        data-testid={`text-message-content-${message.id}`}
                      >
                        {message.content || (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {showQuickQuestions && messages.length === 1 && (
                    <div className="mt-4 space-y-2" data-testid="section-quick-questions">
                      <p className="text-xs text-muted-foreground font-medium" data-testid="text-quick-questions-label">Quick questions:</p>
                      <div className="flex flex-wrap gap-2">
                        {QUICK_QUESTIONS.map((question) => (
                          <Button
                            key={question}
                            variant="outline"
                            size="sm"
                            className="text-xs h-auto py-2 px-3"
                            onClick={() => sendMessage(question)}
                            data-testid={`button-quick-${question.toLowerCase().replace(/\s+/g, "-").replace(/\?/g, "")}`}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t bg-card">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question..."
                    disabled={isLoading}
                    className="flex-1"
                    data-testid="input-concierge-message"
                  />
                  <Button
                    onClick={() => sendMessage()}
                    disabled={!inputValue.trim() || isLoading}
                    size="icon"
                    data-testid="button-concierge-send"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
