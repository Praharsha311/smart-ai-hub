// import { useEffect, useState } from "react";
// import CountUp from "react-countup";
// import {
//   PieChart, Pie, Cell,
//   BarChart, Bar, XAxis, YAxis, Tooltip,
//   ResponsiveContainer,
//   RadialBarChart, RadialBar
// } from "recharts";

// const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

// export default function Dashboard() {
//   const [summary, setSummary] = useState<any>(null);
//   const [modelUsage, setModelUsage] = useState([]);
//   const [feedback, setFeedback] = useState<any>(null);
//   const [complexity, setComplexity] = useState([]);

//   useEffect(() => {
//     fetch("http://127.0.0.1:8000/analytics/summary")
//       .then(res => res.json())
//       .then(setSummary);

//     fetch("http://127.0.0.1:8000/analytics/model-usage")
//       .then(res => res.json())
//       .then(setModelUsage);

//     fetch("http://127.0.0.1:8000/analytics/feedback")
//       .then(res => res.json())
//       .then(setFeedback);

//     fetch("http://127.0.0.1:8000/analytics/complexity")
//       .then(res => res.json())
//       .then(setComplexity);
//   }, []);

//   if (!summary) return <div className="p-10 text-white">Loading...</div>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white p-6">
      
//       <h1 className="text-3xl font-bold mb-8">🚀 AI Router Analytics</h1>

//       {/* 🔥 TOP SECTION */}
//       <div className="grid md:grid-cols-2 gap-6 mb-8">

//         {/* 💰 SAVINGS RADIAL */}
//         <GlassCard>
//           <h2 className="mb-4">💰 Cost Savings</h2>
//           <div className="flex justify-center items-center relative">
//             <RadialBarChart
//               width={250}
//               height={250}
//               innerRadius="70%"
//               outerRadius="100%"
//               data={[{ name: "Savings", value: summary.saved_percent }]}
//             >
//               <RadialBar dataKey="value" fill="#22c55e" />
//             </RadialBarChart>

//             <div className="absolute text-center">
//               <p className="text-2xl font-bold text-green-400">
//                 <CountUp end={summary.saved_percent} duration={2} />%
//               </p>
//               <p className="text-sm text-gray-300">Saved</p>
//             </div>
//           </div>
//         </GlassCard>

//         {/* ⚡ KPI CARDS */}
//         <div className="grid grid-cols-2 gap-4">
//           <KpiCard title="Queries" value={summary.total_queries} color="blue" />
//           <KpiCard title="Cost" value={`$${summary.total_cost}`} color="yellow" />
//           <KpiCard title="Saved $" value={`$${summary.saved}`} color="red" />
//           <KpiCard title="Efficiency" value={`${summary.saved_percent}%`} color="green" />
//         </div>
//       </div>

//       {/* 📊 MIDDLE SECTION */}
//       <div className="grid md:grid-cols-2 gap-6 mb-8">

//         {/* 🤖 MODEL USAGE DONUT */}
//         <GlassCard>
//           <h2 className="mb-4">🤖 Model Usage</h2>
//           <div className="relative flex justify-center">
//             <ResponsiveContainer width="100%" height={250}>
//               <PieChart>
//                 <Pie
//                   data={modelUsage}
//                   dataKey="count"
//                   innerRadius={70}
//                   outerRadius={100}
//                 >
//                   {modelUsage.map((_, i) => (
//                     <Cell key={i} fill={COLORS[i % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>

//             <div className="absolute top-1/2 -translate-y-1/2 text-center">
//               <p className="text-lg font-semibold">Models</p>
//             </div>
//           </div>
//         </GlassCard>

//         {/* 🧠 COMPLEXITY (HORIZONTAL BAR) */}
//         <GlassCard>
//           <h2 className="mb-4">🧠 Complexity</h2>
//           <ResponsiveContainer width="100%" height={250}>
//             <BarChart layout="vertical" data={complexity}>
//               <XAxis type="number" stroke="#ccc" />
//               <YAxis dataKey="complexity" type="category" stroke="#ccc" />
//               <Tooltip />
//               <Bar dataKey="count" fill="#6366f1" radius={[10, 10, 10, 10]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </GlassCard>

//       </div>

//       {/* 📊 BOTTOM SECTION */}
//       <div className="grid md:grid-cols-2 gap-6">

