import React from "react";
import { Menu, Bell, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { useLemma } from "../context/LemmaContext";
import { Button } from "./ui/index.jsx";
import { NAV } from "./Sidebar";

export function Header({ tab, onMenuOpen }) {
  const { status, podId, seedMockData } = useLemma();
  const [seeding, setSeeding] = React.useState(false);

  const current = NAV.find(n => n.id === tab);
  const connected = status === "authenticated";

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedMockData();
      alert("Mock workspace seeded successfully.");
    } catch (err) {
      alert("Seed error: " + err.message);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <header
      className="sticky top-0 z-30 h-16 px-4 md:px-8 flex items-center justify-between flex-shrink-0"
      style={{ background: "#FFFDF6", borderBottom: "3px solid #1F1F1F" }}
    >
      {/* Left — hamburger + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuOpen}
          className="nb-btn nb-btn-ghost !p-2 !shadow-[2px_2px_0_#1F1F1F] md:hidden"
          aria-label="Open menu"
        >
          <Menu size={18}/>
        </button>

        {/* Breadcrumb */}
        <div className="hidden sm:flex items-center gap-2 text-[13px] font-semibold text-[#7B7B7B]">
          <span>BuilderOS</span>
          <span>/</span>
          <span className="text-[#1A1A1A] font-bold">{current?.label || tab}</span>
        </div>
        <div className="sm:hidden font-bold text-[15px] text-[#1A1A1A]">{current?.label || tab}</div>
      </div>

      {/* Right — status + seed */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Connection indicator */}
        <div
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-[12px] font-bold"
          style={{ border: "2px solid #1F1F1F", background: connected ? "#E8F9E8" : "#F0F0F0", boxShadow: "2px 2px 0 #1F1F1F" }}
        >
          {connected
            ? <><Wifi size={12} color="#2E7D32"/> <span className="text-[#2E7D32]">Connected · {podId.slice(0, 8)}</span></>
            : <><WifiOff size={12} color="#7B7B7B"/> <span className="text-[#7B7B7B]">Standalone</span></>
          }
        </div>

        {/* AI Status pill */}
        <div
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-[12px] font-bold"
          style={{ border: "2px solid #1F1F1F", background: "#FFF5CC", boxShadow: "2px 2px 0 #1F1F1F" }}
        >
          <span className="w-2 h-2 rounded-full bg-[#F5C542] animate-pulse"/>
          Agents Active
        </div>

        {/* Seed */}
        <Button
          variant="primary"
          size="sm"
          icon={RefreshCw}
          loading={seeding}
          onClick={handleSeed}
        >
          <span className="hidden sm:inline">Seed Workspace</span>
        </Button>
      </div>
    </header>
  );
}
