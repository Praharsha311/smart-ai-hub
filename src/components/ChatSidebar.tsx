import { Plus, MessageSquare, Trash2, Zap } from "lucide-react";
import { DUMMY_HISTORY } from "@/lib/ai-router";
import { Button } from "@/components/ui/button";

interface ChatSidebarProps {
  onNewChat: () => void;
  onClearChat: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ChatSidebar({ onNewChat, onClearChat, isOpen, onClose }: ChatSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          w-72 flex flex-col
          bg-sidebar border-r border-sidebar-border
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 py-5 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <span className="text-lg font-semibold text-sidebar-accent-foreground tracking-tight">
            AI Router
          </span>
        </div>

        {/* New Chat */}
        <div className="px-3 py-3">
          <Button
            onClick={() => { onNewChat(); onClose(); }}
            className="w-full justify-start gap-2 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
            variant="ghost"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        </div>

        {/* History */}
        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground px-2 py-2">
            Recent
          </p>
          {DUMMY_HISTORY.map((item) => (
            <button
              key={item.id}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-left truncate"
            >
              <MessageSquare className="w-4 h-4 shrink-0 opacity-50" />
              <span className="truncate">{item.title}</span>
            </button>
          ))}
        </div>

        {/* Clear */}
        <div className="px-3 py-3 border-t border-sidebar-border">
          <Button
            onClick={onClearChat}
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
            Clear Chat
          </Button>
        </div>
      </aside>
    </>
  );
}
