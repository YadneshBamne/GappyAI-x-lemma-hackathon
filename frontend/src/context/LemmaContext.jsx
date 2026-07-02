import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const LemmaContext = createContext(null);

export function LemmaProvider({ children }) {
  const [client, setClient]   = useState(null);
  const [status, setStatus]   = useState("connecting"); // connecting | authenticated | standalone
  const [podId,  setPodId]    = useState("");

  const [data, setData] = useState({
    approvals:          [],
    issues:             [],
    roadmap:            [],
    supportTickets:     [],
    communityMessages:  [],
    releases:           [],
    agentRuns:          [],
    docs:               [],
    knowledgeArticles:  [],
  });

  /* ── SDK init ─────────────────────────────────────────────── */
  useEffect(() => {
    const t = setInterval(async () => {
      if (!window.LemmaClient?.LemmaClient) return;
      clearInterval(t);
      try {
        const lc = new window.LemmaClient.LemmaClient();
        const auth = await lc.initialize();
        if (auth.status === "authenticated") {
          setClient(lc);
          setStatus("authenticated");
          setPodId(lc.config.podId || "");
          fetchAll(lc);
        } else {
          setStatus("standalone");
        }
      } catch {
        setStatus("standalone");
      }
    }, 200);
    return () => clearInterval(t);
  }, []);

  /* ── Polling ──────────────────────────────────────────────── */
  useEffect(() => {
    if (!client) return;
    const p = setInterval(() => fetchAll(client), 6000);
    return () => clearInterval(p);
  }, [client]);

  /* ── Fetch ────────────────────────────────────────────────── */
  const fetchAll = useCallback(async (lc) => {
    lc = lc || client;
    if (!lc) return;
    try {
      const [a, i, rm, st, cm, rel, runs, d, ka] = await Promise.all([
        lc.records.list("approvals",          { limit: 100 }),
        lc.records.list("issues",             { limit: 100 }),
        lc.records.list("roadmap",            { limit: 100 }),
        lc.records.list("support_tickets",    { limit: 100 }),
        lc.records.list("community_messages", { limit: 100 }),
        lc.records.list("releases",           { limit: 100 }),
        lc.records.list("agent_runs",         { limit: 100 }),
        lc.records.list("documentation",      { limit: 100 }),
        lc.records.list("knowledge_articles", { limit: 100 }),
      ]);
      setData({
        approvals:         a.items   || [],
        issues:            i.items   || [],
        roadmap:           rm.items  || [],
        supportTickets:    st.items  || [],
        communityMessages: cm.items  || [],
        releases:          rel.items || [],
        agentRuns:         runs.items|| [],
        docs:              d.items   || [],
        knowledgeArticles: ka.items  || [],
      });
    } catch (err) {
      console.warn("Lemma fetch error:", err);
    }
  }, [client]);

  /* ── Record helpers ───────────────────────────────────────── */
  const updateRecord = useCallback(async (table, id, patch) => {
    if (!client) return;
    await client.records.update(table, id, patch);
    await fetchAll();
  }, [client, fetchAll]);

  const createRecord = useCallback(async (table, payload) => {
    if (!client) return null;
    const rec = await client.records.create(table, payload);
    await fetchAll();
    return rec;
  }, [client, fetchAll]);

  /* ── Seed ─────────────────────────────────────────────────── */
  const seedMockData = useCallback(async () => {
    if (!client) throw new Error("Lemma client not loaded.");
    const comp = await client.records.create("companies", { name: "BuilderOS Inc.", domain: "builderos.ai" });
    const proj = await client.records.create("projects",  { company_id: comp.id, name: "BuilderOS Platform", description: "Core platform" });
    await client.records.create("departments", { company_id: comp.id, name: "Engineering", head_agent_name: "engineering-agent" });
    await client.records.create("approvals",   { resource_type: "announcement", resource_id: comp.id, request_details: "Publish v1.0.0 release note to Discord #general.", approval_status: "pending", requested_by_agent: "marketing-agent" });
    await client.records.create("approvals",   { resource_type: "documentation", resource_id: proj.id, request_details: "Publish architecture guide to public docs portal.", approval_status: "pending", requested_by_agent: "documentation-agent" });
    await client.records.create("issues",      { project_id: proj.id, title: "Discord connector rate-limit disconnect", priority: "high",   status: "todo",        assignee_agent_name: "engineering-agent" });
    await client.records.create("issues",      { project_id: proj.id, title: "Fix mobile responsive padding",           priority: "low",    status: "in_progress", assignee_agent_name: "engineering-agent" });
    await client.records.create("roadmap",     { project_id: proj.id, title: "OAuth2 client-credentials flow",          status: "proposed", quarter: "Q4 2026" });
    await client.records.create("support_tickets",    { customer_email: "support@client.com", subject: "Gmail redirect_uri mismatch", description: "400 error on OAuth redirect.", priority: "high", status: "new", assigned_agent_name: "support-agent" });
    await client.records.create("community_messages", { platform: "discord", channel_name: "#bugs", author: "dev_alice", content: "Issues with lemma pod import on Windows?", status: "new" });
    await client.records.create("releases",           { project_id: proj.id, version_tag: "v1.0.0", release_notes_markdown: "Initial rollout of agent orchestrations." });
    await client.records.create("agent_runs",         { agent_name: "company-orchestrator", status: "completed", started_at: new Date().toISOString() });
    await client.records.create("documentation",      { project_id: proj.id, title: "Architecture Guide", slug: "architecture", content_markdown: "System specs...", status: "published" });
    await client.records.create("knowledge_articles", { title: "Resolve redirect_uri mismatch", content_markdown: "Verify domain matches Lemma Console settings.", keywords: "oauth,redirect,auth" });
    await client.records.create("announcements",      { channel: "discord", title: "v1.0.0 Released!", content_text: "BuilderOS is live!", approval_status: "pending" });
    await fetchAll();
  }, [client, fetchAll]);

  return (
    <LemmaContext.Provider value={{ client, status, podId, data, updateRecord, createRecord, seedMockData, refresh: fetchAll }}>
      {children}
    </LemmaContext.Provider>
  );
}

export const useLemma = () => useContext(LemmaContext);

/* ── Field accessor (handles flat + nested .data) ─────────────── */
export const f = (rec, field) => rec?.[field] ?? rec?.data?.[field] ?? null;
