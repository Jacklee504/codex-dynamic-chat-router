# Codex installation

The Codex package lives at `packages/codex/`. Its plugin manifest and skill are
kept together, so users may distribute or customize that directory alone.

For direct local use, copy or symlink:

```text
packages/codex/skills/app-subchat-router
```

into a Codex-discovered skill location such as `~/.agents/skills/` or a
repository’s `.agents/skills/`. Invoke `$app-subchat-router` explicitly.

The adapter requires a host with visible child-task controls. It does not add
those controls to environments that lack them.
