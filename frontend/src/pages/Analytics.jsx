import React from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Activity, Users, MessageSquare, LifeBuoy, Brain, FileText } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";
import { useLemma } from "../context/LemmaContext";
import { Card, SectionHead, pageFade } from "../components/ui/index.jsx";

const COLORS = ["#F5C542", "#61C26A", "#5A8DEE", "#E35D5B", "#F4A940"];

export function AnalyticsPage() {
  const { data } = useLemma();

  const barData = [
    { dept: "Eng",   issues: data.issues.length,             resolved: Math.floor(data.issues.length * 0.6) },
    { dept: "Comms", issues: data.communityMessages.length,  resolved: Math.floor(data.communityMessages.length * 0.8) },
    { dept: "Support",issues: data.supportTickets.length,   resolved: Math.floor(data.supportTickets.length * 0.9) },
    { dept: "Docs",  issues: data.docs.length,              resolved: data.docs.filter(d => d.status === "published" || d.data?.status === "published").length },
    { dept: "KB",    issues: data.knowledgeArticles.length, resolved: data.knowledgeArticles.length },
  ];

  const pieData = [
    { name: "Issues",    value: Math.max(1, data.issues.length)            },
    { name: "Tickets",   value: Math.max(1, data.supportTickets.length)    },
    { name: "Messages",  value: Math.max(1, data.communityMessages.length) },
    { name: "Docs",      value: Math.max(1, data.docs.length)              },
    { name: "KB",        value: Math.max(1, data.knowledgeArticles.length) },
  ];

  const lineData = [
    { day: "Mon", runs: 8  }, { day: "Tue", runs: 12 }, { day: "Wed", runs: 10 },
    { day: "Thu", runs: 19 }, { day: "Fri", runs: 15 }, { day: "Sat", runs: 7  },
    { day: "Sun", runs: 9  },
  ];

  const tooltipStyle = {
    border: "2px solid #1F1F1F", borderRadius: 12, fontFamily: "Inter",
    fontWeight: 600, fontSize: 12
  };

  return (
    <motion.div {...pageFade} className="flex flex-col gap-8">
      <SectionHead
        title="Analytics"
        subtitle="Aggregated metrics across all AI departments and agent runs."
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Community",  val: data.communityMessages.length,  icon: MessageSquare, color: "#E8F9E8" },
          { label: "Support",    val: data.supportTickets.length,     icon: LifeBuoy,      color: "#FDECEA" },
          { label: "Issues",     val: data.issues.length,             icon: Activity,      color: "#E8F0FF" },
          { label: "Docs",       val: data.docs.length,               icon: FileText,      color: "#FFF5CC" },
          { label: "KB Articles",val: data.knowledgeArticles.length,  icon: Brain,         color: "#FFF3E0" },
          { label: "Agent Runs", val: data.agentRuns.length,          icon: TrendingUp,    color: "#FFF7E8" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="nb-card p-4 text-center" style={{ background: s.color }}>
              <Icon size={18} className="mx-auto mb-1.5"/>
              <div className="font-extrabold text-[28px] leading-none">{s.val}</div>
              <div className="text-[10px] font-bold text-[#7B7B7B] uppercase tracking-wide mt-1">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-extrabold text-[16px] mb-5">Department Output</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E0CC"/>
              <XAxis dataKey="dept" tick={{ fontFamily: "Inter", fontWeight: 600, fontSize: 11 }}/>
              <YAxis tick={{ fontFamily: "Inter", fontWeight: 600, fontSize: 11 }}/>
              <Tooltip contentStyle={tooltipStyle}/>
              <Legend wrapperStyle={{ fontFamily: "Inter", fontWeight: 600, fontSize: 12 }}/>
              <Bar dataKey="issues"   fill="#F5C542" radius={[4,4,0,0]} name="Total"/>
              <Bar dataKey="resolved" fill="#61C26A" radius={[4,4,0,0]} name="Resolved"/>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="font-extrabold text-[16px] mb-5">Agent Runs — 7 Days</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E0CC"/>
              <XAxis dataKey="day" tick={{ fontFamily: "Inter", fontWeight: 600, fontSize: 11 }}/>
              <YAxis tick={{ fontFamily: "Inter", fontWeight: 600, fontSize: 11 }}/>
              <Tooltip contentStyle={tooltipStyle}/>
              <Line type="monotone" dataKey="runs" stroke="#1F1F1F" strokeWidth={3}
                dot={{ r: 4, fill: "#F5C542", stroke: "#1F1F1F", strokeWidth: 2 }}/>
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Pie + breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 flex flex-col items-center">
          <h3 className="font-extrabold text-[16px] mb-5 self-start">Data Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                dataKey="value" nameKey="name" paddingAngle={3}
                label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                labelLine={false}
              >
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle}/>
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="font-extrabold text-[16px] mb-5">Health Summary</h3>
          <div className="flex flex-col gap-4">
            {[
              { label: "Engineering Health",   val: 98,  color: "#61C26A" },
              { label: "Support Resolution",   val: 100, color: "#61C26A" },
              { label: "Community Coverage",   val: 95,  color: "#F5C542" },
              { label: "Knowledge Coverage",   val: 94,  color: "#F5C542" },
              { label: "Documentation Coverage",val: 80, color: "#F4A940" },
            ].map(h => (
              <div key={h.label}>
                <div className="flex justify-between text-[13px] font-semibold mb-1.5">
                  <span>{h.label}</span>
                  <span className="font-extrabold">{h.val}%</span>
                </div>
                <div className="nb-progress-track">
                  <motion.div
                    className="nb-progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${h.val}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{ background: h.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
