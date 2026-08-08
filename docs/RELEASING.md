# Releasing packages

## Local validation

Run the Codex validators from the repository root:

```bash
python3 /Users/jacklee/.codex/skills/.system/skill-creator/scripts/quick_validate.py packages/codex/skills/app-subchat-router
python3 /Users/jacklee/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py packages/codex
```

Validate Claude locally with `claude plugin validate ./packages/claude` when the
Claude CLI is available. Validate Qwen's JSON manifest with `python3 -m json.tool
packages/qwen/dynamic-subchat-router/qwen-extension.json` and forward-test it
with `qwen extensions install ./packages/qwen/dynamic-subchat-router --scope
project` when Qwen Code is available. Test route, status, safe abort, and
independent review; never use production systems.

## Versioning

Use semantic versioning in each package manifest.

- Patch: documentation, wording, and non-behavioral corrections.
- Minor: new safe workflow behavior or compatible capability support.
- Major: changed safety guarantees, lifecycle semantics, or compatibility.

## Publishing

1. Create a tagged GitHub release from a validated commit.
2. Release `packages/codex/`, `packages/claude/`, and
   `packages/qwen/dynamic-subchat-router/` as separate package roots.
3. Submit each package through its host’s current plugin distribution channel.
4. Test each installed package in a fresh host session.

Do not claim marketplace availability until the package has actually been
accepted and published.
