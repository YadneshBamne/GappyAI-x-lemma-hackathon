import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Terminal, Users, LifeBuoy, FileText,
  Brain, Map, BarChart3, CheckSquare, Layers, Settings,
  Search, ChevronRight, X, Menu
} from "lucide-react";
import { useLemma } from "../context/LemmaContext";

export const NAV = [
  { id: "dashboard",     label: "Dashboard",     icon: LayoutDashboard },
  { id: "engineering",   label: "Engineering",   icon: Terminal         },
  { id: "community",     label: "Community",     icon: Users            },
  { id: "support",       label: "Support",       icon: LifeBuoy         },
  { id: "documentation", label: "Documentation", icon: FileText         },
  { id: "knowledge",     label: "Knowledge",     icon: Brain            },
  { id: "roadmap",       label: "Roadmap",       icon: Map              },
  { id: "analytics",     label: "Analytics",     icon: BarChart3        },
  { id: "approvals",     label: "Approvals",     icon: CheckSquare      },
  { id: "releases",      label: "Releases",      icon: Layers           },
  { id: "settings",      label: "Settings",      icon: Settings         },
];

function NavItem({ nav, active, onClick, badge }) {
  const Icon = nav.icon;
  return (
    <button onClick={() => onClick(nav.id)} className={`nb-nav-item ${active ? "active" : ""}`}>
      <Icon size={18} strokeWidth={2}/>
      <span className="flex-1 text-left">{nav.label}</span>
      {badge > 0 && (
        <span className="nb-badge nb-badge-danger !text-[9px] !py-0.5 !px-2">{badge}</span>
      )}
    </button>
  );
}

/* ── Desktop Sidebar ─────────────────────────────────────────── */
export function Sidebar({ tab, onTab }) {
  const { data } = useLemma();
  const pending = data.approvals.filter(a => (a.approval_status ?? a.data?.approval_status) === "pending").length;

  return (
    <aside
      className="nb-desktop-only flex-col w-64 flex-shrink-0 sticky top-0 h-screen overflow-y-auto"
      style={{ background: "#FFF2D6", borderRight: "3px solid #1F1F1F" }}
    >
      {/* Logo */}
      <div className="p-6 pb-5" style={{ borderBottom: "3px solid #1F1F1F" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 flex items-center justify-center rounded-xl font-black text-xl text-[#1A1A1A]"
            style={{ background: "#F5C542", border: "3px solid #1F1F1F", boxShadow: "3px 3px 0 #1F1F1F" }}
          >B</div>
          <div>
            <div className="font-black text-[15px] text-[#1A1A1A] leading-none">BuilderOS</div>
            <div className="text-[10px] text-[#7B7B7B] font-bold uppercase tracking-widest mt-0.5">AI Operating System</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pt-4 pb-3">
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-text"
          style={{ border: "2px solid #1F1F1F", background: "#fff", boxShadow: "2px 2px 0 #1F1F1F" }}
        >
          <Search size={14} color="#7B7B7B"/>
          <span className="text-[13px] text-[#7B7B7B] font-medium">Search...</span>
          <span className="ml-auto text-[10px] font-bold text-[#7B7B7B] border border-[#ccc] px-1 rounded">⌘K</span>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 pb-4 flex flex-col gap-1 overflow-y-auto">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#7B7B7B] px-2 py-2 mt-1">Navigation</p>
        {NAV.map(n => (
          <NavItem
            key={n.id}
            nav={n}
            active={tab === n.id}
            onClick={onTab}
            badge={n.id === "approvals" ? pending : 0}
          />
        ))}
      </nav>

      {/* User Footer */}
      <div
        className="p-4 m-3 rounded-xl flex items-center gap-3"
        style={{ background: "#F5C542", border: "3px solid #1F1F1F", boxShadow: "4px 4px 0 #1F1F1F" }}
      >
        <div
          className="w-9 h-9 flex items-center justify-center rounded-lg font-black text-sm text-white flex-shrink-0"
          style={{ background: "#1F1F1F" }}
        >F</div>
        <div className="min-w-0 flex-1">
          <div className="font-bold text-[12px] truncate text-[#1A1A1A]">Founder Account</div>
          <div className="text-[10px] text-[#555] truncate font-medium">yadnesh2105@gmail.com</div>
        </div>
      </div>
    </aside>
  );
}

/* ── Mobile Drawer ───────────────────────────────────────────── */
export function MobileDrawer({ open, onClose, tab, onTab }) {
  const { data } = useLemma();
  const pending = data.approvals.filter(a => (a.approval_status ?? a.data?.approval_status) === "pending").length;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed left-0 top-0 bottom-0 w-72 z-50 flex flex-col overflow-y-auto"
            style={{ background: "#FFF2D6", borderRight: "3px solid #1F1F1F" }}
          >
            <div className="p-5 flex items-center justify-between" style={{ borderBottom: "3px solid #1F1F1F" }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-xl font-black text-xl"
                  style={{ background: "#F5C542", border: "3px solid #1F1F1F" }}>B</div>
                <div className="font-black text-[15px]">BuilderOS</div>
              </div>
              <button onClick={onClose} className="nb-btn nb-btn-ghost !p-2 !shadow-[2px_2px_0_#1F1F1F]"><X size={16}/></button>
            </div>
            <nav className="flex-1 p-3 flex flex-col gap-1">
              {NAV.map(n => (
                <NavItem key={n.id} nav={n} active={tab === n.id}
                  onClick={(id) => { onTab(id); onClose(); }}
                  badge={n.id === "approvals" ? pending : 0}
                />
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Mobile Bottom Nav ───────────────────────────────────────── */
export function MobileBottomNav({ tab, onTab }) {
  const visible = NAV.slice(0, 5);

  const SHORT_LABELS = {
    dashboard:     "Home",
    engineering:   "Eng",
    community:     "Chat",
    support:       "Help",
    documentation: "Docs",
  };

  return (
    <nav
      className="nb-mobile-only fixed bottom-0 left-0 right-0 z-30"
      style={{
        background: "#FFFDF6",
        borderTop: "3px solid #1F1F1F",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div style={{ display: "flex", width: "100%" }}>
        {visible.map((n, i) => {
          const Icon  = n.icon;
          const active = tab === n.id;
          const isLast = i === visible.length - 1;
          return (
            <button
              key={n.id}
              onClick={() => onTab(n.id)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                padding: "10px 4px 10px",
                background: active ? "#F5C542" : "transparent",
                borderRight: isLast ? "none" : "2px solid #E8E0CC",
                borderTop: active ? "3px solid #1F1F1F" : "3px solid transparent",
                marginTop: "-3px",
                cursor: "pointer",
                transition: "background 0.15s ease",
                minWidth: 0,
              }}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 1.8}
                color={active ? "#1F1F1F" : "#7B7B7B"}
              />
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: active ? 800 : 600,
                  color: active ? "#1A1A1A" : "#7B7B7B",
                  letterSpacing: "0.03em",
                  lineHeight: 1,
                }}
              >
                {SHORT_LABELS[n.id] || n.label.slice(0, 5)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
