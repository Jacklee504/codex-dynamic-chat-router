---
description: Integrate completed routed work and request a fresh read-only review. Use when the user asks to hand off or finish a routing run.
disable-model-invocation: true
---

# Handoff

Integrate only returned evidence. Run combined checks. Then use the
`read-only-reviewer` agent on the final diff and actual check output. Record:

```text
DONE: <evidence>
OPEN: <decision or none>
CHECK: <result>
NEXT: <owner/action>
```
