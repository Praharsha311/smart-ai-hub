import { useState } from "react";
import { Send, ChevronDown, Paperclip, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSend: (message: string, model: string, useRag: boolean) => void;
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
  const [useRag, setUseRag] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const selectedModel = MODELS.find((m) => m.id === model)!;

  // 🔥 SEND MESSAGE (UPDATED)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;

    // ✅ FORCE RAG if file exists
    const shouldUseRag = fileName ? true : useRag;

    onSend(input.trim(), model, shouldUseRag);
    setInput("");
  };

  // 🔥 FILE UPLOAD HANDLER
  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      setFileName(file.name);

      const formData = new FormData();
      formData.append("file", file);

      await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      // ✅ AUTO ENABLE RAG
      setUseRag(true);

    } catch (err) {
      console.error("Upload error:", err);
      setFileName(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-md px-4 py-4">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex flex-col gap-2">

        {/* 🔽 Model Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-md bg-muted/50"
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
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-muted ${
                      m.id === model ? "text-primary" : ""
                    }`}
                  >
                    <div className="font-medium">{m.label}</div>
                    <div className="text-xs text-muted-foreground">{m.desc}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 📄 Uploaded file indicator */}
          {fileName && (
            <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
              {uploading ? (
                <span>Uploading...</span>
              ) : (
                <>
                  <Check className="w-3 h-3 text-green-500" />
                  <span className="truncate max-w-[120px]">{fileName}</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* ✍️ Input Row */}
        <div className="flex gap-2 items-end">
          <div className="flex-1 flex items-center gap-2 bg-muted border border-border rounded-xl px-3 py-2">

            {/* 📎 Attachment */}
            <label className="cursor-pointer text-muted-foreground hover:text-foreground">
              <Paperclip className="w-4 h-4" />
              <input
                type="file"
                hidden
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
            </label>

            {/* Textarea */}
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
              className="flex-1 resize-none bg-transparent outline-none text-sm"
              style={{ maxHeight: "120px" }}
            />
          </div>

          {/* 🚀 Send */}
          <Button
            type="submit"
            disabled={!input.trim() || disabled}
            size="icon"
            className="h-[46px] w-[46px] rounded-xl"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
