# Claude Code package

This package exposes a small, explicit command surface:

```text
/dynamic-subchat-router:route <objective>
/dynamic-subchat-router:status
/dynamic-subchat-router:handoff
/dynamic-subchat-router:abort
/dynamic-subchat-router:restart <corrected objective>
```

The default route uses parent-led subagents. Use agent teams only when workers
need peer-to-peer coordination and the user explicitly requests team mode.
Agent teams are experimental and require Claude Code to enable them.

Test a clone without installation:

```bash
claude --plugin-dir ./packages/claude
```

See [the Claude Code guide](../../docs/claude-code.md) for installation and
behavior.
