import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { LemmaProvider } from "./context/LemmaContext";
import { Sidebar, MobileDrawer, MobileBottomNav } from "./components/Sidebar";
import { Header } from "./components/Header";
import LandingPage from "./pages/LandingPage";

import { DashboardPage }    from "./pages/Dashboard";
import { EngineeringPage }  from "./pages/Engineering";
import { CommunityPage }    from "./pages/Community";
import { SupportPage }      from "./pages/Support";
import { DocumentationPage} from "./pages/Documentation";
import { KnowledgePage }    from "./pages/Knowledge";
import { RoadmapPage }      from "./pages/Roadmap";
import { AnalyticsPage }    from "./pages/Analytics";
import { ApprovalsPage }    from "./pages/Approvals";
import { ReleasesPage }     from "./pages/Releases";
import { SettingsPage }     from "./pages/Settings";

const PAGES = {
  dashboard:     DashboardPage,
  engineering:   EngineeringPage,
  community:     CommunityPage,
  support:       SupportPage,
  documentation: DocumentationPage,
  knowledge:     KnowledgePage,
  roadmap:       RoadmapPage,
  analytics:     AnalyticsPage,
  approvals:     ApprovalsPage,
  releases:      ReleasesPage,
  settings:      SettingsPage,
};

/* ── Dashboard App Shell ──────────────────────────────────────── */
function AppShell() {
  const [tab, setTab]           = useState("dashboard");
  const [drawerOpen, setDrawer] = useState(false);
  const Page = PAGES[tab] || DashboardPage;

  return (
    <div className="flex min-h-screen" style={{ background: "#FFFDF6", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Sidebar tab={tab} onTab={setTab}/>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawer(false)} tab={tab} onTab={setTab}/>
      <div className="flex-1 flex flex-col min-w-0">
        <Header tab={tab} onMenuOpen={() => setDrawer(true)}/>
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <AnimatePresence mode="wait">
            <Page key={tab}/>
          </AnimatePresence>
        </main>
      </div>
      <MobileBottomNav tab={tab} onTab={setTab}/>
    </div>
  );
}

/* ── Landing wrapper with navigate ───────────────────────────── */
function Landing() {
  const navigate = useNavigate();
  return <LandingPage onDash={() => navigate("/dashboard")}/>;
}

/* ── Root Router ──────────────────────────────────────────────── */
function RouterContent() {
  return (
    <Routes>
      <Route path="/"          element={<Landing/>}/>
      <Route path="/dashboard" element={
        <LemmaProvider>
          <AppShell/>
        </LemmaProvider>
      }/>
      {/* Redirect any unknown path to landing */}
      <Route path="*" element={<Landing/>}/>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <RouterContent/>
    </BrowserRouter>
  );
}
