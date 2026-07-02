# BuilderOS FAQ

### What is BuilderOS?
It is a virtual, AI-native company dashboard and operating system where departments are run by collaborating agents.

### How do I configure external integrations?
Go to the `/connectors` directory, read the guide, and authorize your accounts on Lemma Web Console.

### How does the human-in-the-loop approval work?
When an agent requests approval (e.g. for marketing announcements, critical bug closures, or docs publishes), they add a record to the `approvals` table. The Founder Dashboard picks this up, allowing the founder to click "Approve" or "Reject".