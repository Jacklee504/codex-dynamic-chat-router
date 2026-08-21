---
description: Report the current routing subagents, blockers, and next owner without changing work. Use when the user asks for routing status.
disable-model-invocation: true
---

# Status

Read the current registered subagents only. Return one line per subagent:

```text
<subagent> — <state> — <blocker or next action>
```

Do not dispatch, redirect, resume, or stop any subagent.
