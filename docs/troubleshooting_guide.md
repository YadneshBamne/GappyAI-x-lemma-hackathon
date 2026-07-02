# BuilderOS Troubleshooting Guide

## 1. Authentication Conflicts
If commands fail with `LemmaConfigError: org_id is required`, set your default organization:
```bash
lemma config set-default-org <org_id>
```

## 2. Invalid Schema References
If `lemma pod doctor` fails with missing database dependencies, make sure the referenced table is declared before importing.

## 3. Connector Token Expiration
If the gmail or linear integrations fail:
1. Re-authorize the connection: `lemma connector auth-configs create <platform>`
2. Fetch the new token: `lemma connector accounts list`
3. Update the surface configurations with the updated UUIDs.