//         {/* 💰 COST COMPARISON */}
//         <GlassCard>
//           <h2 className="mb-4">💰 Cost Comparison</h2>
//           <ResponsiveContainer width="100%" height={250}>
//             <BarChart
//               data={[
//                 { name: "Without Router", cost: summary.baseline_cost },
//                 { name: "With Router", cost: summary.total_cost }
//               ]}
//             >
//               <XAxis dataKey="name" stroke="#ccc" />
//               <YAxis stroke="#ccc" />
//               <Tooltip />
//               <Bar dataKey="cost" fill="#22c55e" radius={[10, 10, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </GlassCard>

//         {/* 👍 FEEDBACK GAUGE */}
//         <GlassCard>
//           <h2 className="mb-4">👍 User Satisfaction</h2>
//           <div className="flex justify-center relative">
//             <RadialBarChart
//               width={250}
//               height={200}
//               innerRadius="60%"
//               outerRadius="100%"
//               startAngle={180}
//               endAngle={0}
//               data={[{ value: feedback?.like || 0 }]}
//             >
//               <RadialBar dataKey="value" fill="#22c55e" />
//             </RadialBarChart>

//             <div className="absolute bottom-0 text-center">
//               <p className="text-xl font-bold text-green-400">
//                 {feedback?.like || 0} 👍
//               </p>
//             </div>
//           </div>
//         </GlassCard>

//       </div>

//       {/* 🚀 INSIGHT CARD */}
//       <div className="mt-8">
//         <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-xl shadow-lg text-black">
//           <h2 className="text-xl font-bold mb-2">🚀 Smart Insight</h2>
//           <p>
//             Your AI Router reduced cost by <b>{summary.saved_percent}%</b> and
//             optimized model usage dynamically based on query complexity and user feedback.
//           </p>
//         </div>
//       </div>

//     </div>
//   );
// }

// /* 🔥 COMPONENTS */

// function GlassCard({ children }: any) {
//   return (
//     <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl p-4 shadow-lg">
//       {children}
//     </div>
//   );
// }

// function KpiCard({ title, value, color }: any) {
//   const colors: any = {
//     green: "text-green-400",
//     blue: "text-blue-400",
//     yellow: "text-yellow-400",
//     red: "text-red-400"
//   };

//   return (
//     <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
//       <p className="text-sm text-gray-300">{title}</p>
//       <p className={`text-xl font-bold ${colors[color]}`}>
//         {value}
//       </p>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer,
  RadialBarChart, RadialBar
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [modelUsage, setModelUsage] = useState([]);
  const [feedback, setFeedback] = useState<any>(null);
  const [complexity, setComplexity] = useState([]);
  const [performance, setPerformance] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/analytics/summary").then(r => r.json()).then(setSummary);
    fetch("http://127.0.0.1:8000/analytics/model-usage").then(r => r.json()).then(setModelUsage);
    fetch("http://127.0.0.1:8000/analytics/feedback").then(r => r.json()).then(setFeedback);
    fetch("http://127.0.0.1:8000/analytics/complexity").then(r => r.json()).then(setComplexity);
  }, []);

  if (!summary) return <div className="p-10 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617] text-white p-6">

      <h1 className="text-3xl font-bold mb-6">🚀 OptiRoute AI Intelligent Dashboard</h1>

      {/* 🔝 TOP SECTION */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* 💰 COST SAVINGS RADIAL */}
        <GlassCard>
          <h2>💰 Cost Optimization</h2>
          <div className="flex justify-center relative">
            <RadialBarChart width={220} height={220} innerRadius="70%" outerRadius="100%"
              data={[{ value: summary.saved_percent }]}>
              <RadialBar dataKey="value" fill="#22c55e" />
            </RadialBarChart>

            <div className="absolute text-center top-1/2 -translate-y-1/2">
              <p className="text-2xl font-bold text-green-400">
                <CountUp end={summary.saved_percent} duration={2} />%
              </p>
              <p className="text-sm">Saved</p>
            </div>
          </div>
        </GlassCard>

        {/* 🤖 MODEL USAGE */}
        <GlassCard>
  <h2 className="mb-4">🤖 Model Distribution</h2>

  <div className="relative">

    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={modelUsage}
          dataKey="count"
          nameKey="model"
          innerRadius={70}
          outerRadius={100}
          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
        >
          {modelUsage.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip
          formatter={(value: any, name: any) => [`${value} queries`, name]}
        />
      </PieChart>
    </ResponsiveContainer>

    {/* 🔥 CENTER TEXT */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
      <p className="text-lg font-bold">Models</p>
      <p className="text-xs text-gray-400">Usage Split</p>
    </div>
  </div>

  {/* 🔥 LEGEND */}
  <div className="mt-4 space-y-2">
    {modelUsage.map((m: any, i) => (
      <div key={i} className="flex justify-between text-sm">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: COLORS[i % COLORS.length] }}
          />
          {m.model}
        </div>
        <span>{m.count}</span>
      </div>
    ))}
  </div>

