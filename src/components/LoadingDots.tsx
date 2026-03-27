import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export function LoadingDots() {
  return (
    <div className="flex gap-3">
      <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-primary/15 text-primary">
        <Bot className="w-4 h-4" />
      </div>
      <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-primary/60"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}
