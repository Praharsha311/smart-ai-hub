import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, Bot, User } from "lucide-react";
import { useState } from "react";
import type { Message } from "@/lib/ai-router";
import { MetricsBadge } from "./MetricsBadge";
import { sendFeedback } from "@/lib/ai-router"; // 🔥 NEW

export function ChatMessage({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false);

  // 🔥 Feedback state
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 🔥 Feedback handler
  const handleFeedback = async (type: "like" | "dislike") => {
    if (!message.metrics) return;

    try {
      setLoadingFeedback(true);

      await sendFeedback({
        query: message.content, // ⚠️ later we can improve this
        model: message.metrics.model,
        complexity: message.metrics.complexity,
        feedback: type,
        comment,
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
      <div className={`flex flex-col gap-2 max-w-[75%] ${isUser ? "items-end" : ""}`}>
        
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
            <div className="prose prose-invert prose-sm max-w-none prose-headings:text-foreground prose-p:text-card-foreground prose-strong:text-foreground prose-code:text-primary prose-blockquote:border-primary/30 prose-blockquote:text-muted-foreground">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content || ""}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Copy button */}
        {!isUser && (
          <button
            onClick={handleCopy}
            className="self-start text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        )}

        {/* 🔥 FEEDBACK UI */}
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
              className="px-2 py-1 text-xs rounded bg-muted text-foreground outline-none"
            />
          </div>
        )}

        {/* ✅ Feedback Submitted */}
        {submitted && (
          <div className="text-xs text-muted-foreground mt-1">
            ✅ Feedback submitted
          </div>
        )}

        {/* Metrics */}
        {message.metrics && <MetricsBadge metrics={message.metrics} />}
      </div>
    </motion.div>
  );
}