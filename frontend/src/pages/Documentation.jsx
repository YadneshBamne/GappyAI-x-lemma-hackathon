import React from "react";
import { motion } from "framer-motion";
import { FileText, Clock, CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react";
import { useLemma, f } from "../context/LemmaContext";
import { Card, SectionHead, EmptyState, statusBadge, pageFade } from "../components/ui/index.jsx";

export function DocumentationPage() {
  const { data } = useLemma();
  const docs = data.docs;
  const published = docs.filter(d => f(d,"status") === "published").length;

  return (
    <motion.div {...pageFade} className="flex flex-col gap-8">
      <SectionHead
        title="Documentation"
        subtitle="Auto-generated guides indexed and published by the Documentation Agent."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Docs",  val: docs.length,    color: "#FFF7E8", icon: FileText    },
          { label: "Published",   val: published,       color: "#E8F9E8", icon: CheckCircle2},
          { label: "Draft",       val: docs.filter(d => f(d,"status") === "draft").length, color: "#FFF5CC", icon: Clock },
          { label: "Coverage",    val: docs.length > 0 ? `${Math.round((published/docs.length)*100)}%` : "—", color: "#E8F0FF", icon: ArrowUpRight },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h3 className="font-extrabold text-[18px] mb-5">Doc Inventory</h3>
            {docs.length === 0
              ? <EmptyState icon={FileText} title="No documentation pages" description="Documentation Agent will publish guides automatically."/>
              : (
                <div className="overflow-x-auto">
                  <table className="nb-table w-full">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Slug</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {docs.map(doc => (
                        <tr key={doc.id}>
                          <td className="font-bold text-[#1A1A1A]">{f(doc,"title")}</td>
                          <td className="font-mono text-[12px] text-[#7B7B7B]">/{f(doc,"slug")}</td>
                          <td>{statusBadge(f(doc,"status"))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            }
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-5" accent="yellow">
            <div className="font-bold text-[14px] mb-2 flex items-center gap-2">
              <Clock size={15}/> Hourly Sync
            </div>
            <p className="text-[13px] text-[#555] font-medium leading-relaxed">
              Documentation Agent scans project directories and validates markdown changes against the datastore.
            </p>
          </Card>
          <Card className="p-5">
            <h4 className="font-bold text-[14px] mb-3">Publishing Stats</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "Published", val: published,                               color: "#E8F9E8" },
                { label: "Draft",     val: docs.filter(d => f(d,"status") === "draft").length, color: "#FFF5CC" },
                { label: "Missing",   val: Math.max(0, 5 - docs.length),            color: "#FDECEA" },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: s.color, border: "2px solid #E8E0CC" }}>
                  <span className="text-[13px] font-medium">{s.label}</span>
                  <span className="font-extrabold text-[18px]">{s.val}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
