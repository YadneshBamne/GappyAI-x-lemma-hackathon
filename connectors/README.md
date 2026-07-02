# BuilderOS External Connectors Setup Guide

To operate properly, BuilderOS connects to Slack, Discord, Gmail, Linear, and Confluence.
Since these systems require OAuth2 or token-based authentication, you must manually activate them on your Lemma Cloud dashboard.

## Active Connector Credentials Needed:

1. **Slack Connector**
   - **Type:** SLACK
   - **CLI Auth:** `lemma connector auth-configs create slack --name slack-builder-os`
   - **Description:** Allows the Community Agent and Marketing Agent to read and send messages.

2. **Discord Connector**
   - **Type:** DISCORD
   - **CLI Auth:** `lemma connector auth-configs create discord --name discord-builder-os`
   - **Description:** Powering the Community Agent for bug intake and replies.

3. **Gmail Connector**
   - **Type:** GMAIL
   - **CLI Auth:** `lemma connector auth-configs create gmail --name gmail-builder-os`
   - **Description:** Connects the Support Agent to the customer inbox.

4. **Linear Connector**
   - **Type:** LINEAR
   - **CLI Auth:** `lemma connector auth-configs create linear --name linear-builder-os`
   - **Description:** Powers the Engineering Agent for creating and updating development issues.

5. **Confluence Connector**
   - **Type:** CONFLUENCE
   - **CLI Auth:** `lemma connector auth-configs create confluence --name confluence-builder-os`
   - **Description:** Connects the Knowledge and Documentation Agents to internal wikis.

## Authorization Steps

For each connector:
1. Run the respective `lemma connector auth-configs create` command, or navigate to the Connectors tab on your Lemma web console.
2. Complete the OAuth login flow when prompted.
3. Obtain the Account UUID (via `lemma connector accounts list`).
4. Update the corresponding `surfaces/*.json` files with the account UUIDs to enable live agent interaction.
