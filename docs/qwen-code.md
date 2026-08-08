# Qwen Code installation

The native Qwen extension is self-contained at
`packages/qwen/dynamic-subchat-router/`.

## Install from a clone

From the repository root, install it for the current project:

```bash
qwen extensions install ./packages/qwen/dynamic-subchat-router --scope project
```

Use `/router:route <objective>` to start an explicit routing run. The other
commands are `/router:status`, `/router:handoff`, `/router:abort`, and
`/router:restart <corrected objective>`. If a command name conflicts with a
local command, Qwen Code lists the extension-prefixed alternative in `/help`.

## Cost-aware worker roles

The `implementation-owner` and `test-runner` profiles use Qwen Code's `fast`
model selector. Configure that selector once in Qwen Code, for example:

```text
/model --fast <your-cheap-worker-model>
```

The parent session owns routing and integration; the fresh read-only reviewer
inherits the parent model by default. Fork the extension and change the agent
frontmatter if a project needs a different split.

## Why use the native adapter?

Qwen Code can convert a Claude Code plugin during installation, so the Claude
package is a useful compatibility option. The native adapter is recommended: it
uses Qwen command names, Qwen tool allowlists, and Qwen's `fast` selector
directly.

## Local customization

Edit `commands/` for the parent workflow and `agents/` for worker profiles.
Reload an installed extension with `/reload-plugins`. Keep the compact worker
contract intact: goal, scope, non-goals, check, and return evidence only.
