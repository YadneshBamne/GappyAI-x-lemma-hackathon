import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare, Check, X, Clock, MessageSquare } from "lucide-react";
import { useLemma, f } from "../context/LemmaContext";
import { Card, SectionHead, EmptyState, statusBadge, Button, pageFade } from "../components/ui/index.jsx";

export function ApprovalsPage() {
  const { data, updateRecord } = useLemma();
  const approvals = data.approvals;

  const pending  = approvals.filter(a => f(a,"approval_status") === "pending");
  const approved = approvals.filter(a => f(a,"approval_status") === "approved");
  const rejected = approvals.filter(a => f(a,"approval_status") === "rejected");

  const act = (id, status) => updateRecord("approvals", id, { approval_status: status });

  const ApprovalCard = ({ appr }) => {
    const status  = f(appr, "approval_status");
    const details = f(appr, "request_details");
    const agent   = f(appr, "requested_by_agent");
    const type    = f(appr, "resource_type");

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="nb-card p-5"
        style={{ background: status === "approved" ? "#E8F9E8" : status === "rejected" ? "#FDECEA" : "#FFFDF6" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              {statusBadge(status)}
              {type && <span className="nb-badge nb-badge-neutral uppercase">{type}</span>}
            </div>
            <p className="font-semibold text-[14px] text-[#1A1A1A] leading-relaxed">{details}</p>
            <div className="text-[12px] text-[#7B7B7B] font-medium mt-1.5">
              Requested by <span className="font-bold text-[#1A1A1A]">{agent}</span>
            </div>
          </div>

          {status === "pending" && (
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="success" size="sm" icon={Check} onClick={() => act(appr.id, "approved")}>
                Approve
              </Button>
              <Button variant="danger" size="sm" icon={X} onClick={() => act(appr.id, "rejected")}>
                Reject
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div {...pageFade} className="flex flex-col gap-8">
      <SectionHead
        title="Approvals Hub"
        subtitle="Founder sign-off requests submitted by autonomous AI agents."
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending",  val: pending.length,  color: "#FFF5CC", icon: Clock     },
          { label: "Approved", val: approved.length, color: "#E8F9E8", icon: Check     },
          { label: "Rejected", val: rejected.length, color: "#FDECEA", icon: X         },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="nb-card p-5 text-center" style={{ background: s.color }}>
              <Icon size={20} className="mx-auto mb-2"/>
              <div className="font-extrabold text-[32px] leading-none">{s.val}</div>
              <div className="text-[11px] font-bold text-[#7B7B7B] uppercase tracking-wide mt-1">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Pending Queue */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-extrabold text-[18px]">Pending Queue</h3>
          {pending.length > 0 && (
            <span className="nb-badge nb-badge-warning flex items-center gap-1.5">
              <Clock size={10}/>{pending.length} awaiting
            </span>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {pending.length === 0
              ? <EmptyState icon={CheckSquare} title="All caught up!" description="No pending approval requests."/>
              : pending.map(a => <ApprovalCard key={a.id} appr={a}/>)
            }
          </AnimatePresence>
        </div>
      </Card>

      {/* Resolved */}
      {(approved.length > 0 || rejected.length > 0) && (
        <Card className="p-6">
          <h3 className="font-extrabold text-[18px] mb-5">Resolved</h3>
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {[...approved, ...rejected].map(a => <ApprovalCard key={a.id} appr={a}/>)}
            </AnimatePresence>
          </div>
        </Card>
      )}
    </motion.div>
  );
}
