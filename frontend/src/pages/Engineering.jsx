import React, { useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Plus, Link, GitBranch, RefreshCw } from "lucide-react";
import { useLemma, f } from "../context/LemmaContext";
import {
  Card, SectionHead, Button, Input, Select, Textarea,
  EmptyState, priorityBadge, statusBadge, pageFade
} from "../components/ui/index.jsx";

export function EngineeringPage() {
  const { data, createRecord } = useLemma();
  const [title, setTitle] = useState("");
  const [prio,  setPrio]  = useState("medium");
  const [desc,  setDesc]  = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      let compId, projId;
      const compR = await window.LemmaClient?.LemmaClient
        ? undefined : undefined;
      // use createRecord helper which works through context
      // We need the raw client for lookups — fall back to creating inline
      await createRecord("issues", {
        title, description: desc, priority: prio,
        status: "todo", assignee_agent_name: "engineering-agent"
      });
      setTitle(""); setDesc("");
    } catch (err) { alert("Error: " + err.message); }
    finally { setSaving(false); }
  };

  const byStatus = (s) => data.issues.filter(i => (f(i,"status") || "").toLowerCase() === s);
  const todo   = byStatus("todo");
  const inProg = byStatus("in_progress");
  const done   = [...byStatus("completed"), ...byStatus("resolved")];

  return (
    <motion.div {...pageFade} className="flex flex-col gap-8">
      <SectionHead
        title="Engineering"
        subtitle="Issue backlog synced with Linear. Engineering Agent managing sprint."
        action={
          <div className="flex items-center gap-2">
            <div className="nb-badge nb-badge-info hidden sm:flex items-center gap-1.5">
              <GitBranch size={10}/> Linear Synced
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kanban columns */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "To Do",      items: todo,   color: "#FFF7E8" },
            { label: "In Progress",items: inProg, color: "#E8F0FF" },
            { label: "Done",       items: done,   color: "#E8F9E8" },
          ].map(col => (
            <div key={col.label}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-extrabold text-[15px]">{col.label}</h3>
                <span className="nb-badge nb-badge-neutral">{col.items.length}</span>
              </div>
              <div className="flex flex-col gap-3">
                {col.items.length === 0
                  ? (
                    <div className="rounded-[14px] border-2 border-dashed border-[#ccc] p-6 text-center text-[#7B7B7B] text-[12px] font-medium">
                      Empty
                    </div>
                  )
                  : col.items.map(iss => (
                    <Card key={iss.id} className="p-4 nb-card-interactive" interactive>
                      <div className="font-bold text-[13px] leading-snug mb-2">{f(iss,"title")}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {priorityBadge(f(iss,"priority"))}
                      </div>
                      {f(iss,"assignee_agent_name") && (
                        <div className="text-[11px] text-[#7B7B7B] font-medium mt-2">
                          Assigned: {f(iss,"assignee_agent_name")}
                        </div>
                      )}
                    </Card>
                  ))
                }
              </div>
            </div>
          ))}
        </div>

        {/* Issue Form */}
        <div className="flex flex-col gap-4">
          <Card className="p-6">
            <h3 className="font-extrabold text-[18px] mb-5">Report Issue</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Issue Title"
                placeholder="Brief summary of the issue..."
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <Select label="Priority" value={prio} onChange={e => setPrio(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </Select>
              <Textarea
                label="Description"
                placeholder="Detailed description, steps to reproduce..."
                value={desc}
                onChange={e => setDesc(e.target.value)}
                rows={4}
              />
              <Button type="submit" variant="primary" icon={Plus} loading={saving} className="w-full !justify-center">
                Add to Backlog
              </Button>
            </form>
          </Card>

          <Card className="p-5" accent="blue">
            <div className="flex items-center gap-2 mb-2">
              <Link size={15}/>
              <span className="font-bold text-[13px]">Linear Connector</span>
            </div>
            <p className="text-[13px] text-[#555] font-medium leading-relaxed">
              Engineering Agent polls Linear and maps issues automatically to the datastore.
            </p>
          </Card>

          {/* Metrics mini */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Total Issues", val: data.issues.length,                       color: "#FFF7E8" },
              { label: "In Progress",  val: inProg.length,                            color: "#E8F0FF" },
              { label: "Completed",    val: done.length,                              color: "#E8F9E8" },
              { label: "Critical",     val: data.issues.filter(i => f(i,"priority") === "critical").length, color: "#FDECEA" },
            ].map(m => (
              <div key={m.label} className="nb-card p-3 text-center"
                style={{ background: m.color }}>
                <div className="font-extrabold text-[24px] leading-none">{m.val}</div>
                <div className="text-[11px] font-bold text-[#7B7B7B] mt-1 uppercase tracking-wide">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
