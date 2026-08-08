# Releasing the plugin

## Local validation

Run both validators from the repository root:

```bash
python3 /Users/jacklee/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/app-subchat-router
python3 /Users/jacklee/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py .
```

Then forward-test the skill in a host that actually provides visible subchat
controls. Test at least one route, one status request, one safe abort path, and
one independent review path. Do not forward-test against production systems.

## Versioning

Use semantic versioning in `.codex-plugin/plugin.json`.

- Patch: documentation, wording, and non-behavioral corrections.
- Minor: new safe workflow behavior or compatible capability support.
- Major: changed safety guarantees, lifecycle semantics, or compatibility.

## Publishing

1. Create a tagged GitHub release from a validated commit.
2. Keep the repository root intact; `.codex-plugin/plugin.json` and `skills/`
   are the package entry points.
3. Submit or register the package through the current Codex plugin distribution
   channel. Follow the current official requirements rather than relying on this
   document for marketplace-specific policy.
4. Test the installed package in a fresh Codex task.

Do not claim marketplace availability until the package has actually been
accepted and published.
