---
description: Route an explicitly requested task through parent-led Claude Code subagents. Use only when the user asks to route or delegate bounded work.
disable-model-invocation: true
---

# Route

Read `../../references/routing-contract.md`. State objective, checks, and safety
boundary. Create subagents only for independent scopes; one writer owns each
shared contract.

Use this exact worker contract:

```text
GOAL: <outcome>
SCOPE: <paths>
DO NOT: <non-goals>
CHECK: <evidence>
RETURN: paths; check; blocker/risk
```

Keep returns to five lines. Use agent-team mode only if the user explicitly
asks and independent workers need direct coordination. Otherwise use subagents
that report to the parent.
