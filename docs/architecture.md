# BuilderOS System Architecture

BuilderOS leverages the Lemma SDK to run an autonomous startup within a single pod. 

## Specialized AI Agents
- **Company Orchestrator:** Schedules and assigns tasks across teams.
- **Engineering Agent:** Integrates with Linear to manage bug triage and development sprints.
- **Product Agent:** Directs product roadmap features and converts user feedback into specifications.
- **Community Agent:** Triages Discord/Slack chat, answers issues using existing docs, or escalates bugs.
- **Support Agent:** Handles customer Gmail tickets, utilizing knowledge articles for resolution.
- **Knowledge Agent:** Vector indexing agent for semantic search and Q&A retrieval.
- **Documentation Agent:** Reviews documentation coverage and flags missing articles.
- **Release Agent:** Collects completed issues and drafts changelogs.
- **Marketing Agent:** Broadcasts feature announcements on public Slack and Discord channels.
- **Analytics Agent:** Aggregates telemetry metrics from database tables and generates system-wide KPIs.

## Data Schema & Relationships
BuilderOS utilizes a relational structure within Lemma's Datastore:
- `companies` -> `projects` -> `issues` / `roadmap` / `documentation` / `releases`
- `community_messages` -> logs of Discord and Slack intake
- `support_tickets` -> customer issues log
- `knowledge_articles` -> vectors for Q&A search
- `approvals` -> log of human-in-the-loop decisions
- `analytics` -> time-series performance data