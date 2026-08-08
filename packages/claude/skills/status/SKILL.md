---
description: Report the current routing workers, blockers, and next owner without changing work. Use when the user asks for routing status.
disable-model-invocation: true
---

# Status

Read the current registered workers only. Return one line per worker:

```text
<worker> — <state> — <blocker or next action>
```

Do not dispatch, redirect, resume, or stop any worker.
