# Dynamic Task Router

An open-source, provider-agnostic multi-model engineering orchestrator with
optional host-specific skills and plugins. It turns cross-cutting work into
bounded routed tasks with explicit ownership, verification, handoff, and
review.

This repository is deliberately easy to fork: each platform package is
self-contained, while `core/` defines the portable behavior they share.

## Executable orchestrator

`packages/orchestrator/` is an explicit, read-only runtime alongside the host
adapters. It uses existing Claude Code and Codex CLI authentication—never API
keys—and can invoke local Ollama models through Codex OSS mode. It selects a
model and internal effort independently, can fan out read-only analysis to
independent model families, and supports an optional disabled-by-default
OpenRouter adapter. Repository writing stays opt-in and isolated.

```bash
npm install
npm run link:local # once: installs the `dtr` and `dtr-mcp` commands for this checkout
npm run dtr -- health
npm run dtr -- models
npm run dtr -- models refresh
npm run dtr -- select --role reviewer --complexity difficult --risk high
npm run dtr -- route --role debugger --prompt "Find why valid signals never reach order submission"
npm run dtr -- run --provider codex --model codex-terra --effort high --role reviewer --cwd /path/to/repo --prompt "Review the execution pipeline. Do not modify anything."
```

After `npm run link:local`, run DTR from any repository instead of returning to
this checkout:

```bash
cd /path/to/target-repository
dtr                 # interactive TUI for the current repository
dtr tui --cwd "$PWD" # explicit equivalent
dtr route --role reviewer --prompt "Review the changed files. Do not modify anything."
```

The router remains installed in this checkout. `--cwd` chooses the target
repository, where DTR stores its `.dtr/` run records and optional worktrees.
Run `npm unlink -g dynamic-task-router` from this checkout to remove the local
command later.

See [the orchestrator guide](docs/orchestrator.md) and
[routing guide](docs/routing.md). Model inventory and read-only defaults are
user-editable in `config/`; no credentials belong there. See [providers](docs/providers.md),
[privacy](docs/privacy.md), and [cost routing](docs/cost-routing.md) before
enabling a remote provider.

## Choose an interface

Use DTR in one of three ways: an interactive terminal UI (`dtr` or `dtr tui`
from a TTY), the scriptable CLI (`dtr route ...`), or its local STDIO MCP
server. All three use the same application/routing layer; the terminal UI does
not call provider CLIs or APIs directly. See [TUI guide](docs/tui.md).

## Choose your host

| Host | Package | Routed task type | Guide |
| --- | --- | --- | --- |
| Codex desktop app | `packages/codex/` | Visible subchats | [Codex guide](docs/codex.md) |
| Claude Code | `packages/claude/` | Subagents; optional agent teams | [Claude Code guide](docs/claude-code.md) |
| Qwen Code | `packages/qwen/dynamic-task-router/` | Subagents; routine subagents use the configured fast model | [Qwen Code guide](docs/qwen-code.md) |

Install only the package for the host you use. No package reads or changes
another package.

## Dynamic model routing

When a routing run begins, the parent classifies each candidate task, assumes
`medium` routing level unless specified otherwise, and selects the least expensive
permitted tier that can safely complete it: fast, standard, deep, or critical.
`low` may select one cheaper eligible tier; `high` may select one stronger tier.
The host adapter maps that tier to its native subchat or subagent controls. See the shared
[model routing policy](core/model-routing-policy.md) for the decision rules and
host mappings.

### Codex at medium routing level

Medium is the default routing level; it preserves the task-class baseline rather
than forcing every subchat onto one model. Select the model's internal effort
separately from the role and risk. In Codex, that means:

| Task shape | Codex selection |
| --- | --- |
| Narrow read-only triage | Luna / low effort |
| Tightly bounded implementation or review | Luna / high effort |
| Ordinary isolated task | Terra / effort by role |
| Core or cross-cutting task | Terra / normally high effort |
| Critical task or review | Sol / normally high effort |

Use `low` only when a cheaper tier remains safe, and `high` when a stronger tier
is justified by ambiguity or dependency analysis. Those routing labels do not
set internal effort: a low-level route can use Luna/high for a bounded code
change. Critical tasks never reduce below Sol.

## Shared contract

Every adapter follows the [routing contract](core/routing-contract.md):

1. The parent/lead owns the objective and final decision.
2. Each routed target gets a bounded outcome, non-overlapping write boundary,
   and only the paths/symbols needed to do its work.
3. Returned evidence—not activity or optimism—drives integration.
4. A fresh, read-only reviewer checks the integrated result.
5. Stop and restart actions are honest about what the host actually did.

## Why separate adapters?

The workflow is portable, but host controls are not. Codex uses app-owned
subchats; Claude Code uses subagents and, when explicitly enabled, agent teams;
Qwen Code uses extension commands and subagents. Keeping their instructions
separate lets each be concise, accurate, and safe.

## Repository layout

```text
core/                 Host-neutral contract and scenarios
packages/codex/       Installable Codex plugin
packages/claude/      Installable Claude Code plugin
packages/qwen/        Native Qwen Code extension
docs/                 Installation and architecture guides
```

## Contributing

Fork freely, make focused changes, validate the relevant package, and open a
pull request. See [CONTRIBUTING.md](CONTRIBUTING.md). The most useful changes
preserve parent ownership, explicit dispatch, and small task I/O contracts.

## License

[MIT](LICENSE)
