import React from "react";
import { motion } from "framer-motion";

/* ================================================================
   REUSABLE UI PRIMITIVES
   ================================================================ */

/* ── Card ──────────────────────────────────────────────────────── */
export function Card({ children, className = "", interactive = false, accent, style }) {
  const base  = "nb-card";
  const inter = interactive ? "nb-card-interactive" : "";
  const acc   = accent ? `nb-card-${accent}` : "";
  if (interactive) {
    return (
      <motion.div
        whileHover={{ x: -3, y: -3 }}
        whileTap={{ x: 2, y: 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={`${base} ${acc} ${className}`}
        style={style}
      >
        {children}
      </motion.div>
    );
  }
  return (
    <div className={`${base} ${acc} ${className}`} style={style}>
      {children}
    </div>
  );
}

/* ── Badge ─────────────────────────────────────────────────────── */
export function Badge({ children, variant = "neutral", icon: Icon }) {
  return (
    <span className={`nb-badge nb-badge-${variant}`}>
      {Icon && <Icon size={10}/>}
      {children}
    </span>
  );
}

export function statusBadge(status) {
  if (!status) return <Badge variant="neutral">—</Badge>;
  const s = status.toLowerCase();
  if (["approved","completed","published","resolved","active","connected"].includes(s))
    return <Badge variant="success">{status}</Badge>;
  if (["rejected","failed","closed"].includes(s))
    return <Badge variant="danger">{status}</Badge>;
  if (["pending","new","todo","proposed"].includes(s))
    return <Badge variant="warning">{status}</Badge>;
  if (["in_progress","syncing","listening","reviewing"].includes(s))
    return <Badge variant="info">{status}</Badge>;
  return <Badge variant="neutral">{status}</Badge>;
}

export function priorityBadge(priority) {
  if (!priority) return <Badge variant="neutral">—</Badge>;
  const p = priority.toLowerCase();
  if (p === "critical") return <Badge variant="danger">Critical</Badge>;
  if (p === "high")     return <Badge variant="danger">High</Badge>;
  if (p === "medium")   return <Badge variant="warning">Medium</Badge>;
  return <Badge variant="neutral">Low</Badge>;
}

/* ── Button ────────────────────────────────────────────────────── */
export function Button({
  children, variant = "ghost", size = "md", className = "",
  icon: Icon, loading = false, disabled = false, onClick, type = "button"
}) {
  const sizes = { sm: "!py-1.5 !px-3 !text-[12px]", md: "", lg: "!py-3 !px-6 !text-[15px]" };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`nb-btn nb-btn-${variant} ${sizes[size]} ${className}`}
    >
      {loading
        ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/>
        : Icon && <Icon size={size === "sm" ? 13 : 15}/>
      }
      {children}
    </button>
  );
}

/* ── Input ─────────────────────────────────────────────────────── */
export function Input({ label, placeholder, value, onChange, type = "text", className = "" }) {
  return (
    <div>
      {label && <label className="nb-label">{label}</label>}
      <input
        type={type}
        className={`nb-input ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export function Select({ label, value, onChange, children, className = "" }) {
  return (
    <div>
      {label && <label className="nb-label">{label}</label>}
      <select className={`nb-input ${className}`} value={value} onChange={onChange}>
        {children}
      </select>
    </div>
  );
}

export function Textarea({ label, placeholder, value, onChange, rows = 4, className = "" }) {
  return (
    <div>
      {label && <label className="nb-label">{label}</label>}
      <textarea
        className={`nb-input resize-none ${className}`}
        style={{ height: "auto" }}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

/* ── Empty State ───────────────────────────────────────────────── */
export function EmptyState({ icon: Icon, title, description, action, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center gap-4">
      <div
        className="w-16 h-16 flex items-center justify-center rounded-2xl"
        style={{ border: "3px solid #1F1F1F", background: "#FFF7E8", boxShadow: "4px 4px 0 #1F1F1F" }}
      >
        <Icon size={28} strokeWidth={1.5} color="#7B7B7B"/>
      </div>
      <div>
        <p className="font-bold text-[15px] text-[#1A1A1A]">{title || "Nothing here yet"}</p>
        {description && <p className="text-sm text-[#7B7B7B] mt-1 font-medium">{description}</p>}
      </div>
      {action && (
        <Button variant="primary" onClick={onAction} size="sm">{action}</Button>
      )}
    </div>
  );
}

/* ── Skeleton ──────────────────────────────────────────────────── */
export function Skeleton({ rows = 4 }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="nb-skeleton h-20" style={{ opacity: 1 - i * 0.15 }}/>
      ))}
    </div>
  );
}

/* ── Section Heading ───────────────────────────────────────────── */
export function SectionHead({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-8">
      <div>
        <h1 className="font-extrabold text-[28px] leading-tight text-[#1A1A1A]">{title}</h1>
        {subtitle && <p className="text-[15px] text-[#555] font-medium mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ── Stat Card ─────────────────────────────────────────────────── */
export function StatCard({ label, value, icon: Icon, accent = "yellow", trend }) {
  const accents = {
    yellow: { bg: "#FFF5CC", border: "#c0880a" },
    green:  { bg: "#E8F9E8", border: "#2E7D32" },
    blue:   { bg: "#E8F0FF", border: "#1A3A8F" },
    red:    { bg: "#FDECEA", border: "#831717" },
    orange: { bg: "#FFF3E0", border: "#7A4E00" },
  };
  const { bg, border } = accents[accent] || accents.yellow;
  return (
    <motion.div
      whileHover={{ x: -3, y: -3, boxShadow: "11px 11px 0 #1F1F1F" }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="rounded-[20px] p-6 flex flex-col gap-3 cursor-default"
      style={{ background: bg, border: "3px solid #1F1F1F", boxShadow: "8px 8px 0 #1F1F1F" }}
    >
      <div className="flex items-center justify-between">
        <span className="nb-label mb-0">{label}</span>
        {Icon && (
          <div className="w-9 h-9 flex items-center justify-center rounded-xl"
            style={{ border: `2px solid ${border}`, background: "#fff" }}>
            <Icon size={17} color={border}/>
          </div>
        )}
      </div>
      <div className="nb-stat-number">{value}</div>
      {trend !== undefined && (
        <div className="text-[12px] font-semibold" style={{ color: trend >= 0 ? "#1B6B22" : "#831717" }}>
          {trend >= 0 ? "+" : ""}{trend}% this week
        </div>
      )}
    </motion.div>
  );
}

/* ── Progress Bar ──────────────────────────────────────────────── */
export function ProgressBar({ value, color = "#F5C542" }) {
  return (
    <div className="nb-progress-track">
      <motion.div
        className="nb-progress-fill"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, value)}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ background: color }}
      />
    </div>
  );
}

/* ── Page Fade ─────────────────────────────────────────────────── */
export const pageFade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.14 } },
};
