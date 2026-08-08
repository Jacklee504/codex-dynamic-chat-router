---
description: Route an explicitly requested task through bounded Qwen Code subagents.
---

Route this objective only when the user explicitly asks to delegate work:

{{args}}

The parent owns the objective, integration, and final report. Create subagents
only for independent scopes; one writer owns each shared contract. Use the
available subagent tool with this exact payload:

```text
GOAL: <outcome>
SCOPE: <paths>
DO NOT: <non-goals>
CHECK: <evidence>
RETURN: paths; check; blocker/risk
```

Do not send sibling work, a routing plan, or parent narrative. Limit ordinary
returns to five lines. Use `implementation-owner` or `test-runner` for routine
work; use `read-only-reviewer` only after integration.
