import { Bot, BarChart3, Zap, DollarSign, Gauge } from "lucide-react";
import type { MessageMetrics, Complexity } from "@/lib/ai-router";

const COMPLEXITY_CONFIG: Record<Complexity, { label: string; color: string; dot: string }> = {
  simple: { label: "Simple", color: "text-complexity-simple", dot: "🟢" },
  medium: { label: "Medium", color: "text-complexity-medium", dot: "🟡" },
  complex: { label: "Complex", color: "text-complexity-complex", dot: "🔴" },
};

export function MetricsBadge({ metrics }: { metrics: MessageMetrics }) {
  const cx = COMPLEXITY_CONFIG[metrics.complexity];

  return (
    <div className="flex flex-wrap gap-2 text-xs">
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-muted-foreground">
        <Bot className="w-3 h-3" />
        {metrics.model}
      </span>
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted ${cx.color}`}>
        <BarChart3 className="w-3 h-3" />
        {cx.dot} {cx.label}
      </span>
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-muted-foreground">
        <Zap className="w-3 h-3" />
        {metrics.latency}ms
      </span>
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-muted-foreground">
        <DollarSign className="w-3 h-3" />
        ${metrics.cost.toFixed(4)}
      </span>
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary">
        <Gauge className="w-3 h-3" />
        {metrics.efficiency}%
      </span>
    </div>
  );
}
