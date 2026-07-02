import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Zap, Terminal, Users, LifeBuoy, Brain, FileText, Map,
  BarChart3, CheckSquare, Layers, Settings, ArrowRight,
  ChevronDown, ChevronRight, Star, Play, ExternalLink,
  Cpu, Database, GitBranch, Mail, MessageSquare, Link,
  Shield, TrendingUp, Clock, Sparkles, Building2, Workflow,
  Globe, Activity, Bot, Command, Network
} from "lucide-react";

/* ================================================================
   DESIGN TOKENS
   ================================================================ */
const T = {
  bg:       "#FFFDF6",
  bgAlt:    "#FFF7E8",
  card:     "#FFFFFF",
  sidebar:  "#FFF2D6",
  accent:   "#F5C542",
  accent2:  "#F8D772",
  border:   "#1E1E1E",
  text:     "#1A1A1A",
  sub:      "#555555",
  muted:    "#7C7C7C",
  success:  "#64C87A",
  warn:     "#F5A524",
  danger:   "#E85B5B",
  info:     "#5B8DEF",
};

const cardStyle = (bg = T.card, extra = {}) => ({
  background: bg,
  border: `3px solid ${T.border}`,
  borderRadius: 20,
  boxShadow: `6px 6px 0 ${T.border}`,
  ...extra,
});

const btnStyle = (bg = T.accent, extra = {}) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "13px 26px",
  fontFamily: "Inter, sans-serif",
  fontSize: 15,
  fontWeight: 600,
  background: bg,
  color: bg === T.card || bg === T.bg ? T.text : (bg === T.accent ? T.text : "#fff"),
  border: `3px solid ${T.border}`,
  borderRadius: 12,
  boxShadow: `4px 4px 0 ${T.border}`,
  cursor: "pointer",
  textDecoration: "none",
  transition: "transform 0.12s ease, box-shadow 0.12s ease",
  whiteSpace: "nowrap",
  ...extra,
});

const hoverProps = {
  whileHover: { x: -3, y: -3, boxShadow: `9px 9px 0 ${T.border}` },
  whileTap:   { x: 2,  y: 2,  boxShadow: `2px 2px 0 ${T.border}` },
  transition: { type: "spring", stiffness: 400, damping: 25 },
};

const fadeUp = {
  initial:  { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: "easeOut" },
};

const stagger = (i) => ({ ...fadeUp, transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" } });

/* ================================================================
   REUSABLE COMPONENTS
   ================================================================ */
function SectionLabel({ children }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "6px 16px",
      background: T.accent, border: `2px solid ${T.border}`,
      borderRadius: 999, fontSize: 12, fontWeight: 800,
      letterSpacing: "0.08em", textTransform: "uppercase",
      boxShadow: `3px 3px 0 ${T.border}`, marginBottom: 20,
    }}>
      {children}
    </div>
  );
}

function SectionTitle({ children, center = false }) {
  return (
    <h2 style={{
      fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800,
      color: T.text, lineHeight: 1.15, letterSpacing: "-0.5px",
      textAlign: center ? "center" : "left",
      marginBottom: 16,
    }}>{children}</h2>
  );
}

function SectionSub({ children, center = false }) {
  return (
    <p style={{
      fontSize: 17, fontWeight: 400, color: T.sub, lineHeight: 1.7,
      textAlign: center ? "center" : "left", maxWidth: 640,
      margin: center ? "0 auto" : undefined,
    }}>{children}</p>
  );
}

function Card({ children, bg = T.card, className, style, interactive = false }) {
  if (interactive) return (
    <motion.div {...hoverProps} style={{ ...cardStyle(bg), ...style }} className={className}>
      {children}
    </motion.div>
  );
  return (
    <div style={{ ...cardStyle(bg), ...style }} className={className}>
      {children}
    </div>
  );
}

function Badge({ children, color = T.accent }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 10px", background: color,
      border: `2px solid ${T.border}`, borderRadius: 999,
      fontSize: 11, fontWeight: 700, letterSpacing: "0.05em",
      textTransform: "uppercase",
    }}>{children}</span>
  );
}

