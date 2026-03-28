import { useState } from "react";
import { Send, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSend: (message: string, model: string) => void;
  disabled: boolean;
}

const MODELS = [
  { id: "auto", label: "Auto (Recommended)", desc: "Smart routing" },
  { id: "llama-3.1-8b-instant", label: "8B Fast", desc: "Cheap & fast" },
  { id: "openai/gpt-oss-20b", label: "20B Balanced", desc: "Best tradeoff" },
  { id: "llama-3.3-70b-versatile", label: "70B Powerful", desc: "High reasoning" },
  { id: "openai/gpt-oss-120b", label: "120B Premium", desc: "Maximum intelligence" },
];

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [model, setModel] = useState("auto");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedModel = MODELS.find((m) => m.id === model)!;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;

    onSend(input.trim(), model);
    setInput("");
  };

  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-md px-4 py-4">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex flex-col gap-2">

        {/* 🔽 Model Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md bg-muted/50"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {selectedModel.label}
            <ChevronDown className="w-3 h-3" />
          </button>

          {dropdownOpen && (
            <div className="absolute bottom-full mb-1 left-0 w-64 bg-popover border border-border rounded-lg shadow-xl z-50 py-1">
              {MODELS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setModel(m.id);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors flex flex-col ${
                    m.id === model ? "text-primary" : "text-popover-foreground"
                  }`}
                >
                  <span className="font-medium">{m.label}</span>
                  <span className="text-xs text-muted-foreground">{m.desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ✍️ Input Row */}
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              rows={1}
              disabled={disabled}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              className="w-full resize-none bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all disabled:opacity-50"
              style={{ minHeight: "46px", maxHeight: "120px" }}
              onInput={(e) => {
                const t = e.currentTarget;
                t.style.height = "auto";
                t.style.height = Math.min(t.scrollHeight, 120) + "px";
              }}
            />
          </div>

          {/* 🚀 Send Button */}
          <Button
            type="submit"
            disabled={!input.trim() || disabled}
            size="icon"
            className="h-[46px] w-[46px] rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30 shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}