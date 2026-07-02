import React from "react";
import { motion } from "framer-motion";
import { Brain, Search, Book, Tag, TrendingUp } from "lucide-react";
import { useLemma, f } from "../context/LemmaContext";
import { Card, SectionHead, EmptyState, pageFade } from "../components/ui/index.jsx";

export function KnowledgePage() {
  const { data } = useLemma();
  const articles = data.knowledgeArticles;

  return (
    <motion.div {...pageFade} className="flex flex-col gap-8">
      <SectionHead
        title="Knowledge Base"
        subtitle="Confluence articles indexed for semantic search and RAG retrieval."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Articles",    val: articles.length, icon: Book,      color: "#E8F0FF" },
          { label: "KB Coverage", val: "94%",           icon: TrendingUp, color: "#E8F9E8" },
          { label: "Search Hits", val: "2,847",         icon: Search,    color: "#FFF5CC" },
          { label: "Sources",     val: "3",             icon: Brain,     color: "#FFF3E0" },
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
            <h3 className="font-extrabold text-[18px] mb-5">Articles</h3>
            <div className="flex flex-col gap-3">
              {articles.length === 0
                ? <EmptyState icon={Brain} title="No articles indexed" description="Knowledge Agent will index articles automatically."/>
                : articles.map(art => (
                  <div key={art.id}
                    className="rounded-[14px] p-4 border-2 border-[#1F1F1F] hover:bg-[#FFF7E8] transition-colors cursor-pointer"
                    style={{ background: "#FAFAFA" }}
                  >
                    <div className="font-bold text-[14px] mb-1.5">{f(art,"title")}</div>
                    {f(art,"keywords") && (
                      <div className="flex flex-wrap gap-1.5">
                        {(f(art,"keywords") || "").split(",").map(k => (
                          <span key={k} className="nb-badge nb-badge-info flex items-center gap-1 !text-[10px]">
                            <Tag size={8}/>{k.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    {f(art,"content_markdown") && (
                      <p className="text-[12px] text-[#7B7B7B] font-medium mt-2 line-clamp-2">
                        {f(art,"content_markdown").slice(0,100)}...
                      </p>
                    )}
                  </div>
                ))
              }
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-5" accent="blue">
            <div className="font-extrabold text-[40px] leading-none mb-1">94%</div>
            <div className="font-bold text-[13px] uppercase tracking-wide">KB Coverage</div>
            <p className="text-[13px] text-[#555] font-medium mt-1">Across Confluence spaces, Notion pages, and internal wikis.</p>
          </Card>

          <Card className="p-5">
            <h4 className="font-bold text-[14px] mb-3">Indexed Sources</h4>
            <div className="flex flex-col gap-2">
              {["Confluence Wiki", "Internal Docs", "Support FAQs"].map(s => (
                <div key={s} className="flex items-center gap-2 rounded-xl px-3 py-2 border-2 border-[#E8E0CC] bg-[#FFF7E8]">
                  <div className="w-2 h-2 rounded-full bg-[#61C26A]"/>
                  <span className="text-[13px] font-medium">{s}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
