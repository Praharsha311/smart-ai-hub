import { useState, useRef, useEffect, useCallback } from "react";
import { Menu, Zap } from "lucide-react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { LoadingDots } from "@/components/LoadingDots";
import { sendMessage, type Message, type ModelId } from "@/lib/ai-router";

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(scrollToBottom, [messages, loading, scrollToBottom]);

 const handleSend = async (content: string, model: ModelId) => {
  const userMsg: Message = {
    id: crypto.randomUUID(),
    role: "user",
    content,
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMsg]);
  setLoading(true);

  try {
    const res = await sendMessage(content, model);

    console.log("API RESPONSE:", res); // 🔍 debug

    const aiMsg: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: res.answer, // ✅ FIX
      timestamp: new Date(),
      metrics: {
        model: res.model,
        complexity: res.complexity,
        latency: res.latency,
        cost: res.cost,
        efficiency: res.efficiency,
      },
    };

    setMessages((prev) => [...prev, aiMsg]);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    setLoading(false);
  }
};

  const handleNewChat = () => setMessages([]);
  const handleClearChat = () => setMessages([]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ChatSidebar
        onNewChat={handleNewChat}
        onClearChat={handleClearChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background/80 backdrop-blur-md">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <div>
              <h1 className="text-sm font-semibold text-foreground leading-tight">
                Smart AI Router
              </h1>
              <p className="text-xs text-muted-foreground">
                Optimizing cost, speed & intelligence
              </p>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 glow-primary">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-1">
                  Smart AI Router
                </h2>
                <p className="text-sm text-muted-foreground max-w-md">
                  Automatically selects the best model for your query — balancing speed, cost, and intelligence.
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {loading && <LoadingDots />}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <ChatInput onSend={handleSend} disabled={loading} />
      </div>
    </div>
  );
}
