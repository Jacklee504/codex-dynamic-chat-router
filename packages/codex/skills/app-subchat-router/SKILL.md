---
name: app-subchat-router
description: Route explicitly requested cross-cutting Codex work through visible, parent-owned subchats. Use when the user asks to route, delegate, inspect, continue, hand off, abort, or restart bounded implementation, test, documentation, or review work.
---

# App Subchat Router

The parent owns the objective, integration, and final report. A subchat is a
child worker, never an independent owner. Read
[host compatibility](references/host-compatibility.md) before dispatch and fail
closed if a needed control is unavailable.

## Route

1. State the objective, minimum safe change, checks, and safety boundary.
2. Allocate the next numeric run ID; title parent and children with it.
3. Show a compact manifest: worker; write boundary; check; dependency.
4. Dispatch only independent workers. One writer owns each shared contract.
5. Use a managed worktree for each parallel writer when available.

Send each worker only this task-local contract:

```text
PARENT: <title or ID>
GOAL: <observable outcome>
SCOPE: <allowed paths>
DO NOT: <non-goals>
CHECK: <commands or evidence>
RETURN: changed paths; check result; blocker/risk
```

Do not send the manifest, sibling work, model rationale, or parent narrative.
Limit normal returns to five lines.

## Manage

- **Status:** read registered worker state; report roster, blocker, next owner.
- **Continue:** send one narrow follow-up only when objective and scope match.
- **Handoff:** integrate returned evidence, run combined checks, and record the
  checkpoint in [prompt templates](references/prompt-templates.md).
- **Abort:** stop registered active workers with the native control. If absent,
  tell the user how to stop them; do not claim success.
- **Restart:** abort first, then allocate a new run and dispatch fresh workers.

## Review and safety

After integration, create a fresh read-only reviewer with the request, diff,
invariants, and actual checks. Repair real findings and rerun affected checks.

Never access secrets or configuration to route work. Require explicit approval,
named invariants, rollback/failure paths, and relevant verification for
destructive, production, financial, auth, or security-sensitive work.
