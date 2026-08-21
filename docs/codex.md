# Codex installation

The Codex package lives at `packages/codex/`. Its plugin manifest and skill are
kept together, so users may distribute or customize that directory alone.

For direct local use, copy or symlink:

```text
packages/codex/skills/app-task-router
```

into a Codex-discovered skill location such as `~/.agents/skills/` or a
repository’s `.agents/skills/`. Invoke `$app-task-router` explicitly.

The adapter requires a host with visible child-task controls. It does not add
those controls to environments that lack them.

Model assignment follows the shared [model routing policy](../core/model-routing-policy.md).
Medium is the routing default: it keeps the baseline selected by task class,
rather than forcing every subchat onto the same model.

| Task shape | Codex selection at medium routing level |
| --- | --- |
| Narrow read-only triage | Luna / low effort |
| Tightly bounded implementation or review | Luna / high effort |
| Ordinary isolated task | Terra / effort by role |
| Core or cross-cutting task | Terra / normally high effort |
| Critical work or review | Sol / normally high effort |

`low` selects one cheaper eligible tier and `high` one stronger tier; neither
can reduce a task below its safety minimum. They do not mechanically set model
effort: a low-level route may use Luna/high for a tightly bounded code change.
The parent records routing level, baseline, selected tier, and model effort in
its routing manifest before creating a subchat.
