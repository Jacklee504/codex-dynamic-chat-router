# Dynamic Subchat Router for Qwen Code

Install this directory as a Qwen Code extension:

```bash
qwen extensions install ./packages/qwen/dynamic-subchat-router --scope project
```

Use `/router:route <objective>` to start. The extension contains compact
parent commands and the following worker profiles:

- `implementation-owner` — bounded implementation, `model: fast`
- `test-runner` — isolated verification, `model: fast`
- `read-only-reviewer` — fresh no-edit review, inherits the parent model

Configure Qwen Code's fast model separately. This extension contains no model
credentials or provider-specific model ID.
