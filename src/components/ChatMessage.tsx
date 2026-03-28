import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, Bot, User, FileText } from "lucide-react";
import { useState } from "react";
import type { Message } from "@/lib/ai-router";
import { MetricsBadge } from "./MetricsBadge";
import { sendFeedback } from "@/lib/ai-router";

export function ChatMessage({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = async (type: "like" | "dislike") => {
    if (!message.metrics) return;

    try {
      setLoadingFeedback(true);

      sendFeedback({
        query: message.query,
        model: message.metrics.model,
        complexity: message.metrics.complexity,
        feedback: type,
        comment,
        forced_complexity:
          type === "dislike"
            ? prompt(
                "Which complexity should be used? (simple/moderate/advanced/complex)"
              )
            : null,
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Feedback error:", err);
    } finally {
      setLoadingFeedback(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div
        className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
          isUser
            ? "bg-accent/20 text-accent"
            : "bg-primary/15 text-primary"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Content */}
      <div
        className={`flex flex-col gap-2 max-w-[75%] ${
          isUser ? "items-end" : ""
        }`}
      >
        {/* 🔥 RAG Indicator */}
        {!isUser && (message as any).rag_used && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <FileText className="w-3 h-3" />
            <span>Answer based on document</span>
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed break-words whitespace-pre-wrap ${
            isUser
              ? "bg-accent/15 text-foreground rounded-tr-sm"
              : "bg-card text-card-foreground border border-border rounded-tl-sm"
          }`}
        >
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content || ""}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Copy */}
        {!isUser && (
          <button
            onClick={handleCopy}
            className="self-start text-muted-foreground hover:text-foreground p-1"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        )}

        {/* Feedback */}
        {!isUser && message.metrics && !submitted && (
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex gap-2">
              <button
                onClick={() => handleFeedback("like")}
                disabled={loadingFeedback}
                className="px-3 py-1 text-xs rounded bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                👍 Like
              </button>

              <button
                onClick={() => handleFeedback("dislike")}
                disabled={loadingFeedback}
                className="px-3 py-1 text-xs rounded bg-red-600 hover:bg-red-700 disabled:opacity-50"
              >
                👎 Dislike
              </button>
            </div>

            <input
              type="text"
              placeholder="Optional comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="px-2 py-1 text-xs rounded bg-muted outline-none"
            />
          </div>
        )}

        {/* Submitted */}
        {submitted && (
          <div className="text-xs text-muted-foreground">
            ✅ Feedback submitted
          </div>
        )}

        {/* 🔥 Metrics (SAFE RENDER) */}
        {message.metrics && (
          <MetricsBadge metrics={message.metrics} />
        )}
      </div>
    </motion.div>
  );
}
