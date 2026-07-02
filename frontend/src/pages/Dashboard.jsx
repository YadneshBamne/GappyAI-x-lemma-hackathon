import React from "react";
import { motion } from "framer-motion";
import {
  Activity, CheckSquare, AlertTriangle, LifeBuoy,
  TrendingUp, Layers, Users, Terminal, Brain,
  FileText, Map, Zap, Clock, BarChart3
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { useLemma, f } from "../context/LemmaContext";
import { StatCard, Card, Badge, statusBadge, SectionHead, ProgressBar, pageFade, EmptyState } from "../components/ui/index.jsx";

const AGENTS = [
  { name: "Orchestrator",   role: "Operations",   color: "#FFF5CC", icon: Layers   },
  { name: "Engineering",    role: "Git / Linear", color: "#E8F0FF", icon: Terminal },
  { name: "Product",        role: "Roadmap",      color: "#E8F9E8", icon: Map      },
  { name: "Community",      role: "Discord",      color: "#FFF3E0", icon: Users    },
  { name: "Support",        role: "Gmail Triage", color: "#FDECEA", icon: LifeBuoy },
  { name: "Knowledge",      role: "RAG / Vector", color: "#E8F0FF", icon: Brain    },
  { name: "Documentation",  role: "Guide Audit",  color: "#FFF5CC", icon: FileText },
  { name: "Release",        role: "Deploy",       color: "#FFF3E0", icon: Layers   },
  { name: "Analytics",      role: "Telemetry",    color: "#E8F9E8", icon: BarChart3},
];

const DEPT = [
  { name: "Engineering",   role: "Linear + Git Sync",   health: 98, status: "active",     icon: Terminal, color: "#E8F0FF" },
  { name: "Support",       role: "Gmail Auto-triage",   health: 100,status: "active",     icon: LifeBuoy, color: "#FDECEA" },
  { name: "Community",     role: "Discord Monitor",     health: 95, status: "listening",  icon: Users,    color: "#E8F9E8" },
  { name: "Documentation", role: "Knowledge RAG Sync",  health: 100,status: "up-to-date", icon: FileText, color: "#FFF5CC" },
];

const mockActivity = [
  { time: "Jan", events: 12 }, { time: "Feb", events: 19 }, { time: "Mar", events: 14 },
  { time: "Apr", events: 28 }, { time: "May", events: 35 }, { time: "Jun", events: 42 },
];

export function DashboardPage() {
  const { data } = useLemma();
  const pending = data.approvals.filter(a => f(a,"approval_status") === "pending").length;

  return (
    <motion.div {...pageFade} className="flex flex-col gap-8">
      <SectionHead
        title="BuilderOS — AI Operating System"
        subtitle="All departments operational. Agents standing by."
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <StatCard label="System Health"   value="98%"                   icon={Activity}     accent="green"  trend={2}  />
        <StatCard label="Pending Actions" value={pending}               icon={CheckSquare}  accent="yellow" />
        <StatCard label="Open Issues"     value={data.issues.length}    icon={AlertTriangle} accent="orange" />
        <StatCard label="Support Tickets" value={data.supportTickets.length} icon={LifeBuoy} accent="red"   />
      </div>

      {/* Chart + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h3 className="font-extrabold text-[18px] mb-5">AI Event Activity</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={mockActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E0CC"/>
                <XAxis dataKey="time" tick={{ fontFamily: "Inter", fontWeight: 600, fontSize: 12 }}/>
                <YAxis tick={{ fontFamily: "Inter", fontWeight: 600, fontSize: 12 }}/>
                <Tooltip contentStyle={{ border: "2px solid #1F1F1F", borderRadius: 10, fontFamily: "Inter", fontWeight: 600 }}/>
                <Area type="monotone" dataKey="events" stroke="#F5C542" strokeWidth={3} fill="#FFF5CC"/>
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Live Activity */}
        <Card className="p-6">
          <h3 className="font-extrabold text-[18px] mb-5">Live Activity</h3>
          <div className="flex flex-col gap-0 overflow-y-auto max-h-[220px]">
            {data.agentRuns.length === 0
              ? <EmptyState icon={Activity} title="No events logged" description="Seed workspace to start."/>
              : data.agentRuns.map((run, i) => (
                <div key={run.id || i} className="flex gap-3 items-start relative pb-4 last:pb-0">
                  {i < data.agentRuns.length - 1 && <div className="nb-timeline-line"/>}
                  <div className="nb-timeline-dot flex-shrink-0"/>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[13px] text-[#1A1A1A] truncate">{f(run,"agent_name")}</div>
                    <div className="mt-1">{statusBadge(f(run,"status"))}</div>
                  </div>
                </div>
              ))
            }
          </div>
        </Card>
      </div>

      {/* Departments */}
      <div>
        <h2 className="font-extrabold text-[22px] mb-5">Department Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {DEPT.map(d => {
            const Icon = d.icon;
            return (
              <Card key={d.name} className="p-5 nb-card-interactive" interactive>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl"
                    style={{ background: d.color, border: "2px solid #1F1F1F" }}>
                    <Icon size={18}/>
                  </div>
                  {statusBadge(d.status)}
                </div>
                <div className="font-bold text-[15px] mb-0.5">{d.name}</div>
                <div className="text-[12px] text-[#7B7B7B] font-medium mb-3">{d.role}</div>
                <ProgressBar value={d.health} color={d.health >= 99 ? "#61C26A" : "#F5C542"}/>
                <div className="text-[11px] font-bold text-[#555] mt-1.5">Health: {d.health}%</div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Agent Fleet */}
      <div>
        <h2 className="font-extrabold text-[22px] mb-5">AI Agent Fleet</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
          {AGENTS.map(a => {
            const Icon = a.icon;
            return (
              <Card key={a.name} className="p-4 text-center nb-card-interactive" interactive>
                <div className="w-9 h-9 flex items-center justify-center rounded-xl mx-auto mb-2"
                  style={{ background: a.color, border: "2px solid #1F1F1F" }}>
                  <Icon size={16}/>
                </div>
                <div className="font-bold text-[12px] leading-tight">{a.name}</div>
                <div className="text-[10px] text-[#7B7B7B] font-medium mt-0.5">{a.role}</div>
                <div className="nb-badge nb-badge-success mt-2 !text-[9px] mx-auto w-fit">Idle</div>
              </Card>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
