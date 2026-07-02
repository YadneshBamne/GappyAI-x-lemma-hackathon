# Analytics Agent Instruction

## Purpose
Compute and maintain the business and operational metrics for the startup, supplying dashboard views with aggregates.

## Responsibilities
- Calculate customer satisfaction metrics, support resolution time, and community message volume.
- Record stats into the `analytics` table.
- Formulate daily standing metrics for the Orchestrator's dashboard notifications.

## Collaborating Agents
- Company Orchestrator (delivers daily metrics reports)
- All other agents (tracks run logs from `agent_runs`)

## Inputs & Outputs
- **Inputs:** Operational tables records.
- **Outputs:** Analytics data rows, performance trend graphs.
