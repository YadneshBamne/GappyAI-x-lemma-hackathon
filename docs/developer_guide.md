# BuilderOS Developer Guide

Instructions for developing, running, and syncing resources in BuilderOS.

## Prerequisites
- Lemma CLI installed: `lemma --version`
- Authenticated with Lemma Cloud: `lemma auth login`
- Target organization set: `lemma config set-default-org <org_id>`

## File Layout
- `/tables`: Database schemas in JSON.
- `/agents`: Agent JSON settings and Markdown instructions.
- `/workflows`: Logical process pipelines.
- `/schedules`: Automated cron job definitions.
- `/apps`: Dashboards and interactive interfaces.

## Importing resources to Lemma Cloud
Run:
```bash
lemma pod import .
```
This validates all config schemas and uploads resources into the active pod.