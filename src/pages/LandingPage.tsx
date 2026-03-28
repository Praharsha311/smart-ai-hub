import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { Zap, Cpu, BarChart3, DollarSign } from "lucide-react";
// import AIRouter3D from "@/components/AIRouter3D";
import AIFlowVisualization from "@/components/AIFlowVisualization";

export default function LandingPage() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/analytics/summary")
      .then((res) => res.json())
      .then(setSummary)
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#020617] text-white overflow-hidden">

      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-purple-500/20 blur-[120px] top-[-200px] left-[-100px]" />
        <div className="absolute w-[500px] h-[500px] bg-green-500/20 blur-[120px] bottom-[-200px] right-[-100px]" />
      </div>

      {/* HERO */}
<section className="relative w-full px-6 md:px-12 lg:px-20 py-14 grid md:grid-cols-2 gap-10 items-center">

  {/* LEFT TEXT */}
  <div>
    <h1 className="text-6xl font-bold leading-tight mb-6">
      🚀 OptiRoute AI
    </h1>

    <p className="text-xl text-gray-400 mb-8">
      Intelligent AI routing that reduces cost, improves speed,
      and optimizes every query automatically.
    </p>

    <div className="flex gap-4">
      <button
        onClick={() => navigate("/chat")}
        className="px-8 py-4 bg-green-500 text-black rounded-xl font-semibold text-lg hover:bg-green-600 shadow-lg"
      >
        Chat
      </button>

      <button
        onClick={() => navigate("/dashboard")}
        className="px-8 py-4 border border-white/20 rounded-xl text-lg hover:bg-white/10"
      >
        Dashboard
      </button>
    </div>
  </div>

  {/* RIGHT 3D */}
<div className="flex flex-col items-center">

  {/* 3D BOX */}
  <div className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
  <AIFlowVisualization />
</div>

  {/* 🔥 LABELS (ADD HERE) */}
  {/* <div className="flex justify-center gap-6 text-sm mt-4 text-gray-400">
    <span>🟡 Local Compute</span>
    <span>🔴 RAG</span>
    <span>🔵 LLM</span>
  </div> */}

</div>

</section>
      {/* PROBLEM + SOLUTION */}
      <section className="w-full px-6 md:px-12 lg:px-20 py-12 grid md:grid-cols-2 gap-6">

        <GlassCard title="💸 The Problem">
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>• Every query hits expensive LLMs</li>
            <li>• No cost-awareness</li>
            <li>• High latency</li>
            <li>• No optimization layer</li>
          </ul>
        </GlassCard>

        <GlassCard title="⚡ Our Solution">
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>• Smart model routing</li>
            <li>• Local compute (zero cost)</li>
            <li>• RAG for context</li>
            <li>• Real-time analytics</li>
          </ul>
        </GlassCard>

      </section>

      {/* COST COMPARISON */}
      {summary && (
        <section className="w-full px-6 md:px-12 lg:px-20 py-12">

          <h2 className="text-2xl font-semibold mb-6">💰 Cost Comparison</h2>

          <div className="grid md:grid-cols-2 gap-6">

            <motion.div whileHover={{ scale: 1.03 }}
              className="p-6 rounded-xl bg-red-500/10 border border-red-500/30 backdrop-blur-lg">
              <p className="text-red-400">Without OptiRoute</p>
              <p className="text-3xl mt-2 font-bold">${summary.baseline_cost}</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }}
              className="p-6 rounded-xl bg-green-500/10 border border-green-500/30 backdrop-blur-lg">
              <p className="text-green-400">With OptiRoute</p>
              <p className="text-3xl mt-2 font-bold">${summary.total_cost}</p>
            </motion.div>

          </div>
        </section>
      )}

      {/* FEATURES */}
      <section className="w-full px-6 md:px-12 lg:px-20 py-12 grid md:grid-cols-4 gap-4">
        <Feature icon={<Zap />} title="Smart Routing" />
        <Feature icon={<Cpu />} title="Local Compute" />
        <Feature icon={<BarChart3 />} title="Analytics" />
        <Feature icon={<DollarSign />} title="Cost Saving" />
      </section>

      {/* HOW IT WORKS */}
      {/* <section className="w-full px-6 md:px-12 lg:px-20 py-12 text-center">
        <h2 className="text-2xl font-semibold mb-6">🔄 How It Works</h2>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
          <Step text="User Query" />
          <Step text="Analyze" />
          <Step text="Route" />
          <Step text="Optimized Response" />
        </div>
      </section> */}

      {/* CTA */}
      {/* <section className="w-full px-6 md:px-12 lg:px-20 py-16 text-center">
        <h2 className="text-3xl font-semibold mb-4">
          Start Saving AI Costs Today
        </h2>

        <button
          onClick={() => navigate("/chat")}
          className="px-10 py-4 bg-green-500 text-black rounded-xl font-semibold hover:bg-green-600 shadow-lg"
        >
          Launch Demo →
        </button>
      </section> */}

    </div>
  );
}

/* COMPONENTS */

function GlassCard({ title, children }: any) {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-xl">
      <h3 className="font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}

function Metric({ label, children }: any) {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-4 rounded-lg">
      <p className="text-xl font-bold text-green-400">{children}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}

function Feature({ icon, title }: any) {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-4 rounded-lg text-center">
      <div className="mb-2 text-primary">{icon}</div>
      <p className="text-sm">{title}</p>
    </div>
  );
}

function Step({ text }: any) {
  return (
    <div className="px-4 py-2 border border-white/10 rounded-lg bg-white/5">
      {text}
    </div>
  );
}