</GlassCard>

        {/* ⚡ KPI CARDS */}
        <GlassCard>
          <h2>⚡ Performance</h2>
          <div className="space-y-3 mt-4">
            <Stat label="Queries" value={summary.total_queries} />
            <Stat label="Cost" value={`$${summary.total_cost}`} />
            <Stat label="Saved $" value={`$${summary.saved}`} />
            <Stat label="Efficiency" value={`${summary.saved_percent}%`} />
          </div>
        </GlassCard>

      </div>

      {/* 🧠 MIDDLE SECTION */}
      <div className="grid lg:grid-cols-2 gap-6 mt-6">

        {/* 🧠 COMPLEXITY */}
        <GlassCard>
          <h2>🧠 Query Complexity</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart layout="vertical" data={complexity}>
              <XAxis type="number" stroke="#ccc" />
              <YAxis dataKey="complexity" type="category" stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[10,10,10,10]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* 💰 COST COMPARISON */}
        <GlassCard>
          <h2>💰 Cost Comparison</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[
              { name: "Without Router", cost: summary.baseline_cost },
              { name: "With Router", cost: summary.total_cost }
            ]}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="cost" fill="#22c55e" radius={[10,10,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

      </div>

      {/* 🔥 PERFORMANCE MATRIX */}
      <div className="mt-6">
        <GlassCard>
          <h2 className="mb-4">🧠 Model Performance Matrix</h2>

          <div className="grid md:grid-cols-4 gap-4">

            <PerfCard model="8B" cost="Low 💰" speed="Fast ⚡" efficiency="95%" color="green" />
            <PerfCard model="20B" cost="Medium 💰" speed="Balanced ⚡" efficiency="90%" color="blue" />
            <PerfCard model="70B" cost="High 💰" speed="Slow 🐢" efficiency="85%" color="yellow" />
            <PerfCard model="120B" cost="Very High 💰" speed="Very Slow 🐢" efficiency="80%" color="red" />

          </div>
        </GlassCard>
      </div>

      {/* 🔻 BOTTOM SECTION */}
      <div className="grid lg:grid-cols-2 gap-6 mt-6">

<GlassCard>
  <h2>🏆 Routing Performance</h2>

  <div className="mt-4 space-y-3 text-lg">

    <div className="flex justify-between text-green-400">
      <span>👍 Rewards</span>
      <span>+{feedback?.like || 0}</span>
    </div>

    <div className="flex justify-between text-red-400">
      <span>👎 Penalties</span>
      <span>-{feedback?.dislike || 0}</span>
    </div>

    <div className="flex justify-between font-bold text-blue-400 border-t pt-2">
      <span>📈 Net Score</span>
      <span>
        {(feedback?.like || 0) - (feedback?.dislike || 0)}
      </span>
    </div>

  </div>
</GlassCard>

        {/* 🚀 INSIGHT */}
        <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-xl text-black shadow-lg">
          <h2 className="text-xl font-bold mb-2">🚀 System Insight</h2>
          <p>
            Your AI Router reduced cost by <b>{summary.saved_percent}%</b> while dynamically
            selecting optimal models using intelligent routing and user feedback.
          </p>
        </div>

      </div>

    </div>
  );
}

/* 🔥 COMPONENTS */

function GlassCard({ children }: any) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl p-5 shadow-lg">
      {children}
    </div>
  );
}

function Stat({ label, value }: any) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-400">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function PerfCard({ model, cost, speed, efficiency, color }: any) {
  const colors: any = {
    green: "border-green-400 text-green-400",
    blue: "border-blue-400 text-blue-400",
    yellow: "border-yellow-400 text-yellow-400",
    red: "border-red-400 text-red-400",
  };

  return (
    <div className={`p-4 border rounded-xl bg-white/5 backdrop-blur-md ${colors[color]}`}>
      <h3 className="text-lg font-bold mb-2">{model}</h3>
      <p>💰 {cost}</p>
      <p>⚡ {speed}</p>
      <p className="mt-2 font-semibold">Efficiency: {efficiency}</p>
    </div>
  );
}