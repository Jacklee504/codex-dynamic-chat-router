---
description: Integrate completed routed work and request a fresh read-only review. Use when the user asks to hand off or finish a routing run.
disable-model-invocation: true
---

# Handoff

Integrate only returned evidence. Normalize each return to status, paths, check,
and risk; do not copy a subagent transcript into the lead. Run combined checks. Then use the
`read-only-reviewer` agent on the final diff and actual check output. Use
`critical-reviewer` instead when the routed task is auth, secret-bearing,
financial, destructive, production, or otherwise critical. Record:

```text
DONE: <evidence>
OPEN: <decision or none>
CHECK: <result>
NEXT: <owner/action>
```

Keep this checkpoint to four lines; update it only on a state change.
