# Qwen Code installation

The native Qwen extension is self-contained at
`packages/qwen/dynamic-task-router/`.

## Install from a clone

From the repository root, install it for the current project:

```bash
qwen extensions install ./packages/qwen/dynamic-task-router --scope project
```

Use `/router:route <objective>` to start an explicit routing run. The other
commands are `/router:status`, `/router:handoff`, `/router:abort`, and
`/router:restart <corrected objective>`. If a command name conflicts with a
local command, Qwen Code lists the extension-prefixed alternative in `/help`.

## Model routing

The Qwen adapter follows the shared [model routing policy](../core/model-routing-policy.md).
It uses Qwen Code selectors rather than bundling a provider or model ID:

| Baseline task class | Qwen Code assignment at medium routing level |
| --- | --- |
| Read-only triage or routine review | `fast` or a user-configured `small` grade |
| Isolated tests, documentation, or bounded support | user-configured `standard` grade; otherwise inherit the parent model |
| Core or cross-cutting implementation | user-configured `deep` grade; otherwise inherit the parent model |
| Critical work or critical review | user-configured `critical` grade; otherwise retain the task in a deliberately strong parent session |

The parent assumes the `medium` routing level unless the user specifies `low` or
`high`. Low selects one cheaper eligible grade; high selects one stronger grade.
Critical and other safety-bound work remain at their minimum tier. Qwen Code
applies this through the model grade because it has no matching per-subagent
reasoning-effort field; the routing level therefore must not be treated as an
effort setting.

## Configure model grades

Add this fragment to the user's `~/.qwen/settings.json`, or to the project's
`.qwen/settings.json` when the routing policy is intentionally project-specific.
Replace each selector with a model already available through that user's Qwen
Code configuration; these values are model selectors, not credentials.

```json
{
  "fastModel": "<provider>:<fast-model-id>",
  "agents": {
    "modelGrades": {
      "standard": "<provider>:<standard-model-id>",
      "deep": "<provider>:<deep-model-id>",
      "critical": "<provider>:<critical-model-id>"
    },
    "allowedGrades": ["standard", "deep", "critical"]
  }
}
```

`fastModel` serves the router's fast tier. The other names are user-defined
Qwen Code grades, requested by the router after its low/medium/high routing
adjustment selects the final tier. A user who does not configure a grade retains
that task in the parent session rather than silently downgrading it. Set or
inspect the fast selector interactively with:

```text
/model --fast <provider>:<fast-model-id>
```

Qwen Code currently selects the model for a subagent but does not expose a
matching per-subagent reasoning-effort field in agent frontmatter.

## Why use the native adapter?

Qwen Code can convert a Claude Code plugin during installation, so the Claude
package is a useful compatibility option. The native adapter is recommended: it
uses Qwen command names, Qwen tool allowlists, and Qwen's native model selectors
directly.

## Local customization

Edit `commands/` for the parent workflow and `agents/` for subagent profiles.
Reload an installed extension with `/reload-plugins`. Keep the compact task
contract intact: goal, scope, non-goals, check, and return evidence only.
