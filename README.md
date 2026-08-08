# Dynamic Subchat Router

An open-source, parent-led routing workflow for Codex, Claude Code, and Qwen
Code. It turns
cross-cutting work into bounded worker tasks with explicit ownership,
verification, handoff, and review.

This repository is deliberately easy to fork: each platform package is
self-contained, while `core/` defines the portable behavior they share.

## Choose your host

| Host | Package | Primary worker type | Guide |
| --- | --- | --- | --- |
| Codex desktop app | `packages/codex/` | Visible subchats | [Codex guide](docs/codex.md) |
| Claude Code | `packages/claude/` | Subagents; optional agent teams | [Claude Code guide](docs/claude-code.md) |
| Qwen Code | `packages/qwen/dynamic-subchat-router/` | Subagents; routine workers use the configured fast model | [Qwen Code guide](docs/qwen-code.md) |

Install only the package for the host you use. No package reads or changes
another package.

## Shared contract

Every adapter follows the [routing contract](core/routing-contract.md):

1. The parent/lead owns the objective and final decision.
2. Each worker gets a bounded outcome and a non-overlapping write boundary.
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
preserve parent ownership, explicit dispatch, and small worker I/O contracts.

## License

[MIT](LICENSE)
