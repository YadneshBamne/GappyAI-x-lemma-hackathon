import React from "react";
import { motion } from "framer-motion";
import { Users, MessageSquare, Zap, TrendingUp, Hash } from "lucide-react";
import { useLemma, f } from "../context/LemmaContext";
import { Card, SectionHead, EmptyState, statusBadge, pageFade } from "../components/ui/index.jsx";

export function CommunityPage() {
  const { data } = useLemma();
  const msgs = data.communityMessages;

  return (
    <motion.div {...pageFade} className="flex flex-col gap-8">
      <SectionHead
        title="Community Hub"
        subtitle="Discord streams monitored and triaged in real-time by the Community Agent."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Messages", val: msgs.length,  icon: MessageSquare, color: "#E8F9E8" },
          { label: "Auto-Replies",   val: msgs.filter(m => f(m,"response_sent")).length, icon: Zap, color: "#FFF5CC" },
          { label: "Open Questions", val: msgs.filter(m => f(m,"status") === "new").length, icon: TrendingUp, color: "#E8F0FF" },
          { label: "Channels",       val: [...new Set(msgs.map(m => f(m,"channel_name")).filter(Boolean))].length || 1, icon: Hash, color: "#FFF3E0" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="nb-card p-5 flex flex-col gap-2" style={{ background: s.color }}>
              <div className="flex items-center justify-between">
                <span className="nb-label mb-0">{s.label}</span>
                <Icon size={16} strokeWidth={2}/>
              </div>
              <div className="font-extrabold text-[32px] leading-none">{s.val}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feed */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h3 className="font-extrabold text-[18px] mb-5">Discord Feed</h3>
            <div className="flex flex-col gap-4">
              {msgs.length === 0
                ? <EmptyState icon={MessageSquare} title="No messages indexed" description="Connect Discord and seed the workspace."/>
                : msgs.map(msg => (
                  <div key={msg.id}
                    className="rounded-[14px] p-4 border-2 border-[#1F1F1F] flex flex-col gap-3 transition-colors hover:bg-[#FFF7E8]"
                    style={{ background: "#FAFAFA" }}
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#E8F0FF] border-2 border-[#1F1F1F] flex items-center justify-center text-[11px] font-black">
                          {(f(msg,"author") || "?")[0].toUpperCase()}
                        </div>
                        <span className="font-bold text-[13px]">@{f(msg,"author")}</span>
                        {f(msg,"channel_name") && (
                          <span className="text-[11px] text-[#7B7B7B] font-medium">{f(msg,"channel_name")}</span>
                        )}
                      </div>
                      {statusBadge(f(msg,"status"))}
                    </div>
                    <p className="text-[14px] font-medium text-[#1A1A1A] leading-relaxed">{f(msg,"content")}</p>
                    {f(msg,"response_sent") && (
                      <div className="border-l-4 border-[#F5C542] pl-3 text-[13px] font-medium text-[#555]">
                        <span className="font-bold text-[#1A1A1A]">Agent Reply:</span> {f(msg,"response_sent")}
                      </div>
                    )}
                  </div>
                ))
              }
            </div>
          </Card>
        </div>

        {/* Sidebar panels */}
        <div className="flex flex-col gap-4">
          <Card className="p-5" accent="green">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16}/>
              <span className="font-bold text-[14px]">Auto-Response Active</span>
            </div>
            <p className="text-[13px] text-[#555] font-medium leading-relaxed">
              Community Agent answers Discord queries using the RAG knowledge base.
            </p>
            <div className="mt-3 rounded-xl p-2.5 text-[11px] font-bold bg-white/60 border-2 border-[#1F1F1F]">
              Guild ID: 1522084255059017871
            </div>
          </Card>

          <Card className="p-5">
            <h4 className="font-bold text-[14px] mb-3">Message Status Breakdown</h4>
            <div className="flex flex-col gap-2">
              {["new","answered","escalated"].map(s => {
                const count = msgs.filter(m => f(m,"status") === s).length;
                return (
                  <div key={s} className="flex items-center justify-between">
                    {statusBadge(s)}
                    <span className="font-extrabold text-[18px]">{count}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
