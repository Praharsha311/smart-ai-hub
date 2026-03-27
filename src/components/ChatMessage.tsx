import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Copy, Check, Bot, User } from "lucide-react";
import { useState } from "react";
import type { Message } from "@/lib/ai-router";
import { MetricsBadge } from "./MetricsBadge";

export function ChatMessage({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-accent/15 text-foreground rounded-tr-sm"
              : "bg-card text-card-foreground border border-border rounded-tl-sm"
          }`}
        >
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none prose-headings:text-foreground prose-p:text-card-foreground prose-strong:text-foreground prose-code:text-primary prose-blockquote:border-primary/30 prose-blockquote:text-muted-foreground">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Copy button for assistant */}
        {!isUser && (
          <button
            onClick={handleCopy}
            className="self-start text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        )}

        {/* Metrics */}
        {message.metrics && <MetricsBadge metrics={message.metrics} />}
      </div>
    </motion.div>
  );
}
