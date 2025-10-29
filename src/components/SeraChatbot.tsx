import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface SeraChatbotProps {
  stressScore: number;
  anxietyScore: number;
  depressionScore: number;
  onClose: () => void;
}

const SeraChatbot = ({ stressScore, anxietyScore, depressionScore, onClose }: SeraChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sera-chat`;

  // Generate initial greeting based on scores
  const getInitialGreeting = () => {
    const depLevel = depressionScore >= 28 ? "extremely_severe" : 
                      depressionScore >= 21 ? "severe" : 
                      depressionScore >= 14 ? "moderate" : 
                      depressionScore >= 10 ? "mild" : "normal";
    
    const anxLevel = anxietyScore >= 20 ? "extremely_severe" : 
                      anxietyScore >= 15 ? "severe" : 
                      anxietyScore >= 10 ? "moderate" : 
                      anxietyScore >= 8 ? "mild" : "normal";
    
    const stressLevel = stressScore >= 34 ? "extremely_severe" : 
                         stressScore >= 26 ? "severe" : 
                         stressScore >= 19 ? "moderate" : 
                         stressScore >= 15 ? "mild" : "normal";

    const severityLevels = ["normal", "mild", "moderate", "severe", "extremely_severe"];
    const maxSeverity = Math.max(
      severityLevels.indexOf(depLevel),
      severityLevels.indexOf(anxLevel),
      severityLevels.indexOf(stressLevel)
    );
    const overallSeverity = severityLevels[maxSeverity];

    if (overallSeverity === "normal") {
      return "Namaste! 🙏 Great job completing the assessment! Your scores look healthy. How are you feeling about your journey through the game?";
    } else if (overallSeverity === "mild") {
      return "Namaste! 🙏 Thank you for completing the assessment. I can see you've been experiencing some challenges lately. I'm here to listen and support you. How has your day been?";
    } else if (overallSeverity === "moderate") {
      return "Namaste! 🙏 I appreciate you taking the time to complete this assessment. It takes courage to acknowledge when things feel difficult. I'm here to support you. Would you like to talk about what's been on your mind?";
    } else if (overallSeverity === "severe") {
      return "Namaste! 🙏 Thank you for completing the assessment. I can see you're going through a really tough time, and I want you to know that you're not alone. I'm here to listen and support you. How are you holding up today?";
    } else {
      return "Namaste! 🙏 Thank you for sharing your assessment with me. I'm deeply concerned about what you're experiencing, and I want you to know that you deserve support and care. You're incredibly brave for being here. Would you be open to talking about professional resources that could help? Remember, seeking help is a sign of strength, not weakness.";
    }
  };

  useEffect(() => {
    // Add initial greeting when component mounts
    const greeting = getInitialGreeting();
    setMessages([{ role: "assistant", content: greeting }]);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const streamChat = async (userMessages: Message[]) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({
        messages: userMessages,
        stressScore,
        anxietyScore,
        depressionScore,
      }),
    });

    if (!resp.ok || !resp.body) throw new Error("Failed to start stream");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;
    let assistantMessage = "";

    // Add empty assistant message that we'll update
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantMessage += content;
            setMessages((prev) => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = {
                role: "assistant",
                content: assistantMessage,
              };
              return newMessages;
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      await streamChat(newMessages);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, I'm having trouble connecting right now. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      {/* Decorative Indian patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0icGF0dGVybiIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSI4IiBmaWxsPSIjRkY5OTMzIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')] opacity-40" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0icGF0dGVybjIiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTMwIDAgTDYwIDMwIEwzMCA2MCBMMCAzMCBaIiBmaWxsPSIjRkY2Nzg5Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4yKSIvPjwvc3ZnPg==')] opacity-30" />
      </div>

      <div className="relative w-full max-w-3xl h-[600px] bg-card/95 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-amber-200 flex flex-col overflow-hidden">
        {/* Header with Indian motif */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-6 border-b-4 border-amber-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1vcGFjaXR5PSIwLjIiLz48L3N2Zz4=')] opacity-30" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/40">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  SERA
                </h2>
                <p className="text-sm text-white/80">Student Emotional Resource Assistant</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages area with decorative border */}
        <ScrollArea className="flex-1 p-6 bg-gradient-to-b from-orange-50/50 to-amber-50/50">
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md"
                      : "bg-white border-2 border-amber-200 text-foreground shadow-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* Input area with decorative elements */}
        <div className="p-4 bg-gradient-to-r from-orange-100 via-amber-100 to-yellow-100 border-t-2 border-amber-300">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Share your thoughts..."
              disabled={isLoading}
              className="flex-1 border-2 border-amber-300 focus:border-orange-400 bg-white/80 backdrop-blur-sm rounded-xl"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl px-6 shadow-md"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeraChatbot;
