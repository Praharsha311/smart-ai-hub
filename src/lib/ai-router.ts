export type ModelId =
  | "auto"
  | "llama-3.1-8b-instant"
  | "openai/gpt-oss-20b"
  | "llama-3.3-70b-versatile"
  | "openai/gpt-oss-120b";

export type Complexity =
  | "simple"
  | "moderate"
  | "advanced"
  | "complex"
  | "manual";

// ✅ MESSAGE TYPES
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metrics?: any;
  query?: string;
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

// ✅ BACKEND RESPONSE TYPE
export interface ApiResponse {
  answer: string;
  model: string;
  complexity: Complexity;
  latency: number;
  cost: number;
  efficiency: number;
}

// 🔥 API CALL (REAL BACKEND)
export async function sendMessage(
  query: string,
  model: string,
  useRag: boolean
) {
  const res = await fetch("http://127.0.0.1:8000/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      model,
      use_rag: useRag, // 🔥 THIS IS THE FIX
    }),
  });

  if (!res.ok) {
    throw new Error("API request failed");
  }

  return res.json();
}

// ✅ MODEL LIST
export const AVAILABLE_MODELS: {
  id: ModelId;
  label: string;
  description: string;
}[] = [
  { id: "auto", label: "Auto", description: "Smart routing" },
  { id: "llama-3.1-8b-instant", label: "8B Fast", description: "Cheap & fast" },
  { id: "openai/gpt-oss-20b", label: "20B Balanced", description: "Best tradeoff" },
  { id: "llama-3.3-70b-versatile", label: "70B Powerful", description: "High reasoning" },
  { id: "openai/gpt-oss-120b", label: "120B Premium", description: "Maximum intelligence" },
];

// ✅ DUMMY HISTORY
export const DUMMY_HISTORY: { id: string; title: string }[] = [
  { id: "1", title: "Explain microservices architecture" },
  { id: "2", title: "Quick math calculation" },
  { id: "3", title: "Design a REST API" },
  { id: "4", title: "What is Docker?" },
  { id: "5", title: "Compare SQL vs NoSQL" },
];

export async function sendFeedback(data: {
  query: string;
  model: string;
  complexity: string;
  feedback: "like" | "dislike";
  comment?: string;
}) {
  await fetch("http://127.0.0.1:8000/feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}