import React from "react";
import { motion } from "framer-motion";
import { Layers, ShieldCheck, FileText, Megaphone, Clock } from "lucide-react";
import { useLemma, f } from "../context/LemmaContext";
import { Card, SectionHead, EmptyState, statusBadge, pageFade } from "../components/ui/index.jsx";

export function ReleasesPage() {
  const { data } = useLemma();
  const releases = data.releases;

  return (
    <motion.div {...pageFade} className="flex flex-col gap-8">
      <SectionHead
        title="Releases"
        subtitle="Version tags, deployment history, and agent-generated release notes."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Releases", val: releases.length,           color: "#FFF7E8", icon: Layers     },
          { label: "Latest",         val: releases[0] ? f(releases[0],"version_tag") || "—" : "—", color: "#E8F9E8", icon: ShieldCheck },
          { label: "Pending Notes",  val: releases.filter(r => !f(r,"release_notes_markdown")).length, color: "#FFF5CC", icon: FileText },
          { label: "Announcements",  val: releases.length, color: "#E8F0FF", icon: Megaphone },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="nb-card p-5" style={{ background: s.color }}>
              <div className="flex items-center justify-between mb-2">
                <span className="nb-label mb-0">{s.label}</span>
                <Icon size={15}/>
              </div>
              <div className="font-extrabold text-[28px] leading-none truncate">{s.val}</div>
            </div>
          );
        })}
      </div>

      {/* Timeline */}
      <Card className="p-6">
        <h3 className="font-extrabold text-[18px] mb-6">Release Timeline</h3>
        {releases.length === 0
          ? <EmptyState icon={Layers} title="No releases cataloged" description="Release Agent will track deployments here."/>
          : (
            <div className="relative pl-6 flex flex-col gap-0">
              {releases.map((rel, i) => (
                <div key={rel.id} className="relative flex gap-4 pb-8 last:pb-0">
                  {i < releases.length - 1 && (
                    <div className="absolute left-[-18px] top-4 bottom-0 w-0.5 bg-[#E8E0CC]"/>
                  )}
                  <div
                    className="absolute left-[-23px] top-1 w-4 h-4 rounded-full border-2 border-[#1F1F1F]"
                    style={{ background: "#F5C542" }}
                  />
                  <div className="flex-1 nb-card p-5 nb-card-interactive" style={{ background: "#FFFDF6" }}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-[22px]">{f(rel,"version_tag")}</span>
                        <span className="nb-badge nb-badge-success flex items-center gap-1">
                          <ShieldCheck size={9}/> Active
                        </span>
                      </div>
                      {f(rel,"created_at") && (
                        <div className="nb-badge nb-badge-neutral flex items-center gap-1">
                          <Clock size={9}/>{new Date(f(rel,"created_at")).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <hr className="nb-divider mb-3"/>
                    <p className="text-[13px] font-medium text-[#555] leading-relaxed whitespace-pre-line">
                      {f(rel,"release_notes_markdown") || "No release notes provided."}
                    </p>
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
