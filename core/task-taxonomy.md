# Task taxonomy

Every routed task has a `TaskProfile`:

- `role`: architect, implementer, debugger, reviewer, researcher, test, or log-analysis.
- `complexity`: trivial, normal, difficult, or extreme.
- `risk`: low, medium, or high.
- `preferLocal` / `requireLocal`: cost preference versus hard locality boundary.
- `privacySensitive`: hard local-only boundary in the current runtime.
- `diversity`: none, low, medium, or high; medium/high require two families.
- `contextRequirement`: optional small, medium, large, or huge capacity signal.
- `requiresTools`: require tool-capable candidates.

The classifier is deterministic. It considers the role, explicit flags, and
narrow risk/complexity/locality terms in the bounded task prompt. Explicit CLI
flags override inference. It does not send a task to a model to classify it.
