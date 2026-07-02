import React from "react";
import { motion } from "framer-motion";
import { LifeBuoy, Mail, Clock, TrendingDown, CheckCircle2, AlertCircle } from "lucide-react";
import { useLemma, f } from "../context/LemmaContext";
import { Card, SectionHead, EmptyState, statusBadge, priorityBadge, pageFade } from "../components/ui/index.jsx";

export function SupportPage() {
  const { data } = useLemma();
  const tickets = data.supportTickets;

  const resolved = tickets.filter(t => ["resolved","completed"].includes((f(t,"status")||"").toLowerCase())).length;
  const rate = tickets.length ? Math.round((resolved / tickets.length) * 100) : 100;

  return (
    <motion.div {...pageFade} className="flex flex-col gap-8">
      <SectionHead
        title="Support Queue"
        subtitle="Gmail tickets auto-triaged and responded to by the Support Agent."
      />

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Tickets",    val: tickets.length,  icon: LifeBuoy, color: "#FFF7E8" },
          { label: "Resolution Rate",  val: `${rate}%`,      icon: CheckCircle2, color: "#E8F9E8" },
          { label: "Open / New",       val: tickets.filter(t => f(t,"status") === "new").length, icon: AlertCircle, color: "#FDECEA" },
          { label: "High Priority",    val: tickets.filter(t => ["high","critical"].includes(f(t,"priority")||"")).length, icon: TrendingDown, color: "#FFF3E0" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="nb-card p-5" style={{ background: s.color }}>
              <div className="flex items-center justify-between mb-2">
                <span className="nb-label mb-0">{s.label}</span>
                <Icon size={16}/>
              </div>
              <div className="font-extrabold text-[32px] leading-none">{s.val}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket list */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-extrabold text-[18px]">Gmail Inbox</h3>
              <div className="nb-badge nb-badge-info flex items-center gap-1.5">
                <Mail size={10}/> Auto-triage On
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {tickets.length === 0
                ? <EmptyState icon={LifeBuoy} title="No support tickets" description="Connect Gmail and seed the workspace."/>
                : tickets.map(tkt => (
                  <div key={tkt.id}
                    className="rounded-[14px] p-4 border-2 border-[#1F1F1F] hover:bg-[#FFF7E8] transition-colors"
                    style={{ background: "#FAFAFA" }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <span className="font-bold text-[14px]">{f(tkt,"subject")}</span>
                      <div className="flex gap-2 flex-wrap">
                        {priorityBadge(f(tkt,"priority"))}
                        {statusBadge(f(tkt,"status"))}
                      </div>
                    </div>
                    <p className="text-[13px] text-[#555] font-medium leading-relaxed">{f(tkt,"description")}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="text-[11px] font-bold text-[#7B7B7B]">From: {f(tkt,"customer_email")}</div>
                      {f(tkt,"assigned_agent_name") && (
                        <div className="text-[11px] font-bold text-[#7B7B7B]">Agent: {f(tkt,"assigned_agent_name")}</div>
                      )}
                    </div>
                  </div>
                ))
              }
            </div>
          </Card>
        </div>

        {/* Stats panel */}
        <div className="flex flex-col gap-4">
          <Card className="p-5" accent="green">
            <div className="font-extrabold text-[40px] leading-none mb-1">{rate}%</div>
            <div className="font-bold text-[13px] uppercase tracking-wide mb-1">Resolution Rate</div>
            <p className="text-[13px] text-[#555] font-medium">All support queries actioned within SLA windows.</p>
          </Card>

          <Card className="p-5">
            <h4 className="font-bold text-[14px] mb-3">Response Time</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "First Response", val: "< 5 min",  good: true },
                { label: "Resolution",     val: "< 24 hrs", good: true },
                { label: "CSAT Score",     val: "4.8 / 5",  good: true },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid #E8E0CC" }}>
                  <span className="text-[13px] font-medium text-[#555]">{r.label}</span>
                  <span className="font-extrabold text-[13px] text-[#1A1A1A]">{r.val}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
