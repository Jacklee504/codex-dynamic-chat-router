# Architecture

`core/` is the source of truth for behavior. Platform packages are adapters,
not forks of the workflow:

```text
core contract
   ├── Codex: parent → visible subchat → parent
   └── Claude: lead → subagent → lead
```

Keep adapter instructions host-specific and task-local. Keep common rules in
the core. Do not make worker prompts carry the entire core document: workers
receive only goal, scope, non-goals, check, and return contract.

Claude agent teams are an explicit extension of the Claude adapter, not the
default. They are appropriate only when independent workers need peer-to-peer
coordination.
