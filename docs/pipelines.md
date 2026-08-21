# Pipelines

Pipelines are explicit stage definitions in `config/pipelines.yaml`, not a
single large prompt. Each stage has a role, a strategy, dependencies, a
read-only setting, and optional diversity request.

Available templates:

- `debug-review`: primary debugger, independent debugger, fresh reviewer.
- `plan-challenge-review`: architect, independent plan challenge, reviewer.
- `implement-review`: implementation, verification, independent review.

```sh
npm run dtr -- pipeline --template debug-review --role debugger --risk high --prompt "Trace why a valid signal fails before order submission"
```

A downstream stage receives the objective plus compact evidence from only its
declared dependencies. It never receives full unrelated sibling transcripts.
If a stage requests medium/high diversity, the router excludes the first
dependency’s model family when selecting that fresh stage.

Pipeline completion is never an integration decision. The caller receives the
run ID and stage metadata, then reviews evidence and decides whether to apply a
worktree diff.
