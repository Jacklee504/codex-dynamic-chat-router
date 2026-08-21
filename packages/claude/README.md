# Claude Code package

This package exposes a small, explicit command surface:

```text
/dynamic-task-router:route <objective>
/dynamic-task-router:status
/dynamic-task-router:handoff
/dynamic-task-router:abort
/dynamic-task-router:restart <corrected objective>
```

The default route uses parent-led subagents. Use agent teams only when subagents
need peer-to-peer coordination and the user explicitly requests team mode.
Agent teams are experimental and require Claude Code to enable them.

The package assumes the medium routing level and maps routed tasks to Haiku,
Sonnet, or Opus according to the shared
[model routing policy](../../core/model-routing-policy.md). Low/high routing
adjusts to a cheaper/stronger eligible tier without overriding safety minima;
the parent session's thinking effort remains a separate, role-based decision.

Test a clone without installation:

```bash
claude --plugin-dir ./packages/claude
```

See [the Claude Code guide](../../docs/claude-code.md) for installation and
behavior.
