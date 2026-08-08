# Claude Code installation

The Claude plugin is self-contained at `packages/claude/`.

## Try a clone

```bash
claude --plugin-dir ./packages/claude
```

Then invoke `/dynamic-subchat-router:route <objective>`. Claude Code namespaces
plugin skills, so this cannot collide with a personal `/route` command.

## Default behavior

The router uses parent-led subagents by default. This provides compact,
one-directional handoffs and matches the shared routing contract.

Agent teams are optional for independent, cross-module work whose workers need
to communicate directly. They are experimental and disabled by default; users
must explicitly enable them in Claude Code before asking for team mode.

## Local customization

Fork the repository and edit `packages/claude/skills/` for command behavior or
`packages/claude/agents/` for worker roles. Run `claude --plugin-dir
./packages/claude` during development, then reload plugins inside Claude Code.