/* ── Animated Counter ────────────────────────────────────────── */
function Counter({ target, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef();
  const inView = useInView(ref, { once: true, margin: "-50px" });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(Math.floor(start));
      if (start >= target) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [inView, target, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ── FAQ Accordion Item ──────────────────────────────────────── */
function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div {...stagger(index)}
      style={{ ...cardStyle(), marginBottom: 12, overflow: "hidden", cursor: "pointer" }}
      onClick={() => setOpen(!open)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px" }}>
        <span style={{ fontWeight: 700, fontSize: 16, color: T.text }}>{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={20} color={T.muted}/>
        </motion.div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 24px 20px", color: T.sub, fontSize: 15, lineHeight: 1.7,
              borderTop: `2px solid #E8E0CC` }}>
              <div style={{ paddingTop: 16 }}>{a}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ================================================================
   SECTIONS
   ================================================================ */

/* ── NAVBAR ──────────────────────────────────────────────────── */
function Navbar({ onDash }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(255,253,246,0.96)" : T.bg,
      borderBottom: scrolled ? `3px solid ${T.border}` : "3px solid transparent",
      backdropFilter: "none",
      transition: "border-color 0.2s, background 0.2s",
      padding: "0 max(24px, 4vw)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", height: 68, gap: 24 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
          <div style={{
            width: 38, height: 38, background: T.accent,
            border: `3px solid ${T.border}`, borderRadius: 10,
            boxShadow: `3px 3px 0 ${T.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: 20, color: T.text,
          }}>B</div>
          <span style={{ fontWeight: 900, fontSize: 17, color: T.text, letterSpacing: "-0.3px" }}>BuilderOS</span>
        </div>

        {/* Nav Links (desktop) */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}
          className="nav-links-desktop">
          {["Features", "Agents", "Workflows", "Docs"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}
              style={{ padding: "7px 14px", fontWeight: 600, fontSize: 14, color: T.sub,
                borderRadius: 8, textDecoration: "none", transition: "color 0.15s, background 0.15s" }}
              onMouseEnter={e => { e.target.style.color = T.text; e.target.style.background = T.bgAlt; }}
              onMouseLeave={e => { e.target.style.color = T.sub; e.target.style.background = "transparent"; }}
            >{l}</a>
          ))}
        </div>

        {/* CTA */}
        <motion.button {...hoverProps} style={btnStyle(T.accent)} onClick={onDash}>
          Launch Dashboard <ArrowRight size={15}/>
        </motion.button>
      </div>
    </nav>
  );
}

/* ── HERO ────────────────────────────────────────────────────── */
function HeroOrg() {
  const agents = [
    { label: "Engineering", color: "#E8F0FF", angle: -60 },
    { label: "Community",   color: "#E8F9E8", angle: -20 },
    { label: "Support",     color: "#FDECEA", angle:  20 },
    { label: "Knowledge",   color: "#FFF5CC", angle:  60 },
    { label: "Marketing",   color: "#FFF3E0", angle: 100 },
    { label: "Docs",        color: "#E8F0FF", angle: 140 },
    { label: "Analytics",   color: "#E8F9E8", angle: 180 },
    { label: "Releases",    color: "#FFF5CC", angle: 220 },
  ];
  const r = 160;
  return (
    <div style={{ position: "relative", width: 400, height: 400, margin: "0 auto", flexShrink: 0 }}>
      {/* Connecting lines SVG */}
      <svg width={400} height={400} style={{ position: "absolute", top: 0, left: 0 }}>
        {agents.map((a, i) => {
          const rad = (a.angle * Math.PI) / 180;
          const x2 = 200 + r * Math.cos(rad);
          const y2 = 200 + r * Math.sin(rad);
          return (
            <motion.line key={i} x1={200} y1={200} x2={x2} y2={y2}
              stroke={T.border} strokeWidth={2} strokeDasharray="6 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ duration: 1.2, delay: i * 0.1 }}
            />
          );
        })}
      </svg>

      {/* Center node */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          ...cardStyle(T.accent), padding: "14px 20px",
          textAlign: "center", zIndex: 2,
        }}
      >
        <Building2 size={22} style={{ marginBottom: 4 }}/>
        <div style={{ fontWeight: 800, fontSize: 13 }}>Your Company</div>
      </motion.div>

      {/* Agent nodes */}
      {agents.map((a, i) => {
        const rad = (a.angle * Math.PI) / 180;
        const x = 200 + r * Math.cos(rad);
        const y = 200 + r * Math.sin(rad);
        return (
          <motion.div key={i}
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
            whileHover={{ scale: 1.1 }}
            style={{
              position: "absolute",
              left: x - 46, top: y - 22,
              ...cardStyle(a.color), padding: "6px 12px",
              fontSize: 11, fontWeight: 700, cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.success, display: "inline-block" }}/>
              {a.label}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function Hero({ onDash }) {
  return (
    <section style={{
      minHeight: "100vh", background: T.bg,
      display: "flex", alignItems: "center",
      padding: "100px max(24px, 4vw) 80px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}
        className="hero-grid">

        <div>
          <motion.div {...fadeUp}>
            <SectionLabel><Sparkles size={12}/> Powered by Lemma SDK</SectionLabel>
          </motion.div>
          <motion.h1 {...stagger(1)} style={{
            fontSize: "clamp(38px, 5.5vw, 60px)", fontWeight: 900,
            color: T.text, lineHeight: 1.08, letterSpacing: "-1.5px",
            marginBottom: 24,
          }}>
            Run Your Company<br/>
            <span style={{ background: T.accent, padding: "0 8px", display: "inline-block", marginTop: 6,
              border: `3px solid ${T.border}`, borderRadius: 8 }}>
              with AI,
            </span>{" "}
            Not Busywork.
          </motion.h1>
          <motion.p {...stagger(2)} style={{
            fontSize: 18, color: T.sub, lineHeight: 1.75, marginBottom: 40, fontWeight: 400,
          }}>
            BuilderOS transforms your startup into an AI-native organization where autonomous agents manage engineering, support, documentation, releases, community, and operations — powered by the Lemma SDK.
          </motion.p>
          <motion.div {...stagger(3)} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <motion.button {...hoverProps} style={btnStyle(T.accent)} onClick={onDash}>
              <Play size={15}/> Launch Dashboard
            </motion.button>
            <motion.a {...hoverProps} style={btnStyle(T.card)} href="#architecture">
              View Architecture <ChevronRight size={15}/>
            </motion.a>
          </motion.div>

          {/* Mini metrics */}
          <motion.div {...stagger(4)} style={{ display: "flex", gap: 32, marginTop: 48 }}>
            {[["10+","AI Agents"], ["14+","Tables"], ["9+","Workflows"], ["3+","Connectors"]].map(([n,l]) => (
              <div key={l}>
                <div style={{ fontWeight: 900, fontSize: 26, color: T.text, lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 12, color: T.muted, fontWeight: 600, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
          className="hero-visual">
          <HeroOrg/>
        </motion.div>
      </div>
    </section>
  );
}

/* ── TRUST BAR ────────────────────────────────────────────────── */
function TrustBar() {
  const items = [
    { label: "Lemma SDK", icon: <Command size={18}/>, color: "#E8F0FF" },
    { label: "React",     icon: <Cpu size={18}/>,     color: "#E8F9E8" },
    { label: "Vite",      icon: <Zap size={18}/>,     color: "#FFF5CC" },
    { label: "Discord",   icon: <MessageSquare size={18}/>, color: "#E8F0FF" },
    { label: "Linear",    icon: <GitBranch size={18}/>,color: "#FDECEA" },
    { label: "Gmail",     icon: <Mail size={18}/>,    color: "#FDECEA" },
    { label: "Framer",    icon: <Activity size={18}/>,color: "#FFF3E0" },
    { label: "Lucide",    icon: <Star size={18}/>,    color: "#FFF5CC" },
    { label: "Tailwind",  icon: <Globe size={18}/>,   color: "#E8F9E8" },
  ];
  return (
    <section style={{ background: T.bgAlt, borderTop: `3px solid ${T.border}`, borderBottom: `3px solid ${T.border}`, padding: "28px max(24px, 4vw)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p style={{ textAlign: "center", fontSize: 12, fontWeight: 800, color: T.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>
          Powered by industry-leading tools
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          {items.map((it, i) => (
            <motion.div key={it.label} {...stagger(i)}
              style={{ ...cardStyle(it.color), padding: "10px 18px", display: "flex", alignItems: "center", gap: 8 }}>
              {it.icon}
              <span style={{ fontWeight: 700, fontSize: 13 }}>{it.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── WHAT IS BUILDEROS ────────────────────────────────────────── */
function WhatIs() {
  const cards = [
    { icon: <Bot size={28}/>, title: "AI Agents", color: "#E8F0FF",
      desc: "Specialized autonomous agents run each department — Engineering, Support, Community, Docs, and more — 24/7 without manual intervention." },
    { icon: <Workflow size={28}/>, title: "Event Workflows", color: "#FFF5CC",
      desc: "Discord messages, Gmail tickets, and GitHub events automatically trigger precise multi-step agent workflows with zero configuration." },
    { icon: <Database size={28}/>, title: "Company Memory", color: "#E8F9E8",
      desc: "A relational datastore and semantic knowledge base gives agents perfect memory — every decision, ticket, and update is remembered and queryable." },
  ];
  return (
    <section id="features" style={{ background: T.bg, padding: "100px max(24px, 4vw)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <motion.div {...fadeUp}><SectionLabel><Building2 size={12}/> What is BuilderOS</SectionLabel></motion.div>
          <motion.div {...stagger(1)}><SectionTitle center>An AI-Native Company Operating System</SectionTitle></motion.div>
          <motion.div {...stagger(2)}><SectionSub center>
            BuilderOS is not a chatbot. It's a full-stack operating system where specialized AI agents run every department of your company — continuously, autonomously, intelligently.
          </SectionSub></motion.div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {cards.map((c, i) => (
            <motion.div key={c.title} {...stagger(i)} whileHover={{ x: -3, y: -3, boxShadow: `9px 9px 0 ${T.border}` }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              style={{ ...cardStyle(c.color), padding: 32 }}>
              <div style={{ width: 52, height: 52, background: T.card, border: `2px solid ${T.border}`,
                borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                {c.icon}
              </div>
              <h3 style={{ fontWeight: 800, fontSize: 20, color: T.text, marginBottom: 12 }}>{c.title}</h3>
              <p style={{ fontSize: 15, color: T.sub, lineHeight: 1.7 }}>{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── THE PROBLEM ─────────────────────────────────────────────── */
function Problem() {
  const items = [
    "Manually triaging every Discord bug report",
    "Writing and updating documentation by hand",
    "Answering the same support emails daily",
    "Managing releases across tools manually",
    "Keeping knowledge bases current",
    "Reviewing every PR and comment",
    "Generating and approving announcements",
    "Tracking roadmap and sprint status",
  ];
  return (
    <section style={{ background: T.bgAlt, borderTop: `3px solid ${T.border}`, padding: "100px max(24px, 4vw)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}
        className="two-col-grid">
        <div>
          <motion.div {...fadeUp}><SectionLabel><Clock size={12}/> The Problem</SectionLabel></motion.div>
          <motion.div {...stagger(1)}><SectionTitle>Traditional startups burn hours on manual operations.</SectionTitle></motion.div>
          <motion.div {...stagger(2)}><SectionSub>Every growing startup hits the same wall — too many operational tasks, too few people, and zero automation. Your engineers become support agents. Your founders become project managers.</SectionSub></motion.div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((item, i) => (
            <motion.div key={i} {...stagger(i * 0.5 + 1)}
              style={{ ...cardStyle(), padding: "14px 20px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.danger, flexShrink: 0 }}/>
              <span style={{ fontWeight: 500, fontSize: 14, color: T.sub }}>{item}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── THE SOLUTION ─────────────────────────────────────────────── */
function Solution() {
  const depts = [
    { label: "Engineering",   color: "#E8F0FF", icon: <Terminal size={16}/> },
    { label: "Community",     color: "#E8F9E8", icon: <Users size={16}/> },
    { label: "Support",       color: "#FDECEA", icon: <LifeBuoy size={16}/> },
    { label: "Documentation", color: "#FFF5CC", icon: <FileText size={16}/> },
    { label: "Knowledge",     color: "#FFF3E0", icon: <Brain size={16}/> },
    { label: "Releases",      color: "#E8F0FF", icon: <Layers size={16}/> },
    { label: "Analytics",     color: "#E8F9E8", icon: <BarChart3 size={16}/> },
    { label: "Approvals",     color: "#FFF5CC", icon: <CheckSquare size={16}/> },
  ];
  return (
    <section style={{ background: T.bg, padding: "100px max(24px, 4vw)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}
          className="two-col-grid">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {depts.map((d, i) => (
              <motion.div key={d.label} {...stagger(i * 0.5)}
                whileHover={{ x: -3, y: -3, boxShadow: `9px 9px 0 ${T.border}` }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                style={{ ...cardStyle(d.color), padding: "16px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                {d.icon}
                <span style={{ fontWeight: 700, fontSize: 13 }}>{d.label}</span>
                <span style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: T.success }}/>
              </motion.div>
            ))}
          </div>
          <div>
            <motion.div {...fadeUp}><SectionLabel><Zap size={12}/> The Solution</SectionLabel></motion.div>
            <motion.div {...stagger(1)}><SectionTitle>Every department becomes autonomous overnight.</SectionTitle></motion.div>
            <motion.div {...stagger(2)}><SectionSub>
              BuilderOS deploys specialized AI agents into each department. They monitor inputs, execute workflows, update memory, and surface insights — autonomously, continuously, and without human micromanagement.
            </SectionSub></motion.div>
            <motion.div {...stagger(3)} style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
              {["Zero manual triage", "Real-time knowledge updates", "Automated release notes", "Instant support replies"].map(t => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: T.success,
                    border: `2px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width={10} height={10} viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth={1.8} fill="none" strokeLinecap="round"/></svg>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: 14, color: T.text }}>{t}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── HOW IT WORKS ─────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { step: "01", title: "Discord Message",     desc: "User reports a bug in your Discord server.",          color: "#E8F0FF", icon: <MessageSquare size={18}/> },
    { step: "02", title: "Community Agent",     desc: "Agent captures the message and classifies it.",       color: "#FFF5CC", icon: <Bot size={18}/> },
    { step: "03", title: "Knowledge Agent",     desc: "Searches the knowledge base for related context.",    color: "#E8F9E8", icon: <Brain size={18}/> },
    { step: "04", title: "Engineering Agent",   desc: "Creates a Linear issue with AI-generated detail.",    color: "#FDECEA", icon: <Terminal size={18}/> },
    { step: "05", title: "Documentation Agent", desc: "Updates docs if a known fix is already available.",   color: "#FFF3E0", icon: <FileText size={18}/> },
    { step: "06", title: "Release Agent",       desc: "Adds the fix to the upcoming release log.",           color: "#E8F0FF", icon: <Layers size={18}/> },
    { step: "07", title: "Founder Approval",    desc: "Surfaces for human sign-off before announcing.",      color: "#FFF5CC", icon: <CheckSquare size={18}/> },
    { step: "08", title: "Announcement",        desc: "Posts the fix note to Discord automatically.",        color: "#E8F9E8", icon: <Zap size={18}/> },
  ];
  return (
    <section id="workflows" style={{ background: T.bgAlt, borderTop: `3px solid ${T.border}`, padding: "100px max(24px, 4vw)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <motion.div {...fadeUp}><SectionLabel><Workflow size={12}/> How It Works</SectionLabel></motion.div>
          <motion.div {...stagger(1)}><SectionTitle center>From Discord Bug to Fixed Release — Automatically.</SectionTitle></motion.div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {steps.map((s, i) => (
            <motion.div key={s.step} {...stagger(i * 0.5)}
              style={{ ...cardStyle(s.color), padding: 24, position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <span style={{ fontWeight: 900, fontSize: 13, color: T.muted, letterSpacing: "0.05em" }}>STEP {s.step}</span>
                <div style={{ width: 36, height: 36, background: T.card, border: `2px solid ${T.border}`,
                  borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {s.icon}
                </div>
              </div>
              <h3 style={{ fontWeight: 800, fontSize: 16, color: T.text, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: T.sub, lineHeight: 1.6 }}>{s.desc}</p>
              {i < steps.length - 1 && (
                <div style={{ position: "absolute", bottom: -18, left: "50%", transform: "translateX(-50%)",
                  width: 28, height: 28, background: T.accent, border: `2px solid ${T.border}`, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                  <ChevronDown size={14}/>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── AGENT ECOSYSTEM ──────────────────────────────────────────── */
function AgentEcosystem() {
  const agents = [
    { name: "Company Orchestrator", role: "Coordinates all agents and maintains company health.", inputs: ["All events"], outputs: ["Decisions","Reports"], color: "#FFF5CC" },
    { name: "Engineering Agent",    role: "Syncs Linear issues, manages sprints, writes PR summaries.", inputs: ["Linear","GitHub"], outputs: ["Issues","Reports"], color: "#E8F0FF" },
    { name: "Community Agent",      role: "Monitors Discord, classifies messages, posts responses.", inputs: ["Discord"], outputs: ["Replies","Tickets"], color: "#E8F9E8" },
    { name: "Support Agent",        role: "Triages Gmail tickets, drafts replies, escalates criticals.", inputs: ["Gmail"], outputs: ["Replies","Escalations"], color: "#FDECEA" },
    { name: "Knowledge Agent",      role: "Indexes docs, Confluence, wikis into a semantic search engine.", inputs: ["Confluence","Docs"], outputs: ["KB Articles"], color: "#FFF3E0" },
    { name: "Documentation Agent",  role: "Audits and generates technical guides from codebase changes.", inputs: ["GitHub","Docs"], outputs: ["Published Docs"], color: "#FFF5CC" },
    { name: "Release Agent",        role: "Generates release notes, syncs deployment status.", inputs: ["Git tags","Linear"], outputs: ["Release Notes"], color: "#E8F0FF" },
    { name: "Marketing Agent",      role: "Writes announcements and social posts pending approval.", inputs: ["Releases"], outputs: ["Announcements"], color: "#E8F9E8" },
    { name: "Analytics Agent",      role: "Aggregates telemetry and generates weekly digests.", inputs: ["All tables"], outputs: ["Dashboards","Reports"], color: "#FFF3E0" },
    { name: "Product Agent",        role: "Maintains roadmap, tracks milestones, surfaces blockers.", inputs: ["Linear","Feedback"], outputs: ["Roadmap updates"], color: "#FDECEA" },
  ];
  const [active, setActive] = useState(null);
  return (
    <section id="agents" style={{ background: T.bg, padding: "100px max(24px, 4vw)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <motion.div {...fadeUp}><SectionLabel><Bot size={12}/> Agent Ecosystem</SectionLabel></motion.div>
          <motion.div {...stagger(1)}><SectionTitle center>10 Specialized AI Agents. One OS.</SectionTitle></motion.div>
          <motion.div {...stagger(2)}><SectionSub center>Click any agent to learn what it does, what it reads, and what it produces.</SectionSub></motion.div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {agents.map((a, i) => (
            <motion.div key={a.name} {...stagger(i * 0.3)}
              whileHover={{ x: -3, y: -3, boxShadow: `9px 9px 0 ${T.border}` }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              style={{
                ...cardStyle(active === i ? T.accent : a.color),
                padding: 20, cursor: "pointer",
                borderColor: active === i ? T.border : T.border,
              }}
              onClick={() => setActive(active === i ? null : i)}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <Bot size={18}/>
                <Badge color={T.success}>Active</Badge>
              </div>
              <div style={{ fontWeight: 800, fontSize: 14, color: T.text, marginBottom: 6 }}>{a.name}</div>
              <div style={{ fontSize: 12, color: T.sub, lineHeight: 1.5 }}>{a.role}</div>
              <AnimatePresence>
                {active === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} style={{ marginTop: 12, overflow: "hidden" }}>
                    <div style={{ paddingTop: 12, borderTop: `2px solid ${T.border}` }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, marginBottom: 4, textTransform: "uppercase" }}>Inputs</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                        {a.inputs.map(inp => <Badge key={inp} color={T.card}>{inp}</Badge>)}
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, marginBottom: 4, textTransform: "uppercase" }}>Outputs</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {a.outputs.map(out => <Badge key={out} color="#E8F9E8">{out}</Badge>)}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FEATURES ─────────────────────────────────────────────────── */
function Features() {
  const feats = [
    { icon: <Bot size={20}/>,         title: "Autonomous Agents",     desc: "Deploy specialized AI agents per department.", color: "#FFF5CC" },
    { icon: <Workflow size={20}/>,     title: "Workflow Automation",   desc: "Event-driven multi-step agent pipelines.",     color: "#E8F0FF" },
    { icon: <Brain size={20}/>,        title: "Semantic Search",       desc: "Natural language search across company data.", color: "#E8F9E8" },
    { icon: <BarChart3 size={20}/>,    title: "Live Dashboard",        desc: "Real-time health scores and activity feeds.",  color: "#FFF3E0" },
    { icon: <CheckSquare size={20}/>,  title: "Founder Approvals",     desc: "Human-in-the-loop sign-off for key actions.", color: "#FDECEA" },
    { icon: <TrendingUp size={20}/>,   title: "Analytics",             desc: "Cross-department metrics and weekly digests.", color: "#FFF5CC" },
    { icon: <MessageSquare size={20}/>,title: "Discord Integration",   desc: "Auto-triage Discord bugs and questions.",      color: "#E8F0FF" },
    { icon: <GitBranch size={20}/>,    title: "Linear Integration",    desc: "Sync engineering issues bi-directionally.",    color: "#E8F9E8" },
    { icon: <Mail size={20}/>,         title: "Gmail Integration",     desc: "Auto-respond and route support emails.",       color: "#FDECEA" },
    { icon: <Database size={20}/>,     title: "Company Memory",        desc: "Relational datastore for all agent state.",    color: "#FFF5CC" },
    { icon: <Activity size={20}/>,     title: "Live Activity",         desc: "Real-time timeline of all agent actions.",     color: "#E8F0FF" },
    { icon: <Layers size={20}/>,       title: "Release Automation",    desc: "Generate notes and announcements on deploy.",  color: "#E8F9E8" },
    { icon: <FileText size={20}/>,     title: "Doc Generation",        desc: "AI-authored docs synced from codebase.",       color: "#FFF3E0" },
    { icon: <Shield size={20}/>,       title: "Secure by Default",     desc: "Pod-scoped access and audit trails.",          color: "#FDECEA" },
    { icon: <Network size={20}/>,      title: "Department Intelligence",desc: "Per-department health and anomaly detection.", color: "#FFF5CC" },
  ];
  return (
    <section style={{ background: T.bgAlt, borderTop: `3px solid ${T.border}`, padding: "100px max(24px, 4vw)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <motion.div {...fadeUp}><SectionLabel><Sparkles size={12}/> Features</SectionLabel></motion.div>
          <motion.div {...stagger(1)}><SectionTitle center>Everything a modern AI company needs.</SectionTitle></motion.div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {feats.map((f, i) => (
            <motion.div key={f.title} {...stagger(i * 0.2)}
              whileHover={{ x: -3, y: -3, boxShadow: `9px 9px 0 ${T.border}` }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              style={{ ...cardStyle(f.color), padding: 24 }}>
              <div style={{ width: 40, height: 40, background: T.card, border: `2px solid ${T.border}`,
                borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                {f.icon}
              </div>
              <div style={{ fontWeight: 800, fontSize: 15, color: T.text, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: T.sub, lineHeight: 1.6 }}>{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── WORKFLOW SHOWCASE ────────────────────────────────────────── */
function WorkflowShowcase() {
  const tabs = [
    {
      id: "engineering", label: "Engineering",
      steps: ["Linear Issue Created","Engineering Agent Picks Up","Code Review Analysis","Sprint Updated","PR Opened","Release Logged"],
      colors: ["#E8F0FF","#FFF5CC","#E8F9E8","#E8F0FF","#FFF5CC","#E8F9E8"],
    },
    {
      id: "community", label: "Community",
      steps: ["Discord Message","Community Agent Reads","KB Search","Response Drafted","Auto-Reply Sent","Ticket Filed"],
      colors: ["#E8F9E8","#FFF5CC","#E8F0FF","#E8F9E8","#FFF5CC","#E8F0FF"],
    },
    {
      id: "support", label: "Support",
      steps: ["Gmail Ticket","Support Agent Reads","Priority Set","Reply Drafted","Founder Review","Response Sent"],
      colors: ["#FDECEA","#FFF5CC","#FDECEA","#E8F9E8","#FFF5CC","#E8F9E8"],
    },
    {
      id: "releases", label: "Releases",
      steps: ["Git Tag Pushed","Release Agent Starts","Issues Collected","Notes Generated","Announcement Drafted","Founder Approves"],
      colors: ["#E8F0FF","#FFF5CC","#E8F9E8","#E8F0FF","#FFF5CC","#FDECEA"],
    },
  ];
  const [active, setActive] = useState(0);

  return (
    <section style={{ background: T.bg, padding: "100px max(24px, 4vw)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <motion.div {...fadeUp}><SectionLabel><Workflow size={12}/> Workflow Showcase</SectionLabel></motion.div>
          <motion.div {...stagger(1)}><SectionTitle center>Live Workflow Examples</SectionTitle></motion.div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 40, flexWrap: "wrap" }}>
          {tabs.map((t, i) => (
            <button key={t.id} onClick={() => setActive(i)}
              style={{
                ...btnStyle(active === i ? T.accent : T.card),
                padding: "10px 22px",
              }}>
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
              {tabs[active].steps.map((step, i) => (
                <React.Fragment key={step}>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    style={{ ...cardStyle(tabs[active].colors[i]), padding: "14px 20px", minWidth: 140, textAlign: "center" }}>
                    <div style={{ fontWeight: 700, fontSize: 11, color: T.muted, marginBottom: 4 }}>STEP {String(i+1).padStart(2,"0")}</div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: T.text }}>{step}</div>
                  </motion.div>
                  {i < tabs[active].steps.length - 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 + 0.15 }}>
                      <ArrowRight size={20} color={T.muted}/>
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ── DASHBOARD PREVIEW ────────────────────────────────────────── */
function DashboardPreview({ onDash }) {
  const mockStats = [
    { label: "Health Score", val: "98%", color: "#E8F9E8" },
    { label: "Open Issues",  val: "5",   color: "#FFF5CC" },
    { label: "Pending",      val: "2",   color: "#FDECEA" },
    { label: "Agent Runs",   val: "147", color: "#E8F0FF" },
  ];
  return (
    <section style={{ background: T.bgAlt, borderTop: `3px solid ${T.border}`, padding: "100px max(24px, 4vw)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <motion.div {...fadeUp}><SectionLabel><BarChart3 size={12}/> Live Dashboard</SectionLabel></motion.div>
          <motion.div {...stagger(1)}><SectionTitle center>Your AI OS — at a glance.</SectionTitle></motion.div>
          <motion.div {...stagger(2)}><SectionSub center>A real-time view of every department, agent, and workflow — all in one place.</SectionSub></motion.div>
        </div>

        {/* Mock dashboard frame */}
        <motion.div {...stagger(3)} style={{ ...cardStyle(), overflow: "hidden" }}>
          {/* Mock header */}
          <div style={{ background: T.bgAlt, borderBottom: `2px solid #E8E0CC`, padding: "12px 24px",
            display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {["#E85B5B","#F5A524","#64C87A"].map(c => (
                <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c, border: `1.5px solid ${T.border}` }}/>
              ))}
            </div>
            <div style={{ flex: 1, background: T.card, border: `2px solid ${T.border}`, borderRadius: 6,
              padding: "4px 12px", fontSize: 12, color: T.muted, fontWeight: 600 }}>
              builder-os-dashboard.apps.lemma.work
            </div>
          </div>

          {/* Mock content */}
          <div style={{ padding: 24, background: T.bg }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}
              className="four-col-grid">
              {mockStats.map((s, i) => (
                <div key={s.label} style={{ ...cardStyle(s.color), padding: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: T.text, lineHeight: 1 }}>{s.val}</div>
                </div>
              ))}
            </div>

            {/* Mock chart */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }} className="two-col-grid">
              <div style={{ ...cardStyle(), padding: 20 }}>
                <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 16 }}>AI Event Activity</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
                  {[30,45,28,60,52,70,65,80,58,72,88,75].map((h,i) => (
                    <motion.div key={i}
                      initial={{ height: 0 }} animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.05, duration: 0.5 }}
                      style={{ flex: 1, background: i % 3 === 0 ? T.accent : T.bgAlt,
                        border: `2px solid ${T.border}`, borderRadius: "4px 4px 0 0", minWidth: 0 }}/>
                  ))}
                </div>
              </div>
              <div style={{ ...cardStyle(), padding: 20 }}>
                <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 14 }}>Agents</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {["Orchestrator","Engineering","Community"].map(a => (
                    <div key={a} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: T.sub }}>{a}</span>
                      <Badge color="#E8F9E8">Active</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <motion.button {...hoverProps} style={btnStyle(T.accent)} onClick={onDash}>
            <ExternalLink size={15}/> Open Live Dashboard
          </motion.button>
        </div>
      </div>
    </section>
  );
}

/* ── INTEGRATIONS ─────────────────────────────────────────────── */
function Integrations() {
  const items = [
    { name: "Lemma SDK",    icon: <Command size={24}/>,     color: "#FFF5CC", desc: "Core agent runtime" },
    { name: "Discord",      icon: <MessageSquare size={24}/>,color: "#E8F0FF", desc: "Community events" },
    { name: "Linear",       icon: <GitBranch size={24}/>,   color: "#FDECEA", desc: "Issue tracking" },
    { name: "Gmail",        icon: <Mail size={24}/>,        color: "#E8F9E8", desc: "Support emails" },
    { name: "React",        icon: <Cpu size={24}/>,         color: "#E8F0FF", desc: "UI framework" },
    { name: "Vite",         icon: <Zap size={24}/>,         color: "#FFF5CC", desc: "Build tooling" },
    { name: "Framer Motion",icon: <Activity size={24}/>,    color: "#FFF3E0", desc: "Animations" },
    { name: "Lucide",       icon: <Star size={24}/>,        color: "#E8F9E8", desc: "Icon system" },
    { name: "Tailwind CSS", icon: <Globe size={24}/>,       color: "#FFF5CC", desc: "Styling" },
  ];
  return (
    <section style={{ background: T.bg, padding: "100px max(24px, 4vw)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <motion.div {...fadeUp}><SectionLabel><Link size={12}/> Integrations</SectionLabel></motion.div>
          <motion.div {...stagger(1)}><SectionTitle center>Connects to everything your team already uses.</SectionTitle></motion.div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
          {items.map((it, i) => (
            <motion.div key={it.name} {...stagger(i * 0.3)}
              whileHover={{ x: -3, y: -3, boxShadow: `9px 9px 0 ${T.border}` }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              style={{ ...cardStyle(it.color), padding: 24, textAlign: "center" }}>
              <div style={{ width: 52, height: 52, background: T.card, border: `2px solid ${T.border}`,
                borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 14px" }}>
                {it.icon}
              </div>
              <div style={{ fontWeight: 800, fontSize: 14, color: T.text, marginBottom: 4 }}>{it.name}</div>
              <div style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>{it.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── WHY LEMMA ────────────────────────────────────────────────── */
function WhyLemma() {
  const pillars = [
    { title: "Agents",     icon: <Bot size={18}/>,      desc: "Deploy Python functions as persistent AI agents with full runtime context.", color: "#FFF5CC" },
    { title: "Tables",     icon: <Database size={18}/>, desc: "Relational datastores with typed schemas, relations, and live queries.",       color: "#E8F0FF" },
    { title: "Knowledge",  icon: <Brain size={18}/>,    desc: "Built-in vector knowledge base with semantic search and RAG pipelines.",       color: "#E8F9E8" },
    { title: "Functions",  icon: <Zap size={18}/>,      desc: "Event-triggered serverless functions that execute on any platform signal.",    color: "#FFF3E0" },
    { title: "Workflows",  icon: <Workflow size={18}/>, desc: "Visual workflow editor with branching, conditions, and agent handoffs.",       color: "#FDECEA" },
    { title: "Surfaces",   icon: <Globe size={18}/>,    desc: "Host frontend apps and APIs directly within the Lemma pod ecosystem.",         color: "#FFF5CC" },
    { title: "Connectors", icon: <Link size={18}/>,     desc: "OAuth integrations for Discord, Linear, Gmail, GitHub and more.",             color: "#E8F0FF" },
  ];
  return (
    <section style={{ background: T.bgAlt, borderTop: `3px solid ${T.border}`, padding: "100px max(24px, 4vw)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }} className="two-col-grid">
          <div style={{ position: "sticky", top: 100 }}>
            <motion.div {...fadeUp}><SectionLabel><Command size={12}/> Powered by Lemma SDK</SectionLabel></motion.div>
            <motion.div {...stagger(1)}><SectionTitle>The infrastructure layer that makes BuilderOS possible.</SectionTitle></motion.div>
            <motion.div {...stagger(2)}><SectionSub>
              Lemma SDK provides the complete primitive set for running autonomous AI agents in production: persistent tables, semantic knowledge, event-driven workflows, and native connectors — all unified in a single development environment.
            </SectionSub></motion.div>
            <motion.div {...stagger(3)} style={{ marginTop: 32 }}>
              <motion.a {...hoverProps} href="https://lemma.work" target="_blank" rel="noopener noreferrer"
                style={btnStyle(T.accent)}>
                Explore Lemma SDK <ExternalLink size={14}/>
              </motion.a>
            </motion.div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {pillars.map((p, i) => (
              <motion.div key={p.title} {...stagger(i * 0.4)}
                whileHover={{ x: -3, y: -3, boxShadow: `9px 9px 0 ${T.border}` }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                style={{ ...cardStyle(p.color), padding: "18px 22px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 36, height: 36, background: T.card, border: `2px solid ${T.border}`,
                  borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {p.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: T.text, marginBottom: 4 }}>{p.title}</div>
                  <div style={{ fontSize: 13, color: T.sub, lineHeight: 1.6 }}>{p.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── METRICS ──────────────────────────────────────────────────── */
function Metrics() {
  const items = [
    { target: 10,  suffix: "+", label: "AI Agents Deployed",         color: "#FFF5CC" },
    { target: 14,  suffix: "+", label: "Relational Tables",           color: "#E8F0FF" },
    { target: 9,   suffix: "+", label: "Automated Workflows",         color: "#E8F9E8" },
    { target: 3,   suffix: "+", label: "Native Connectors",           color: "#FDECEA" },
    { target: 100, suffix: "%", label: "Autonomous Operations",       color: "#FFF3E0" },
  ];
  return (
    <section style={{ background: T.accent, borderTop: `3px solid ${T.border}`, borderBottom: `3px solid ${T.border}`, padding: "80px max(24px, 4vw)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20 }}>
          {items.map((m, i) => (
            <motion.div key={m.label} {...stagger(i * 0.3)}
              style={{ ...cardStyle(m.color), padding: "28px 24px", textAlign: "center" }}>
              <div style={{ fontWeight: 900, fontSize: 52, color: T.text, lineHeight: 1, letterSpacing: "-2px" }}>
                <Counter target={m.target} suffix={m.suffix}/>
              </div>
              <div style={{ fontWeight: 700, fontSize: 13, color: T.muted, marginTop: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>{m.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── TESTIMONIALS ─────────────────────────────────────────────── */
function Testimonials() {
  const items = [
    { name: "Alex M.", role: "Founder & CEO", quote: "BuilderOS cut our operational overhead by 80%. Our Discord community now gets instant, accurate responses 24/7 — and our engineering backlog auto-triages itself.", color: "#FFF5CC" },
    { name: "Sarah K.", role: "Engineering Manager", quote: "Having a dedicated Engineering Agent that syncs with Linear and generates sprint reports autonomously is a game-changer. My team focuses on shipping, not reporting.", color: "#E8F0FF" },
    { name: "Marcus T.", role: "Community Lead", quote: "Before BuilderOS, I spent 4 hours a day on Discord. Now the Community Agent handles everything intelligently, escalating only what truly needs human judgment.", color: "#E8F9E8" },
  ];
  return (
    <section style={{ background: T.bg, padding: "100px max(24px, 4vw)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <motion.div {...fadeUp}><SectionLabel><Star size={12}/> Testimonials</SectionLabel></motion.div>
          <motion.div {...stagger(1)}><SectionTitle center>Teams that run on BuilderOS.</SectionTitle></motion.div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {items.map((t, i) => (
            <motion.div key={t.name} {...stagger(i * 0.4)}
              whileHover={{ x: -3, y: -3, boxShadow: `9px 9px 0 ${T.border}` }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              style={{ ...cardStyle(t.color), padding: 32 }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                {[...Array(5)].map((_,j) => <Star key={j} size={16} fill={T.warn} color={T.warn}/>)}
              </div>
              <p style={{ fontSize: 15, color: T.sub, lineHeight: 1.75, fontStyle: "italic", marginBottom: 24 }}>
                "{t.quote}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, background: T.border, borderRadius: "50%",
                  border: `2px solid ${T.border}`, display: "flex", alignItems: "center",
                  justifyContent: "center", fontWeight: 900, fontSize: 16, color: "#fff" }}>
                  {t.name[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: T.text }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── ROADMAP ──────────────────────────────────────────────────── */
function Roadmap() {
  const items = [
    { phase: "Now",       title: "AI Agent Fleet v1",       desc: "10 agents, 14 tables, 9 workflows, 3 connectors live in production.",       color: T.success, done: true },
    { phase: "Next",      title: "Enterprise Multi-Company", desc: "Multi-pod orchestration for agencies and enterprise clients.",                color: T.warn,    done: false },
    { phase: "Q4 2026",   title: "Voice Agents",             desc: "Voice-activated agent interactions via Whisper and ElevenLabs.",             color: T.info,    done: false },
    { phase: "2027",      title: "Agent Marketplace",        desc: "Community-contributed specialized agents available as one-click deploys.",   color: T.muted,   done: false },
  ];
  return (
    <section style={{ background: T.bgAlt, borderTop: `3px solid ${T.border}`, padding: "100px max(24px, 4vw)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <motion.div {...fadeUp}><SectionLabel><Map size={12}/> Roadmap</SectionLabel></motion.div>
          <motion.div {...stagger(1)}><SectionTitle center>Where BuilderOS is heading.</SectionTitle></motion.div>
        </div>
        <div style={{ position: "relative" }}>
          {/* Vertical line */}
          <div style={{ position: "absolute", left: 19, top: 0, bottom: 0, width: 2, background: "#E8E0CC" }}/>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {items.map((it, i) => (
              <motion.div key={it.phase} {...stagger(i * 0.3)}
                style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: it.done ? it.color : T.card,
                  border: `3px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, zIndex: 1 }}>
                  {it.done && <svg width={14} height={14} viewBox="0 0 14 14"><path d="M2 7l3.5 3.5L12 3.5" stroke="#fff" strokeWidth={2} fill="none" strokeLinecap="round"/></svg>}
                </div>
                <div style={{ ...cardStyle(), padding: "20px 24px", flex: 1 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                    <Badge color={it.done ? "#E8F9E8" : T.bgAlt}>{it.phase}</Badge>
                    <span style={{ fontWeight: 800, fontSize: 16, color: T.text }}>{it.title}</span>
                  </div>
                  <p style={{ fontSize: 14, color: T.sub, lineHeight: 1.6 }}>{it.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ──────────────────────────────────────────────────────── */
function FAQ() {
  const items = [
    { q: "What is BuilderOS?", a: "BuilderOS is an AI-native Company Operating System that deploys specialized AI agents to autonomously run every department — engineering, support, community, documentation, and operations — powered by the Lemma SDK." },
    { q: "What is the Lemma SDK?", a: "Lemma is a developer platform that provides the full infrastructure for building AI-native products: persistent agents, relational datastores, vector knowledge bases, event-driven workflows, and native connectors." },
    { q: "Is BuilderOS secure?", a: "Yes. All data is scoped to your Lemma pod, which is isolated per organization. Agent access is controlled by permission manifests, and all actions are fully auditable through the datastore." },
    { q: "What integrations does BuilderOS support?", a: "BuilderOS connects to Discord (community events), Linear (engineering issues), Gmail (support tickets), and any HTTP endpoint via Lemma's connector system. More integrations are coming." },
    { q: "Do AI agents replace humans?", a: "No. BuilderOS augments your team with AI automation so humans focus on high-leverage decisions. Agents surface insights, execute routine tasks, and escalate exceptions for human review via the Approvals system." },
    { q: "When is pricing available?", a: "BuilderOS is currently in hackathon demo phase. Enterprise pricing and self-hosted options will be announced in Q4 2026. Join the waitlist to be notified." },
  ];
  return (
    <section style={{ background: T.bg, padding: "100px max(24px, 4vw)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <motion.div {...fadeUp}><SectionLabel>FAQ</SectionLabel></motion.div>
          <motion.div {...stagger(1)}><SectionTitle center>Frequently asked questions.</SectionTitle></motion.div>
        </div>
        {items.map((item, i) => <FAQItem key={i} q={item.q} a={item.a} index={i}/>)}
      </div>
    </section>
  );
}

/* ── FINAL CTA ────────────────────────────────────────────────── */
function FinalCTA({ onDash }) {
  return (
    <section style={{ background: T.accent, borderTop: `3px solid ${T.border}`, padding: "100px max(24px, 4vw)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <motion.div {...fadeUp}>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, color: T.text,
            lineHeight: 1.1, letterSpacing: "-1px", marginBottom: 20 }}>
            Ready to Let AI Run<br/>Your Operations?
          </h2>
        </motion.div>
        <motion.div {...stagger(1)}>
          <p style={{ fontSize: 18, color: T.sub, lineHeight: 1.7, marginBottom: 40 }}>
            BuilderOS is live. Your agents are waiting. Deploy your AI Operating System today.
          </p>
        </motion.div>
        <motion.div {...stagger(2)} style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <motion.button {...hoverProps} style={btnStyle(T.border, { color: "#fff", fontSize: 16, padding: "16px 32px" })} onClick={onDash}>
            <Play size={16}/> Launch BuilderOS
          </motion.button>
          <motion.a {...hoverProps} href="#architecture" style={btnStyle(T.card, { fontSize: 16, padding: "16px 32px" })}>
            Explore Architecture <ArrowRight size={16}/>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

/* ── FOOTER ───────────────────────────────────────────────────── */
function Footer({ onDash }) {
  return (
    <footer style={{ background: T.border, color: "#fff", padding: "60px max(24px, 4vw) 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}
          className="footer-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, background: T.accent, border: `2px solid rgba(255,255,255,0.2)`,
                borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 900, fontSize: 18, color: T.text }}>B</div>
              <span style={{ fontWeight: 900, fontSize: 18 }}>BuilderOS</span>
            </div>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 280 }}>
              An AI-native Company Operating System where specialized agents run every department — autonomously, continuously, intelligently.
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 16 }}>Powered by Lemma SDK</p>
          </div>
          {[
            { heading: "Product", links: ["Dashboard", "Features", "Agents", "Workflows", "Architecture"] },
            { heading: "Resources", links: ["Documentation", "Lemma SDK", "GitHub", "Changelog", "Status"] },
            { heading: "Company", links: ["About", "Hackathon", "Community", "Contact", "Privacy"] },
          ].map(col => (
            <div key={col.heading}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>{col.heading}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map(l => (
                  <a key={l} href="#"
                    style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", textDecoration: "none", fontWeight: 500,
                      transition: "color 0.15s" }}
                    onMouseEnter={e => { e.target.style.color = T.accent; }}
                    onMouseLeave={e => { e.target.style.color = "rgba(255,255,255,0.7)"; }}
                  >{l}</a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 32,
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            © 2026 BuilderOS. Built with Lemma SDK for Lemma Hackathon.
          </p>
          <motion.button {...hoverProps}
            style={{ ...btnStyle(T.accent), fontSize: 13, padding: "8px 18px" }}
            onClick={onDash}>
            Launch Dashboard <ArrowRight size={13}/>
          </motion.button>
        </div>
      </div>
    </footer>
  );
}

/* ================================================================
   RESPONSIVE CSS (injected into head)
   ================================================================ */
const RESPONSIVE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  * { font-family: 'Inter', system-ui, sans-serif; }
  .hero-grid         { grid-template-columns: 1fr 1fr; }
  .two-col-grid      { grid-template-columns: 1fr 1fr; }
  .four-col-grid     { grid-template-columns: repeat(4, 1fr); }
  .footer-grid       { grid-template-columns: 2fr 1fr 1fr 1fr; }
  .hero-visual       { display: block; }
  .nav-links-desktop { display: flex; }
  @media (max-width: 900px) {
    .hero-grid    { grid-template-columns: 1fr !important; }
    .hero-visual  { display: none !important; }
    .two-col-grid { grid-template-columns: 1fr !important; }
    .four-col-grid{ grid-template-columns: repeat(2, 1fr) !important; }
    .footer-grid  { grid-template-columns: 1fr 1fr !important; }
    .nav-links-desktop { display: none !important; }
  }
  @media (max-width: 480px) {
    .four-col-grid { grid-template-columns: 1fr 1fr !important; }
    .footer-grid   { grid-template-columns: 1fr !important; }
  }
`;

/* ================================================================
   MAIN EXPORT
   ================================================================ */
export default function LandingPage({ onDash }) {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = RESPONSIVE_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: T.bg, overflowX: "hidden" }}>
      <Navbar onDash={onDash}/>
      <Hero onDash={onDash}/>
      <TrustBar/>
      <WhatIs/>
      <Problem/>
      <Solution/>
      <HowItWorks/>
      <AgentEcosystem/>
      <Features/>
      <WorkflowShowcase/>
      <DashboardPreview onDash={onDash}/>
      <Integrations/>
      <WhyLemma/>
      <Metrics/>
      <Testimonials/>
      <Roadmap/>
      <FAQ/>
      <FinalCTA onDash={onDash}/>
      <Footer onDash={onDash}/>
    </div>
  );
}
