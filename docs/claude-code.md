# Claude Code installation

The Claude plugin is self-contained at `packages/claude/`.

## Try a clone

```bash
claude --plugin-dir ./packages/claude
```

Then invoke `/dynamic-task-router:route <objective>`. Claude Code namespaces
plugin skills, so this cannot collide with a personal `/route` command.

## Default behavior

The router uses parent-led subagents by default. This provides compact,
one-directional handoffs and matches the shared routing contract.

Agent teams are optional for independent, cross-module work whose subagents need
to communicate directly. They are experimental and disabled by default; users
must explicitly enable them in Claude Code before asking for team mode.

## Model routing

The Claude adapter follows the shared [model routing policy](../core/model-routing-policy.md):

| Baseline task class | Claude assignment at medium routing level |
| --- | --- |
| Read-only triage or routine review | `haiku` / effort by role |
| Isolated tests, documentation, or bounded support | `sonnet` / effort by role |
| Core or cross-cutting implementation | `sonnet` / normally high effort |
| Critical work or critical review | `opus` / normally high effort |

The parent assumes the `medium` routing level unless the user specifies `low`
or `high`. Low selects one cheaper eligible tier; high selects one stronger
tier. Critical and other safety-bound work remain at their minimum tier. The
supplied profiles define roles, while the parent selects the model per
invocation. Claude Code inherits thinking configuration from the parent session,
so that effort is selected for the role independently of routing level. The
parent records routing level, baseline, selected tier, model effort, and reason,
and must not silently downgrade when Claude Code cannot use the selection. The
parent keeps planning, integration, and final decisions.

## Local customization

Fork the repository and edit `packages/claude/skills/` for command behavior or
`packages/claude/agents/` for subagent roles. Run `claude --plugin-dir
./packages/claude` during development, then reload plugins inside Claude Code.
