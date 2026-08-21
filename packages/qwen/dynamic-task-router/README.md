# Dynamic Task Router for Qwen Code

Install this directory as a Qwen Code extension:

```bash
qwen extensions install ./packages/qwen/dynamic-task-router --scope project
```

Use `/router:route <objective>` to start. The extension contains compact
parent commands and the following subagent profiles:

- `implementation-owner` — bounded implementation, selected at dispatch
- `test-runner` — isolated verification, selected at dispatch
- `read-only-reviewer` — fresh no-edit review, selected at dispatch
- `critical-reviewer` — fresh critical no-edit review, selected at dispatch

Configure Qwen Code's `fast` selector and any `standard`, `deep`, or `critical`
model grades separately. Add the documented settings fragment to
`~/.qwen/settings.json` (or `.qwen/settings.json` for an intentional
project-specific policy), then replace its selector placeholders with models
already available in Qwen Code. This extension contains no model credentials or
provider-specific model ID. See [the Qwen configuration guide](../../../docs/qwen-code.md#configure-model-grades)
and the shared [model routing policy](../../../core/model-routing-policy.md).
