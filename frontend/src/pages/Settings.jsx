import React from "react";
import { motion } from "framer-motion";
import { Settings, Plug, ShieldCheck, Users, Bell, Key, Palette, Globe, Link } from "lucide-react";
import { useLemma } from "../context/LemmaContext";
import { Card, SectionHead, statusBadge, pageFade } from "../components/ui/index.jsx";

const CONNECTORS = [
  { name: "Linear Integration",  desc: "Engineering sync & issue mapping",  status: "connected", icon: Link,        color: "#E8F0FF" },
  { name: "Gmail Connector",     desc: "Customer ticket intake events",      status: "connected", icon: Globe,       color: "#E8F9E8" },
  { name: "Discord Hub",         desc: "Message events in guild channels",   status: "active",    icon: Bell,        color: "#FFF5CC" },
];

const SETTINGS_SECTIONS = [
  { label: "Workspace",     icon: Settings  },
  { label: "Members",       icon: Users     },
  { label: "Integrations",  icon: Plug      },
  { label: "API",           icon: Key       },
  { label: "Security",      icon: ShieldCheck},
  { label: "Notifications", icon: Bell      },
  { label: "Theme",         icon: Palette   },
];

export function SettingsPage() {
  const { status, podId } = useLemma();
  const [activeSection, setActiveSection] = React.useState("Workspace");

  return (
    <motion.div {...pageFade} className="flex flex-col gap-8">
      <SectionHead
        title="Settings"
        subtitle="Workspace configuration, integrations, agents, and security."
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Nav */}
        <div className="lg:col-span-1">
          <Card className="p-3 flex flex-col gap-1">
            {SETTINGS_SECTIONS.map(s => {
              const Icon = s.icon;
              const active = activeSection === s.label;
              return (
                <button
                  key={s.label}
                  onClick={() => setActiveSection(s.label)}
                  className={`nb-nav-item ${active ? "active" : ""}`}
                >
                  <Icon size={16}/>
                  {s.label}
                </button>
              );
            })}
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          {/* Workspace / Profile */}
          <Card className="p-6">
            <h3 className="font-extrabold text-[18px] mb-5">Workspace</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: "Workspace Name",   val: "BuilderOS"                    },
                { label: "Slug",             val: "builder-os"                   },
                { label: "SDK Status",       val: status                         },
                { label: "Pod ID",           val: podId ? podId.slice(0,16) + "…" : "Standalone" },
                { label: "Region",           val: "US-East"                      },
                { label: "Plan",             val: "Founder"                      },
              ].map(f => (
                <div key={f.label}>
                  <label className="nb-label">{f.label}</label>
                  <div
                    className="rounded-[12px] px-4 py-3 font-semibold text-[14px] text-[#1A1A1A]"
                    style={{ border: "2px solid #1F1F1F", background: "#FFF7E8" }}
                  >{f.val}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Connectors */}
          <Card className="p-6">
            <h3 className="font-extrabold text-[18px] mb-5">Active Integrations</h3>
            <div className="flex flex-col gap-3">
              {CONNECTORS.map(c => {
                const Icon = c.icon;
                return (
                  <div
                    key={c.name}
                    className="rounded-[14px] p-4 border-2 border-[#1F1F1F] flex items-center gap-4 hover:shadow-[6px_6px_0_#1F1F1F] transition-shadow"
                    style={{ background: c.color }}
                  >
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border-2 border-[#1F1F1F] flex-shrink-0">
                      <Icon size={17}/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[14px]">{c.name}</div>
                      <div className="text-[12px] text-[#7B7B7B] font-medium">{c.desc}</div>
                    </div>
                    {statusBadge(c.status)}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* User profile */}
          <Card className="p-6" accent="yellow">
            <h3 className="font-extrabold text-[18px] mb-4">Account</h3>
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 flex items-center justify-center rounded-2xl font-black text-2xl text-white flex-shrink-0"
                style={{ background: "#1F1F1F", border: "3px solid #1F1F1F" }}
              >F</div>
              <div>
                <div className="font-extrabold text-[18px]">Founder Account</div>
                <div className="text-[14px] text-[#555] font-medium">yadnesh2105@gmail.com</div>
                <div className="mt-2"><span className="nb-badge nb-badge-accent">Founder Plan</span></div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
