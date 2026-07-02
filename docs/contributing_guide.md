# Contributing to BuilderOS

We welcome contributions to BuilderOS. Please follow these guidelines:

## Adding a New Agent
1. Create a subdirectory under `/agents/<agent-slug>`.
2. Write `<agent-slug>.json` outlining the agent metadata and grants.
3. Write `instruction.md` detailing the agent's persona.
4. Execute `lemma pod doctor` to check validation.

## Adding a Datastore Table
1. Define a JSON schema under `/tables/<table-name>/<table-name>.json`.
2. Do not declare `id`, `created_at`, or `updated_at` columns.
3. Reference external tables using `{ "type": "UUID", "foreign_key": { "references": "<table-name>.id" } }`.