import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AIFlowVisualization() {
  const [step, setStep] = useState(0);

  const steps = [
    "User Query: HTML vs React",
    "Analyzing Query...",
    "Detected: MODERATE",
    "Routing → GPT-OSS-20B",
    "Response Generated (balanced, low cost)",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length);
    }, 1400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-4 py-6">

      {steps.map((text, i) => (
        <div key={i} className="flex flex-col items-center">

          {/* BOX */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{
              opacity: i <= step ? 1 : 0.3,
              scale: i === step ? 1.08 : 1,
            }}
            className={`px-6 py-3 rounded-xl border transition-all ${
              i <= step
                ? "bg-green-500/10 border-green-500/30"
                : "bg-white/5 border-white/10"
            }`}
          >
            {text}
          </motion.div>

          {/* 🔥 ARROW (only between steps) */}
          {i < steps.length - 1 && (
            <motion.div
              animate={{ opacity: i < step ? 1 : 0.2 }}
              className="text-gray-500 text-lg mt-2"
            >
              ↓
            </motion.div>
          )}

        </div>
      ))}

    </div>
  );
}