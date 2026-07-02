import React from "react";
import { motion } from "framer-motion";
import { Map, Calendar, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { useLemma, f } from "../context/LemmaContext";
import { Card, SectionHead, EmptyState, statusBadge, pageFade } from "../components/ui/index.jsx";

const STATUS_COLOR = {
  proposed:    "#FFF5CC",
  in_progress: "#E8F0FF",
  completed:   "#E8F9E8",
  on_hold:     "#FDECEA",
};

export function RoadmapPage() {
  const { data } = useLemma();
  const items = data.roadmap;

  const byStatus = (s) => items.filter(r => (f(r,"status")||"").toLowerCase() === s);

  return (
    <motion.div {...pageFade} className="flex flex-col gap-8">
      <SectionHead
        title="Product Roadmap"
        subtitle="Milestones planned and tracked by the Product Agent."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total",      val: items.length,           icon: Map,        color: "#FFF7E8" },
          { label: "Proposed",   val: byStatus("proposed").length, icon: Clock,  color: "#FFF5CC" },
          { label: "In Progress",val: byStatus("in_progress").length, icon: Loader2, color: "#E8F0FF" },
          { label: "Completed",  val: byStatus("completed").length, icon: CheckCircle2, color: "#E8F9E8" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="nb-card p-5" style={{ background: s.color }}>
              <div className="flex items-center justify-between mb-2">
                <span className="nb-label mb-0">{s.label}</span>
                <Icon size={15}/>
              </div>
              <div className="font-extrabold text-[32px] leading-none">{s.val}</div>
            </div>
          );
        })}
      </div>

      {/* Timeline view */}
      <Card className="p-6">
        <h3 className="font-extrabold text-[18px] mb-6">Milestone Timeline</h3>
        {items.length === 0
          ? <EmptyState icon={Map} title="No milestones planned" description="Product Agent will populate the roadmap."/>
          : (
            <div className="relative pl-6">
              {items.map((rm, i) => (
                <div key={rm.id} className="relative flex gap-4 pb-8 last:pb-0">
                  {/* Line */}
                  {i < items.length - 1 && (
                    <div className="absolute left-[-18px] top-4 bottom-0 w-0.5 bg-[#E8E0CC]"/>
                  )}
                  {/* Dot */}
                  <div
                    className="absolute left-[-23px] top-1 w-4 h-4 rounded-full border-2 border-[#1F1F1F] flex-shrink-0"
                    style={{ background: STATUS_COLOR[f(rm,"status")] || "#FFF5CC" }}
                  />
                  <div
                    className="flex-1 rounded-[14px] p-4 border-2 border-[#1F1F1F] hover:bg-[#FFF7E8] transition-colors"
                    style={{ background: STATUS_COLOR[f(rm,"status")] || "#FAFAFA" }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="font-bold text-[14px]">{f(rm,"title")}</div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {f(rm,"quarter") && (
                          <span className="nb-badge nb-badge-neutral flex items-center gap-1">
                            <Calendar size={9}/>{f(rm,"quarter")}
                          </span>
                        )}
                        {statusBadge(f(rm,"status"))}
                      </div>
                    </div>
                    {f(rm,"description") && (
                      <p className="text-[13px] text-[#555] font-medium mt-1.5">{f(rm,"description")}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </Card>
    </motion.div>
  );
}
