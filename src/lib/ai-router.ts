export type ModelId =
  | "auto"
  | "llama-3.1-8b-instant"
  | "openai/gpt-oss-20b"
  | "llama-3.3-70b-versatile"
  | "openai/gpt-oss-120b";

export type Complexity = "simple" | "medium" | "complex";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metrics?: MessageMetrics;
}

export interface MessageMetrics {
  model: string;
  complexity: Complexity;
  latency: number;
  cost: number;
  efficiency: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export function classifyComplexity(query: string): Complexity {
  const lower = query.toLowerCase();
  if (/explain|why|how|design|compare|analyze|architect/.test(lower)) return "complex";
  if (query.split(/\s+/).length > 6) return "medium";
  return "simple";
}

const MODEL_MAP: Record<Complexity, ModelId> = {
  simple: "llama-3.1-8b-instant",
  medium: "openai/gpt-oss-20b",
  complex: "llama-3.3-70b-versatile",
};

const MODEL_COSTS: Record<string, number> = {
  "llama-3.1-8b-instant": 0.0002,
  "openai/gpt-oss-20b": 0.0008,
  "llama-3.3-70b-versatile": 0.0025,
  "openai/gpt-oss-120b": 0.006,
};

const MODEL_LATENCIES: Record<string, [number, number]> = {
  "llama-3.1-8b-instant": [120, 350],
  "openai/gpt-oss-20b": [300, 700],
  "llama-3.3-70b-versatile": [500, 1200],
  "openai/gpt-oss-120b": [800, 2000],
};

function randomBetween(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min));
}

const RESPONSES: Record<Complexity, string[]> = {
  simple: [
    "Here's a quick answer for you! The result is straightforward and efficient.",
    "Got it! This is a simple query — handled instantly with our fastest model.",
    "Done! Quick lookups like this are perfect for lightweight models.",
  ],
  medium: [
    "I've analyzed your query with moderate depth. Here's what I found:\n\n- The topic has several important aspects to consider\n- Each factor contributes to the overall understanding\n- A balanced approach is recommended\n\nLet me know if you'd like me to go deeper on any point.",
    "Here's a well-rounded response to your question:\n\n**Key Points:**\n1. Context matters significantly in this case\n2. There are multiple valid approaches\n3. The optimal solution depends on your specific constraints\n\nWould you like more detail on any of these?",
  ],
  complex: [
    "Great question! Let me break this down comprehensively:\n\n## Analysis\n\nThis is a multi-faceted topic that requires careful consideration.\n\n### Key Factors\n1. **Architecture** — The structural approach impacts scalability\n2. **Performance** — Trade-offs between speed and accuracy exist\n3. **Maintainability** — Long-term costs should be factored in\n\n### Recommendation\nBased on the analysis, I'd suggest a layered approach that balances all three factors. Start with a solid foundation, optimize for the critical path, and iterate.\n\n> *The best solution is often the simplest one that meets all requirements.*\n\nWant me to elaborate on any specific aspect?",
    "This requires a thorough analysis. Here's my deep dive:\n\n## Overview\n\nThe complexity here stems from interconnected systems that need to work in harmony.\n\n### Design Considerations\n- **Scalability**: Plan for 10x growth from day one\n- **Resilience**: Implement circuit breakers and fallbacks\n- **Observability**: You can't fix what you can't measure\n\n### Implementation Strategy\n```\nPhase 1: Core infrastructure\nPhase 2: Feature development\nPhase 3: Optimization & scaling\n```\n\nEach phase builds on the previous, ensuring a stable foundation before adding complexity.",
  ],
};

export function selectModel(query: string, selectedModel: ModelId): string {
  if (selectedModel !== "auto") return selectedModel;
  const complexity = classifyComplexity(query);
  return MODEL_MAP[complexity];
}

export function generateMetrics(model: string, complexity: Complexity): MessageMetrics {
  const [minLat, maxLat] = MODEL_LATENCIES[model] || [200, 800];
  const latency = randomBetween(minLat, maxLat);
  const cost = MODEL_COSTS[model] || 0.001;
  const efficiency = Math.round((1 - cost / 0.006) * 100);

  return { model, complexity, latency, cost, efficiency };
}

export function generateResponse(complexity: Complexity): string {
  const pool = RESPONSES[complexity];
  return pool[Math.floor(Math.random() * pool.length)];
}

export async function sendMessage(
  query: string,
  model: ModelId
): Promise<{ response: string; metrics: MessageMetrics }> {
  const complexity = classifyComplexity(query);
  const resolvedModel = selectModel(query, model);
  const metrics = generateMetrics(resolvedModel, complexity);

  // Simulate API latency
  await new Promise((r) => setTimeout(r, metrics.latency));

  return {
    response: generateResponse(complexity),
    metrics,
  };
}

export const AVAILABLE_MODELS: { id: ModelId; label: string; description: string }[] = [
  { id: "auto", label: "Auto", description: "Smart routing based on query" },
  { id: "llama-3.1-8b-instant", label: "Llama 3.1 8B", description: "Fast & lightweight" },
  { id: "openai/gpt-oss-20b", label: "GPT-OSS 20B", description: "Balanced performance" },
  { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B", description: "High capability" },
  { id: "openai/gpt-oss-120b", label: "GPT-OSS 120B", description: "Maximum intelligence" },
];

export const DUMMY_HISTORY: { id: string; title: string }[] = [
  { id: "1", title: "Explain microservices architecture" },
  { id: "2", title: "Quick math calculation" },
  { id: "3", title: "Design a REST API" },
  { id: "4", title: "What is Docker?" },
  { id: "5", title: "Compare SQL vs NoSQL" },
];
