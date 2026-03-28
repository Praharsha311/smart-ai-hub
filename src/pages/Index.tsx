import { useState, useRef, useEffect, useCallback } from "react";
import { Menu, Zap, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { LoadingDots } from "@/components/LoadingDots";
import { sendMessage, type Message, type ModelId } from "@/lib/ai-router";

// 🔥 Firebase
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(scrollToBottom, [messages, loading, scrollToBottom]);

  // 🔥 LOAD FROM FIREBASE
  useEffect(() => {
    if (!selectedChatId) return;

    const q = query(
      collection(db, "conversations", selectedChatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          role: data.Role === "User" ? "user" : "assistant",
          content: data.Content,
          timestamp: data.createdAt?.toDate?.() || new Date(),

          // 🔥 IMPORTANT: LOAD METRICS
          query: data.query,
          metrics: data.model
            ? {
                model: data.model,
                complexity: data.complexity,
                latency: data.latency,
                cost: data.cost,
                efficiency: data.efficiency,
              }
            : undefined,
        };
      });

      setMessages(msgs as Message[]);
    });

    return () => unsubscribe();
  }, [selectedChatId]);

  // 🔥 SEND MESSAGE (RAG + FIREBASE + METRICS)
  const handleSend = async (
    content: string,
    model: ModelId,
    useRag: boolean
  ) => {
    if (!selectedChatId) {
      alert("Please create/select a chat first");
      return;
    }

    setLoading(true);

    try {
      const chatRef = doc(db, "conversations", selectedChatId);

      // ✅ SET TITLE (FIRST MESSAGE ONLY)
      const chatSnap = await getDoc(chatRef);
      const chatData = chatSnap.data();

      if (!chatData?.Title || chatData.Title === "New Chat") {
        await updateDoc(chatRef, {
          Title: content.split(" ").slice(0, 5).join(" "),
        });
      }

      // ✅ SAVE USER MESSAGE
      await addDoc(
        collection(db, "conversations", selectedChatId, "messages"),
        {
          Content: content,
          Role: "User",
          createdAt: serverTimestamp(),
        }
      );

      // 🤖 CALL AI (RAG untouched ✅)
      const res = await sendMessage(content, model, useRag);

      // ✅ SAVE AI RESPONSE + METRICS
      await addDoc(
        collection(db, "conversations", selectedChatId, "messages"),
        {
          Content: res.answer,
          Role: "AI",
          createdAt: serverTimestamp(),

          // 🔥 STORE EVERYTHING
          query: content,
          model: res.model,
          complexity: res.complexity,
          latency: res.latency,
          cost: res.cost,
          efficiency: res.efficiency,
          rag_used: useRag,
        }
      );

      // ✅ UPDATE SIDEBAR
      await updateDoc(chatRef, {
        lastMessage: content,
        lastUpdated: serverTimestamp(),
      });

    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 CREATE CHAT
  const handleNewChat = async () => {
    const docRef = await addDoc(collection(db, "conversations"), {
      Title: "New Chat",
      UserId: "test_user",
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
    });

    setSelectedChatId(docRef.id);
    setMessages([]);
  };

  const handleClearChat = () => setMessages([]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ChatSidebar
        onNewChat={handleNewChat}
        onClearChat={handleClearChat}
        onSelectChat={setSelectedChatId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">

        {/* HEADER */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/80 backdrop-blur-md">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <div>
                <h1 className="text-sm font-semibold">
                  OptiRoute AI
                </h1>
                <p className="text-xs text-muted-foreground">
                  Optimizing cost, speed & intelligence
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-sm"
          >
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </button>
        </header>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">
                  OptiRoute AI
                </h2>
                <p className="text-sm text-muted-foreground max-w-md">
                  Chat normally or upload documents for RAG-based answers.
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {loading && <LoadingDots />}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* INPUT */}
        <ChatInput onSend={handleSend} disabled={loading} />
      </div>
    </div>
  );
}
