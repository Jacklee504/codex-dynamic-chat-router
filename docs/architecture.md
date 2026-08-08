# Architecture

`core/` is the source of truth for behavior. Platform packages are adapters,
not forks of the workflow:

```text
core contract
   ├── Codex: parent → visible subchat → parent
   ├── Claude: lead → subagent → lead
   └── Qwen: parent → subagent → parent
```

Keep adapter instructions host-specific and task-local. Keep common rules in
the core. Do not make worker prompts carry the entire core document: workers
receive only goal, scope, non-goals, check, and return contract.

Claude agent teams are an explicit extension of the Claude adapter, not the
default. They are appropriate only when independent workers need peer-to-peer
coordination.

Qwen's native adapter gives routine implementation and test workers its `fast`
model selector. That selector is configured by the user; the adapter never
ships a provider credential or hard-coded model ID. The parent owns integration
and can use a stronger session model when the task warrants it.
